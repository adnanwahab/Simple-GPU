
import * as d3 from 'd3'
import {interpolateTurbo} from "d3-scale-chromatic";


const obj = (n) => `https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/1/${n}myfile.bin`

let dancer = []
let frames = []

let frameMax = 50
let frameCount = [...Array(frameMax).keys()]


function getFrames(model) { 
  frames[model]= []
  let loaded = 0
  frameCount.forEach(function (i) {
    fetch(`https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/${model}/${i}myfile.bin`
    )
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
  
      var floatBuffer = new Float32Array(buffer)
      frames[model][i]=floatBuffer
    })
    loaded += 1
    if (loaded === frameMax - 1) setTimeout(makeStagingBuffer, 3000)
  })

  
}

fetch(obj(1)).then(d => {
  return d.arrayBuffer()
}).then((d) => {
  dancer = new Float32Array(d)
  shapes.push(window.makeBuffer(dancer, 0,'leaf'))
  basic()
})
getFrames(1)
getFrames(2)

let time = 0
let stagingBuffer

let choice = 1


let animating = true
window.addEventListener('click', function () {
  animating = ! animating
  if (animating) makeStagingBuffer()
})

function makeStagingBuffer() {
  setTimeout(function () {
    if (! shapes[0]) return;
    stagingBuffer = webgpu.device.createBuffer({
      size: 1e7,
      usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    let frame = time % frames[choice].length
    const toCopy = frames[choice][frame]

    if (time === 0) window.toCopy = toCopy

    time += 1
    
    //console.log(frames[frame])
    //let mesh = 
    const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())

    for (let i =0 ; i < toCopy.length; i++){
      vertexPositions[4*i]= toCopy[4*i]
      vertexPositions[4*i+1]= toCopy[4*i+1]
      vertexPositions[4*i+2]= toCopy[4*i+2]
      vertexPositions[4*i+3]= 0
    }

    stagingBuffer.unmap();

     // Copy the staging buffer contents to the vertex buffer.
    const commandEncoder = webgpu.device.createCommandEncoder({});
    commandEncoder.copyBufferToBuffer(stagingBuffer, 0, shapes[0], 0, toCopy.length * 4);
    webgpu.device.queue.submit([commandEncoder.finish()]);

    // Immediately after copying, re-map the buffer. Push onto the list of staging buffers when the
    // mapping completes.
    // stagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
    //   //waveGridStagingBuffers.push(stagingBuffer);
    // });
    if (animating) makeStagingBuffer()
  }, 50)
}

let shapes = [

]
function writeBuffer (device, buffer, array) {
  device.queue.writeBuffer(device, 0, buffer, 0, new Float32Array(16));
}


//need a way to swap meshes
//make 5 functions that load 5 point clouds
//make a beat detection function that calls function upon volume threshold 
//one more to diff particles 
//no animation 
// have to make a demo so good it unites stream


import createCamera from './createCamera'

import bunny from 'bunny'
import dragon from 'stanford-dragon'
import { analyze } from 'web-audio-beat-detector';

//import GLTFLoader from 'three-gltf-loader';

//change mesh when it detects a beat [.5]
//gold particles for mesh [0]
//add rainbow particles for motion - detect DX and show trail [0]

import { WebGPUScan } from './scan'

const stuff = 4
const NUM_PARTICLES = 256 * 4 * stuff
const particlesCount = 442008 / 3 
const SCAN_THREADS = 256
import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';

import { mat4, vec3 } from 'gl-matrix'

window.makeBuffer = function makeBuffer (stuff, flag, label) {
//  let particlesCount = stuff.length
  const particleSize = 1
  const gpuBufferSize = 1e7 * particleSize

  const gpuBuffer = webgpu.device.createBuffer({
    label,
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST ,
    mappedAtCreation: true,
  });
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
  // for (let iParticle = 0; iParticle < stuff.length; iParticle++) {
  //   const i = iParticle;
  //     particlesBuffer[4 * iParticle + 0] = stuff[4 * i]
  //     particlesBuffer[4 * iParticle + 1] = stuff[4 * i + 1]
  //     particlesBuffer[4 * iParticle + 2] = stuff[4 * i + 2]

  // }
 
  if (stuff.flat) stuff.flat()
  particlesBuffer.set(stuff)

  gpuBuffer.unmap();
  return gpuBuffer
} 
let webgpu = simpleWebgpuInit().then(w => webgpu = w)
async function basic () {
 
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16 + 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const posBuffer = makeBuffer(bunny.positions.map(d => d.concat(0)).flat(), 1, 'bunny')

const dragonBuffer = makeBuffer(dragon.positions, 1, 'dragon')
shapes.push(posBuffer)
shapes.push(dragonBuffer)

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

//convert each point in buffer to a vector to next point


const buffers = [
  {
      attributes: [
          {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 3,
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
            format: "float32x3",
        }
    ],
    arrayStride: Float32Array.BYTES_PER_ELEMENT * 3,
    stepMode: "instance",
},

{
  attributes: [
      {
          shaderLocation: 3,
          offset: 0,
          format: "float32x3",
      }
  ],
  arrayStride: Float32Array.BYTES_PER_ELEMENT * 3,
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

//compute shader = transition from one mesh to another
//vertex -> fragment = simple display + lighting




// let vectorField = []
// for (let i = 0; i < 10; i++) {
//   vectorField[i] = []
// }

// for (let i = 0; i < 10; i++) {
//   for (let i = 0; j < 10; i++) {
//     vectorField[i][j] = []
//   }
// }
// let count = 0


// function getUpperBound(bound) {
//   let ret = 0
//   while (! ret && ret < bound){
//     ret = Math.random()
//   }
//   return ret
// }

// while (count < 100) {
  

//   let line = [
//     [Math.random() / 3, getUpperBound()],
//     [Math.random() / 3, getUpperBound()],
//   ]

//   vectorField[


//   ]


// }


let velocityBuffer = new Float32Array(1e3)


function magnitude (v) {
  return Math.sqrt(v[0]) + Math.sqrt(v[1]) + Math.sqrt(v[2])
}

function unitVector (v) {
  let l = magnitude(v)
  return v.map(d => d / l);
}

function vectorTo(b, a) {
  return unitVector(b) - unitVector(a)
}

let shit = bunny.positions
let convert = function (x) {
  //console.log(x.toPrecision(2))
  return ((x * .1).toPrecision(2) + 1) /2
}

for (let i = 0; i < velocityBuffer.length; i++) {
  let buffer = velocityBuffer;
  let vec = shit[i % shit.length]

  buffer[4*i] = vec[0]
  buffer[4*i+1] = vec[1]
  buffer[4*i+2] = vec[2]
  buffer[4*i+3] = 0
  //console.log(hash)
}


let result = []
let hasColided = {}
let width = 10
let height = 10




for (let i = 0; i <100; i++) {
  for (let j = 0; j <100; j++) {
    for (let k = 0; k <100; k++) {
      let idx = i  + j * width + k * width * height
      try {
      result[4 * idx] = Math.cos(i)
      result[4 * idx+1] = Math.sin(j)
      result[4 * idx+2] = 0
      } catch (e) {
        console.log(4*idx)

      }

      //if(hasColided[idx] > 1) console.log('ohnoe')
    }
    
  }
   
}

//access vector field with 

console.log(result, 'result')



//return i32(pos.x * 10. + pos.y * 100. + pos.z * 1000.);


//100 cubes
//iterate through bunny
  //for each point -> draw a vector to that point from another point
// 
//
//
//

let vectorFieldBuffer = makeBuffer(result, 0, 'vectorField')
let velocity = makeBuffer(new Float32Array(2e5), 0, 'vectorField')

// use a buffer to index 3 dimensionally
// use xyz to convert to a hash
// x * 10 + y * 100 + z * 1000


let texture = webgpu.device.createTexture({
  size: [100, 100, 100],
//  mipLevelCount: 1,
  format:  "rgba8unorm",
//  usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST,
  dimension: "3d",

  usage:
    GPUTextureUsage.TEXTURE_BINDING |
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.STORAGE_BINDING,
});

  webgpu.device.queue.writeTexture(
    { texture },
    velocityBuffer,
    {
      bytesPerRow: 400,
      rowsPerImage: 100,
    },
    [100, 100, 100]
  );

const computeTransition = webgpu.initComputeCall({
  label: `predictedPosition`,
  code:`

  struct Uniforms {
    time: f32,
  
  }
  @group(0) @binding(0) var<storage,read> buffer1: array<vec4<f32>>;
  @group(0) @binding(1) var<storage,read> buffer2: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> buffer3: array<vec4<f32>>;

  @group(0) @binding(4) var<uniform> uniforms: Uniforms;

  @group(0) @binding(5) var<storage,read_write> velocity: array<vec4<f32>>;

  @group(0) @binding(6) var myTexture: texture_3d<f32>;

fn taylorInvSqrt( r: vec4<f32>) -> vec4<f32>
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

fn snoise( v: vec3<f32>) -> f32
  {
    var  C = vec2(1.0/6.0, 1.0/3.0) ;
    var  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
var i = floor(v + dot(v, C.yyy) );
var x0 =   v - i + dot(i, C.xxx) ;

// Other corners
var g = step(x0.yzx, x0.xyz);
var l = 1.0 - g;
var i1 = min( g.xyz, l.zxy );
var i2 = max( g.xyz, l.zxy );

  var x1 = x0 - i1 + C.xxx;
  var x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  var x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  var p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
let n_ = 0.142857142857; // 1.0/7.0
let  ns = n_ * D.wyz - D.xzx;

let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

let x_ = floor(j * ns.z);
let y_ = floor(j - 7.0 * x_ );    // mod(j,N)

let x = x_ *ns.x + ns.yyyy;
let y = y_ *ns.x + ns.yyyy;
let h = 1.0 - abs(x) - abs(y);

let b0 = vec4( x.xy, y.xy );
let b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  let s0 = floor(b0)*2.0 + 1.0;
  let s1 = floor(b1)*2.0 + 1.0;
  let sh = -step(h, vec4(0.0));

  let a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  let a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  var p0 = vec3(a0.xy,h.x);
  var p1 = vec3(a0.zw,h.y);
  var p2 = vec3(a1.xy,h.z);
  var p3 = vec3(a1.zw,h.w);

//Normalise gradients
  var norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
//t m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  
var m = (0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)));
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

//ramp function = f(x) -> x .0-.2 = 1 [1,2,3,4,5]

const list=5.;

fn curl_noise (pos:vec4<f32>, t: f32) -> vec4<f32> {
  //make unit cube
  //take 8 gradients of trilinear interpolations |-|
  var x = pos.x;
  var y = pos.y;
  var z = pos.z;
  var x0 = x + 1.;
  return vec4<f32>(sfrand(), sfrand(), sfrand(), sfrand());
}

fn snoiseVec3(  x: vec3<f32> ) -> vec3<f32>{
  var s  = snoise(vec3( x ));
  var s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  var s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  var c = vec3( s , s1 , s2 );
  return c;

}

fn curlNoise(  p:vec3<f32> ) -> vec3<f32>{
  var e = .1;
  var dx = vec3( e   , 0.0 , 0.0 );
  var dy = vec3( 0.0 , e   , 0.0 );
  var dz = vec3( 0.0 , 0.0 , e   );

  var p_x0 = snoiseVec3( p - dx );
  var p_x1 = snoiseVec3( p + dx );
  var p_y0 = snoiseVec3( p - dy );
  var p_y1 = snoiseVec3( p + dy );
  var p_z0 = snoiseVec3( p - dz );
  var p_z1 = snoiseVec3( p + dz );

  var x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  var y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  var z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  var divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

 fn mod289( x: vec3<f32>) -> vec3<f32> {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289v( x: vec4<f32>)  ->vec4<f32>
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute( x: vec4<f32>) -> vec4<f32>
{
  return mod289v(((x*34.0)+1.0)*x);
}


fn fade( t: vec3<f32>) -> vec3<f32> {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

fn sfrand () -> f32{
  let co = vec2<f32>(${Math.random()}, ${Math.random()});
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}


fn mrand() ->  f32{
  return (sfrand() * 2.) - 1.;
}

fn hash (pos:vec3<f32>) -> i32{

  return i32(pos.x * 10. + pos.y * 100. + pos.z * 1000.);
}


  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;

    let v = vectorFieldBuffer[index];

    var pos = buffer3[index];
    //vectorFieldBuffer[index] = buffer3[index] - buffer3[index+1];
    //let idx = hash(pos.xyz);
    //vectorFieldBuffer[index] += snoise(pos.xyz);
    var t = uniforms.time;
    var test = mix(buffer1[index], buffer2[index], vectorFieldBuffer[hash(pos.xyz)].x);
    var abc = buffer3[index];
    //buffer3[index] = pos + .1 * vec4<f32>(curlNoise(vectorFieldBuffer[hash(pos.xyz)].xyz), 1.);
    var position = pos.xyz;
    var stuff =  textureLoad(myTexture,
       vec3<i32>(0, 0, 0), 
       0
       );
       //x * 100, y * 100, z * 100

    var idx = i32(pos.x *100 + pos.y * 100 * 100 + pos.z * 100 * 100 * 100);
    velocity[index] += .01 * vectorFieldBuffer[idx];
    buffer3[index] = pos + .01 * velocity[index];
    // + .001 * vec4<f32>(curlNoise(vectorFieldBuffer[index].xyz), 1.);
  }`,

  exec: function (state){
    const device = state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass();
    state.computePass.computePass = computePass;

    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(256);
    computePass.end();
  },
  bindGroups: function (state, computePipeline) {

    const uniformsBuffer = webgpu.device.createBuffer({
      size: 32, 
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [
        posBuffer,
        posBuffer,
        
        vectorFieldBuffer,
        shapes[0],
        uniformsBuffer,
        velocity,
        texture.createView({
          dimension: '3d',
          sampleType: 'float'
        }),
      ], )

    return [computeBindGroup]
  }
})

// vector field = 2d image
// vector field = 3d model
// circulate particles throughout model - use curl noise to circulate throughout model with turbulence 
// divergence set to 0
// add 2nd particle sysstem with emitter at points with most change in flow

//buffer[0]= vec from previous point to next point
//


//go slow to go fast
//build one cool original algorithmic effect from scratch

//turn down saturation by point density of cuboid 
//precisely calculate line interval convolutions using 
var rgb = new Float32Array(2e5);
for (let i = 0; i < rgb.length; i+=3) {
  let stuff = (i / rgb.length) * 1000 % 1000
  let interval = (Math.sin((stuff)) + 1) / 2.
  let color = d3.rgb( interpolateTurbo(interval));

  rgb[i] = color.r / 255 / 2
  rgb[i+1] = color.g / 255 / 2

  rgb[i+2] = color.b / 255 / 2
  //if (Math.random())console.log(i / rgb.length)

}
//console.log(d3.rgb(interpolateTurbo(Math.random())))
//console.log(rgb, 123)
const colorBuffer = makeBuffer(rgb, 0, 'color')

const drawCube = await webgpu.initDrawCall({
  shader: {
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`
    struct Uniforms {             //             align(16)  size(24)
    color: vec3<f32>,         // offset(0)   align(16)  size(16)
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
    @location(1) color: vec3<f32>
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
 @location(2) pos2: vec4<f32>, @location(3) color: vec3<f32>,
) -> VSOut {
    var vsOut: VSOut;
    var stuff = mix(inPosition.xy, pos2.xy, vec2<f32>(camera.time));


    vsOut.position = 
     camera.projectionMatrix * camera.viewMatrix *  camera.modelMatrix * 

     vec4<f32>(stuff + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
   //vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.), 1.);
    vsOut.position.y = vsOut.position.y;
    vsOut.localPosition = quadCorner;

    vsOut.color = color;
    return vsOut;
}

@fragment
fn main_fragment(@location(0) localPosition: vec2<f32>, @location(1) color:vec3<f32> ) -> @location(0) vec4<f32> {
    let distanceFromCenter: f32 = length(localPosition);
    if (distanceFromCenter > 1.0) {
        discard;
    }
    var viewDir = vec3<f32>(0,0,0);
    var lightSpecularColor = vec3<f32>(0., 0., 1.);
    var lightSpecularPower = 1.;
    var lightPosition = vec3<f32>(-1,0., 0);

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
		intensity = pow(saturate(NdotH), .1);

		//Sum up the specular light factoring
		let col = vec4<f32>(intensity * lightSpecularColor * lightSpecularPower / distance, .1);
    //return  col + vec4<f32>(distanceFromCenter - 1.5, 1.,1.,.1);
    //return  col + vec4<f32>(distanceFromCenter - 1.5,  / 10000,1.,.1);
    return vec4<f32>(color.xyz, 1.);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    shapes[0], quadBuffer, posBuffer, colorBuffer
  ],
  count: 6,
 // blend,
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

const a = new Float32Array(1)

let choice = false
let i = 0

function recur () {
  i = (i + 1) % (shapes.length)

  choice = ! choice;
  let swap = drawCube.state.options.attributeBufferData[
    choice ? 0 : 2
  ]
  drawCube.state.options.attributeBufferData[
    choice ? 0 : 2
  ] = shapes[i]
  // drawCube.state.options.attributeBufferData[
  //   choice ? 2 : 0
  // ] = shapes[i]
  d3.transition().duration(3 * 1000)
  .ease(d3.easeCubic)
  .attrTween('animation', function () {
    return function (t) {
      if (choice) t = 1.0 - t
      a.forEach((d, i) => a[i] = t)

     
    }
    
  }).on('end', recur)
}
//recur()



let camera = createCamera({
  center: [.5, 1.5, -.3],
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
 
   

    device.queue.writeBuffer(
      cameraUniformBuffer,
      192,
      a.buffer,
      0,
      a.byteLength
    );
  
 
    if (! animating) computeTransition()
    drawCube({})


    }, 8) 

  

}

//dancing mesh = write to mesh
//galaxy mesh = write to mesh
//mountain landscape 
// flower garden 

//2024 - water 

  // create the audio context (chrome only for now)
  var context;
  var audioBuffer;
  var sourceNode;
  var splitter;
  var analyser, analyser2;
  var javascriptNode;

  function setupAudioNodes() {
    context = new AudioContext()
      // setup a javascript node
      javascriptNode = context.createScriptProcessor(2048, 1, 1);
      // connect to destination, else it isn't called
      javascriptNode.connect(context.destination);

      // when the javascript node is called
      // we use information from the analyzer node
      // to draw the volume
      javascriptNode.onaudioprocess = function(stuff) {
          // get the average for the channel
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          getAverageVolume(array);
          const buffer = stuff.outputBuffer
    
      }

      // setup a analyzer
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      // create a buffer source node
      sourceNode = context.createBufferSource();
      splitter = context.createChannelSplitter();

      // connect the source to the analyser and the splitter
      sourceNode.connect(splitter);

      // connect one of the outputs from the splitter to
      // the analyser
      splitter.connect(analyser,0,0);

      // connect the splitter to the javascriptnode
      // we use the javascript node to draw at a
      // specific interval.
      analyser.connect(javascriptNode);

      // and connect to destination
      sourceNode.connect(context.destination);
  }

  // load the specified sound
  function loadSound(url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      // When loaded decode the data
      request.onload = function() {

          // decode the data
        //   document.querySelector('body').addEventListener('click', function() {
        //     context.resume().then(() => {
        //       console.log('Playback resumed successfully');
        //     });
        //     context.decodeAudioData(request.response)
        //     .then(function(buffer) {
        //       // when the audio is decoded play the sound

        //       playSound(buffer);
   
        //   })
        // });
      
      }
      request.send();
  }

  function playSound(buffer) {
      sourceNode.buffer = buffer;
      sourceNode.start(0);

         
  }

  // log if an error occurs
  function onError(e) {
      console.log(e);
  }

  function getAverageVolume(array) {
      var values = 0;
      var average;

      var length = array.length;
      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
      average = values / length;
      return average;
  }

  setupAudioNodes()
  loadSound('https://ia800300.us.archive.org/16/items/JusticeDance/03D.a.n.c.e.mp3')


//   //https://toji.dev/webgpu-best-practices/buffer-uploads - galaxy


//   //its impossible to know what a good decision is when thousands of people add thoughts to my head that come from randomness
