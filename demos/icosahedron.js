import utils from '../lib/utils'

import { mat4, vec3 } from 'https://unpkg.com/gl-matrix@3.1.0/esm/index.js';
import simpleWebgpuInit from '../lib/main';

async function main () {
  const webgpu = await simpleWebgpuInit();
  const device = webgpu.device
  const context = webgpu.context

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

  const canvas = webgpu.canvas

  const icoVerts = device.createBuffer({
    size: 3 * 12 * 4,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  })

  function makeBuffer(device, size=4, usage, data, type) {
    const buffer = device.createBuffer({
      size,
      mappedAtCreation: true,
      usage: GPUBufferUsage[usage],
    });
    new type(buffer.getMappedRange()).set(data)
    buffer.unmap();
    return buffer;
  }

  // makeBuffer(device, 3 * 12 * 4, 'VERTEX', )

  // makeBuffer(device, 3 * 20 * 2, 'INDEX', [
  //   5, 2, 3,  6, 0,  1,  8, 2, 5,  9,  0, 6,
  //   9, 6, 7,  9, 2,  8, 10, 1, 4, 10,  4, 5,
  //   11, 3, 7, 11, 1, 10,  4, 1, 0,  7,  3, 2,
  //   8, 4, 0,  8, 5,  4,  9, 7, 2,  9,  8, 0,
  //   10, 5, 3, 11, 6,  1, 11, 7, 6, 11, 10, 3
  // ], Uint16Array);
  
  const VERTS = new Float32Array(icoVerts.getMappedRange())
  for (let i = 0, v = 0; i < 3; ++i)
  for (let b = -1; b <=1; b += 2)
  for (let a = -1; a <= 1; a += 2) {
      VERTS[v + i] = a
      VERTS[v + ((i + 1) % 3)] = b * 0.5 * (1 + Math.sqrt(5))
      v += 3
  }
  icoVerts.unmap()

  const icoFaces = device.createBuffer({
    size: 3 * 20 * 2,
    usage: GPUBufferUsage.INDEX,
    mappedAtCreation: true
  })
  new Uint16Array(icoFaces.getMappedRange()).set([
    5, 2, 3,  6, 0,  1,  8, 2, 5,  9,  0, 6,
    9, 6, 7,  9, 2,  8, 10, 1, 4, 10,  4, 5,
    11, 3, 7, 11, 1, 10,  4, 1, 0,  7,  3, 2,
    8, 4, 0,  8, 5,  4,  9, 7, 2,  9,  8, 0,
    10, 5, 3, 11, 6,  1, 11, 7, 6, 11, 10, 3
  ])
  icoFaces.unmap()
  

  const shaderModule = device.createShaderModule({
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
  })
  
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vertMain',
      buffers: [{
        arrayStride: 3 * 4,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        }]
      }]
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fragMain',
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: 'triangle-list',
      cullMode: 'back'
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus'
    }
  })

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  })

  const uniformBuffer = device.createBuffer({
    size: 3 * 4 * 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer
        }
      }
    ]
  })

  const matrixBuffer = new Float32Array(3 * 16)
  const model = matrixBuffer.subarray(0, 16)
  const view = matrixBuffer.subarray(16, 32)
  const projection = matrixBuffer.subarray(32, 48)

  function frame (tick) {
    mat4.perspective(projection, Math.PI / 4, canvas.width / canvas.height, 0.01, 50.0)
    mat4.lookAt(view, [0, 0, -5], [0, 0, 0], [0, 1, 0])
    mat4.fromRotation(model, 0.001 * tick, [0.3, 0.5, -0.2])
    device.queue.writeBuffer(uniformBuffer, 0, matrixBuffer.buffer, 0, 3 * 16 * 4)

    const commandEncoder = device.createCommandEncoder()
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        }
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: 'clear',
        depthStoreOp: 'store'
      }
    })
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup)
    passEncoder.setVertexBuffer(0, icoVerts)
    passEncoder.setIndexBuffer(icoFaces, 'uint16')
    passEncoder.drawIndexed(60)
    passEncoder.end()
    device.queue.submit([commandEncoder.finish()])
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

export default main