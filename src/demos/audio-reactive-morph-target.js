import {load} from '@loaders.gl/core';
import {GLBLoader} from '@loaders.gl/gltf';

// interpret black and white images as vector fields
// repel mouse by vel = (-y,x)
// faux metallic lighting 
// 3d model - rotate the model
// onkeyPress - 1 - 8 = change vector field

const ply = `https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/point-cloud-ply/lucy800k.ply`

// const gltf = load(ply, GLBLoader).then(d => {
//   console.log(d)
// })

let shapes = [

]
function writeBuffer (device, buffer, array) {
  console.log('hi', buffer, array)
  device.queue.writeBuffer(device, 0, buffer, 0, new Float32Array(16));
}

// fetch('https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/src/demos/matt.obj').then(d => {
//   return d.text()
// }).then((d) => {
//   let abc = parseOBJ(d).position
//   shapes.push(window.makeBuffer(abc, 0,'flower'))
// })

setTimeout(function () {
  fetch('https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/src/demos/matt.txt').then(d => {
    return d.text()
  }).then((d) => {
    let abc = parseOBJ(d).position
    shapes.push(window.makeBuffer(abc, 0,'leaf'))
  })

}, 250 )


function parseOBJ(text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];

  function newGeometry() {
    // If there is an existing geometry and it's
    // not empty then start a new one.
    if (geometry && geometry.data.position.length) {
      geometry = undefined;
    }
    setGeometry();
  }

  function addVertex(vert) {
    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      // should check for missing v and extra w?
      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      //console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
  };
}

//need a way to swap meshes
//make 5 functions that load 5 point clouds
//make a beat detection function that calls function upon volume threshold 
//one more to diff particles 
//no animation 
// have to make a demo so good it unites stream
// cant just survive their insanity 

// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
// //import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';
// //import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';

// let camera, renderer;

// let mixer, clock;

// export default init
// let   scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
//   camera.position.set( 100, 200, 300 );

//   camera.lookAt( 0, 100, 0 );

//   clock = new THREE.Clock();
//    const loader = new FBXLoader();

// function init () {

//   loader.load('./data/samba.fbx', function ( object ) {
// console.log(object)
//     mixer = new THREE.AnimationMixer( object );

//     const action = mixer.clipAction( object.animations[ 0 ] );
//     action.play();

//     object.traverse( function ( child ) {
//       if ( child.isMesh ) {

//         child.visible = false;

//         const materialPoints = new PointsNodeMaterial();
//         materialPoints.colorNode = uniform( new THREE.Color() );
//         materialPoints.positionNode = skinning( child );
//         console.log(child.geometry)
//         const pointCloud = new THREE.Points( child.geometry, materialPoints );
//         scene.add( pointCloud );
//         console.log(pointCloud, 123)
//       }

//     } );

//     scene.add( object );
//   });
//   renderer = new THREE.WebGLRenderer();
//   renderer.setPixelRatio( window.devicePixelRatio );
//   renderer.setSize( 500, 500   );
//   renderer.setAnimationLoop( animate );
//   document.body.appendChild( renderer.domElement );

//   window.addEventListener( 'resize', onWindowResize );
// }
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize( innerWidth, innerHeight );

// }

// function animate() {
//   const delta = clock.getDelta();

//   if ( mixer ) mixer.update( delta );

//   renderer.render( scene, camera );

// }

import createCamera from './createCamera'

import bunny from 'bunny'
import dragon from 'stanford-dragon'
import { analyze } from 'web-audio-beat-detector';
import {FBXLoader} from './FBXLoader'

var loader = new FBXLoader();

loader.load('https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/src/demos/run.txt',   (object) => {
  // object.traverse(function (child) {
  //     if ((child as THREE.Mesh).isMesh) {
  //         // (child as THREE.Mesh).material = material
  //         if ((child as THREE.Mesh).material) {
  //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
  //         }
  //     }
  // })
  // object.scale.set(.01, .01, .01)
  //console.log('55523')
  //console.log(object)
},
(xhr) => {
  //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
},
(error) => {
  console.log(error)
}
)

//import GLTFLoader from 'three-gltf-loader';

//change mesh when it detects a beat [.5]
//animate collada meshes so it dances [0]
//gold particles for mesh [0]
//add rainbow particles for motion - detect DX and show trail [0]

let keyframes = [
  []//VBO
]

// const loader = new ColladaLoader();
// loader.load(
// 	'https://raw.githubusercontent.com/stackgpu/Simple-GPU/main/src/demos/start_plank.txt',
// 	( gltf ) => {
// 		// called when the resource is loaded
// 		console.log(gltf)
// 	},
// 	( xhr ) => {
//     console.log(xhr)
// 		// called while loading is progressing
// 		console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
// 	},
// 	( error ) => {
// 		// called when loading has errors
// 		console.error( 'An error happened', error );
// 	},
// );


// async function abc() {

//   const soundBuffer =  await fetch( './dance.txt' ).then( res => res.arrayBuffer() );
//   const audioContext = new AudioContext();


//   waveBuffer = audioBuffer.getChannelData( 0 );

//   // adding extra silence to delay and pitch
//   waveBuffer = new Float32Array( [ ...waveBuffer, ...new Float32Array( 200000 ) ] );

//   sampleRate = audioBuffer.sampleRate / audioBuffer.numberOfChannels;
//   console.log(waveBuffer)
// }
// abc()

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


window.makeBuffer = function makeBuffer (stuff, flag, label) {
  let particlesCount = stuff.length
  stuff = stuff.flat()
  const particleSize = 16
  const gpuBufferSize = 1e7 * particleSize
  //const gpuBufferSize = particlesCount * (flag ? particleSize :1)

  if (flag) {
    stuff.forEach((d, i, array) => {
      array[i] /= 18
    })
  }

  const gpuBuffer = webgpu.device.createBuffer({
    label,
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
  for (let iParticle = 0; iParticle < 1839; iParticle++) {
    const i = iParticle;
      particlesBuffer[4 * iParticle + 0] = (stuff[i*3+0]);
      particlesBuffer[4 * iParticle + 1] = (stuff[i*3+1]);
      particlesBuffer[4 * iParticle + 2] = (stuff[i*3+2]);
      particlesBuffer[4 * iParticle + 3] = 0
  }


  particlesBuffer[0] = .2
  particlesBuffer[1] = -1
  particlesBuffer[2] = 1

  gpuBuffer.unmap();
  return gpuBuffer
} 
const posBuffer = makeBuffer(bunny.positions, 0, 'bunny')

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
    var stuff = mix(inPosition.xy, pos2.xy, (sin(vec2<f32>(camera.time)) + 1. ) / 2.);

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

    a.forEach((d, i) => a[i] = window.avg / 40)
    a.forEach((d, i) => a[i] = performance.now()/ 1000)

    device.queue.writeBuffer(
      cameraUniformBuffer,
      192,
      a.buffer,
      0,
      a.byteLength
    );
  
 

    drawCube({})


    }, 8) 

    let choice = false
    //do this every 5th beat
    let i = 0

    setInterval(function () {
      i = (i + 1) % (shapes.length)
   
      choice = ! choice;
      drawCube.state.options.attributeBufferData[
        choice ? 0 : 2
      ] = shapes[i]
      //writeBuffer(device, choice, shapes[i].flat())
    }, 1000 * 3)

}

basic()
//http://labs.dinahmoe.com/plink/


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
          console.log(window.avg)
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
          document.querySelector('body').addEventListener('click', function() {
            context.resume().then(() => {
              console.log('Playback resumed successfully');
            });
            context.decodeAudioData(request.response)
            .then(function(buffer) {
              // when the audio is decoded play the sound

              playSound(buffer);
   
          })
        });
      
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
      //console.log(array)
      // get all the frequency amplitudes
      for (var i = 0; i < length; i++) {
          values += array[i];
      }
console.log(array)
      average = values / length;
      return average;
  }

  setupAudioNodes()
  loadSound('https://ia800300.us.archive.org/16/items/JusticeDance/03D.a.n.c.e.mp3')


  //https://toji.dev/webgpu-best-practices/buffer-uploads


  //its impossible to know what a good decision is when thousands of people add thoughts to my head that come from randomness
