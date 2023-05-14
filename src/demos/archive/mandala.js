//web based Dtrace


import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';

import { mat4, vec3 } from 'gl-matrix'

import * as d3 from "d3";

import {geoMercator} from "d3-geo";


//RA = right ascension measured in time or angle - vertical 
//declination = longitude - horizontal 



//2gb 30 million rows csv
//binary 


//parse and upload all copies of galaxy
//animate evolution of galaxy using morph target animation
//zoomable - time scrub
var stuff

var hash = {
  g: 0,
  a: 1,
  t: 2,
  c: 3,
  G: 0,
  A: 1,
  T: 2,
  C: 3
}

//should just use images - png has compression - repeated colors are indexed so takes less space
//image with 4 colors will take like .1mb
var abc = []
for (let i = 0; i< 100; i++) {
 setTimeout(function () {
  console.log(123)

  fetch(`https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/${i}.txt`).then((response) => {
    return response.text();
  }).then(data => {
    //console.log(data.slice(0,50))
    abc.push(data.split('').map(d => {
      return hash[d]
    }))
    })
 }, 100 * i)
}

    let xScale = d3.scaleLinear()
    .domain([0, 1e6])
    .range([-1, 1])

    let yScale = d3.scaleLinear()
    .domain([0, 1e6])
    .range([-1, 1])


 
// let stuff = new Float32Array(data)
//     let x = []
//     let y = []
//     let color = []
//     for (var i = 0; i < stuff.length; i+= 6) {
//         x.push(stuff[i])
//         y.push(stuff[i+1])
//         color.push(stuff[i+2])
//     }
//     console.log(color)

//     console.log(
//       d3.min(x), d3.max(x),
    
//       d3.min(y), d3.max(y)
//     )


//       console.log(x)
//     let a = x.map(xScale)
//     let b = y.map(yScale)

//     //console.log(x, y)
//     main(a,b)
// }

const coordinates = [

]
const projection = d3.geoMercator()
.center([-73.9375, 40.7324])
.scale((1090000) / (10 * Math.PI))
.translate([500 / 2, 500 / 2])


function canvasToClipSpace(stuff) {
    let [x, y] = stuff
    return [(x / 500) * 2 -1 , (1- y / 500) ]
}


// const data = d3.text().then(d => {
//     console.log(d)
//     // d.forEach(d => {
//     //     // console.log(canvasToClipSpace(projection([
//     //     //     + d.Longitude,
//     //     //     + d.Latitude
//     //     //  ])));
//     //     coordinates.push(
//     //         canvasToClipSpace(projection([
//     //         + d.Longitude,
//     //         + d.Latitude
//     //      ]))
//     //   )
//     // })
//     main()
// })

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

async function main(a,b) {
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
        for (let iParticle = 0; iParticle < 1e6; iParticle++) {

            particlesBuffer[4 * iParticle + 0] =( Math.random () -1 ) /2  
            particlesBuffer[4 * iParticle + 1] = (Math.random () -1 ) /2 

            particlesBuffer[4 * iParticle + 2] = 0;
            particlesBuffer[4 * iParticle + 3] = 0
        }
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
          vsOut.position =  //vec4<f32>(inPosition.xy + (.0000009 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
          
         vec4<f32>(inPosition.xy + (.09 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
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
//complaints - date time stamp 
//catgeorical
//16 million complaints - 100 million in person nyc data office 

//http://vis.stanford.edu/files/2013-imMens-EuroVis.pdf
///http://vis.stanford.edu/projects/immens/demo/brightkite/
