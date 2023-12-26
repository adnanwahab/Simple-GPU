import utils from '../lib/utils'



const redFragWGSL = `
@fragment
fn main() -> @location(0) vec4<f32> {
  return vec4(1.0, 0.0, 0.0, 1.0);
}
`
const triangleVertWGSL = `fn main(
    @builtin(vertex_index) VertexIndex : u32
  ) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
      vec2(0.0, 0.5),
      vec2(-0.5, -0.5),
      vec2(0.5, -0.5)
    );
  
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  }`

const animatedCanvasSize = `@keyframes animated-size {
    0% {
      width: 10px;
      height: 600px;
    }
    50% {
      width: 100%;
      height: 600px;
    }
    100% {
      width: 10px;
      height: 600px;
    }
  }
  
  .animatedCanvasSize {
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-name: animated-size;
    animation-timing-function: ease;
  }`

   async function resizeCanvas() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const canvas = utils.createCanvas()
  const context = canvas.getContext('webgpu');

  const devicePixelRatio = window.devicePixelRatio || 1;
  const presentationSize = [
    canvas.clientWidth * devicePixelRatio,
    canvas.clientHeight * devicePixelRatio,
  ];
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    size: presentationSize,
    format: presentationFormat,
    alphaMode: 'opaque',
  });

  const sampleCount = 4;

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: triangleVertWGSL,
      }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({
        code: redFragWGSL,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
    multisample: {
      count: 4,
    },
  });

  const texture = device.createTexture({
    size: presentationSize,
    sampleCount,
    format: presentationFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
  const view = texture.createView();

  function frame() {

    const commandEncoder = device.createCommandEncoder();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view,
          resolveTarget: context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'discard',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
}
}




  export default resizeCanvas