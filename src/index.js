
import prefixSums from './prefix-sum'

import sdfPhysics from './sdf-physics'
import raytracer from './raytracer-demo'

import matrixMultiply from "./matrix-multiply";

import particleLife from "./particle-life";

import sprites from "./sprites";

import basic from "./basic";

import cube from "./cube";

import texturedCube from "./texturedCube";

import postProcessing from "./postProcessing";


import instancedCube from "./instanced-cube";

//import lines from "./lines";

import icosahedron from "./icosahedron";

//import points from "./points";

import hexagon from "./h3-hexagon";

import fractalCube from "./fractal-cube";
//import lines from "./lines";
//import points from "./points";

import computeBoids from "./computeBoids";

import shadowCasting from "./shadowCasting";

import particles from "./particles";

import deferredRendering from "./deferredRendering";

import kodiak from "./kodiak";
import kodiak2 from "./kodiak2";
import gpuSort from './gpu-sort'
import neuralRenderingRadianceField from './nerf'
import threejsDemo from './threejs'
import zed from './zed2i'
//make sure the right radio button is selected
import gpuLines from "./gpu-lines";

import waymo from './waymo-open'


let data = {}


async function start_loop_static(options) {
  options.data = options.data || data; //extend 

let draw = await init(options);
  if (! draw) return alert('webgpu not defined - please install chrome canary, go to chrome://flags, search for WebGPU')
  draw(data)
  
  // requestAnimationFrame(function test() {
  //   draw(data);
  //   requestAnimationFrame(test)
  // });
}
//https://playlist.downloader.is/
//https://www.youtube.com/watch?v=cz7QHNvNFfA&list=PLPJVlVRVmhc4Z01fD57jbzycm9I6W054x

let demoTitles = [
  'basic' , 'hexagon', 'cube',
  'texturedCube', 'postProcessing', 'instancedCube',  
  'icosahedron', 'fractalCube', 
  'computeBoids', 'shadowCasting', 'particles',
  'deferredRendering', 'particle-life', 'sprites',
  'matrix-multiply', 'raytracer', 'sdf-physics', 'prefixSums',  
  'gpu-sort', 'Neural-Rendering-Radiance-Field',
  'Threejs', 'kodiak',
  'gpu-lines', 
  'waymo-open' 
  //'zed-2i'
]

let demos = [
basic, hexagon, cube, texturedCube, postProcessing, instancedCube, icosahedron, fractalCube,
computeBoids, shadowCasting, particles, 

deferredRendering, particleLife, sprites, matrixMultiply, raytracer, sdfPhysics,
prefixSums, gpuSort, neuralRenderingRadianceField,
threejsDemo, kodiak,
gpuLines,
//zed,
waymo
]

  document.querySelectorAll('input').forEach(e => {
   e.addEventListener('click', (event) => {
      select(event.target.value)
    })
  })

function cleanup() {
  (document.querySelector(':checked') || {}).checked = null  
  let canvas = document.querySelector('canvas')
  
  if (canvas) canvas.remove()
}

function customShader(options) {
  let start = window.location.host === "localhost:3000" ? start_loop_static : start_loop_nb;
  start(options);
}

function select(name) {
  let idx = demoTitles.indexOf(name);
  let demo = demos[idx];

  cleanup()

  window.location.hash = name;
  demo()
  document.querySelector(`input[value="${window.location.hash.slice(1)}"]`).checked = true
}

let defaultDemo = 'Threejs'
//defaultDemo = 'gpu-lines'
defaultDemo = 'waymo-open'
select(defaultDemo || window.location.hash.slice(1) || document.querySelector(':checked').value)
