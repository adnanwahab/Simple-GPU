import utils from '../lib/utils'

let canvas = document.createElement('canvas');

canvas.style.background = 'aliceblue'
canvas.width = canvas.height = 256;

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter.requestDevice();

const context = canvas.getContext('webgpu');

const presentationSize = [canvas.width, canvas.height]

const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

context.configure({
    device: device,
    format: presentationFormat,
    size: presentationSize
})
//@builtin(vertex_index) VertexIndex : u32
//
let vertWGSL = `
@vertex 
fn main(@location(0) position : vec2<f32>)
    -> @builtin(position) vec4<f32>{
        // var pos = array<vec2<f32>, 4>(
        //     vec2<f32>( -.9, .9),
        //     vec2<f32>( -.9, .9),
        //     vec2<f32>( .9, .9),
        //     vec2<f32>( .9, -.9));
            return vec4<f32>(position, 0.0, 1.0);
        
    }

`
var fragWGSL = `@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 1.0, 1.0);
}`

const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module : device.createShaderModule({code: vertWGSL}),
     entryPoint: 'main',
     buffers: [
        {
            arrayStride: 0, //two vertices so 4 bytes each
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: 0, 
                format: `float32x2`,
              },
            ],
          }
    ],
    },
    fragment: { module : device.createShaderModule ({ code: fragWGSL,}),
                entryPoint:'main',
                targets: [{ format: presentationFormat }]   },
    
    primitive: {topology: 'point-list',
                stripIndexFormat: undefined},

})

const renderPassDescriptor = {
    colorAttachments: [{
        view: undefined,
        loadOp: 'clear',
        clearValue : {r: 0, g: 0, b: 0, a: 1.0},
        storeOp : 'store'
    }]
}

function points () {
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

    const commandEncoder = device.createCommandEncoder()

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)

    let points = [-.9,.9,
                 -.9, .9,
                 .9, .9,
                 .9, -.9
    ]
    for (var i = 0; i < 1e6; i++){
        points[i] = Math.random()
    }

    const vbo = utils.makeBuffer(device, 4 *points.length, 'VERTEX', points, Float32Array)

    passEncoder.setPipeline(pipeline)
    passEncoder.setVertexBuffer(0, vbo)
    passEncoder.draw(points.length, 1,0,0)
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()])
    document.body.appendChild(canvas);
}

export default points