import * as dat from 'dat.gui';
let camera = {position: {x: 0, y: 0, z: 0} }
const gui = new dat.GUI();
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()
var person = {name: 'Sam'};

gui.add(person, 'name');


let p = {type: 45}
gui.add(p, 'type', 0, 100)

var text =
{
    speed: 'someName'
}
gui.add(text, 'speed', { King: 'A', Queen: 'B', Rook: 'C' } );


//friday - try to work 12 hours a day including today
//sophisticated vectorfield 
//reflections ?
//rose Petals -> gold -> 

//try your best to keep it scratch - dont copy paste 
//read stuff and learn from it 
//write it down - fill up 100 page journal with learning
//learning is whats important
//learning is what preps us to face what challenges come tomorrow
//demo is merely a stepping stone to more important creations
//put in 140 hours of work and see if its good enough
// if not, reassess and try again but sure



//good loading bar - prefetch first frame then load all frames 
import postProcessing from './postProcessing'

const useCamera = true
function makeRand () {
  let x = Math.random().toPrecision(2)
  x -= .5;
  return x * 2
}

function clipSpace(x,y, z, width, height) {
  y /= height
  z /= width * height
  y = y - .5
  z = z - .5
  y *= -2
  z *= 2

  x = (x / width) * 2 -1

  return [x,y,z]
}

function zeroToOne(x , y) {
  var x1 = (x + 1) /2 
  var y1 =((1. - y) / 2);

  return [x1, y1]
}

function makeCube() {
  let result = []
  let width = 100, height = 100
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      for (var k = 0; k < height; k++) {

  
        
        let [x, y, z] = clipSpace(k, j, i, width, height)

        let [x1, y1]  = zeroToOne(x, y)


        result.push([x, y, 0, 0])
      }
    }
  }
  console.log(result)
  return result;
}


//shader on box 
//split box in half and rotate 

//
function box() {
  this.width = 100
  this.height = 100
  this.z = 100

  this.origin = [0,0,0]
  this.rotation = [];
}

box.prototype.rotate = function (x, y, z) {

}

box.prototype.render = function (grid) {
  let render = []
  for (var i = 0; i < width; i++) {
    for (var j = 0; i < height; i++) {
      for (var k = 0; i < height; i++) {
        let [x, y, z] = clipSpace(i, j, k, width, height);

        result.push([x, y, z, 0])
      }
    }
  }

  return render;
}

//done from scratch - eta may 1 - happy bear
///0 = do now, 2 = later, 3 never
//3d path finding - 2
//3d models https://www2.cs.uh.edu/~chengu/Teaching/Spring2013/Lecs/Lec9.pdf
//SDF - parametric equations - random - 2
//butterflies wings - artful way of transitioning between memes - 3
//https://gamedevelopment.tutsplus.com/tutorials/understanding-goal-based-vector-field-pathfinding--gamedev-9007

//primary criteria = amazingness of process + final result
//rose petals - 2
//particles are mirrors - reflecting environment - 1
//dont fight the stream - mochi
//write words in flowing vector field -> shift it over one column at at time -> 3

//bake stuff - baked lighting on particles https://www.youtube.com/watch?v=yG4ChOPyC-4&t=82s
//mirror walls + mirror particles -2 
//glowy particles - 2
//ray traced reflections on particles - 2
//stellar dancer - celestial - 2
//electrical water - lightning = particles colliding - 2
//https://www.youtube.com/watch?v=rzRf0pTxYO0
//animation looks like zoom - 2
// chromatic blur - 2
///frosted glass - transparency https://twitter.com/pandrr/status/1646782946542592001 - 3
//CPU Curl - COULD end the stream - 3
//grid of points - colored by image - 2 - shaders projected on it- move p articles sync w/ shader animation
//galaxy - 2
//globe - 2
//flower - vector field - 2
//lighting on particles - 2
//dancerA -> dancerB - 2
//flow field - spiral - 2
//[ DONE]magnet - needs polish
//[DONE] tween from an explosion to a dancer
//flowfield - 3d model - 2
//emitter field - 2nd particle sim - 2
//multiple dancers - 2
//add linked visualization
//add camera to compute shader - 2
let drawCallChoice = 2

let button = document.createElement('button')

button.textContent = 'change draw'

document.body.appendChild(button)

button.addEventListener('click', function () {
  drawCallChoice = (drawCallChoice + 1) % 3

})

import {abc} from "./shader2";

const mouse = [0,0]
import * as d3 from 'd3'
import {interpolateTurbo} from "d3-scale-chromatic";
import createCamera from './createCamera'
import bunny from 'bunny'
import dragon from 'stanford-dragon'
import { mat4, vec3 } from 'gl-matrix'
const particlesCount = 442008 / 3 
import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';
//curl noise turbulence
//flowing along 3d model
//magnets
//spiral
//writing words

function distanceTo(b, a) {
      
  return [b[0] - a[0], b[1]-a[1], b[2] - a[2]]
}


function getDist(a, b) {
  return [a[0] - b[0], a[1]-b[1], a[2] - b[2], 0].map(d => Math.pow(d , 2)).reduce((a, b) => {
    return a + b
  })
}

function minus (v1, v2) {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
    v1[2] - v2[2],
  ]
}

function add (v1, v2) {
  return [
    v1[0] + v2[0],
    v1[1] + v2[1],
    v1[2] + v2[2],
  ]
}

function length (p) {
  let [x, y] = p
  return Math.sqrt(x*x + y*y)
}
 
function magnitude (v) {
  let pow = (e) => Math.pow(e, 2)
  return Math.sqrt(pow(v[0]) + pow(v[1]) + pow(v[2]))
}

function unitVector (v) {
  let l = magnitude(v)
  return v.map(d => d / l);
}

function makeComputeShader(webgpu, mesh, abc) {
  let device = webgpu.device
  let velocityBuffer = new Float32Array(1e6)

  let velocity = makeBuffer(velocityBuffer, 0, 'vectorField')


  let particleLifetime = new Float32Array(1e6)
  for(let i =0; i < particleLifetime.length; i++) {
    particleLifetime[i] = Math.random() * 3000
  }


  let lifeTimeBuffer = makeBuffer(particleLifetime, 0, 'vectorField')

let coords = []

for (var i = 0; i < 10; i++) {
  coords.push((i / 10 - .5) * 2)
}



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


let result = []

for (let i = -1; i < 1; i+=.2) {
  coords.push(i)
}

result = []
let width = 100, height = width

let makeVectorField = makeVectorField1
// make spiral vector field 
// dont use visualizer
//algorithms for vector field
function makeVectorField3() {
  let dir = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1]
  ]
  for (let i = 0; i <= width; i++) {
    for (let j = 0; j < height; j++) {
      let [x, y] = clipSpace(j, i, 0, width, height)
      let [x1, y1 ] = zeroToOne(x , y)
      let idx = Math.round(x1 * width + y1 * width * height)



      result[idx] = [
        -x, -y, 0, 1
      ]
      
      // [
      //   x / x * x + y * y
      //   ,
        
      //   y / y * y + x * x
        
      //   ,0,0]
    }
  }

return result
}


let magnets = []
for (let i = 0; i < 5; i++) {
  if (i < 1)
  magnets.push([
    max.x + makeRand(), max.y+ makeRand(), 0
  ]); else 
  magnets.push([
        makeRand(), makeRand(),0
    ])
  
}

function makeVectorField1() {
  magnets.forEach(m => {
    m[0] += .1 * makeRand()
    m[1] += .1 * makeRand()
    m[2] += .1 * makeRand()
  })

for (let i = 0; i <= width; i++) {
  for (let j = 0; j < height;j++) {
  let [x, y] = clipSpace(j, i, 0, width, height)
    let [x1, y1 ] = zeroToOne(x , y)
    let idx = Math.round(x1 * width + y1 * width * height)
    let dog = -Math.sin(x+y + Math.random())
    let dummy =  Math.cos(x) - Math.sin(y)
    let sin = Math.sin, cos = Math.cos, max = Math.max, pow = Math.pow, min = Math.min
    let p = [x ,y, 0]
    p.x = x 
    p.y = y

    dog = 0
    dummy = 0

  let vec = [0,0,0,0]
   
    let s = shapes[0].source
    magnets.forEach((mag , i) => {
      let dist = getDist(mag, p)
      //console.log(dist)
      let dx = unitVector(distanceTo(mag, p))
      //if (Math.random() * .9999)console.log(dist)
      vec = add(vec, dx.map(d => d * 1/ dist))
      //add(vec, dx.map(d => d * 1/ dist))
      ///if (dist < .1) vec = [ -vec[1] , vec[0] , vec[2]]
      //console.log(dist)
      if (dist < .0001) vec = [ -vec[1], vec[0], vec[2]]
    })
    
    //vec[2] = 0
    vec[3] = 0
    vec.x = x1
    vec.y = y1

    let bounds = j < 30 || i < 30 || i > 70 || j > 70
    result[idx]= vec
}
}
return result
}




function makeVectorField2() {

  let magnets = []
for (let i = 0; i < 5; i++) {
  if (i < 1)
  magnets.push([
    max.x + makeRand(), max.y+ makeRand(), Math.random()
  ]); else 
  magnets.push([
        makeRand(), makeRand(), Math.random()
    ])
  
}
function makeParticlesMove () {
  let i = 0;
  for (let i = 0; i < 100; i++) {

  }
}

for (let i = 0; i <= width; i++) {
  for (let j = 0; j < height;j++) {
  let [x, y] = clipSpace(j, i, 0, width, height)
    let [x1, y1 ] = zeroToOne(x , y)
    let idx = Math.round(x1 * width + y1 * width * height)
    let dog = -Math.sin(x+y + Math.random())
    let dummy =  Math.cos(x) - Math.sin(y)
    let sin = Math.sin, cos = Math.cos, max = Math.max, pow = Math.pow, min = Math.min

    let p = [x ,y, 0]
    p.x = x 
    p.y = y

    dog = 0
    dummy = 0

  let vec = [0,0,0,0]

      let dist = getDist(p, getClosestMagnet())

      magnets.forEach((mag , i) => {
        let dist = getDist(mag, p)
        //console.log(dist)
        let dx = unitVector(distanceTo(mag, p))
        //if (Math.random() * .9999)console.log(dist)
        vec = add(vec, dx.map(d => d * 1/ dist))
        //add(vec, dx.map(d => d * 1/ dist))
        ///if (dist < .1) vec = [ -vec[1] , vec[0] , vec[2]]
        //console.log(dist)
        if (dist < .05) vec = [ -vec[1], vec[0], vec[2]]
      })

    vec[2] = 0
    vec[3] = 0
    vec.x = x1
    vec.y = y1

    let bounds = j < 30 || i < 30 || i > 70 || j > 70
    // if (bounds) {
    //   vec[0] = 200 * -x
    //   vec[1] = 200 * -y
    // }
    // vec[0] = -x
    // vec[1] = -y

    // vec[0] = x
    // vec[1] = y
    result[idx]= vec
}
}
return result
}


function makeVectorField2() {


// magnets.push([
//   0,0,0
// ])
//console.log(magnets)

for (let i = 0; i <= width; i++) {
  for (let j = 0; j < height;j++) {
  let [x, y] = clipSpace(j, i, 0, width, height)
    let [x1, y1 ] = zeroToOne(x , y)
    let idx = Math.round(x1 * width + y1 * width * height)
    let dog = -Math.sin(x+y + Math.random())
    let dummy =  Math.cos(x) - Math.sin(y)
    let sin = Math.sin, cos = Math.cos, max = Math.max, pow = Math.pow, min = Math.min
    // let a = dancer.slice(idx, idx+3)
    // let b = dancer.slice(idx+4, idx+7)
    // x *= 2
    // y *= 2f
    let p = [x ,y, 0]
    p.x = x 
    p.y = y

    dog = 0
    dummy = 0

  let vec = [0,0,0,0]

    function distanceTo(b, a) {
      
      return [b[0] - a[0], b[1]-a[1], 0]
    }

    function getClosestMagnet() {
      let idx = 0, distance = 0
      magnets.forEach((d , i) => {
        let dist = distanceTo(p, p)
        if (distance > dist) return
        distance = Math.min(dist, distance)
        idx = i
      })
      return magnets[idx]
    }

    function getDist(a, b) {
      return [a[0] - b[0], a[1]-b[1], a[2] - b[2], 0].map(d => Math.pow(d , 2)).reduce((a, b) => {
        return a + b
      })
    }

    function add (v1, v2) {
      return [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
      ]
    }
    

      vec = [0, 0,0,0]
      let dist = getDist(p, getClosestMagnet())

  
      

      // vec[0] = Math.sin(x * 180)
      // vec[1] = Math.cos(i * 180)

      // magnets.forEach((mag , i) => {
      //   let dist = getDist(mag, p)
      //   //console.log(dist)
      //   let dx = unitVector(distanceTo(mag, p))
      //   //if (Math.random() * .9999)console.log(dist)
      //   vec = add(vec, dx.map(d => d * 1/ dist))
      //   //add(vec, dx.map(d => d * 1/ dist))
      //   ///if (dist < .1) vec = [ -vec[1] , vec[0] , vec[2]]
      //   //console.log(dist)
      //   //if (dist < .05) vec = [ -vec[1], vec[0], vec[2]]

      //   shapes[0]
      // })
      const angle = Math.atan2(x, y)
      let degrees = angle * (180 / Math.PI)
      let abs = Math.abs, sqrt = Math.sqrt

   
  


const dot2 = (p) => {
   let _ = dot(p, p)
  //if (! _) return console.log(p)
   return _
}

    const dot = ( a, b) => {

      return a[0] * b[0] + a[1] * b[1]// + a[2] * b[2];
  
    }
    function sub (a, b) {
      return [a[0] - b[0], a[1] - b[1]]
    }

    function circle(p) {
      return length(p)
    }

    function sdHeart( p )
    {
      //console.log(p)
        p[0] = abs(p[0]);
        // p[0] -= .3
        // p[1] -= .3
        if( p[0]+p[1]>1. )
            return sqrt(dot2(sub(p,[0.25,0.75]))) - sqrt(2.0)/4.0;
        return sqrt(min(dot2(sub(p,[0.00,1.00])),
                        dot2(p.map(d => d -0.5*Math.max(p[0]+p[1],0.0))))) * (p[0]-p[1] > 0 ? 1 : -1);
    }
    let l = circle(p);
    vec[0] = 1- l * 10
    vec[1] = 1- l * 10

    if (l < .5 && l > .4) {
      vec[0] = y * 10.
      vec[1] = -x * 10.
    } 
    vec[2] = 0
    vec[3] = 0
    vec.x = x1
    vec.y = y1

    //spiral
    // vec[0] = y / (x * x) + (y * y) 
    // vec[1] = -x / (x * x) + (y * y) 

    let bounds = j < 30 || i < 30 || i > 70 || j > 70
    // if (bounds) {
    //   vec[0] = 200 * -x
    //   vec[1] = 200 * -y
    // }
    // vec[0] = -x
    // vec[1] = -y

    // vec[0] = x
    // vec[1] = y
    result[idx]= vec
}
}
return result
}
//multiple dancers and a globe and one particle swarm that becomes stuff according to the beat
//use curl noise on CPU to interpolate the vector field according to the music

// console.log(result, counter)

//vector field isnt updating 
makeVectorField()

function zeroToOne(x , y) {
  var x1 = (x + 1) /2 
  var y1 =((1. - y) / 2);

  return [x1, y1]
}

//problem solving process has to be better than beefore
function findPoint(d) {
    let [x, y] = d
    var x1 = ((x + 1) /2).toPrecision(2)
    var y1 = ((1. - y) / 2).toPrecision(2) 
  
  
    //if (y1 > .5) y1 -= .02
    //var x1 = x, y1 = y;
    //console.log(x1,y1)
    //if (x1 % 1 === .5) x1 -= 1, y -= -1 
    x1 *= 100;
    y1 *= 10000;
  
    let index = Math.floor(x1 + y1);
    //console.log(index, x, x1, y, y1)
    //console.log(index, x1, y1)
    return [result[index], index]
  }


let n = 0;
let collided = 0

function makeRand () {
  let x = Math.random().toPrecision(2)
  x -= .5;
  return x * 2
}

let gridBuffer = makeBuffer(result.flat(), 0, 'result')

setInterval(function () {
  let vf = makeVectorField()
  window.drawVF(vf)


  let stagingBuffer = webgpu.device.createBuffer({
    size: 1e6,
    usage: GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });

  const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())

  vertexPositions.set(vf.flat())
  stagingBuffer.unmap();

   // Copy the staging buffer contents to the vertex buffer.

  const commandEncoder = webgpu.device.createCommandEncoder({});
  commandEncoder.copyBufferToBuffer(stagingBuffer, 0, gridBuffer, 0, vf.length * 4 * 4);

  webgpu.device.queue.submit([commandEncoder.finish()]);
  


}, 5000)

let count = 0
let coll = {}

  

  window.gridBuffer = gridBuffer
  let texture = webgpu.device.createTexture({
    size: [100, 100, 1],
    format:  "rgba8unorm",
    dimension: "2d",
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.STORAGE_BINDING |
      GPUTextureUsage.COPY_SRC,
  });
  
    // webgpu.device.queue.writeTexture(
    //   { texture },
    //   gridBuffer,
    //   {
    //     bytesPerRow: 400,
    //     rowsPerImage: 400,
    //   },
    //   [100, 100, 1]
    // );
  
  let ce = device.createCommandEncoder();
  ce.copyBufferToTexture(
    { buffer: gridBuffer },
    { texture },
    { width: 100, height: 00, depthOrArrayLayers: 1, bytesPerRow: 400 },
    { offset: 0, bytesPerRow: 400, rowsPerImage: 100 }
  );
  
  device.queue.submit([ce.finish()]);
  
  const uniformsBuffer = webgpu.device.createBuffer({
    size: 32, 
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});




  return  webgpu.initComputeCall({
    label: `predictedPosition`,
    code: abc || `
//timeStep
//Acceleration
//curl factor
//colors 
//2d : 3d
// magnet animation formula
//



  
  //   const matrix = [
  //     -3.677814483642578,
  //     0,
  //     0,
  //     0,
  //     0,
  //     -3.677814483642578,
  //     0,
  //     0,
  //     0,
  //     0,
  //     -1.0090817213058472,
  //     -1,
  //     0,
  //     0,
  //     -0.9081735610961914,
  //     0
  // ];


    struct Uniforms {
      mouse: vec2<f32>,
      time: f32
    }


    @group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
    @group(0) @binding(1) var<storage,read_write> buffer3: array<vec4<f32>>;
    @group(0) @binding(2) var<uniform> uniforms: Uniforms;
    @group(0) @binding(3) var<storage,read_write> velocity: array<vec3<f32>>;
    @group(0) @binding(4) var myTexture: texture_2d<f32>;
    @group(0) @binding(5) var<storage, read_write> lifetime: array<f32>;

  
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

  fn shift (x:f32)->f32 {
    return (x + 1.) / 2.;
  }

  fn hash(pos: vec3<f32>) -> i32 {
    //let idx = shift(pos.x) * 10 + shift(pos.y) * 1000 + shift(pos.z) * 100000;

  
    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;

    // if (y < .01) {y = 1.;}
    // if (x < .01) {x = 1.;}
    // if (y > .99) {y = 0.;}
    // if (x > .99) {x = 0.;}
    //return i32(floor(x * 100) + floor(y * 10000));
    return i32(floor(x * 100) + floor(y * 100) * 100);
    //return vec2<i32>(i32(x * 10), i32(y * 100));
  }
  
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {



      let index: u32 = GlobalInvocationID.x;


      let life = lifetime[index];

      if (life < 10.) {
        lifetime[index] = 3000.;
        velocity[index] = vec3<f32>(sfrand() * 10., -20, 30.);
        buffer3[index]= vec4<f32>(sfrand() * 10., sfrand() * 10., 0, 1.);
      } else {
        lifetime[index] -= 8.;
      }

      //decay rate has to be same as scaling factor - 1.6



      var pos = buffer3[index];

      var abc = buffer3[index];

      //buffer3[index] = pos + .1 * vec4<f32>(curlNoise(vectorFieldBuffer[hash(pos.xyz)].xyz), 1.);
      var idx = hash(pos.xyz);
      var stuff =  textureLoad(myTexture,
        vec2<i32>(idx),
         //vec3<i32>(i32(shift(pos.x) * 100), i32(shift(pos.y * 255), i32(pos.z * 255)), 
         0
         );
  
      
   
      //vectorFieldBuffer[index] = .1 * vec4<f32>(curlNoise(buffer3[index].xyz), 1);
  
  
    var vf = vec3<f32>(vectorFieldBuffer[idx].xyz);
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
     velocity[index] += .01 * vf;
     
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
   
      var p = buffer3[index];
      if (p.x > .99){ buffer3[index].x = -1;}
      if (p.x < -0.99){ buffer3[index].x = 1;}
      if (p.y > .99){ buffer3[index].y = -1;}
      if (p.y < -.99){ buffer3[index].y = 1;}

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
      computePass.dispatchWorkgroups(256);
      computePass.end();
    },
    bindGroups: function (state, computePipeline) {
  //dancing
  //3d vector field of spiral explosion thing
  //3d vector field to transition to 2nd model dancing
  // 2nd 3d model dancing
  // const computeBindGroup =
  //   utils.makeBindGroup(state.device,
  //     computePipeline.getBindGroupLayout(0),
  //   [ 
  
  //     gridBuffer,
  //     shapes[0],
  //     uniformsBuffer,
  //     velocity,
  //     texture.createView({
  //       // dimension: '3d',
  //       sampleType: 'float'
  //     }),
  //     lifeTimeBuffer,
  //   ])

  let computeBindGroup = state.device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {binding: 0, resource: {buffer: gridBuffer}},
      {binding: 1, resource: {buffer: shapes[0]}},
      {binding: 2, resource: {buffer: uniformsBuffer}},
      {binding: 3, resource: {buffer: velocity}},

      {binding: 4, resource: texture.createView({
        // dimension: '3d',
        sampleType: 'float'
      })},
      {binding: 5, resource: {buffer: lifeTimeBuffer}}
    ]
  })





console.log(
  // @group(0) @binding(0) var<storage, read_write> lifetime: array<f32>;
  // @group(0) @binding(1) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
  // @group(0) @binding(2) var<storage,read_write> buffer3: array<vec4<f32>>;
  // @group(0) @binding(3) var<uniform> uniforms: Uniforms;
  // @group(0) @binding(4) var<storage,read_write> velocity: array<vec3<f32>>;
  // @group(0) @binding(5) var myTexture: texture_2d<f32>;

)
// console.log( [ 
//           lifeTimeBuffer,
//           gridBuffer,
//           shapes[0],
//           uniformsBuffer,
//           velocity,
//           texture.createView({
//             // dimension: '3d',
//             sampleType: 'float'
//           }),
//           mesh,
          
//         ])
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

fetch(obj(1)).then(d => {
  return d.arrayBuffer()
}).then((d) => {
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

let time = 0
let stagingBuffer

let modelType = 1

let animating = true

let particle = () =>{ return {x: 0, y: 0, z:0} }

const particles = new Array(1e6).fill(0).map((d)=> particle() )


function drawStuff () {
  stagingBuffer = webgpu.device.createBuffer({
    size: 1e6,
    usage: GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });

  time += 1

  const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())

  for (var i= 0; i < 1e6; i++) {
    let p = particles[i]
    p.x = makeRand()
    p.y = makeRand()
    p.z = makeRand()
    vertexPositions[4*i] = 10 * Math.cos(i)
    vertexPositions[4*i+1] = 10 * Math.sin(i);
    vertexPositions[4*i+2] = 1.;
    vertexPositions[4*i+3] = 0.;
  }

  stagingBuffer.unmap();

   // Copy the staging buffer contents to the vertex buffer.
  const commandEncoder = webgpu.device.createCommandEncoder({});
  commandEncoder.copyBufferToBuffer(stagingBuffer, 0, shapes[0], 0, vertexPositions.length * 4);
  webgpu.device.queue.submit([commandEncoder.finish()]);
}

window.addEventListener('click', function () {
  let timebetween = 1000
  if (! animating ) {


    drawStuff()
    animating = ! animating
    modelType = 1 + ((modelType) % (frames.length ))
 
    // let elapsed = Date.now()
    // setTimeout(function recur() {
    //   let dt = Date.now() - elapsed
    //   window.writeTime(timebetween - dt)
    //   if (dt < timebetween) setTimeout(recur, 16)
    //   else {
    //     animating = ! animating
    //     modelType = modelType === 1 ? 2 : 1
    //     return makeStagingBuffer()
    //   }
      
    // }, 8)
  } else {
    animating = ! animating
    
  }
  //if (animating) return makeStagingBuffer()


  if (animating) {
    drawStuff()
  }
})

function makeStagingBuffer() {
  setTimeout(function () {
    if (! shapes[0] || !animating) return;

    stagingBuffer = webgpu.device.createBuffer({
      size: 1e6,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
   
    let frame = time % frames[modelType].length
    const toCopy = frames[modelType][frame]
    if (! toCopy) return console.log(toCopy, modelType, frame)
    if (time === 0) window.toCopy = toCopy



    time += 1

    const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())

    vertexPositions.set(toCopy)
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
  }, 100)
}

let shapes = [

]
function writeBuffer (device, buffer, array) {
  device.queue.writeBuffer(device, 0, buffer, 0, new Float32Array(16));
}


window.makeBuffer = function makeBuffer (stuff, flag, label) {
  const particleSize = 4
  const gpuBufferSize = 1e7 * particleSize

  const gpuBuffer = webgpu.device.createBuffer({
    label,
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    
    |GPUBufferUsage.COPY_SRC,
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

let computeTransitions = [0]
async function basic () {
  let computeTransition = makeComputeShader(webgpu, makeBuffer(frames[1][0]))
  let computeTransition2 = makeComputeShader(webgpu, makeBuffer(frames[2][0]), abc)
  computeTransitions.push(computeTransition, computeTransition2)
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
  // mat4.perspectiveZO(projectionMatrix,
  //   10, 500 / 500, .5, 10.0);
  //mat4.translate(viewProjectionMatrix, viewProjectionMatrix, eyePosition);
  //mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);

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
var rgb = new Float32Array(2e5);
for (let i = 0; i < rgb.length; i+=3) {
  let stuff = (i / rgb.length) * 1000 % 1000
  let interval = (Math.sin((stuff)) + 1) / 2.
  let color = d3.rgb( interpolateTurbo(interval));

  rgb[i] = color.r / 255 / 2
  rgb[i+1] = color.g / 255 / 2

  rgb[i+2] = color.b / 255 / 2
}

const colorBuffer = makeBuffer(rgb, 0, 'color')
let hello = []


//5 files
// 5 draw calls
// shader box + generate box + shaders for transitions + functions to change rotation
// compute shader - changing poitns according to vector field - 3 of those
//

let boxDescriptor = {
  shader: {
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
    @location(1) uv: vec2<f32>
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
 @location(2) pos2: vec4<f32>, @location(3) color: vec3<f32>,
) -> VSOut {
    var vsOut: VSOut;
    var m = camera.modelMatrix;
    // const uv = array(
    //   vec2(1.0, 0.0),
    //   vec2(1.0, 1.0),
    //   vec2(0.0, 1.0),
    //   vec2(1.0, 0.0),
    //   vec2(0.0, 1.0),
    //   vec2(0.0, 0.0),
    // );



    var t = uniforms.time;
    //mix(inPosition.xy, pos2.xy, vec2<f32>(camera.time));


    vsOut.position = 

    vec4<f32>(inPosition.xy + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
//    vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.)), 1.);
    
    //vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.)), 1.);

    //vec4<f32>(stuff + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);

  //${useCamera ? 1: ''}//  camera.projectionMatrix
  //  * camera.viewMatrix *  camera.modelMatrix * 

   //vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.), 1.);
    
    vsOut.localPosition = quadCorner;

    vsOut.uv = (inPosition.xy + 1.) / 2.;
    return vsOut;
}

@fragment
fn main_fragment(@location(0) localPosition: vec2<f32>, @location(1) uv:vec2<f32> ) -> @location(0) vec4<f32> {
    let distanceFromCenter: f32 = length(localPosition);
    if (distanceFromCenter > 1.0) {
        discard;
    }


    var c = 0.;
    if (uv.x > 0.) {
      c = 1.;
    } else {
      c = 0.;
    }


    let color = vec3<f32>(uv, sin(uniforms.time));
    
    //120. * sin(camera.time) + 20. * sin(uv);
    //


    return vec4<f32>((color.xyz), .7);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    shapes[0]
    //makeBuffer(makeCube(), 0, 'cube')
    , quadBuffer, posBuffer, colorBuffer
  ],
  count: 6,
  //blend,
  instances: particlesCount,
  bindGroup: function ({pipeline}) {
    const uniformsBuffer = webgpu.device.createBuffer({
      size: 48, 
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
  let timeBuffer = new Float32Array(1);
  window.reWriteTime = function () {
    timeBuffer[0] = performance.now() / 1000
    webgpu.device.queue.writeBuffer(uniformsBuffer, 0,  timeBuffer)
  }
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
}

const drawBox = await webgpu.initDrawCall(boxDescriptor)


let drawDescriptor = {
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
  
    const uv = array(
      vec2(1.0, 0.0),
      vec2(1.0, 1.0),
      vec2(0.0, 1.0),
      vec2(1.0, 0.0),
      vec2(0.0, 1.0),
      vec2(0.0, 0.0),
    );



    var t = camera.time;
    //mix(inPosition.xy, pos2.xy, vec2<f32>(camera.time));


    vsOut.position = 

    vec4<f32>(inPosition.xy + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
//    vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.)), 1.);
    
    //vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.)), 1.);

    //vec4<f32>(stuff + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);

  //${useCamera ? 1: ''}//  camera.projectionMatrix
  //  * camera.viewMatrix *  camera.modelMatrix * 

   //vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.), 1.);
    
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

    return vec4<f32>(sin(color.xyz), .7);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    shapes[0]
    //makeBuffer(makeCube(), 0, 'cube')
    , quadBuffer, posBuffer, colorBuffer
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
}
setInterval(function () {
  reWriteTime()
}, 8)
const drawCube = await webgpu.initDrawCall(drawDescriptor)

const drawRosePetals =  await webgpu.initDrawCall(Object.assign(drawDescriptor , { shader:{
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
//  camera.projectionMatrix
//  * camera.viewMatrix *  camera.modelMatrix * 

 vec4<f32>(stuff + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
//vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.), 1.);

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

return vec4<f32>(1. * col.b, .34, .74, .7);
}
`}}));


const drawGold = await webgpu.initDrawCall(Object.assign(drawDescriptor , {
  shader:{
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
//  camera.projectionMatrix
//  * camera.viewMatrix *  camera.modelMatrix * 

 vec4<f32>(stuff + (.01 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
//vec4<f32>(stuff + (.005 + vec3<f32>(uniforms.spriteSize, 1.), 1.);

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
var normal = vec3(1.,-1., 0.);

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
intensity = pow(saturate(NdotH), .5);

//Sum up the specular light factoring
let col = vec4<f32>(intensity * lightSpecularColor * lightSpecularPower / distance, .1);

return vec4<f32>(1., col.b, .0, .1);
}
`}}));

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


let drawCalls = [drawBox, drawGold, drawRosePetals, drawCube]

webgpu.canvas.addEventListener('mousemove', function (e) {
  mouse[0] = e.clientX / 1000
  mouse[1] = e.clientY / 500
  // console.log(e.clientX, e.clientY)
  // console.log(mouse)
})

let camera = createCamera({
  center: [0, 2.5, 0],
  damping: 0,
  noScroll: true,
  renderOnDirty: true,
  element: document.createElement('div') || webgpu.canvas
});

let result = drawCalls[drawCallChoice]({})
let texture = result.state.swapChainTexture
let pp = await postProcessing(webgpu, texture);

setInterval(
   function () {
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
     
 
    if (! animating) {
      computeTransitions[1]()
    }// && drawCallChoice
    let result = drawCalls[drawCallChoice]({})
    let texture = result.state.swapChainTexture
    //pp(texture)
    }, 8) 
}


let shouldDraw = false
let dpi = devicePixelRatio;
var canvas = document.createElement("canvas");
let width = 1000
let height = 2000
canvas.width = width * dpi;
canvas.height = height * dpi;
canvas.style.width = width + "px";
canvas.style.height = height + "px";

var context = canvas.getContext("2d");
context.scale(dpi, dpi);
window.drawVF = function (vf, i) {
context.fillRect(0, 0, innerWidth, innerHeight);

  vf.forEach((vec, i) => {
    let x = 50
    context.fillStyle = i % 2 ===1 ? "orange" : "#FFFFFF";//rgb(${vec[0] * 55}, ${vec[1] * 55}
    context.fillStyle = `rgb(${Math.abs(vec[0]) * 50},  ${vec[2] * 55}, ${Math.abs(vec[1]) * 50})`

    context.fillRect(vec.x * innerWidth, vec.y * innerHeight, 10, 10);

  })
}

setTimeout(() => {
  if (! shouldDraw) return
  canvas.style.opacity = .5
  canvas.style.position = 'absolute'
  canvas.style.zIndex = '600'
  canvas.style.pointerEvents = 'none'
  webgpu.canvas.style.position = 'absolute'
  webgpu.canvas.style.zIndex = '500'
  webgpu.canvas.webgpuCompostingMode = 'alpha-blend'
  document.body.insertBefore(canvas, webgpu.canvas)
}, 500);

