import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';

import { mat4, vec3 } from 'gl-matrix'

import * as d3 from "d3";

import {geoMercator} from "d3-geo";

import csv from './311'
const data = d3.csvParse(csv.split('\n').join('')).columns
console.log(data)
const coordinates = [

]
for (let i = 0; i < data.length; i+=39) {
    coordinates.push({long: data[i+38], lat: data[i+39]})
}

const width = 500, height = 500
console.log(coordinates)
const projection = d3.geoMercator()
.center([-73.9375, 40.7324])
.scale((550000) / (2 * Math.PI))
.translate([width / 2, height / 2])

const blend = {
    color: {
      srcFactor: 'src-alpha',
      dstFactor: 'one',
      operation: 'add',
    },
    alpha: {
      srcFactor: 'zero',
      dstFactor: 'one',
      operation: 'add',
    },
  }

  const buffers = [
    {
        attributes: [
            {
                shaderLocation: 0,
                offset: 0,
                format: "float32x4",
            }
        ],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
        stepMode: "instance",
    },
    {
        attributes: [
            {
                shaderLocation: 1,
                offset: 0,
                format: "float32x2",
            }
        ],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
        stepMode: "vertex",
    }
  ]
  

const particlesCount = 1e6;
const particleSize = 100;

async function main() {
    const webgpu = await simpleWebgpuInit();

    const quadBuffer = webgpu.device.createBuffer({
        size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
      });
      new Float32Array(quadBuffer.getMappedRange()).set([
        -1, -1, +1, -1, +1, +1,
        -1, -1, +1, +1, -1, +1
      ]);
      quadBuffer.unmap();
      
    
    function makeBuffer (size=particlesCount, flag=1, log) {
        const gpuBufferSize = particlesCount * particleSize;
      
        const gpuBuffer = webgpu.device.createBuffer({
          size: gpuBufferSize,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
          mappedAtCreation: true,
        });
        
        const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
        for (let iParticle = 0; iParticle < particlesCount; iParticle++) {
            particlesBuffer[4 * iParticle + 0] = flag && (Math.random() * 2 - 1);
            particlesBuffer[4 * iParticle + 1] = flag &&(Math.random()  );
            particlesBuffer[4 * iParticle + 2] = flag &&(Math.random() * 2 - 1);
            particlesBuffer[4 * iParticle + 3] = 0
        }
        if (log) console.log(particlesBuffer)
        gpuBuffer.unmap();
        return gpuBuffer
      } 
      
      const posBuffer = makeBuffer(particlesCount, 1)

    const drawCube = await webgpu.initDrawCall({
        shader: {
          vertEntryPoint: 'main_vertex',
          fragEntryPoint: 'main_fragment',
          code:`struct Uniforms {             //             align(16)  size(24)
          color: vec4<f32>,         // offset(0)   align(16)  size(16)
          spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
      };
      
      struct VSOut {
          @builtin(position) position: vec4<f32>,
          @location(0) localPosition: vec2<f32>, // in {-1, +1}^2
      };
      
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      
      
      @vertex
      fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>) -> VSOut {
          var vsOut: VSOut;
          vsOut.position =  //vec4<f32>(inPosition.xy + (.03 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
          
         vec4<f32>(inPosition.xy + (.009 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
          vsOut.position.y = vsOut.position.y;
          vsOut.localPosition = quadCorner;
          return vsOut;
      }
      
      @fragment
      fn main_fragment(@location(0) localPosition: vec2<f32>) -> @location(0) vec4<f32> {
          let distanceFromCenter: f32 = length(localPosition);
          if (distanceFromCenter > 1.0) {
              discard;
          }
          var viewDir = vec3<f32>(0,0,0);
          var lightSpecularColor = vec3<f32>(1);
          var lightSpecularPower = 1.;
          var lightPosition = vec3<f32>(-1,-1, 0);
      
          var lightDir = lightPosition - vec3<f32>(localPosition, 1.); //3D position in space of the surface
      
              var distance = length(lightDir);
      
              lightDir = lightDir / distance; // = normalize(lightDir);
              distance = distance * distance; //This line may be optimised using Inverse square root
          var normal = vec3(-1.,-1., 0.);
      
              //Intensity of the diffuse light. Saturate to keep within the 0-1 range.
              var NdotL = dot(normal, lightDir);
              var intensity = saturate(NdotL);
      
              // Calculate the diffuse light factoring in light color, power and the attenuation
              //OUT.Diffuse = intensity * light.diffuseColor * light.diffusePower / distance;
      
              //Calculate the half vector between the light vector and the view vector.
              //This is typically slower than calculating the actual reflection vector
              // due to the normalize function's reciprocal square root
              var H = normalize(lightDir + viewDir);
      
              //Intensity of the specular light
              var NdotH = dot(normal, H);
              //intensity = pow(saturate(NdotH), specularHardness);
      
              //Sum up the specular light factoring
              let col = vec4<f32>(1. * lightSpecularColor * lightSpecularPower / distance, .1);
      
          return col + vec4<f32>(distanceFromCenter - 1.5, 0,1.,.1);
      }
      `},
        attributeBuffers: buffers,
        attributeBufferData: [
          posBuffer, quadBuffer,
        ],
        count: 6,
        blend,
        instances: particlesCount ,
        bindGroup: function ({pipeline}) {
          const uniformsBuffer = webgpu.device.createBuffer({
            size: 32, 
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
        });
          return webgpu.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: uniformsBuffer,
                    }
                }
            ]
        });
        }
      })


      drawCube()
}

main()


// map vertex points to longitude latitude 
// 20 million points

//compute shader - parralell query processing
//when i solve this, it'll be a good story