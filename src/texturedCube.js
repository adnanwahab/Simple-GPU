//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../lib/main';
import { mat4, vec3 } from 'gl-matrix';

const cubeVertexSize = 4 * 10; // Byte size of one cube vertex.
const cubePositionOffset = 0;
const cubeColorOffset = 4 * 4; // Byte offset of cube vertex color attribute.
const cubeUVOffset = 4 * 8;
const cubeVertexCount = 36;

// prettier-ignore
const cubeVertexArray = ([
  //float4 position, float4 color, float2 uv,
  [1, -1, 1, 1,   1, 0, 1, 1,  1, 1],
  [-1, -1, 1, 1,  0, 0, 1, 1,  0, 1],
  [-1, -1, -1, 1, 0, 0, 0, 1,  0, 0],
  [1, -1, -1, 1,  1, 0, 0, 1,  1, 0],
  [1, -1, 1, 1,   1, 0, 1, 1,  1, 1],
  [-1, -1, -1, 1, 0, 0, 0, 1,  0, 0],

  [1, 1, 1, 1,    1, 1, 1, 1,  1, 1],
  [1, -1, 1, 1,   1, 0, 1, 1,  0, 1],
  [1, -1, -1, 1,  1, 0, 0, 1,  0, 0],
  [1, 1, -1, 1,   1, 1, 0, 1,  1, 0],
  [1, 1, 1, 1,    1, 1, 1, 1,  1, 1],
  [1, -1, -1, 1,  1, 0, 0, 1,  0, 0],

  [-1, 1, 1, 1,   0, 1, 1, 1,  1, 1],
  [1, 1, 1, 1,    1, 1, 1, 1,  0, 1],
  [1, 1, -1, 1,   1, 1, 0, 1,  0, 0],
  [-1, 1, -1, 1,  0, 1, 0, 1,  1, 0],
  [-1, 1, 1, 1,   0, 1, 1, 1,  1, 1],
  [1, 1, -1, 1,   1, 1, 0, 1,  0, 0],

  [-1, -1, 1, 1,  0, 0, 1, 1,  1, 1],
  [-1, 1, 1, 1,   0, 1, 1, 1,  0, 1],
  [-1, 1, -1, 1,  0, 1, 0, 1,  0, 0],
  [-1, -1, -1, 1, 0, 0, 0, 1,  1, 0],
  [-1, -1, 1, 1,  0, 0, 1, 1,  1, 1],
  [-1, 1, -1, 1,  0, 1, 0, 1,  0, 0],

  [1, 1, 1, 1,    1, 1, 1, 1,  1, 1],
  [-1, 1, 1, 1,   0, 1, 1, 1,  0, 1],
  [-1, -1, 1, 1,  0, 0, 1, 1,  0, 0],
  [-1, -1, 1, 1,  0, 0, 1, 1,  0, 0],
  [1, -1, 1, 1,   1, 0, 1, 1,  1, 0],
  [1, 1, 1, 1,    1, 1, 1, 1,  1, 1],

  [1, -1, -1, 1,  1, 0, 0, 1,  1, 1],
  [-1, -1, -1, 1, 0, 0, 0, 1,  0, 1],
  [-1, 1, -1, 1,  0, 1, 0, 1,  0, 0],
  [1, 1, -1, 1,   1, 1, 0, 1,  1, 0],
  [1, -1, -1, 1,  1, 0, 0, 1,  1, 1],
  [-1, 1, -1, 1,  0, 1, 0, 1,  0, 0],
]);

function getTransformationMatrix() {
  const presentationSize = [500, 500]
  const aspect = presentationSize[0] / presentationSize[1];
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -4));
  const now = Date.now() / 1000;
  mat4.rotate(
    viewMatrix,
    viewMatrix,
    1,
    vec3.fromValues(Math.sin(now), Math.cos(now), 0)
  );

  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

  return modelViewProjectionMatrix
}
async function basic () {

// Calling simplewebgpu.init() creates a new partially evaluated draw command
let webgpu = await simpleWebgpuInit()
let img = new Image();
img.src = './baboon.png'
//document.body.appendChild(img)

await img.decode();
//1/4, shader abstraction might get it to 1/10 or 1/5
//goal: 10x easier than native w/ shader abstraction
//15% way to full framework - last 2 months well spent 
const drawCube = await webgpu.initDrawCall({
frag: `
  @group(0) @binding(1) var mySampler: sampler;
  @group(0) @binding(2) var myTexture: texture_2d<f32>;
@fragment
  fn main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>
  ) -> @location(0) vec4<f32> {
    return textureSample(myTexture, mySampler, fragUV) * fragPosition;
  }`,
  vert: `
  struct Uniforms {
    modelViewProjectionMatrix : mat4x4<f32>,
  }
  @binding(0) @group(0) var<uniform> uniforms : Uniforms;
  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }  
  @vertex
  fn main(
    @location(0) position : vec4<f32>,
    @location(1) uv : vec2<f32>
  ) -> VertexOutput {
    var output : VertexOutput;
    output.Position = uniforms.modelViewProjectionMatrix * position;
    output.fragUV = uv;
    output.fragPosition = position;
    return output;
  }`,
  attributes: {
    position: new webgpu.attribute(cubeVertexArray, 0, 4),
    uv: new webgpu.attribute(cubeVertexArray, 4 * 8, 4)
  },
  uniforms: {
    modelViewProjectionMatrix: getTransformationMatrix,
   texture: webgpu.texture(img),
  },
  count: 36
})

setInterval(
  function () {
    drawCube({
      texture: webgpu.texture(img)
    })
  }, 50
)
  
}

export default basic