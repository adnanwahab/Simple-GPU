import createCamera from './createCamera'

//import FBXLoader from 'three-fbx-loader'
import bunny from 'bunny'
import dragon from 'stanford-dragon'

//import GLTFLoader from 'three-gltf-loader';
//change mesh when it detects a beat
import ColladaLoader from 'three-collada-loader'

const loader = new ColladaLoader();
loader.load(
	'https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/src/demos/start_plank.txt',
	( gltf ) => {
		// called when the resource is loaded
		console.log(gltf)
	},
	( xhr ) => {
    console.log(xhr)
		// called while loading is progressing
		console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
	},
	( error ) => {
		// called when loading has errors
		console.error( 'An error happened', error );
	},
);


async function abc() {

  const soundBuffer =  await fetch( 'sounds/webgpu-audio-processing.mp3' ).then( res => res.arrayBuffer() );
  const audioContext = new AudioContext();

  const audioBuffer = await audioContext.decodeAudioData( soundBuffer );

  waveBuffer = audioBuffer.getChannelData( 0 );

  // adding extra silence to delay and pitch
  waveBuffer = new Float32Array( [ ...waveBuffer, ...new Float32Array( 200000 ) ] );

  sampleRate = audioBuffer.sampleRate / audioBuffer.numberOfChannels;
}

import { WebGPUScan } from './scan'

const stuff = 4
const NUM_PARTICLES = 256 * 4 * stuff
const particlesCount = bunny.positions.length
const SCAN_THREADS = 256
import simpleWebgpuInit from '../../lib/main';
import { mat4, vec3 } from 'gl-matrix'

async function basic () {
let webgpu = await simpleWebgpuInit()
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16 + 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});


function makeBuffer (stuff, flag) {
  let particlesCount = stuff.positions.length
  const particleSize = 16
  const gpuBufferSize = particlesCount * particleSize
  //const gpuBufferSize = particlesCount * (flag ? particleSize :1)

  if (flag) {
    stuff.positions.forEach((triplet) => {
      triplet[0] /= 18
      triplet[1] /= 18
      triplet[2] /= 18

    })

  }

  const gpuBuffer = webgpu.device.createBuffer({
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
  for (let iParticle = 0; iParticle < 1839; iParticle++) {
    const i = iParticle;
      particlesBuffer[4 * iParticle + 0] = (stuff.positions[i][0]);
      particlesBuffer[4 * iParticle + 1] = (stuff.positions[i][1]);
      particlesBuffer[4 * iParticle + 2] = (stuff.positions[i][2]);
      particlesBuffer[4 * iParticle + 3] = 0
  }


  particlesBuffer[0] = .2
  particlesBuffer[1] = -1
  particlesBuffer[2] = 1

  gpuBuffer.unmap();
  return gpuBuffer
} 
const posBuffer = makeBuffer(bunny)

const dragonBuffer = makeBuffer(dragon, 1)
// const velocityBuffer = makeBuffer(particlesCount, 0)
// const vorticityBuffer = makeBuffer(particlesCount, 0)
// const predictionBuffer = makeBuffer(particlesCount, 0)
// const densityBuffer = makeBuffer(particlesCount / 4, 0)
// const constBuffer = makeBuffer(particlesCount, 0)
// const correctParticle = makeBuffer(particlesCount, 0)
// const hashCounts = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)
// const particleIds = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)
// const debugGetNeighbors = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)

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
  },
  {
    attributes: [
        {
            shaderLocation: 2,
            offset: 0,
            format: "float32x4",
        }
    ],
    arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
    stepMode: "instance",
},
]

const device = webgpu.device
const model = mat4.identity(new Float32Array(16))

function getCameraViewProjMatrix() {
  mat4.translate(model, model, vec3.fromValues(2, 2, 0));
  mat4.rotate(
    model,
    model,
    1,
    vec3.fromValues(
      Math.sin(0),
      Math.cos(1),
      0
    )
  );
  //vec3.rotateY(eyePosition, eyePosition, origin, rad);

  let projectionMatrix = mat4.create();
  let viewProjectionMatrix = mat4.create();
  mat4.perspectiveZO(projectionMatrix,
    100, 500 / 500, .9, 100.0);
  //mat4.translate(viewProjectionMatrix, viewProjectionMatrix, eyePosition);
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);

  //mat4.lookAt(viewProjectionMatrix, eyePosition, origin, upVector);


  // Write the render parameters to the uniform buffer.
  let renderParamsHost = new ArrayBuffer(4 * 4 * 4);
  let viewProjectionMatrixHost = new Float32Array(renderParamsHost);
  viewProjectionMatrixHost.set(viewProjectionMatrix);
  return viewProjectionMatrixHost
}


  const cameraViewProj = getCameraViewProjMatrix();


// Calling simplewebgpu.init() creates a new partially evaluated draw command
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

const drawCube = await webgpu.initDrawCall({
  shader: {
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`
    struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct Camera {
  projectionMatrix : mat4x4<f32>,
  viewMatrix : mat4x4<f32>,
  modelMatrix: mat4x4<f32>,
  time: f32,

}

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
 @location(2) pos2: vec4<f32>,
) -> VSOut {
    var vsOut: VSOut;
    var stuff = mix(inPosition.xy, pos2.xy, (sin(vec2<f32>(camera.time) + 1) / 2));



    vsOut.position = 
     camera.projectionMatrix * camera.viewMatrix *  camera.modelMatrix * 
   vec4<f32>(stuff + (.09 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
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

//    return  col + vec4<f32>(distanceFromCenter - 1.5,  / 10000,1.,.1);
return vec4<f32>(1., sin(camera.time), 0., 1.);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    dragonBuffer, quadBuffer, posBuffer
  ],
  count: 6,
  blend,
  instances: particlesCount,
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
          },
          {
            binding: 1,
            resource: {
            buffer: cameraUniformBuffer
            }
          }
      ]
  });
  }
})
let camera = createCamera({
  center: [5., 1.5, .3],
  damping: 0,
  noScroll: true,
  renderOnDirty: true,
  element: webgpu.canvas
});

setInterval(
  async function () {
    let {projection, view} = camera()
    device.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      projection.buffer,
      projection.byteOffset,
      projection.byteLength
    );

    device.queue.writeBuffer(
      cameraUniformBuffer,
      64,
      view.buffer,
      view.byteOffset,
      view.byteLength
    );
     device.queue.writeBuffer(
      cameraUniformBuffer,
      128,
      model.buffer,
      model.byteOffset,
      model.byteLength
    );
    const a = new Float32Array(1)
    a.forEach((d, i) => a[i] = performance.now() * .001)

    device.queue.writeBuffer(
      cameraUniformBuffer,
      192,
      a.buffer,
      0,
      a.byteLength
    );
  
   
 

    drawCube({})


    }, 8) 
}

basic()
