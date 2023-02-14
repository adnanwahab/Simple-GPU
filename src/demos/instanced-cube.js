import { mat4, vec3 } from 'gl-matrix';
import utils from '../../lib/utils'
import initWebGPU from '../../lib/main'

const cubeVertexCount = 36;

const xCount = 20;
const yCount = 30;
const numInstances = xCount * yCount;
const matrixFloatCount = 16; // 4x4 matrix

function updateTransformationMatrix() {
    const now = Date.now() / 10000;

    let m = 0,
      i = 0;
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        mat4.rotate(
          tmpMat4,
          modelMatrices[i],
          1,
          vec3.fromValues(
            Math.sin((x + 0.5) * now),
            Math.cos((y + 0.5) * now),
            0
          )
        );

        mat4.multiply(tmpMat4, viewMatrix, tmpMat4);
        mat4.multiply(tmpMat4, projectionMatrix, tmpMat4);

        mvpMatricesData.set(tmpMat4, m);

        i++;
        m += matrixFloatCount;
      }
    }
    return mvpMatricesData
  }

const aspect = 1;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);
  
    const modelMatrices = new Array(numInstances);
    const mvpMatricesData = new Float32Array(matrixFloatCount * numInstances);
  
    const step = 4.0;
  
    // Initialize the matrix data for every instance.
    let m = 0;
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        modelMatrices[m] = mat4.create();
        mat4.translate(
          modelMatrices[m],
          modelMatrices[m],
          vec3.fromValues(
            step * (x - xCount / 2 + 0.5),
            step * (y - yCount / 2 + 0.5),
            0
          )
        );
        m++;
      }
    }
  
    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -70));
  
    const tmpMat4 = mat4.create();
  


const instancedVertWGSL = `struct Uniforms {
    modelViewProjectionMatrix : array<mat4x4<f32>, 600>,
  }
  
  @binding(0) @group(0) var<uniform> uniforms : Uniforms;
  
  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }
  
  @vertex
  fn main(
    @builtin(instance_index) instanceIdx : u32,
    @location(0) position : vec4<f32>,
    @location(1) uv : vec2<f32>
  ) -> VertexOutput {
    var output : VertexOutput;
    output.Position = uniforms.modelViewProjectionMatrix[instanceIdx] * position;
    output.fragUV = uv;
    output.fragPosition = 0.5 * (position + vec4(1.0));
    return output;
  }
  `

const vertexPositionColorWGSL = `@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  return fragPosition;
}`

// prettier-ignore
const cubeVertexArrayData = [
  // float4 position, float4 color, float2 uv,
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
]


const instancedCube = async () => {
    const webGPU = await initWebGPU()
  
    const draw = await webGPU.initDrawCall({
        frag: vertexPositionColorWGSL,
        vert: instancedVertWGSL,
        attributes: {
            position: new webGPU.attribute(
                cubeVertexArrayData, 0, 4)
        },
        uniforms: {
            modelViewProjectionMatrix: updateTransformationMatrix
        },
        count:cubeVertexCount,
        instances: numInstances
    })
    setInterval(draw, 16)
}
  

instancedCube()

//https://alteredqualia.com/three/examples/webgl_cubes.html
//https://github.com/regl-project/regl/blob/gh-pages/example/instance-mesh.js