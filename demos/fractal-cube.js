//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../lib/main';
import { mat4, vec3 } from 'gl-matrix';


 const cubePositionOffset = 0;
  const cubeUVOffset = 4 * 8;

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
const presentationSize = [500, 500]
const aspect = presentationSize[0] / presentationSize[1];

const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);

function getTransformationMatrix() {
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
const cubeTexture = await webgpu.texture({
    width: 500,
    height: 500,
    format: navigator.gpu.getPreferredCanvasFormat()
})
const drawCube = await webgpu.initDrawCall({
frag: `
@binding(1) @group(0) var mySampler: sampler;
@binding(2) @group(0) var myTexture: texture_2d<f32>;

@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  let texColor = textureSample(myTexture, mySampler, fragUV * 0.8 + vec2(0.1));
  let f = select(1.0, 0.0, length(texColor.rgb - vec3(0.5)) < 0.01);
  return f * texColor + (1.0 - f) * fragPosition;
}
`,
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
    output.fragPosition = 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));
    return output;
  }
  `,
  attributes: {
    position: new webgpu.attribute(cubeVertexArray, 0, 4),
    uv: new webgpu.attribute(cubeVertexArray, 4 * 8, 2)
  },
  uniforms: {
    modelViewProjectionMatrix: getTransformationMatrix,
   texture: cubeTexture,
  },
  count: 36,
  postRender: function (commandEncoder, swapChainTexture) {
   commandEncoder.copyTextureToTexture(
        {
          texture: swapChainTexture,
        },
        {
          texture: cubeTexture.texture,
        },
        [500, 500]
      );
  }
})

setInterval(
  function () {
    drawCube({
      texture: cubeTexture
    })
  }, 50
)
  
}

export default basic