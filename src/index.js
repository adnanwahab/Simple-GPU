
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
import icosahedron from "./icosahedron";
import hexagon from "./h3-hexagon";
import fractalCube from "./fractal-cube";
import computeBoids from "./computeBoids";
import shadowCasting from "./shadowCasting";
import particles from "./particles";
import deferredRendering from "./deferredRendering";
import kodiak from "./kodiak";
import gpuSort from './gpu-sort'
import neuralRenderingRadianceField from './nerf'
import threejsDemo from './threejs'
import gpuLines from "./gpu-lines";

import zed from './zed2i'
import waymo from './waymo-scale-lidar-data-visualization'
import mineSweeper from './mine-sweeper'


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
  'waymo-scale-lidar-data-visualization',

  'mine-sweeper'
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
waymo,
mineSweeper
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

function select(name) {
  let idx = demoTitles.indexOf(name);
  let demo = demos[idx];

  cleanup()

  window.location.hash = name;
  demo()
  const selected = document.querySelector(`input[value="${window.location.hash.slice(1)}"]`)
  if (selected) selected.checked = true
}

let defaultDemo = 'Threejs'
//defaultDemo = 'gpu-lines'
defaultDemo = 'waymo-scale-lidar-data-visualization'
select(defaultDemo || window.location.hash.slice(1) || document.querySelector(':checked').value)


//select('mine-sweeper')

