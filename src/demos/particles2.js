// // reflection 2pm - 2pm friday
// // saturday - leaves, vector field improvements 
// // shader background


// //// reflections ? yes - 2 days - 1 days - rest of today? - if it takes more throw it away
// //[DONE] emitter - moving the emitter in a pattern
// //use mesh location as a emitter
// //mode - use emitter in different location 
// //use bitmasks to toggle multiple flags as a string???
// //
// //ray marching cubes - 1.5 days tops 
// // wind - no - 1 day tops 
// // custom camera - multiple angles  - 2 days 
// // terrain generation - 1 day
// // FBM  / noise generation - 2days 
// // shadows collosseum

// let split_testing = {
//   concentric_shapes: true,
//   reflections: true,
   
// }
// import {multiply, add, dist} from './misc'
// import dragon from 'stanford-dragon'

// let img = new Image();
// img.src = './data/webgpu.png'
// await img.decode();
// let bitmap = await createImageBitmap(img);

// const buffers = [
//   {
//       attributes: [
//           {
//               shaderLocation: 0,
//               offset: 0,
//               format: "float32x4",
//           }
//       ],
//       arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
//       stepMode: "instance",
//   },
//   {
//       attributes: [
//           {
//               shaderLocation: 1,
//               offset: 0,
//               format: "float32x2",
//           }
//       ],
//       arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
//       stepMode: "vertex",
//   },
//   {
//     attributes: [
//         {
//             shaderLocation: 2,
//             offset: 0,
//             format: "float32x4",
//         }
//     ],
//     arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
//     stepMode: "instance",
// },

// {
//   attributes: [
//       {
//           shaderLocation: 3,
//           offset: 0,
//           format: "float32x3",
//       }
//   ],
//   arrayStride: Float32Array.BYTES_PER_ELEMENT * 3,
//   stepMode: "instance",
// },
// ]


// let drawShapes = true
// let particlesCount = 1e6
// let drawScreen
// let time = 0
// let stagingBuffer
// let modelType = 1
// let animating = true
// let width = 100, height = width, zspace = 100
// let shapes = []
// let webgpu = await simpleWebgpuInit()
// const uniformsBuffer = webgpu.device.createBuffer({
//   size: 48, 
//   usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
// });

// const cameraUniformBuffer = webgpu.device.createBuffer({
//   size: 3 * 4 * 16 + 16, // 4x4 matrix
//   usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
// });

// const quadBuffer = webgpu.device.createBuffer({
//   size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
//   usage: GPUBufferUsage.VERTEX,
//   mappedAtCreation: true,
// });

// new Float32Array(quadBuffer.getMappedRange()).set([
//   -1, -1, +1, -1, +1, +1,
//   -1, -1, +1, +1, -1, +1
// ]);

// quadBuffer.unmap();

// function makeBuffer (stuff, flag, label) {
//   const particleSize = 4
//   const gpuBufferSize = 134217728

//   const gpuBuffer = webgpu.device.createBuffer({
//     label,
//     size: gpuBufferSize,
//     usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
//     | GPUBufferUsage.COPY_SRC,
//     mappedAtCreation: true,
//   });
//   gpuBuffer.source = stuff
  
//   const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());

//   if (stuff && stuff.flat) (stuff = stuff.flat(), label)
//   particlesBuffer.set(stuff)
//   gpuBuffer.unmap();
//   return gpuBuffer
// } 

// let pointBuffer = new Float32Array(particlesCount)
// let pointBufferCount = 0
// let list = pointBuffer.slice()
// list = makeGrid().map(d => d)
// list = new Float32Array(list.flat())
// list = new Float32Array(particlesCount)



// // function makeCube() {
// //   let test = []
// //   for (let i =0; i < 9; i++) {
// //     test.push(makeVectorFieldGeneric(function (x, y, z) {
// //       return [x * .1 * i % 3, y * .1 * Math.floor(i / 3), z , .1]
// //     }), [], 10)
// //   }
// //   return test
// // }

// //list = makeCube().flat()

// // for (let i =0; i < list.length; i++) {
// // //  list[i] = Math.random()
// // }
// var rgb = new Float32Array(3e6);
// for (let i = 0; i < rgb.length; i++) {
//   let stuff = ((i % 1000) / 1e3) 
//   let interval = (Math.sin((stuff)) + 1) / 2.
//   let color = d3.rgb( interpolateTurbo(stuff));
//   rgb[3*i] = color.r / 255 / 2 + .5
//   rgb[3*i+1] = color.g / 255 /2 + .5
//   rgb[3*i+2] = color.b / 255 /2 + .5
// }
// const colorBuffer = makeBuffer(rgb, 0, 'color')
// const dragonBuffer = makeBuffer(dragon.positions, 1, 'dragon')



// function getDist(a, b) {
//   let dx = a[0] - b[0], dy =  a[1]-b[1], dz =  a[2] - b[2]
//   return Math.sqrt([dx * dx, dy * dy, dz * dz, 0].reduce((a, b) => {
//     return a + b
//   }))
// }

// let {cos, sin, } = Math

// import * as d3 from 'd3'
// import {interpolateTurbo} from "d3-scale-chromatic";
// import createCamera from './createCamera'
// import bunny from 'bunny'


// import { mat4, vec3 } from 'gl-matrix'
// //const particlesCount = 442008
// import simpleWebgpuInit from '../../lib/main';
// import utils from '../../lib/utils';
// import * as dat from 'dat.gui';
// import postProcessing from './postProcessing'

// const mouse = [0,0]

// function makeGrid () {
//   return makeVectorFieldGeneric(function (x, y, z) {
//     return [x * 1, y * 1, z , 1]
//   })
// }

// let gridBuffer = makeGrid()

// function length2 (p) {
//   let [x, y] = p
//   return Math.sqrt(x*x + y*y)
// }

// let result = []
// let pickVF = function () {
//   let list = [
//     orange,
//    makeVectorField8,
//    test999,
// makeVectorField2,
//    magnet, 
// stream3,
// makeVectorField10,
// makeVectorField2, // no good - circle SDF
// makeVectorField4,
// makeVectorField5,//needs improvement  // spiral grid
// makeVectorField8, //good- make better
//      makeVectorField1, 
//   ]; //make these better

//   let idx = (Math.random() * list.length) | 0 
//   let ret =  list[idx]()

//   return ret
// }

// function orange() {
//   let vf = []

//   return vf
// }





// function makeVectorFieldGeneric(cb, buffer, divider=1) {
//   let w = width / divider
//   let h = height / divider 
//   let zs = zspace / divider 
//   var result = buffer || []
//   for (let i = 0; i < w; i++) {
//     for (let j = 0; j < h; j++) {
//       for (let k = 0; k < zs; k++) {

//       let [x, y, z] = clipSpace(k, j, i, w, h)

//       let [x1, y1, z1] = zeroToOne(x , y, z) 
//       //
//       let idx = Math.round(x1 * w + y1 * w * h
//          +  z1 * w * w * w 
//          )
      
//       result[idx] = cb(x, y, z, i, j, k, idx)
   
//       }
//     }
//   }
//   return result
// }

// result = makeVectorFieldGeneric(function (x, y, z ) {
//   return [x,y,z, 1]
// },)

// function findPoint(d) {
//   let [x, y, z] = d
//   var x1 = ((x + 1) /2).toPrecision(2)
//   var y1 = ((1. - y) / 2).toPrecision(2) 
//   var z1 = ((1. - z) / 2).toPrecision(2) 

//   x1 *= 100;
//   y1 *= 10000;
//   z1 *= 1000000;


//   let index = Math.floor(x1 + y1 + z1);
//   return [result[index], index, result]
// }


// let counter = 0 ;
// while (counter < 100) {
//   let pt = [makeRand(), makeRand(), makeRand()]
//   let [point, index, result] = findPoint(pt)
//   //console.log(pt, point, index)
//   counter++
// }

// let magnets
// function makeMagnets () {
//    magnets = []
// for (let i = 0; i < 5; i++) {
//   magnets.push([makeRand(), makeRand(), makeRand()])
//   if (i < 1)
//   magnets.push([
//     makeRand(),  makeRand(), 
//     makeRand()
    
//   ]); else 
//   magnets.push([
//          makeRand(),  makeRand(),
//        + makeRand()
        
//     ])
  
// }
// }

// makeMagnets()

// let d = Date.now()
// function makeVectorField1() {
//   magnets.forEach(m => {
// //    let dist = 
// let e = d - Date.now()
//     m[0] = .1 * Math.cos(e / 1000) + m[0]
//     m[1] = .1 * Math.sin(e / 1000) + m[1]
//     m[2] = 0
//     //.1 * Math.atan(e / 1000) + m[2]
//   })
//     makeVectorFieldGeneric(function (x,y,z) {
//       let vec = [0,0,0,0]
//       let p = [x,y,0]
//       magnets.forEach((mag , i) => {
//         let dist = getDist(mag, p)
//         let dx = unitVector(distanceTo(mag, p))

//         vec = add(vec, dx
//           .map(d => d * 1/ dist) )
//       })
//       vec[2] = 0
//       return vec
//    })

// return result
// }

// function makeVectorField2() {
//     return makeVectorFieldGeneric(function (x,y,z) {
//       let vec = [0,0,0,0]
//       let p = [x ,y, 0]
//       let l = circle(p);
//       vec[0] = - x * 2
//       vec[1] = - y * 2
  
//       if (l < .6 && l > .3) {
//         vec[0] = y * 10.
//         vec[1] = -x * 10.
//       } 
//       vec[2] = sin(x)
//       return vec
//     })
// }

// //make vector field that infinitely randomly generates lots of variety and detail every few seconds
// //make dancer in center -> overwrite particles in first 1e5 coordinates 

// let computeTransition
// let camera = {position: {x: 0, y: 0, z: 0} }
// const gui = new dat.GUI();
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'z', 0, 10)
// cameraFolder.open()
// var person = {name: 'Sam'};
// let p = {type: 45}
// gui.add(p, 'type', 0, 100)
// var text = { speed: 'someName' }
// gui.add(text, 'speed', { King: 'A', Queen: 'B', Rook: 'C' } );
// const dot = ( a, b) => {
//   return a[0] * b[0] + a[1] * b[1]// + a[2] * b[2];
// }

// function circle(p) {
//   return length2(p)
// }

// function makeRand () {
//   let x = Math.random().toPrecision(2)
//   x -= .5;
//   return x * 2
// }

// function clipSpace(x,y, z, width, height) {
//   y /= height
//   z /= width
//   y = y - .5
//   z = z - .5
//   y *= -2
//   z *= -2

//   x = (x / width) * 2 -1

//   return [x,y,z]
// }

// function zeroToOne(x , y, z) {
//   var x1 = (x + 1) / 2 
//   var y1 =((1. - y) / 2);
//   var z1 = ((1. - z) / 2);

//   return [x1, y1, z1]
// }
// function makeRadius (i) {
//   return Math.ceil(i / 1e4) / 10
// }
// //parametricly make ensemble of dancing cubes and other shapes 
// function makeVelocityCone() {
//   let velocityBuffer = new Float32Array(particlesCount)
//   for (let i = 0; i < velocityBuffer.length; i+=4) {
//     let idx = ((i/4) % 360)* 1.5 ;
//     let radius = makeRadius(i) * .01;
//     let x = radius * Math.cos((idx)* Math.PI / 180)
//     let y = radius * Math.sin((idx)* Math.PI / 180) 
//     velocityBuffer[i] = x 
//     velocityBuffer[i+1] =y 
//     let theta = Math.atan(y / x)
//     velocityBuffer[i+2] = i / 1e6
//     //velocityBuffer[i+2] = i / particlesCount//.01 * Math.sin(theta) 

//   }
// }

// function makeComputeShader(webgpu, mesh, vf1, vf2) {
//   let velocityBuffer = new Float32Array(particlesCount)
//   for (let i = 0; i < velocityBuffer.length; i+=4) {
//     let idx = ((i/4) % 360)* 1.5 ;
//     let radius = makeRadius(i) * .01;
//     let x = radius * Math.cos((idx)* Math.PI / 180)
//     let y = radius * Math.sin((idx)* Math.PI / 180) 
//     velocityBuffer[i] = x 
//     velocityBuffer[i+1] =y 
//     let theta = Math.atan(y / x)
//     velocityBuffer[i+2] = i / 1e6
//     //velocityBuffer[i+2] = i / particlesCount//.01 * Math.sin(theta) 

//   }
//   // let idx = (i % 360)* 1.5 ;
//   // let radius = makeRadius(i)
//   // let x = radius * Math.cos((idx)* Math.PI / 180)
//   // let y = radius * Math.sin((idx)* Math.PI / 180) 
//   // let z = radius * Math.tan((idx)* Math.PI / 180) 
//   // z = 0

//   let velocity = makeBuffer(velocityBuffer, 0, 'vectorField')
//   let gridBuffer = makeBuffer(vf1.flat(), 0, 'result')
//   let gridBuffer2 = makeBuffer(vf2.flat(), 0, 'result')

//   let particleLifetime = new Float32Array(particlesCount)
//   for(let i =0; i < particleLifetime.length; i++) {
//     if (i < 1e5)
//     particleLifetime[i] = -3000
//   else 
//     particleLifetime[i] = Math.random() * 3000
//   }

//   let lifeTimeBuffer = makeBuffer(particleLifetime, 0, 'vectorField')

// let max = {
//   x: 0,
//   y: 0,
//   z: 0,
// }
// let min = {
//   x: 0,
//   y: 0,
//   z: 0,
// }

// for(let i = 0; i < mesh.source.length; i+=4) {
//   let x = mesh.source[i]
//   let y = mesh.source[i+1]
//   let z = mesh.source[i+2]
//   max.x = Math.max(x, max.x)
//   max.y = Math.max(y, max.y)
//   max.z = Math.max(z, max.z)

//   min.x = Math.min(x, max.x)
//   min.y = Math.min(y, max.y)
//   min.z = Math.min(z, max.z)
// }
//   const uniformsBuffer = webgpu.device.createBuffer({
//     size: 32, 
//     usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
// });
//   return  webgpu.initComputeCall({
//     label: `predictedPosition`,
//     code:  `
//     struct Uniforms {
//       mouse: vec2<f32>,
//       time: f32,
//       mode: f32,
//       decayRate: f32
//     }

//     @group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
//     @group(0) @binding(1) var<storage,read_write> buffer3: array<vec4<f32>>;
//     @group(0) @binding(2) var<uniform> uniforms: Uniforms;
//     @group(0) @binding(3) var<storage,read_write> velocity: array<vec4<f32>>;
//     @group(0) @binding(4) var<storage, read_write> lifetime: array<f32>;
//     @group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
//     @group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;



  
//   
  
//   fn curl_noise (pos:vec4<f32>, t: f32) -> vec4<f32> {
//     //make unit cube
//     //take 8 gradients of trilinear interpolations |-|
//     var x = pos.x;
//     var y = pos.y;
//     var z = pos.z;
//     var x0 = x + 1.;
//     return vec4<f32>(sfrand(), sfrand(), sfrand(), sfrand());
//   }


//   fn hasCollided (p: vec3<f32>)-> bool {
//     var minX = -1; 
//     var bounds = 1.;
//     if (p.x < -bounds) {return true;}
//      if (p.y <= -bounds) {return true;} //why is this backwards? 
//         if (p.x >= bounds) {return true;}
//         if (p.y >= bounds) {return true;}
//         if (p.z <= -bounds ) {return true;}
//         if (p.z >= bounds ){ return true;}
//         return false;
//   }

//   fn hashPosition(pos: vec3<f32>) ->  i32{
//     var x = (pos.x + 1) / 2.;
//     var y = (1. - (pos.y)) / 2.;
//     var z = (1. - (pos.z)) / 2.;
//     //if (z < .1) {z = .9;}
    
//     // 
//     var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
//     + floor(floor(z * 100) * 100) * 100
//     );
//     return idx;
//   }

//   fn hash(p: vec3<f32>) -> vec4<f32> {
//     var pos = p * .5;
//     //pos.z -= 1.1;
//     let idx = hashPosition(pos);

//     var x = pos.x;
//     var y = pos.y;
//     var z = pos.z;
//   //if uniforms.mode == 2 ?
//     // if (idx < 0) {
//     //   //return vec3<f32>(-x, -y, 0);
//     // }
//     // if (idx > 1000000) {
//     //   //return vec3<f32>(-x, -y, 0);
//     // }

//     let vf = vectorFieldBuffer[idx];
// //    vectorFieldBuffer[idx] = sin(vectorFieldBuffer[idx]);
//     //vectorFieldBuffer[idx] += cos(vf);
//     let vf1 = vectorFieldBuffer2[idx];
//     var vt = mix(vectorFieldBuffer[idx].xyz ,
//                 vectorFieldBuffer2[idx].xyz, 
//                 uniforms.time / 3000);

//                 //return vec3<f32>(-x, -y, -z);
//     return vf;
//   }



// fn applyVF() -> vec3<f32> {
//   return vec3<f32>(1.);
// }
  
//     @compute @workgroup_size(256)
//     fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
//       let index: u32 = GlobalInvocationID.x;

//       //if magnitude > 1 -> revert to center 
//       //fly into position -> by index offset duration

//       let life = lifetime[index];
//       let r = reset[index]; 
//       if (life < 0) {
//         lifetime[index] = 3000.;
//         velocity[index] = vec4<f32>(sfrand() * .1, sfrand() * .1, sfrand() * .1, sfrand() * 1.);
//         buffer3[(index)] = vec4<f32>(sin(uniforms.time), uniforms.time / 3000, 00., 1.);
//         //reset[index];
//         //vec4<f32>(sin(uniforms.time), 0, 00., 1.);
        
//       } else {
//         lifetime[index] -= 1.;
//       }

//       var pos = buffer3[index];

//       var abc = buffer3[index];

//       var vf = hash(pos.xyz);

//       let t = uniforms.time;
//       //var vf2 = vec3<f32>(vectorFieldBuffer2[idx].xyz);

//       if (hasCollided(pos.xyz))  {
//         var vel = velocity[index];
//         velocity[index] = vec4<f32>(vel.y, -vel.x, vel.z, 1.);
//       }
  

//       //var vf = vec3<f32>(vectorFieldBuffer[idx].xyz);

//      //velocity[index] *= .91;
//      if (uniforms.mode == 0) {
//        velocity[index] = velocity[index] + .1 * vf;
//      }
//      //velocity[index] = velocity[index] + vec3<f32>(.00001 * f32(index), 0., 0.);
//      buffer3[index] = vec4<f32>(pos.xyz + .1 * velocity[index].xyz,  1);

//       //wind turbulence
// //      buffer3[index] = buffer3[index] + .01 * vec4<f32>(curlNoise(buffer3[index].xyz), 1);
//       //sphere
//       //buffer3[index] = vec4<f32>(curlNoise(buffer3[index].xyz), 1);
//       //buffer3[index] = buffer3[index] + .01 * vec4<f32>(curlNoise(vectorFieldBuffer[index].xyz), 1);

//       var mouse = (uniforms.mouse - .5) * vec2<f32>(2,-2);
//       if (distance(buffer3[index].xy, mouse) < .1) {
//         // velocity[index].x = velocity[index].y;
//         // velocity[index].y = -velocity[index].x;
//         //buffer3[index]= vec4<f32>(buffer3[index].xy - vec2<f32>(distance(buffer3[index].xy, mouse)), 0., 1.);
//         //buffer3[index] = buffer3[index] - vec4<f32>(mouse, 0,0);
//         //velocity[index]*= .001;
//       }
//     }`,
  
//     exec: function (state){
//       const device = state.device
//       const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();
  
//       const computePass = commandEncoder.beginComputePass();
//       state.computePass.computePass = computePass;
      
//     webgpu.device.queue.writeBuffer(uniformsBuffer, 0,  new Float32Array(mouse))
//     let timeBuffer = new Float32Array(1)
//     window.writeTime = function (dt) {
//       timeBuffer[0] = dt
//       webgpu.device.queue.writeBuffer(uniformsBuffer, 8,  timeBuffer)
//     }
//     let modeBuffer = new Float32Array(1)
//     let decayRate = new Float32Array(1)

//     window.writeDecayRate = function (decayRateNum) {
//       decayRate[0] = decayRateNum
//       webgpu.device.queue.writeBuffer(uniformsBuffer, 16,  decayRate)
//     }
//     window.writeDecayRate(0)

//     window.writeMode = function (dt) {
//       timeBuffer[0] = dt
//       webgpu.device.queue.writeBuffer(uniformsBuffer, 12,  modeBuffer)
//     }
//       computePass.setPipeline(state.computePass.pipeline);
//       computePass.setBindGroup(0, state.computePass.bindGroups[0]);
//       computePass.dispatchWorkgroups(10000);
//       computePass.end();
//     },
//     bindGroups: function (state, computePipeline) {

//   const reset = makeBuffer(dancer, 0, 'reset')

//   const descriptor = {
//     layout: computePipeline.getBindGroupLayout(0),
//     entries: [
//       {binding: 0, resource: {buffer: gridBuffer}},
//       {binding: 1, resource: {buffer: mesh || shapes[0]}},
//       {binding: 2, resource: {buffer: uniformsBuffer}},
//       {binding: 3, resource: {buffer: velocity}},
//       {binding: 4, resource: {buffer: lifeTimeBuffer}},
//       {binding: 5, resource: {buffer: reset }},
//       {binding: 6, resource: {buffer: gridBuffer2 }},
//     ]
//   }

//   let computeBindGroup = state.device.createBindGroup(descriptor)
//       return [computeBindGroup]
//     }
//   })
//   }

// const obj = (n) => `https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/1/${n}myfile.bin`

// let dancer = []
// let frames = []

// let frameMax = 50
// let frameCount = [...Array(frameMax).keys()]

// function getFrames(model) { 
//   frames[model]= []
//   let loaded = 0
//   return new Promise (function (resolve) {
//     frameCount.forEach(function (i) {
//       fetch(`https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/obj/${model}/${i}myfile.bin`
//       )
//       .then((res) => res.arrayBuffer())
//       .then((buffer) => {

//         var floatBuffer = new Float32Array(buffer)
//         for (let i = 0; i < floatBuffer.length; i++) {
//           floatBuffer[4*i+1] -= .5;
//         }
//         frames[model][i]=floatBuffer
//         loaded += 1
//         if (loaded === frameMax - 1) {
//           resolve()
//           if (model === 2) basic()
//           setTimeout(makeStagingBuffer, 3000)
//         }
//        // makeStagingBuffer()
//       })
//     })
//   })
// }
// //makeStagingBuffer()
// basic()
// fetch(obj(1)).then(d => d.arrayBuffer()).then((d) => {
//   dancer = new Float32Array(d)
//   for (let i = 0; i < dancer.length; i++) {
//     dancer[4*i+1] -= .5;
//   }
//   // let triplets = []
//   // for (let i = 0; i < dancer.length; i++) {
//   //   dancer[4*i+1] -= .5;
//   // }
//   // shapes.push(dancer)
//   //shapes.push(window.makeBuffer(dancer, 0,'leaf'))

// })
// // getFrames(1)
// // getFrames(2)
// // getFrames(3)
// // getFrames(4)


// let indexPool = new Array(particlesCount / 4).fill(1).map((d, i) => i)
// indexPool.alloc = function (n) {
//   let i = 0

//   let result = []
//   while (i < n) {
//     result.push(this.shift())
//     i++
//   }
//   pointBufferCount += n;
//   return result;
// }

// function line(a, b) {
//   this.x1 = a[0]
//   this.y1 = a[1]
//   this.x2 = b[0]
//   this.y2 = b[1]
//   this.indices = []
//   this.points = [];
//   this.array = pointBuffer
//   this.subdivide = function (resolution) {
//     // dont use the proper technique - bresenhams - cpu rasterizer 
//     let {x1, y1, y2, x2}= this;
//     let dy = y2 - y1;
//     let dx = x2 - x1;
//     let points = new Array(resolution).fill(0).map((d, i) => {
//       return [x1 + (dx / resolution * i), 
//               y1 + (dy / resolution * i) ]
//     })
//     this.points = points;
//   }
// }

// line.prototype.draw = function () {
//   this.subdivide(50)
//   if (! this.indices.length) {
//     this.indices.push(...indexPool.alloc(this.points.length))
//   }

//   this.indices.forEach((d, i) => {
//     let idx = d * 4
//     this.array[idx] = this.points[i][0]
//     this.array[idx+1] = this.points[i][1]
//   })
// }

// let rhomboid = function (origin, side, skew) {
//   //left corner = half radius left + down
//   //6 left, 4 down
//   let a = [origin[0]+side + skew,  origin[1] + side] //top right
//   let b = [origin[0] - side + skew,  origin[1] + side] // top left
//   let c = [origin[0] + side,  origin[1] - side] // bottom right
//   let d = [origin[0] - side, origin[1] - side] // bottom left
//   let lines = [new line(a, b), new line(a, c), new line(c, d), new line(d, b)]
//   lines.forEach( line => line.draw() )
// }

// let triangle = function (origin, side) {
//   let a = [origin[0],  origin[1] + side] //top right
//   let b = [origin[0]- side,  origin[1]-side] // top left
//   let c = [origin[0]+side,  origin[1]-side] // bottom right
//   let lines = [new line(a, b), new line(a, c), new line(c, b)]
//   lines.forEach( line => line.draw() )
// }

//   for (let i =0; i< 100; i++) {
//     rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
//     rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
//     rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
//     rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
//     rhomboid([makeRand() * 5, makeRand() * 5], .9, 1.)
//   triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
//   triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
//   triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
//   triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
//   triangle([makeRand() * 5, makeRand() * 5], .9, 1.)
//   }


// window.addEventListener('click', function () {
//   let timebetween = 1000
//   if (! animating ) {
//     modelType = 1 + ((modelType) % (frames.length ))
 
//     let elapsed = Date.now()
//     setTimeout(function recur() {
//       let dt = Date.now() - elapsed
//       //window.writeTime(timebetween - dt)
//       if (dt < timebetween) setTimeout(recur, 16)
//       else {
//         animating = true
//         modelType = modelType === 1 ? 2 : 1
//         return makeStagingBuffer()
//       }
//     }, 8)
//   } else {
//     animating = ! animating

//   }
//   if (animating) return makeStagingBuffer()
// })

// let particleMesh = []

// function initParticles () {
//   for (let i = 0; i < 1e6; i++) {
//     particleMesh[i] = {x: -.9 + i / 1e4, y: .9, z: 0, dir: [makeRand(), makeRand()]}
//   }
// }
// //initParticles()

// let keyframeFunctions = [
//   function (p, i, t) {
//     let idx = i / 100
//     let radius = 1
//     let z = (i / 1e5) * 100
//     p.x = (radius - z) * Math.cos(idx * 360 * Math.PI / 180) 
//     p.y = (radius - z) * Math.sin(idx * 360 * Math.PI / 180) 
//     p.z = z
//   },
//   function (p, i, t) {
//     p.x = (i / 1000)
//     p.y = Math.round(i / 50) / 200

//   },
//   function (p, i, t) {
//     p.x = i / 1000
//     p.y = (i % 100) / 10

//   },
//   function (p, i, t) {
//     i *= 1. - t
//     p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
//     p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 

//   },

//   function down(p) {
//     p.y -= .01
//   }, 
//   function windshieldWiper (p, i, time) {
//     let t = time
//     p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
//     p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 
//   },

//   function (p, i) {
//     p.x += .01;
//   },
//   function (p, i, t) {
//     t = 1. - t
//     p.x = .1 * i * Math.cos(t * 90 * Math.PI / 180) 
//     p.y = .1 * i * Math.sin(t * 90 * Math.PI / 180) 
//   },
//   function windshieldWiper (p, i, time) {
//     let t = time
//     //t += 10 * Math.floor(i  % 10)
//     t += (i / 1000);
//     let idx = i % 10;
//     p.x = .01 * idx * Math.cos(t * 360 * Math.PI / 180)
//     p.y = .01 * idx * Math.sin(t * 360 * Math.PI / 180)
//     for (let n =0; n < 10; n++)
//       if (i > n * 1000)  
//         p.x += n * .2
//   },
//   function (p, i, t) {
//     p.x = Math.tan(t * 360 * Math.PI / 180)
//     p.y = Math.tan(t * 360 * Math.PI / 180)
//   }
// ]


// function tween (a, b, i) {
//   return a - ((a - b) * i) / (b - a)
// }

// let count = 0
// function moveParticles () {
//   count += 1
//   //count = 0
//   let i = Math.floor(count / 100)
//   let fn = keyframeFunctions[0]
//   if (! fn)fn = function (i){ 
//     count = 0; 
//   }
//   for (let i = 0; i < 1e5; i++) {
//   let pt = particleMesh[i]
//    fn(pt, i, (count % 100) / 100)
//   }
// }

// let drawParticles = true

// function makeStagingBuffer() {
//   setTimeout(function () {
//     if (! shapes[0] || !animating) return;

//     stagingBuffer = webgpu.device.createBuffer({
//       size: 1e7,
//       usage: GPUBufferUsage.COPY_SRC,
//       mappedAtCreation: true,
//     });

   
//     let frame = time % frames[modelType].length
//     const toCopy = frames[modelType][frame]
//     dancer = toCopy
//     if (! toCopy) return console.log(toCopy, modelType, frame)
//     if (time === 0) window.toCopy = toCopy
//     time += 1
//     //if (drawParticles) moveParticles()

//     const vertexPositions = new Float32Array(stagingBuffer.getMappedRange())
//     //let yourCopy = vertexPositions.slice(0, 1e5)

//     // for (let i = 0; i < 9; i++) {
//     //   let idx = i * 4;
//     //   let yourCopy = new Float32Array(1e5)
//     //   for (let j = 0; j < toCopy.length; j+=4){
//     //    // let idx = 4 * j
//     //     yourCopy[j] = toCopy[j] + i * .111
//     //     yourCopy[j+1] = toCopy[j+1] + .2 * Math.floor(i / 3)
//     //     yourCopy[j+2] = toCopy[j+2]
//     //     yourCopy[j+3] = toCopy[j+3]
//     //   }
//     //   // vertexPositions[idx] = yourCopy[idx]
//     //   // vertexPositions[idx+1] = yourCopy[idx+1]
//     //   // vertexPositions[idx+2] = yourCopy[idx+2]
//     //   // vertexPositions[idx+3] = 1
//     //   vertexPositions.set(yourCopy, 1e5 * i)
//     // }
//     //console.log(Date.now())
//     // vertexPositions.forEach(function (d, i) {
//     //   vertexPositions[i]=toCopy[i % toCopy.length] + .2
//     // })

//     vertexPositions.set(toCopy)
//     stagingBuffer.unmap();
//     // Copy the staging buffer contents to the vertex buffer.
//     const commandEncoder = webgpu.device.createCommandEncoder({});
//     commandEncoder.copyBufferToBuffer(stagingBuffer, 0, shapes[0], 0, toCopy.length * 4);
//     webgpu.device.queue.submit([commandEncoder.finish()]);
//     if (animating) makeStagingBuffer()
//     //console.log(animating)
//   }, 20)
// }

// function writeBuffer (device, buffer, array) {
//   device.queue.writeBuffer(device, 0, buffer, 0, new Float32Array(16));
// }




// if (drawShapes)
// list.set(pointBuffer.slice(0, pointBufferCount) )



// async function basic () {
//   let vf1 =  pickVF(), vf2 = pickVF()
//   let happyBear = makeBuffer(list, 0, 'bear')

//   const posBuffer = makeBuffer(dragon.positions.map(d => d.concat(0)).flat(), 1, 'bunny')
//   computeTransition = makeComputeShader(webgpu, happyBear, vf1, vf2)

//   let drawDescriptor = {
//     attributeBuffers: buffers,
//     attributeBufferData: [
//       happyBear
//       , quadBuffer, happyBear, colorBuffer
//     ],
//     count: 6,
//     instances: particlesCount ,
//     bindGroup: function ({pipeline}) {
//   let texture = webgpu.texture(bitmap)
//     let desc = {
//       label: Math.random(),
//         layout: pipeline.getBindGroupLayout(0),
//         entries: [
//             {
//                  binding: 0,
//                 resource: {
//                     buffer: uniformsBuffer,
//                 }
//             },
//             {
//               binding: 1,
//               resource: {
//               buffer: cameraUniformBuffer
//               }
//             },
//             {
//               binding: 2,
//               resource: texture.sampler,
//             },
//             {
//               binding: 3,
//               resource: texture.texture.createView(),
//             },
//         ]
//     }
//       return webgpu.device.createBindGroup(desc);
//     }
//   }
//   function vfPicker() {
//     vf1 = pickVF()
//     vf2 =  vf2
//     let happyBear = makeBuffer(list, 0, 'bear')
//       computeTransition = makeComputeShader(webgpu, happyBear, vf1, vf2)
//       if (! drawScreen)       drawScreen = makeDrawCall(happyBear, drawDescriptor)
//       drawScreen.swapAttributeBuffer(happyBear, 0)
      
//     }
//     vfPicker()
//   setInterval(vfPicker, 30000)
//   drawScreen = makeDrawCall(happyBear, drawDescriptor) 

// shapes.push(posBuffer)
// shapes.push(dragonBuffer)

// const device = webgpu.device

// let model = mat4.identity(new Float32Array(16))
// let cosCounter = 0
// function getCameraViewProjMatrix() {
//   let m  = mat4.identity(new Float32Array(16))
//   mat4.translate(model, model, vec3.fromValues(2, 2, 0));
//   mat4.rotate(
//     model,
//     model,
//     1,
//     vec3.fromValues(
//       Math.sin(0),
//       Math.cos(1),
//       0
//     )
//   );

//   let projectionMatrix = mat4.create();
//   let viewProjectionMatrix = mat4.create();
//   mat4.perspectiveZO(projectionMatrix,
//     10, 500 / 500, .5, 10.0);
//   //mat4.translate(viewProjectionMatrix, viewProjectionMatrix, eyePosition);
//   mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);

//   // Write the render parameters to the uniform buffer.
//   let renderParamsHost = new ArrayBuffer(4 * 4 * 4);
//   let viewProjectionMatrixHost = new Float32Array(renderParamsHost);
//   viewProjectionMatrixHost.set(viewProjectionMatrix);
//   return viewProjectionMatrixHost
// }

//  const cameraViewProj = getCameraViewProjMatrix();

// const blend = {
//   color: {
//     srcFactor: 'src-alpha',
//     dstFactor: 'one',
//     operation: 'add',
//   },
//   alpha: {
//     srcFactor: 'zero',
//     dstFactor: 'one',
//     operation: 'add',
//   },
// }
// function magnitude (v) {
//   return Math.sqrt(v[0]) + Math.sqrt(v[1]) + Math.sqrt(v[2])
// }

// function unitVector (v) {
//   let l = magnitude(v)
//   return v.map(d => d / l);
// }

// function vectorTo(b, a) {
//   return unitVector(b) - unitVector(a)
// }

// let hello = []

// let abc = new Float32Array(1)


// let elapsed = Date.now()
// setInterval(function () {
//   abc[0] = performance.now() 
//   device.queue.writeBuffer(
//     uniformsBuffer,
//     0,
//     abc.buffer,
//     abc.byteOffset,
//     abc.byteLength
//   );
//   if (window.writeTime) {
//     elapsed = Date.now() % 3000
//     window.writeTime(elapsed)
//   } 
// }, 8)



// const a = new Float32Array(1)

// webgpu.canvas.addEventListener('mousemove', function (e) {
//   mouse[0] = e.clientX / 1000
//   mouse[1] = e.clientY / 500
// })

// let camera = createCamera({
//   center: [0, 2.5, 0],
//   damping: 0,
//   noScroll: true,
//   renderOnDirty: true,
//   element: 
//   //webgpu.canvas || false ||
//   document.createElement('div') || false
 
// });
// let zoom = 1
// webgpu.canvas.addEventListener('mousewheel', function (e) {
//   camera.zoom(zoom = zoom + .1 * e.deltaY)
// })

// // let left = drawScreen()
// // let  right = drawScreen()


// //let swapChainTexture = new webgpu.texture(result.state.swapChainTexture)
// let swapChainTexture = webgpu.texture(bitmap)

// //let left = await makeDrawReflection(drawDescriptor);
// //let right = await makeDrawReflection(drawDescriptor);
// setInterval(
// async function () {
//     let {projection, view} = camera()

//     device.queue.writeBuffer(
//       cameraUniformBuffer,
//       0,
//       projection.buffer,
//       projection.byteOffset,
//       projection.byteLength
//     );

//     device.queue.writeBuffer(
//       cameraUniformBuffer,
//       64,
//       view.buffer,
//       view.byteOffset,
//       view.byteLength 
//     );
//      device.queue.writeBuffer(
//       cameraUniformBuffer,
//       128,
//       model.buffer,
//       model.byteOffset,
//       model.byteLength
//     );

//     // device.queue.writeBuffer(
//     //   cameraUniformBuffer,
//     //   192,  
//     //   a.buffer,
//     //   0,
//     //   a.byteLength
//     // );
    
//     computeTransition()
      
//     drawScreen(
//       //{vowOfSilence: false}
//       )
  
//     // device.queue.writeBuffer(
//     //   cameraUniformBuffer,
//     //   0,
//     //   cameraViewProj.buffer,
//     //   projection.byteOffset,
//     //   projection.byteLength
//     // );
//     //change camera 
//     //draw screen from different angle to texture 
//     //use texture to draw texture

//     console.log('after draw screen')
//     //left()
//     //right()
//     }, 8) 
// }

// async function makeDrawReflection (descriptor ) {

//   let img = new Image();
//  img.src = './data/webgpu.png'
//  await img.decode();
// let bitmap = await createImageBitmap(img);
// let texture = webgpu.texture(bitmap);
//   const drawReflection = webgpu.initDrawCall(Object.assign(descriptor, {
//     attributeBuffers: [{attributes: 
//       [
//           {
//               shaderLocation: 0,
//               offset: 0,
//               format: "float32x2",
//           }
//       ],
//       arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
//       stepMode: "vertex",
//   }],
//     attributeBufferData: [quadBuffer],
//     bindGroup: function ({pipeline}) {
//         let desc = {
//           label: Math.random(),
//             layout: pipeline.getBindGroupLayout(0),
//             entries: [
//                 {
//                      binding: 0,
//                     resource: {
//                         buffer: uniformsBuffer,
//                     }
//                 },
//                 {
//                   binding: 1,
//                   resource: {
//                   buffer: cameraUniformBuffer
//                   }
//                 },
//                 {
//                   binding: 2,
//                   resource: texture.sampler,
//                 },
//                 {
//                   binding: 3,
//                   resource: texture.texture.createView(),
//                 },
//             ]
//         }
//           return webgpu.device.createBindGroup(desc);
//         },
//     count: 6,
//     instances: 1,
//    shader :{

//     vertEntryPoint: `vertex`,
//     fragEntryPoint: `fragment`,
//     code: `

//     struct Uniform {
//       time: f32
//     }
//     struct Camera {
//       modelMatrix: mat4x4<f32>
//     }
//       struct VSOut {
//         @builtin(position) position: vec4<f32>
//       }
//       @group(0) @binding(0) var <uniform> uniforms: Uniform;
//       @group(0) @binding(1) var <uniform> camera: Camera;
//       @group(0) @binding(2) var mySampler: sampler;
//       @group(0) @binding(3) var myTexture: texture_2d<f32>;


//     @fragment
//     fn fragment() -> @location(0) vec4<f32>{
//       var m = textureSample(myTexture, mySampler, vec2<f32>(0., 0.));

//       return vec4<f32>(0., 1., 1., 1.);
//     }

//       @vertex
//       fn vertex(
//         @builtin(vertex_index) in_vertex_index: u32,
        
//         @location(0) quadCorner:vec4<f32> ) -> @builtin(position) vec4<f32>{
//         var vsOut: VSOut;

//         // vsOut.position = 
//         var time = uniforms.time;
//         var cam = camera.modelMatrix;
         
       
//         let val = .3;
//         var quad = array<vec2<f32>, 6>(
//           vec2<f32>(val, val),
//           vec2<f32>(val, -val),
//           vec2<f32>(-val, -val),

//           vec2<f32>(-val, -val),
//           vec2<f32>(-val, val),
//           vec2<f32>(val, val),
//         );


//         let pos = 
        
//         quad[in_vertex_index];

//         return 
//         //camera.modelMatrix *  
//         vec4<f32>( pos, 0., 1.);
//       }
//     `,}
//   }));

//   return drawReflection 
// }



// function makeDrawCall (buffer, drawDescriptor) {
//  // drawDescriptor.attributeBufferData[0] = buffer
  
//   const drawRosePetals =  webgpu.initDrawCall(Object.assign(drawDescriptor , { shader:{
//     vertEntryPoint: 'main_vertex',
//     fragEntryPoint: 'main_fragment',
//     code:`
//   struct Uniforms {
//     time: f32,             //             align(16)  size(24)
//   color: vec3<f32>,         // offset(0)   align(16)  size(16)
//   spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
//   };
  
//   struct Camera {
//   projectionMatrix : mat4x4<f32>,
//   viewMatrix : mat4x4<f32>,
//   modelMatrix: mat4x4<f32>,

  
//   }
  
//   struct VSOut {
//   @builtin(position) position: vec4<f32>,
//   @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
//   @location(1) color: vec3<f32>,
//   @location(2) globalPosition: vec2<f32>, // in {-1, +1}^2,

//   };
  
//   @group(0) @binding(0) var<uniform> uniforms: Uniforms;
//   @group(0) @binding(1) var<uniform> camera : Camera;
//   @group(0) @binding(2) var mySampler: sampler;
//   @group(0) @binding(3) var myTexture: texture_2d<f32>;
  
//   @vertex
//   fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
//   @location(2) pos2: vec4<f32>, @location(3) color: vec3<f32>,
//   ) -> VSOut {
//   var vsOut: VSOut;  

//   vsOut.position = 
//    camera.projectionMatrix
//    * camera.viewMatrix *  camera.modelMatrix * 
  
//    vec4<f32>(inPosition.xy + (.01) * quadCorner, inPosition.z, 1.);
  
//   vsOut.localPosition = quadCorner;
//   vsOut.globalPosition = inPosition.xy;

  
//   vsOut.color = color;

//   return vsOut;
//   }



//   const size = 4.0;

//   const b = 0.3;//size of the smoothed border

// fn smoothStep(edge0:f32, edge1:f32, x:f32) -> f32 {
// if (x < edge0) {return 0.;}

// if (x >= edge1) {return 1.;}

// let c = (x - edge0) / (edge1 - edge0);

// return c * c * (3 - 2 * c);
// }

//   fn mainImage(globalPosition: vec2<f32>, iResolution: vec2<f32>
//     ) -> vec4<f32> {
//     let aspect = iResolution.x/iResolution.y;
//     let position = (globalPosition.xy) * aspect;
//     let dist = distance(position, vec2<f32>(aspect*0.5, 0.5));
//     let offset=(uniforms.time) * 0.001;
//     let shit = uniforms.time;
//     let conv=4.;
//     let v=dist*4.-offset;
//     let ringr=floor(v);
    
//     var stuff = 0.;
//     if (v % 3. > .5) {
//       stuff = 0.;
//     }

// var color=smoothStep(-b, b, abs(dist- (ringr+stuff+offset)/conv));
//     if (ringr % 2. ==1.) {
//      color=2.-color;
//     }

//   let distToMouseX = distance(1., globalPosition.x);
//   let distToMouseY = distance(2., globalPosition.y);

//   return vec4<f32>(
//     color, 
//     color, 
//     color, 
//    1.,
//     );
// };

// fn main(uv: vec2<f32>) -> vec4<f32> {
//   let fragCoord = vec2<f32>(uv.x, uv.y);
//   var base = vec4<f32>(cos(uniforms.time * .1), .5, sin(uniforms.time * 0.000001), 1.);
//   //let dist = distance( fragCoord, vec2<f32>(u.mouseX,  u.mouseY));
//   return mainImage(fragCoord, vec2<f32>(1000., 1000.));
// }

//   @fragment
//   fn main_fragment(@location(0) localPosition: vec2<f32>, @location(1) color:vec3<f32>,  @location(2) globalPosition:vec2<f32>) -> @location(0) vec4<f32> {
//   let distanceFromCenter: f32 = length(localPosition);
//   if (distanceFromCenter > 1.0) {
//       discard;
//   }
//   var viewDir = vec3<f32>(0,0,0);
//   var lightSpecularColor = vec3<f32>(0., 0., 1.);
//   var lightSpecularPower = 1.;
//   var lightPosition = vec3<f32>(-1,0., 0);
  
//   var lightDir = lightPosition - vec3<f32>(localPosition, 1.); //3D position in space of the surface
  
//   var distance = length(lightDir);
  
//   lightDir = lightDir / distance; // = normalize(lightDir);
//   distance = distance * distance; //This line may be optimised using Inverse square root
  
  
  
//   var normal = vec3(-1.,-1., 0.);
  
//   //Intensity of the diffuse light. Saturate to keep within the 0-1 range.
//   var NdotL = dot(normal, lightDir);
//   var intensity = saturate(NdotL);
  
//   // Calculate the diffuse light factoring in light color, power and the attenuation
//   //OUT.Diffuse = intensity * light.diffuseColor * light.diffusePower / distance;
  
//   //Calculate the half vector between the light vector and the view vector.
//   //This is typically slower than calculating the actual reflection vector
//   // due to the normalize function's reciprocal square root
//   var H = normalize(lightDir + viewDir);
  
//   //Intensity of the specular light
//   var NdotH = dot(normal, H);
//   intensity = pow(saturate(NdotH), .1);
  
//   //Sum up the specular light factoring
//   let col = vec4<f32>(intensity * lightSpecularColor * lightSpecularPower / distance, .1);
//   let m = textureSample(myTexture, mySampler, localPosition);
//   //sin(camera.time)
//   //

//   var c = mainImage(localPosition, vec2<f32>(1000., 1000.));
//   //color.rgb +
//   return vec4<f32>(color.rgb * c.rgb, 1.);
//   }
//   `}}));
//   return drawRosePetals
// }


