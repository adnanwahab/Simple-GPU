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

let vertWGSL = `
@vertex
fn main(@builtin(vertex_index) VertexIndex : u32)
    -> @builtin(position) vec4<f32>{
        var pos = array<vec2<f32>, 4>(
            vec2<f32>( -.9, .9),
            vec2<f32>( -.9, .9),
            vec2<f32>( .9, .9),
            vec2<f32>( .9, -.9));
            return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        
    }

`
var fragWGSL = `@fragment
fn main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 1.0, 1.0);
}`

const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module : device.createShaderModule({code: vertWGSL}),
     entryPoint: 'main'
    },
    fragment: { module : device.createShaderModule ({ code: fragWGSL,}),
                entryPoint:'main',
                targets: [{ format: presentationFormat }]   },
    
    primitive: {topology: 'point-list',
                stripIndexFormat: undefined}
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

    passEncoder.setPipeline(pipeline)
    passEncoder.draw(4,1,0,0)
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()])
    document.body.appendChild(canvas);

    //requestAnimationFrame(points);
    //console.log(555)
}

export default points