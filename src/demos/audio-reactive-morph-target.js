//make the dancer modulate the edges  with the vector field -> wave patterns 
// make the dancer - reset buffer 
//compute shader should always run but shouldnt change first 100,000 particles
//sin wave of 100,000 particles fly around on interval before resetting every 30 seconds
//use lifetime to animate first 100,000 particles ?? or index 

//make the vector field dance and then reset to a position based on index - cube ??

//make camera parameters a function of audio waveform 
//make particles smoothly interpolate in using lifetime
//make particle colors revolve around dancer
//make a cube of 27 cubes
//tween between different patterns - two vector field slots ??? 
//make vector fields continuous - AI or something 
//https://www.youtube.com/watch?v=tRSbwUGySxA
//https://en.wikipedia.org/wiki/Transformation_matrix
//linear algebra from scratch
import * as d3 from 'd3'
import {interpolateTurbo} from "d3-scale-chromatic";
import createCamera from './createCamera'
import bunny from 'bunny'
import dragon from 'stanford-dragon'
import { mat4, vec3 } from 'gl-matrix'
const particlesCount = 442008
import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';
import * as dat from 'dat.gui';
import postProcessing from './postProcessing'
//make a draw call visualizer - draw 3d lines or arrows with triangles
//convert to custom railway camera -> make a tool to tune it -> tour through gigantic vectorfield -> show lots of detail and scale 
//add more particles
//cloud of flying particles -> 10% forms into dancer -> 
//hardcode - dancer index into shader
//set lifetime of dancer particles to -1000 -> if negative <1000 - dont apply velocity 
//dancer appears ->  immune to vector field for a few seconds before disappearing 
//make all variables in one obj -> link up to sliders if and only if necessary
let drawScreen
let time = 0
let stagingBuffer
let modelType = 1
let animating = true
let width = 100, height = width, zspace = 1
const mouse = [0,0]
let drawCallChoice = 0

function makeGrid () {
  return makeVectorFieldGeneric(function (x, y, z) {
    return [x, y, z , 1]
  })
}

let gridBuffer = makeGrid()

function length2 (p) {
  let [x, y] = p
  return Math.sqrt(x*x + y*y)
}//ant simulation

let makeVectorField = makeVectorField4
let result = []
let pickVF = function () {
  let list = [
    makeGrid,
   makeVectorField9,
   makeVectorField2, 
    
    makeVectorField3, 
   makeModelIndex, 
   makeVectorField4,
   makeVectorField5

  ]
  let idx = (Math.random() * list.length) | 0 
  console.log(idx)
  return list[idx]()
}

function makeVectorField9() {
  return makeVectorFieldGeneric(function (x,y,z) {
    let pos = [x, y, z]
    let a = x - y
    let length = length2(pos)
    
    return [ length, length ,length , 1]
  }) 
}

function makeVectorField3() {
  return makeVectorFieldGeneric(function (x,y,z) {
    return [ -x, -y, -z, 1]
  })

}


function makeVectorField4() {
  return makeVectorFieldGeneric(function (x,y,z) {
        return [ Math.cos(-10 * y + x), Math.sin(10 * x + y), 
          10 * Math.atan(x, y), 1]
       })
}

function makeVectorField5() {
  return makeVectorFieldGeneric(function (x,y,z) {
        return [ 1  / Math.cos(-10 * y + x), 1 / Math.sin(10 * x + y), 
          1 / 10 * Math.atan(x, y), 1]
       })
}


function makeVectorFieldGeneric(cb, buffer ) {
  var result = buffer || []
  for (let i = 0; i <= width; i++) {
    for (let j = 0; j < height; j++) {
      //for (let k = 0; k < zspace; k++) {

      let [x, y, z] = clipSpace(j, i, 0, width, height)

      let [x1, y1, z1] = zeroToOne(x , y, 0)
//+  z1 * width * width * width
      let idx = Math.round(x1 * width + y1 * width * height )
      
      //result[idx] = cb(x, y, z)
      result[idx] = (cb(x,y,z))
      // result[idx].x1 = x1
      // result[idx].y1 = y1
      //}
    }
  }
  return result
}

function findPoint(d) {
  let [x, y] = d
  var x1 = ((x + 1) /2).toPrecision(2)
  var y1 = ((1. - y) / 2).toPrecision(2) 

  x1 *= 100;
  y1 *= 10000;

  let index = Math.floor(x1 + y1);
  return [result[index], index]
}

function makeModelIndex() {
  let model = shapes[0].source

  makeVectorFieldGeneric(function (x,y,z) {
     return [0, 0, 0, 0]
  })

  for (let i = 0; i < model.length; i+=4) {
    let pt = model.slice(i, i + 2)
    let [_, idx] = findPoint(pt)
    result[idx] = [10 * pt[0], 10 * pt[1], 0, 0]
  }
  return result
}

function makeVectorField2() {
    return makeVectorFieldGeneric(function (x,y,z) {
      let vec = [0,0,0,0]
      let p = [x ,y, 0]
      let l = circle(p);
      vec[0] = 1- l * 10
      vec[1] = 1- l * 10
  
      if (l < .5 && l > .4) {
        vec[0] = y * 10.
        vec[1] = -x * 10.
      } 
      return vec
    })
}

//make vector field that infinitely randomly generates lots of variety and detail every few seconds
//make dancer in center -> overwrite particles in first 1e5 coordinates 

let computeTransition
let camera = {position: {x: 0, y: 0, z: 0} }
const gui = new dat.GUI();
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()
var person = {name: 'Sam'};
let p = {type: 45}
gui.add(p, 'type', 0, 100)
var text = { speed: 'someName' }
gui.add(text, 'speed', { King: 'A', Queen: 'B', Rook: 'C' } );
const dot = ( a, b) => {
  return a[0] * b[0] + a[1] * b[1]// + a[2] * b[2];
}

function circle(p) {
  return length2(p)
}

function makeRand () {
  let x = Math.random().toPrecision(2)
  x -= .5;
  return x * 2
}

function clipSpace(x,y, z, width, height) {
  y /= height
  z /= width
  y = y - .5
  z = z - .5
  y *= -2
  z *= -2

  x = (x / width) * 2 -1

  return [x,y,z]
}

function zeroToOne(x , y, z) {
  var x1 = (x + 1) / 2 
  var y1 =((1. - y) / 2);
  var z1 = ((1. - z) / 2);

  return [x1, y1, z1]
}

function makeComputeShader(webgpu, mesh, vf1, vf2) {
  let velocityBuffer = new Float32Array(1e6)

  let velocity = makeBuffer(velocityBuffer, 0, 'vectorField')
  let gridBuffer = makeBuffer(vf1.flat(), 0, 'result')
  let gridBuffer2 = makeBuffer(vf2.flat(), 0, 'result')
console.log(vf1)

  let particleLifetime = new Float32Array(1e6)
  for(let i =0; i < particleLifetime.length; i++) {
    if (i < 1e5)
    particleLifetime[i] = -3000000
  else 
    particleLifetime[i] = Math.random() * 300000

  }

  let lifeTimeBuffer = makeBuffer(particleLifetime, 0, 'vectorField')

let max = {
  x: 0,
  y: 0,
  z: 0,
}
let min = {
  x: 0,
  y: 0,
  z: 0,
}

for(let i = 0; i < mesh.source.length; i+=4) {
  let x = mesh.source[i]
  let y = mesh.source[i+1]
  let z = mesh.source[i+2]
  max.x = Math.max(x, max.x)
  max.y = Math.max(y, max.y)
  max.z = Math.max(z, max.z)

  min.x = Math.min(x, max.x)
  min.y = Math.min(y, max.y)
  min.z = Math.min(z, max.z)
}
  const uniformsBuffer = webgpu.device.createBuffer({
    size: 32, 
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});

  return  webgpu.initComputeCall({
    label: `predictedPosition`,
    code:  `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32
    }

    @group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
    @group(0) @binding(1) var<storage,read_write> buffer3: array<vec4<f32>>;
    @group(0) @binding(2) var<uniform> uniforms: Uniforms;
    @group(0) @binding(3) var<storage,read_write> velocity: array<vec3<f32>>;
    @group(0) @binding(4) var<storage, read_write> lifetime: array<f32>;
    @group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
    @group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;



  fn taylorInvSqrt( r: vec4<f32>) -> vec4<f32> {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  fn snoise( v: vec3<f32>) -> f32 {
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
    var e = .00001;
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
  
   fn mod289( x: vec3<f32>)  -> vec3<f32> {
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

  fn shift (x:f32)->f32 {
    return (x + 1.) / 2.;
  }

  fn hash(pos: vec3<f32>) -> i32 {
    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;
    var z = (1. - (pos.z)) / 2.;

    x *= .5;
    y *= .5;
    z *= .5;

    if (x > 1.){ x = .5; } 
    if (y > 1.){ y = .5; } 
    if (y < 0.){ y = .5; } 
    if (x < 0.){ x = .5; } 
    return i32(floor(x * 100) + floor(y * 100) * 100);// + floor(z * 100) * 100 * 100);
  }
  
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let index: u32 = GlobalInvocationID.x;


      let life = lifetime[index];
      let r = reset[index]; 
      if (life < -2000000) {
        buffer3[(index)]= r;
      } else if (life < 0) {
        lifetime[index] = 3000.;
        //        velocity[index] = vec3<f32>(sfrand() * 10., -20, 30.);
        buffer3[(index)]= r;
      } else {
        lifetime[index] -= 1.;
      }
      //start as block
      //if lifetime === -10000
      //deform according to mesh
      //look like dancer 

      var pos = buffer3[index];

      var abc = buffer3[index];

      //buffer3[index] = pos + .1 * vec4<f32>(curlNoise(vectorFieldBuffer[hash(pos.xyz)].xyz), 1.);
      var idx = hash(pos.xyz);
    
      //vectorFieldBuffer[index] = .1 * vec4<f32>(curlNoise(buffer3[index].xyz), 1);
    var vf = vec3<f32>(vectorFieldBuffer[idx].xyz) + 
    vec3<f32>(vectorFieldBuffer2[idx].xyz);
    if (pos.z < 0.) {
      vf *= vec3<f32>(-1, -1, 1.);
    }
    //+ vec3<f32>(vectorFieldBuffer[index].xyz)
    ;
    // vectorFieldBuffer[idx+1].xyz +
    // vectorFieldBuffer[idx-1].xyz +
    // vectorFieldBuffer[idx-100].xyz;
    //vectorFieldBuffer[idx] = vec4<f32>(pos.xyz, 1);
    //vectorFieldBuffer[idx].xyz;
    // if (velocity[index].y < .01) {
    //   velocity[index] = vec3<f32>(-10.);
    // }
        // if (pos.y > 0.) {
        //   velocity[index].y =  sin(pos.y);
        // } else {
        //   velocity[index].y =  sin(pos.y);
        // }
        // if (pos.x > 0.) {
        //   velocity[index].x = 10 * cos(pos.x);
        // } else {
        //   velocity[index].x = -10 * cos(pos.x);
        // }
      velocity[index] *= .1;
     //velocity[index] = clamp(velocity[index] + .01 * vf, vec3<f32>(0), vec3<f32>(1 / 5.));
     velocity[index] = velocity[index] + .1 * vf;
     var p = buffer3[index];
    //  if (p.x > .9){ velocity[index] *= -1;}
    //  if (p.x < -0.9){ velocity[index] *= -1;}
    //  if (p.y > .9){ velocity[index] *= -1;}
    //  if (p.y < -.9){ velocity[index] *= -1;}
     buffer3[index] = vec4<f32>(pos.xyz + .1 * velocity[index],  1);

      // if (uniforms.time > 0.) {
      //   if (distance( buffer3[index], buffer1[index]) > .1) {
      //  var p = (buffer1[index] - buffer3[index]).xyz;
      //  //.1 * uniforms.time *
      //   vf =  ( (.01 * curlNoise(p))) * p;
      //   vf = p;
      //   velocity[index] +=  .1 * vf;
      //   buffer3[index] = vec4<f32>(pos.xyz + .1 * velocity[index],  1);
      //   }
      // }
      //wind turbulence
      //buffer3[index] = buffer3[index] + .01 * vec4<f32>(curlNoise(buffer3[index].xyz), 1);
      
      //sphere
      //buffer3[index] = vec4<f32>(curlNoise(buffer3[index].xyz), 1);

      //buffer3[index] = buffer3[index] + .01 * vec4<f32>(curlNoise(vectorFieldBuffer[index].xyz), 1);
      ;
      //buffer3[index].x < 0. ||
      var mouse = (uniforms.mouse - .5) * vec2<f32>(2,-2);
      if (distance(buffer3[index].xy, mouse) < .1) {
        // velocity[index].x = velocity[index].y;
        // velocity[index].y = -velocity[index].x;
        //buffer3[index]= vec4<f32>(buffer3[index].xy - vec2<f32>(distance(buffer3[index].xy, mouse)), 0., 1.);
        buffer3[index] = buffer3[index] - vec4<f32>(mouse, 0,0);
        //velocity[index]*= .001;
      }
      // velocity[index] =  .01 * vec4<f32>(curlNoise(buffer3[index].xyz), 1).xyz;
   

    }`,
  
    exec: function (state){
      const device = state.device
      const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();
  
      const computePass = commandEncoder.beginComputePass();
      state.computePass.computePass = computePass;
      
    webgpu.device.queue.writeBuffer(uniformsBuffer, 0,  new Float32Array(mouse))
    let timeBuffer = new Float32Array(1)
    window.writeTime = function (dt) {
      timeBuffer[0] = dt
      webgpu.device.queue.writeBuffer(uniformsBuffer, 8,  timeBuffer)

    }
      computePass.setPipeline(state.computePass.pipeline);
      computePass.setBindGroup(0, state.computePass.bindGroups[0]);
      computePass.dispatchWorkgroups(1000);
      computePass.end();
    },
    bindGroups: function (state, computePipeline) {

  const reset = makeBuffer(dancer, 0, 'reset')

  const descriptor = {
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {binding: 0, resource: {buffer: gridBuffer}},
      {binding: 1, resource: {buffer: mesh || shapes[0]}},
      {binding: 2, resource: {buffer: uniformsBuffer}},
      {binding: 3, resource: {buffer: velocity}},
      {binding: 4, resource: {buffer: lifeTimeBuffer}},
      {binding: 5, resource: {buffer: reset }},
      {binding: 6, resource: {buffer: gridBuffer2 }},
    ]
  }

  let computeBindGroup = state.device.createBindGroup(descriptor)
      return [computeBindGroup]
    }
  })
  }

const obj = (n) => `https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/1/${n}myfile.bin`

let dancer = []
let frames = []

let frameMax = 50
let frameCount = [...Array(frameMax).keys()]

function getFrames(model) { 
  frames[model]= []
  let loaded = 0
  return new Promise (function (resolve) {
    frameCount.forEach(function (i) {
      fetch(`https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/${model}/${i}myfile.bin`
      )
      .then((res) => res.arrayBuffer())
      .then((buffer) => {

        var floatBuffer = new Float32Array(buffer)
        for (let i = 0; i < floatBuffer.length; i++) {
          floatBuffer[4*i+1] -= .5;
        }
        frames[model][i]=floatBuffer
        loaded += 1
        if (loaded === frameMax - 1) {
          resolve()
          if (model === 2) basic()
          setTimeout(makeStagingBuffer, 3000)
        }
      })
    })
  })
}

fetch(obj(1)).then(d => d.arrayBuffer()).then((d) => {
  dancer = new Float32Array(d)
  for (let i = 0; i < dancer.length; i++) {
    dancer[4*i+1] -= .5;
  }
  shapes.push(window.makeBuffer(dancer, 0,'leaf'))
})
getFrames(1)
getFrames(2)
getFrames(3)
getFrames(4)

let pointBuffer = new Float32Array(1e6)

let indexPool = new Array(1e6 / 4).fill(1).map((d, i) => i)
indexPool.alloc = function (n) {
  let i = 0

  let result = []
  while (i < n) {
    result.push(this.shift())
    i++
  }
  return result;
}

function line(a, b) {
  this.x1 = a[0]
  this.y1 = a[1]
  this.x2 = b[0]
  this.y2 = b[1]
  this.indices = []
  this.points = [];
  this.array = pointBuffer
  this.subdivide = function (resolution) {
    // dont use the proper technique - bresenhams - cpu rasterizer 
    let {x1, y1, y2, x2}= this;
    let dy = y2 - y1;
    let dx = x2 - x1;
    let points = new Array(resolution).fill(0).map((d, i) => {
      return [x1 + (dx / resolution * i), 
              y1 + (dy / resolution * i) ]
    })
    this.points = points;
  }
}

line.prototype.draw = function () {
  this.subdivide(50)
  if (! this.indices.length) {
    this.indices.push(...indexPool.alloc(this.points.length))
  }

  this.indices.forEach((d, i) => {
    let idx = d * 4
    this.array[idx] = this.points[i][0]
    this.array[idx+1] = this.points[i][1]
  })
}

let rhomboid = function (origin, side, skew) {
  //left corner = half radius left + down
  //6 left, 4 down
  let a = [origin[0]+side + skew,  origin[1] + side] //top right
  let b = [origin[0] - side + skew,  origin[1] + side] // top left
  let c = [origin[0] + side,  origin[1] - side] // bottom right
  let d = [origin[0] - side, origin[1] - side] // bottom left
  let lines = [new line(a, b), new line(a, c), new line(c, d), new line(d, b)]
  lines.forEach( line => line.draw() )
  //console.log(a)
}

let triangle = function (origin, side) {
  let a = [origin[0],  origin[1] + side] //top right
  let b = [origin[0]- side,  origin[1]-side] // top left
  let c = [origin[0]+side,  origin[1]-side] // bottom right
  let lines = [new line(a, b), new line(a, c), new line(c, b)]
  lines.forEach( line => line.draw() )
}

setInterval(function ( ) {
  // rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
  // rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
  // rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
  // rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
  // rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
  triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
  triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
  triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
  triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
  triangle([makeRand() * 5, makeRand() * 5], .9, 1.)

}, 1000)

window.addEventListener('click', function () {
  let timebetween = 1000
  if (! animating ) {
    modelType = 1 + ((modelType) % (frames.length ))
 
    let elapsed = Date.now()
    setTimeout(function recur() {
      let dt = Date.now() - elapsed
      //window.writeTime(timebetween - dt)
      if (dt < timebetween) setTimeout(recur, 16)
      else {
        animating = true
        modelType = modelType === 1 ? 2 : 1
        return makeStagingBuffer()
      }
    }, 8)
  } else {
    animating = ! animating

  }
  if (animating) return makeStagingBuffer()
})

let particleMesh = []

function initParticles () {
  for (let i = 0; i < 1e6; i++) {
    particleMesh[i] = {x: -.9 + i / 1e4, y: .9, z: 0, dir: [makeRand(), makeRand()]}
  }
}
initParticles()

let keyframeFunctions = [
  function (p, i, t) {
    let idx = i / 100
    let radius = 1
    let z = (i / 1e5) * 100
    p.x = (radius - z) * Math.cos(idx * 360 * Math.PI / 180) 
    p.y = (radius - z) * Math.sin(idx * 360 * Math.PI / 180) 
    p.z = z
  },
  function (p, i, t) {
    p.x = (i / 1000)
    p.y = Math.round(i / 50) / 200

  },
  function (p, i, t) {
    p.x = i / 1000
    p.y = (i % 100) / 10

  },
  function (p, i, t) {
    i *= 1. - t
    p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
    p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 

  },

  function down(p) {
    p.y -= .01
  }, 
  function windshieldWiper (p, i, time) {
    let t = time
    p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
    p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 
  },

  function (p, i) {
    p.x += .01;
  },
  function (p, i, t) {
    t = 1. - t
    p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
    p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 
  },
  function windshieldWiper (p, i, time) {
    let t = time
    //t += 10 * Math.floor(i  % 10)
    t += (i / 1000);
    let idx = i % 10;
    p.x = .01 * idx * Math.cos(t * 360 * Math.PI / 180)
    p.y = .01 * idx * Math.sin(t * 360 * Math.PI / 180)
    for (let n =0; n < 10; n++)
      if (i > n * 1000)  
        p.x += n * .2
  },
  function (p, i, t) {
    p.x = Math.tan(t * 360 * Math.PI / 180)
    p.y = Math.tan(t * 360 * Math.PI / 180)
  }
]


function tween (a, b, i) {
  return a - ((a - b) * i) / (b - a)
}

let count = 0
function moveParticles () {
  count += 1
  //count = 0
  let i = Math.floor(count / 100)
  let fn = keyframeFunctions[0]
  if (! fn)fn = function (i){ 
    count = 0; 
  }
  for (let i = 0; i < 1e5; i++) {
  let pt = particleMesh[i]
   fn(pt, i, (count % 100) / 100)
  }
}

let drawParticles = true

let test = new Array(250000).fill(0).map(Math.random)
function makeStagingBuffer() {
  setTimeout(function () {
    if (! shapes[0] || !animating) return;

    stagingBuffer = webgpu.device.createBuffer({
      size: 1e7,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
   
    let frame = time % frames[modelType].length
    const toCopy = frames[modelType][frame]
    dancer = toCopy
    if (! toCopy) return console.log(toCopy, modelType, frame)
    if (time === 0) window.toCopy = toCopy
    time += 1
    //if (drawParticles) moveParticles()

    const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())
    //let yourCopy = vertexPositions.slice(0, 1e5)

    // for (let i = 0; i < 9; i++) {
    //   let idx = i * 4;
    //   let yourCopy = new Float32Array(1e5)
    //   for (let j = 0; j < toCopy.length; j+=4){
    //    // let idx = 4 * j
    //     yourCopy[j] = toCopy[j] + i * .111
    //     yourCopy[j+1] = toCopy[j+1] + .2 * Math.floor(i / 3)
    //     yourCopy[j+2] = toCopy[j+2]
    //     yourCopy[j+3] = toCopy[j+3]
    //   }
    //   // vertexPositions[idx] = yourCopy[idx]
    //   // vertexPositions[idx+1] = yourCopy[idx+1]
    //   // vertexPositions[idx+2] = yourCopy[idx+2]
    //   // vertexPositions[idx+3] = 1
    //   vertexPositions.set(yourCopy, 1e5 * i)
    // }
    //console.log(Date.now())
    // vertexPositions.forEach(function (d, i) {
    //   vertexPositions[i]=toCopy[i % toCopy.length] + .2
    // })

    vertexPositions.set(toCopy)
    stagingBuffer.unmap();
    // Copy the staging buffer contents to the vertex buffer.
    const commandEncoder = webgpu.device.createCommandEncoder({});
    commandEncoder.copyBufferToBuffer(stagingBuffer, 0, shapes[0], 0, toCopy.length * 4);
    webgpu.device.queue.submit([commandEncoder.finish()]);
    if (animating) makeStagingBuffer()
    //console.log(animating)
  }, 20)
}

let shapes = []
function writeBuffer (device, buffer, array) {
  device.queue.writeBuffer(device, 0, buffer, 0, new Float32Array(16));
}

window.makeBuffer = function makeBuffer (stuff, flag, label) {
  const particleSize = 4
  const gpuBufferSize = 134217728

  const gpuBuffer = webgpu.device.createBuffer({
    label,
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  gpuBuffer.source = stuff
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());

  if (stuff && stuff.flat) (stuff = stuff.flat(), label)
  particlesBuffer.set(stuff)
  gpuBuffer.unmap();
  return gpuBuffer
} 
let webgpu = simpleWebgpuInit().then(w => webgpu = w)
let list = pointBuffer
for( let i = 0; i < list.length; i+=4){
  list[i]= makeRand() * 2
  list[i+1]= makeRand() * 2

  list[i+2]=  makeRand() * 2

  list[i+3]= 0

}
// makeVectorFieldGeneric(function (x, y, z) {
//   return [x, y, z]
// }, pointBuffer)


async function basic () {
  let vf1 =  pickVF(), vf2 = pickVF()
  setInterval(function () {
  vf1 = vf2
  vf2 =  pickVF()
  
   
  let happyBear = makeBuffer(list, 0, 'bear')

    computeTransition = makeComputeShader(webgpu, happyBear, vf1, vf2)
    //drawScreen.swapAttributeBuffer(0, happyBear)
    drawScreen = makeDrawCall(happyBear, drawDescriptor) 
  }, 1000)


  computeTransition = makeComputeShader(webgpu, makeBuffer(frames[2][0]), vf1, vf2)

const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16 + 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const posBuffer = makeBuffer(bunny.positions.map(d => d.concat(0)).flat(), 1, 'bunny')
1
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




const device = webgpu.device


let model = mat4.identity(new Float32Array(16))
let cosCounter = 0
function getCameraViewProjMatrix() {
  let m  = mat4.identity(new Float32Array(16))
  mat4.translate(model, model, vec3.fromValues(2, 2, 0));
  mat4.rotate(
    model,
    model,
    1,
    vec3.fromValues(
      Math.sin(0),
      //Math.cos((cosCounter += 1) * .001),
      Math.cos(1),
      0
    )
  );
//  model = m
  //vec3.rotateY(eyePosition, eyePosition, origin, rad);

  let projectionMatrix = mat4.create();
  let viewProjectionMatrix = mat4.create();
  mat4.perspectiveZO(projectionMatrix,
    10, 500 / 500, .5, 10.0);
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
// setInterval(function () {
//    getCameraViewProjMatrix()
// }, 10)
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

//precisely calculate line interval convolutions using 
var rgb = new Float32Array(1e6);
for (let i = 0; i < rgb.length; i++) {
  let stuff = ((i % 1000) / 1e3) 
  let interval = (Math.sin((stuff)) + 1) / 2.
  let color = d3.rgb( interpolateTurbo(stuff));
  rgb[3*i] = color.r / 255 / 2 + .5
  rgb[3*i+1] = color.g / 255 /2 + .5
  rgb[3*i+2] = color.b / 255 /2 + .5
}
const colorBuffer = makeBuffer(rgb, 0, 'color')
let hello = []
//5 files
// 5 draw calls
// shader box + generate box + shaders for transitions + functions to change rotation
// compute shader - changing poitns according to vector field - 3 of those
let img = new Image();
img.src = './data/webgpu.png'
await img.decode();
let bitmap = await createImageBitmap(img);
const uniformsBuffer = webgpu.device.createBuffer({
  size: 48, 
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});
let abc = new Float32Array(1)

setInterval(function () {
  abc[0] = performance.now() 
  device.queue.writeBuffer(
    uniformsBuffer,
    0,
    abc.buffer,
    abc.byteOffset,
    abc.byteLength
  );
}, 8)
let drawDescriptor = {
  attributeBuffers: buffers,
  attributeBufferData: [
    shapes[0]
    //makeBuffer(gridBuffer, 0, 'cube'),
    //makeBuffer(makeCube(), 0, 'cube')
    , quadBuffer, posBuffer, colorBuffer
  ],
  count: 6,
  //blend,
  instances: 1e6 / 4,
  bindGroup: function ({pipeline}) {

  
let texture = webgpu.texture(bitmap)
  let desc = {
    label: Math.random(),
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
          },
          {
            binding: 2,
            resource: texture.sampler,
          },
          {
            binding: 3,
            resource: texture.texture.createView(),
          },
      ]
  }
    return webgpu.device.createBindGroup(desc);
  }
}


const a = new Float32Array(1)

drawScreen = makeDrawCall(shapes[0], drawDescriptor) 


webgpu.canvas.addEventListener('mousemove', function (e) {
  mouse[0] = e.clientX / 1000
  mouse[1] = e.clientY / 500
})

let camera = createCamera({
  center: [0, 2.5, 0],
  damping: 0,
  noScroll: true,
  renderOnDirty: true,
  element: webgpu.canvas || false ||
  document.createElement('div') || false
 
});
let zoom = 10
webgpu.canvas.addEventListener('mousewheel', function (e) {
  camera.zoom(zoom = zoom + .1 * e.deltaY)
})

let result = drawScreen()
//let texture = 
//let pp = await postProcessing(webgpu, texture);


let swapChainTexture = result.state.swapChainTexture

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
    
     
 
    //if (! animating) {
      computeTransition()
    //}


    // let result = drawCalls[drawCallChoice]({
    //   texture: bitmap
    // })

    // bitmap = result.state.swapChainTexture

    // pp(texture)
    drawScreen()
    }, 8) 
}









function makeDrawCall (buffer, drawDescriptor) {
  drawDescriptor.attributeBufferData[0] = buffer
  
  const drawRosePetals =  webgpu.initDrawCall(Object.assign(drawDescriptor , { shader:{
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`
  struct Uniforms {
    time: f32,             //             align(16)  size(24)
  color: vec3<f32>,         // offset(0)   align(16)  size(16)
  spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
  };
  
  struct Camera {
  projectionMatrix : mat4x4<f32>,
  viewMatrix : mat4x4<f32>,
  modelMatrix: mat4x4<f32>,

  
  }
  
  struct VSOut {
  @builtin(position) position: vec4<f32>,
  @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
  @location(1) color: vec3<f32>
  };
  
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<uniform> camera : Camera;
  @group(0) @binding(2) var mySampler: sampler;
  @group(0) @binding(3) var myTexture: texture_2d<f32>;
  
  @vertex
  fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
  @location(2) pos2: vec4<f32>, @location(3) color: vec3<f32>,
  ) -> VSOut {
  var vsOut: VSOut;  

  vsOut.position = 
   camera.projectionMatrix
   * camera.viewMatrix *  camera.modelMatrix * 
  
   vec4<f32>(inPosition.xy + (.01) * quadCorner, inPosition.z, 1.);
  
  vsOut.localPosition = quadCorner;
  
  vsOut.color = color;
  return vsOut;
  }



  const size = 4.0;

  const b = 0.3;//size of the smoothed border

fn smoothStep(edge0:f32, edge1:f32, x:f32) -> f32 {
if (x < edge0) {return 0.;}

if (x >= edge1) {return 1.;}

let c = (x - edge0) / (edge1 - edge0);

return c * c * (3 - 2 * c);
}

  fn mainImage(fragCoord: vec2<f32>, iResolution: vec2<f32>) -> vec4<f32> {
    let aspect = iResolution.x/iResolution.y;
    let position = (fragCoord.xy) * aspect;
    let dist = distance(position, vec2<f32>(aspect*0.5, 0.5));
    let offset=(uniforms.time) * 0.01;
    let shit = uniforms.time;
    let conv=4.;
    let v=dist*4.-offset;
    let ringr=floor(v);
    
    var stuff = 0.;
    if (v % 3. > .5) {
      stuff = 0.;
    }

var color=smoothStep(-b, b, abs(dist- (ringr+stuff+offset)/conv));
    if (ringr % 2. ==1.) {
     color=2.-color;
    }

  let distToMouseX = distance(1., fragCoord.x);
  let distToMouseY = distance(2., fragCoord.y);

  return vec4<f32>(
    color, 
    color, 
    color, 
   1.,
    );
};

fn main(uv: vec2<f32>) -> vec4<f32> {
  let fragCoord = vec2<f32>(uv.x, uv.y);
  var base = vec4<f32>(cos(uniforms.time * .1), .5, sin(uniforms.time * 0.000001), 1.);
  //let dist = distance( fragCoord, vec2<f32>(u.mouseX,  u.mouseY));
  return mainImage(fragCoord, vec2<f32>(1000., 1000.));
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
  let m = textureSample(myTexture, mySampler, localPosition);
  //sin(camera.time)
  //

  var c = mainImage(localPosition, vec2<f32>(1000., 1000.));
  //color.rgb +
  return vec4<f32>( c.rgb, .7);
  }
  `}}));
  return drawRosePetals
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