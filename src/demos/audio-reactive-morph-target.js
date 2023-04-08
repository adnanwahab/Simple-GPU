
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
  let particlesCount = stuff.length
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
console.log(particlesBuffer, label)

  gpuBuffer.unmap();
  return gpuBuffer
} 
let webgpu = simpleWebgpuInit().then(w => webgpu = w)
async function basic () {
 
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16 + 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const posBuffer = makeBuffer(bunny.positions, 1, 'bunny')

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

let vectorFieldBuffer = makeBuffer([], 0, 'vectorField')



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


// use a buffer to index 3 dimensionally
// use xyz to convert to a hash
// x * 10 + y * 100 + z * 1000
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
//  group(0) binding(5) var myTexture: texture_3d<f32>;


//find unit cube that contains point
//find relative xyz of point in cube
//compute fade curves for each of x,y,z
//hash coordinates of 8 cube corners
//add blended results from 8 corners of cube 
//convert LO bits of hash code into 12 gradient directions 


// 225, 155, 210, 108, 175, 199, 221, 144, 203, 116, 70, 213, 69, 158, 33, 252,
// 5, 82, 173, 133, 222, 139, 174, 27, 9, 71, 90, 246, 75, 130, 91, 191,
// 169, 138, 2, 151, 194, 235, 81, 7, 25, 113, 228, 159, 205, 253, 134, 142,
// 248, 65, 224, 217, 22, 121, 229, 63, 89, 103, 96, 104, 156, 17, 201, 129,
// 36, 8, 165, 110, 237, 117, 231, 56, 132, 211, 152, 20, 181, 111, 239, 218,
// 170, 163, 51, 172, 157, 47, 80, 212, 176, 250, 87, 49, 99, 242, 136, 189,
// 162, 115, 44, 43, 124, 94, 150, 16, 141, 247, 32, 10, 198, 223, 255, 72,
// 53, 131, 84, 57, 220, 197, 58, 50, 208, 11, 241, 28, 3, 192, 62, 202,
// 18, 215, 153, 24, 76, 41, 15, 179, 39, 46, 55, 6, 128, 167, 23, 188,
// 106, 34, 187, 140, 164, 73, 112, 182, 244, 195, 227, 13, 35, 77, 196, 185,
// 26, 200, 226, 119, 31, 123, 168, 125, 249, 68, 183, 230, 177, 135, 160, 180,
// 12, 1, 243, 148, 102, 166, 38, 238, 251, 37, 240, 126, 64, 74, 161, 40,
// 184, 149, 171, 178, 101, 66, 29, 59, 146, 61, 254, 107, 42, 86, 154, 4,
// 236, 232, 120, 21, 233, 209, 45, 98, 193, 114, 78, 19, 206, 14, 118, 127,
// 48, 79, 147, 85, 30, 207, 219, 54, 88, 234, 190, 122, 95, 67, 143, 109,
// 137, 214, 145, 93, 92, 100, 245, 0, 216, 186, 60, 83, 105, 97, 204, 52



// fn mod289( x:vec3<f32>) -> vec3<f32> {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// fn mod289( x: vec4<f32>) -> vec4<f32> {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// fn permute( x: vec4<f32>) -> vec4<f32>{
//      return mod289(((x*34.0)+1.0)*x);
// }

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

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
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





















// fn unitCube (x: vec3<f32>, y: vec3<f32>, z:vec3<f32>) -> vec3<f32>{
//   var G = [
//     vec3<f32>(-1,1,0),vec3<f32>(1,-1,0),vec3<f32>(-1,-1,0),
// vec3<f32>(1,0,1),vec3<f32>(-1,0,1),vec3<f32>(1,0,-1),vec3<f32>(-1,0,-1),
// vec3<f32>(0,1,1),vec3<f32>(0,-1,1),vec3<f32>(0,1,-1),vec3<f32>(0,-1,-1)
//   ];
//   G[0] = vec3<f32>(1,1,0);
//   var P = [12,312,312,31,31,23,3,13,123,1,31,];
//   var g = 0.;
//   //ijk = 8 points around cube
//   for (var i = -1; i < 1; i+=1) {
//     for (var j = -1; j < 1; j+=1) {
//       for (var k = -1; k < 1; k+=1) {
//         g += P[k + P[ j + P[i] ]];


//       }
//     }
//   }
//   var result = P[g]


//https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf
// }


//ramp function = f(x) -> x .0-.2 = 1 [1,2,3,4,5]

const list=5.;

fn curl_noise (pos:vec4<f32>, t: f32) -> vec4<f32> {
  //make unit cube
  //take 8 gradients of trilinear interpolations |-|
  var x = pos.x;
  var y = pos.y;
  var z = pos.z;
  var x0 = x + 1.;

  //


  //integer lattice
  

  //add several octaves at different scales together


  //phi constrained() = ramp(d~x/d0)


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

// fn taylorInvSqrt(r: vec4<f32>) -> vec4<f32>
// {
//   return 1.79284291400159 - 0.85373472095314 * r;
// }

fn fade( t: vec3<f32>) -> vec3<f32> {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise, periodic variant
// fn pnoise( P: vec3<f32>,  rep: vec3<f32>) -> f32
// {
//   var Pi0 = floor(P)%  rep; // Integer part, modulo period
//   var Pi1 = (Pi0 + vec3(1.0))%  rep; // Integer part + 1, mod period
//   Pi0 = mod289(Pi0);
//   Pi1 = mod289(Pi1);
//   var Pf0 = fract(P); // Fractional part for interpolation
//   var Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
//   var ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//   var iy = vec4(Pi0.yy, Pi1.yy);
//   var iz0 = Pi0.zzzz;
//   var iz1 = Pi1.zzzz;

//   var ixy = permute(permute(ix) + iy);
//   var ixy0 = permute(ixy + iz0);
//   var ixy1 = permute(ixy + iz1);

//   var gx0 = ixy0 * (1.0 / 7.0);
//   var gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
//   gx0 = fract(gx0);
//   var gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
//   var sz0 = smoothstep(gz0, vec4(0.0));
//   gx0 -= sz0 * (smoothstep(0.0, gx0) - 0.5);
//   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

//   var gx1 = ixy1 * (1.0 / 7.0);
//   var gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
//   gx1 = fract(gx1);
//   var gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
//   var sz1 = smoothstep(gz1, vec4(0.0));
//   gx1 -= sz1 * (smoothstep(0.0, gx1) - 0.5);
//   gy1 -= sz1 * (smoothstep(0.0, gy1) - 0.5);

//   var g000 = vec3(gx0.x,gy0.x,gz0.x);
//   var g100 = vec3(gx0.y,gy0.y,gz0.y);
//   var g010 = vec3(gx0.z,gy0.z,gz0.z);
//   var g110 = vec3(gx0.w,gy0.w,gz0.w);
//   var g001 = vec3(gx1.x,gy1.x,gz1.x);
//   var g101 = vec3(gx1.y,gy1.y,gz1.y);
//   var g011 = vec3(gx1.z,gy1.z,gz1.z);
//   var g111 = vec3(gx1.w,gy1.w,gz1.w);
  
//   var norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
//   g000 *= norm0.x;
//   g010 *= norm0.y;
//   g100 *= norm0.z;
//   g110 *= norm0.w;
//   var norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
//   g001 *= norm1.x;
//   g011 *= norm1.y;
//   g101 *= norm1.z;
//   g111 *= norm1.w;

//   var n000 = dot(g000, Pf0);
//   var n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
//   var n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
//   var n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
//   var n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
//   var n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
//   var n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
//   var n111 = dot(g111, Pf1);

//   var fade_xyz = fade(Pf0);
//   var n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
//   var n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
//   var n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
//   return 2.2 * n_xyz;
// }

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
    vectorFieldBuffer[hash(pos.xyz)] += snoise(pos.xyz);
    
    var test = mix(buffer1[index], buffer2[index], uniforms.time);
    var abc = buffer3[index];
    buffer3[index] = pos + .1 * vec4<f32>(curlNoise(vectorFieldBuffer[hash(pos.xyz)].xyz), 1.);
    
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

      ])
    return [computeBindGroup]
  }
})


//turn down saturation by point density of cuboid 

var rgb = new Float32Array(1e6);
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
console.log(rgb, 123)
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
    return vec4<f32>(color.xyz, 1.);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    shapes[0], quadBuffer, posBuffer, colorBuffer
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
