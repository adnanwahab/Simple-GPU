import createCamera from './createCamera'

//import FBXLoader from 'three-fbx-loader'
import bunny from 'bunny'
import dragon from 'stanford-dragon'

//import GLTFLoader from 'three-gltf-loader';

import ColladaLoader from 'three-collada-loader'

const loader = new ColladaLoader();
loader.load(
	'./start_plank.txt',
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



//console.log(dragon)
// fetch('./breakdance.txt').then(d => {
//   d.json()
// }).then(d => {
//   console.log(d)
// }
// )

// fetch('./data.bin').then((response) => {
//   return response.arrayBuffer();
// }).then(data => {
//   //const vertices = new Float64Array(data)
//   console.log(data)
// })

//post processing glow
//audio reactive - change size of particles



//create a particle for every point in the FBX
//every frame load the point in the FBX
//https://www.youtube.com/watch?v=q76dnjqPA6Q

async function abc() {

  const soundBuffer =  await fetch( 'sounds/webgpu-audio-processing.mp3' ).then( res => res.arrayBuffer() );
  const audioContext = new AudioContext();

  const audioBuffer = await audioContext.decodeAudioData( soundBuffer );

  waveBuffer = audioBuffer.getChannelData( 0 );

  // adding extra silence to delay and pitch
  waveBuffer = new Float32Array( [ ...waveBuffer, ...new Float32Array( 200000 ) ] );

  sampleRate = audioBuffer.sampleRate / audioBuffer.numberOfChannels;
}






//finish a demo
//morph target animation -> transition between meshes
//one set of particles for fillin in vertices
//one set of particles for motion tween



//https://www.youtube.com/watch?v=XZYRyA0ysWI

//two way audio generation


















// import identity from 'gl-mat4/identity'
// import perspective from 'gl-mat4/perspective'
// import lookAt from 'gl-mat4/lookAt'
  //when particles move -> record ID location in bucket neighborhood in 
  //loop through IDs in neighborhood
  //look up velocity[id] and integrate them across neighbors
  //figure out particle IDs

//buffer layout problem
//I learned if you read and write to the same buffer then it has undefined flickering behavior
//this could be causing undefined issues in the simulation code especially with sensitive stuff like constraint and velocity computation
//The solution would be to split up the buffers more and lay them out in a way that the memory stays coherent 
//i'm not sure but simplifying each shader would be a good first step

//revert it back to water code
//try to use a naive getNeighbors function 

//try to make it work for a small cuboid of particles 
//like 1000 droplets 
//try to space them out linearly and then manually assign the nearest neighbors in CPU land

//once it is working for the simple case
//can move to gpu based accelerated GPU collision detection

//Estimate 1-2 weeks 
//no over promise and under delivering

//quit everything and put health first 
//1 hour of cardio, no caffiene, cold turkey


//hardcode indices of cube
//hard code gpu grid - cant hardcode because particles fly around

//do a different demo

//pic flip method gpu

import { WebGPUScan } from './scan'

const stuff = 4
const NUM_PARTICLES = 256 * 4 * stuff
const particlesCount = bunny.positions.length
const SCAN_THREADS = 256
const PARTICLE_WORKGROUP_SIZE = SCAN_THREADS
const NGROUPS = NUM_PARTICLES / 256 
//console.log(NUM_PARTICLES)

const COLLISION_TABLE_SIZE = particlesCount

const HASH_VEC = [
  1,
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 1 / 3)),
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 2 / 3))
] 
const PARTICLE_RADIUS = 0.1
const GRID_SPACING = 2 * PARTICLE_RADIUS



import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';

import { mat4, vec3 } from 'gl-matrix'

const COMMON_SHADER_FUNCS = `
fn bucketHash (p:vec3<i32>) -> u32 {
  // var grid_res = 100;
  // var result = p.x * grid_res * grid_res
  // + p.y * grid_res
  // + p.z;
  // return u32(result);


  // return u32((p.x * 73856093) ^ (p.y * 19349663) ^ (p.z * 83492791));
  var h = (p.x * ${HASH_VEC[0]}) + (p.y * ${HASH_VEC[1]}) + (p.z * ${HASH_VEC[2]});
  if h < 0 {
    return ${COLLISION_TABLE_SIZE}u - (u32(-h) % ${COLLISION_TABLE_SIZE}u);
  } else {
    return u32(h) % ${COLLISION_TABLE_SIZE}u;
  }
}

fn particleBucket (p:vec3<f32>) -> vec3<i32> {
  return vec3<i32>(floor(p * ${(1 / GRID_SPACING).toFixed(3)}));
}

fn particleHash (p:vec3<f32>) -> u32 {
  return bucketHash(particleBucket(p));
}
`

const predefines = `


struct Uniforms {                                  
  force: vec2<f32>,                              
  dt: f32,                                       
  bounce: u32,                                   
  friction: f32,                                 
  aspectRatio: f32,                              
  w: f32,
  h: f32,
};

struct BucketContents {
  indices : array<i32, 400>,
  count : u32,
}

${COMMON_SHADER_FUNCS}

fn getNeighbors (centerId:  u32) -> BucketContents {
  var result : BucketContents;

  //getNeighbors is not being offset by the centerID
  //hashCounts only works for the first 1024 particles
  //what if hashCounts is always 0

  for (var i = 0; i < ${200 }; i += 1) {
    result.indices[i] = i32(i);
//    workgroupBarrier();
    result.count += 1u;
  }
  return result;

  var p = particlesStorage[centerId].xyz;
  var grid = ${GRID_SPACING};
  var pos = bucketHash(vec3(i32(p.x), i32(p.y), i32(p.z)));
    for (var i = -1; i < 2; i = i + 1) {
        for (var j = -1; j < 2; j = j + 1) {
          for (var k = -1; k < 2; k = k + 1) {
            
            var bucketId = //bucketHash(vec3<i32>(i, j, k));
            //particleHash(p.xyz);
            //particleHash(vec3<f32>(p.x, p.y, p.z));
            //particleHash(vec3<f32>(0,0,0));

            particleHash(vec3<f32>(p.x+f32(i)*grid, p.y+f32(j)*grid, p.z+f32(k)*grid));
            
             // % ${COLLISION_TABLE_SIZE}u;
            var bucketStart = hashCounts[bucketId];
            var bucketEnd = ${NUM_PARTICLES}u;
            //if bucketId < ${COLLISION_TABLE_SIZE - 1} {
              bucketEnd = hashCounts[bucketId + 1];
            //}
            for (var n = 0u; n < 10; n = n + 1u) {
              var p = bucketStart + n;
              if p >= bucketEnd {
                break;
              } else {
                var m = particleIds[p];
                result.indices[n+ result.count] = i32(m);
                result.count += 1u;
              }
            }
           }
        }
      }
      return result;
    }
//particle Ids keeps getting bigger 
//particleIds only references 0

const ABS_WALL_POS = vec3<f32>(.9,.9,.9);

const effectRadius = 0.3f;
const restDensity = 450f;
const relaxCFM = 600.0f;
const isArtPressureEnabled = 1;
const artPressureRadius = 0.006f;

const artPressureCoeff = .0001f;
const artPressureExp = 4;
const isVorticityConfEnabled = 1;
const vorticityConfCoeff = 0.0004f;
const xsphViscosityCoeff = 0.0001f;
const PI = 3.14156932;
const timeStep = 0.0000000000010f;

const POLY6_COEFF = 315. / (64. * PI * pow(effectRadius, 9));
const SPIKY_COEFF = 15 / PI * pow(effectRadius, 6);
const FLOAT_EPS = 0.00000001;

 fn poly6( vec:vec4<f32>, effectRadius: f32) -> f32 {
  var vecLength = length(vec);
  return (1.0f - step(effectRadius, vecLength)) * POLY6_COEFF * pow((effectRadius * effectRadius - vecLength * vecLength), 3);
}

fn poly6L(vecLength:f32, effectRadius:f32) -> f32 {
  return (1.0f - step(effectRadius, vecLength)) * POLY6_COEFF * pow((effectRadius * effectRadius - vecLength * vecLength), 3);
}

fn gradSpiky(vec:vec4<f32>,  effectRadius:f32) -> vec4<f32> {
  var vecLength = length(vec);

  if(vecLength <= FLOAT_EPS) {
    return vec4<f32>(0.0f);
}

  return vec * (1.0f - step(effectRadius, vecLength)) * SPIKY_COEFF * -3 * pow((effectRadius - vecLength), 2) / vecLength;
}

fn artPressure( vec:vec4<f32>) -> f32 {
  if(isArtPressureEnabled == 0) {
    return 0.0f;
  }
  return - artPressureCoeff * pow((poly6(vec, effectRadius) / poly6L(artPressureRadius * effectRadius, effectRadius)), artPressureExp);
}
`
async function basic () {
let webgpu = await simpleWebgpuInit()
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const computeUniformsBuffer = webgpu.device.createBuffer({
  size: 96,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
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


const attractors = []
  const attractor = {
      position: [0, 0],
      force: .1 * .1,
  };
  attractor.position[0] = 0
  attractor.position[1] = 0
  attractors.push(attractor);

function buildComputeUniforms(dt, aspectRatio, force, attractors) {
  const buffer = new ArrayBuffer(96);

  new Float32Array(buffer, 0, 2).set([force[0], force[1]]);
  new Float32Array(buffer, 8, 1).set([dt]);
  new Uint32Array(buffer, 12, 1).set([ 3 ]);
  new Float32Array(buffer, 16, 1).set([0.5]);
  new Float32Array(buffer, 20, 1).set([0]);
  new Uint32Array(buffer, 24, 1).set([500]);
  new Uint32Array(buffer, 28, 1).set([500]);

  return buffer;
}
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


const now = Date.now() 
setInterval(function () {
  const elapsed = (Date.now() - now ) * .000001
  const uniformsBufferData = buildComputeUniforms(elapsed, .1, [.5, .5], attractors)
  webgpu.device.queue.writeBuffer(computeUniformsBuffer, 0, uniformsBufferData);
}, 100)

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
    code:`struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct Camera {
  projectionMatrix : mat4x4<f32>,
  viewMatrix : mat4x4<f32>,
  modelMatrix: mat4x4<f32>
}

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
) -> VSOut {
    var vsOut: VSOut;
    vsOut.position = 
     camera.projectionMatrix * camera.viewMatrix *  camera.modelMatrix * 
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

//    return  col + vec4<f32>(distanceFromCenter - 1.5,  / 10000,1.,.1);
return vec4<f32>(1., 0., 0., 1.);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    dragonBuffer, quadBuffer
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
let stuff = camera();

const gridCountScan = new WebGPUScan({
  device,
  threadsPerGroup: SCAN_THREADS,
  itemsPerThread: 4,
  dataType: 'u32',
  dataSize: 4,
  dataFunc: 'A + B',
  dataUnit: '0u'
})

let hasRun = 0;
setInterval(
  async function () {
    let {projection, view} = camera()
    cameraViewProj

    device.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      cameraViewProj.buffer,
      cameraViewProj.byteOffset,
      cameraViewProj.byteLength
    );

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
  
    drawCube({})


    }, 8) 
}

basic()
