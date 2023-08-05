import utils from '../../lib/utils'
//https://github.com/mikolalysenko/webgpu-experiments/blob/master/src/demos/icosahedron.ts
import { mat4 } from 'gl-matrix';
import simpleWebgpuInit from '../../lib/main';

async function main () {
  const webgpu = await simpleWebgpuInit();
  const canvas = webgpu.canvas

  const VERTS = [[-1, -1.6180340051651,0,],
    [1, -1.6180340051651,
    0,],
    [-1,
    1.6180340051651,
    0,],
    [1,
    1.6180340051651,
    0,],
    [0,
    -1,
    -1.6180340051651,],
    [0,
    1,
    -1.6180340051651,],
    [0,
    -1,
    1.6180340051651,],
    [0,
    1,
    1.6180340051651,],
    [-1.6180340051651,
    0,
    -1,],
    [-1.6180340051651,
    0,
    1,],
    [1.6180340051651,
    0,
    -1,],
    [1.6180340051651,
    0,
    1],
]
const icoFaceData = [
  5, 2, 3,  6, 0,  1,  8, 2, 5,  9,  0, 6,
  9, 6, 7,  9, 2,  8, 10, 1, 4, 10,  4, 5,
  11, 3, 7, 11, 1, 10,  4, 1, 0,  7,  3, 2,
  8, 4, 0,  8, 5,  4,  9, 7, 2,  9,  8, 0,
  10, 5, 3, 11, 6,  1, 11, 7, 6, 11, 10, 3
]

  const matrixBuffer = new Float32Array(3 * 16)
  const a = matrixBuffer.subarray(0, 16)
  const b = matrixBuffer.subarray(16, 32)
  const c = matrixBuffer.subarray(32, 48)

  const shader = {
    code: `
struct Camera {
  model: mat4x4<f32>,
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
}
@binding(0) @group(0) var<uniform> camera : Camera;
struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) fragColor : vec3<f32>,
}
@vertex
fn vertMain(
    @location(0) meshPosition : vec3<f32>
) -> VertexOutput {
  var result : VertexOutput;
  result.clipPosition = camera.proj * camera.view * camera.model * vec4(meshPosition, 1.);
  result.fragColor = 0.25 * (2. + meshPosition);
  return result;
}
  
@fragment
fn fragMain(@location(0) fragColor : vec3<f32>) -> @location(0) vec4<f32> {
    return vec4(fragColor, 1.0);
}`
  }

  const draw = await webgpu.initDrawCall({
    label: 'postprocess-draw',
    shader: { code: shader.code,
              fragEntryPoint: "fragMain",
              vertEntryPoint: "vertMain"
    },
    attributes: {
      position: new webgpu.attribute(VERTS, 0, 3),
    },

    indices: icoFaceData,
    indexCount: icoFaceData.length,
    uniforms: {
      fromRotation: ({tick}) => mat4.fromRotation(a, 0.001 * tick, [0.3, 0.5, -0.2]),
      lookAt: () => mat4.lookAt(b, [0, 0, -5], [0, 0, 0], [0, 1, 0]),
      projection: () => mat4.perspective(c, Math.PI / 4, canvas.width / canvas.height, 0.01, 50.0),
    }
  })
    

  function frame (tick) {
    draw()

    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

main()