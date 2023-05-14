import webgpuInit from '../../lib/main'




// let canvas = document.createElement('canvas');
// document.body.appendChild(canvas)
// canvas.style.background = 'aliceblue'
// canvas.width = canvas.height = 256;

// const adapter = await navigator.gpu.requestAdapter();
// const device = await adapter.requestDevice();

// const context = canvas.getContext('webgpu');

// const presentationSize = [canvas.width, canvas.height]

// const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

// context.configure({
//     device: device,
//     format: presentationFormat,
//     size: presentationSize
// })

// let vertWGSL = `
// @vertex
// fn main(@builtin(vertex_index) VertexIndex : u32)
//     -> @builtin(position) vec4<f32>{
//         var pos = array<vec2<f32>, 4>(
//             vec2<f32>( -.9, .9),
//             vec2<f32>( -.9, .9),
//             vec2<f32>( .9, .9),
//             vec2<f32>( .9, -.9));
//             return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        
//     }
// `

// var fragWGSL = `@fragment
// fn main() -> @location(0) vec4<f32> {
//     return vec4<f32>(1.0, 0.0, 1.0, 1.0);
// }`

// const pipeline = device.createRenderPipeline({
//     layout: "auto",
//     vertex: { module : device.createShaderModule({code: vertWGSL}),
//      entryPoint: 'main'
//     },
//     fragment: { module : device.createShaderModule ({ code: fragWGSL,}),
//                 entryPoint:'main',
//                 targets: [{ format: presentationFormat }]   },
    
//     primitive: {topology: 'line-strip',
//                 stripIndexFormat: undefined}
// })

// const renderPassDescriptor = {
//     colorAttachments: [{
//         view: undefined,
//         loadOp: 'clear',
//         clearValue : {r: 0, g: 0, b: 0, a: 1.0},
//         storeOp : 'store'
//     }]
// }

async function lines () {
    let webgpu = await webgpuInit()

const pos = [[-.9, .9],
    [-.9, .9],
    [.9, .9],
    [.9, -.9]
]

for (let i = 0; i < 1e4; i++) {
    pos[i] = [-Math.random(), Math.random()]
}

let position = new webgpu.attribute(pos, 0, 2)

let draw = await webgpu.initDrawCall({
    vert: `@vertex
    fn main(@location(0) position : vec2<f32>)
        -> @builtin(position) vec4<f32>{
                return vec4<f32>(position, 0.0, 1.0);
        }
    `,
    frag: `@fragment
    fn main() -> @location(0) vec4<f32> {
        return vec4<f32>(1.0, 0.0, 1.0, 1.0);
    }`,
    count: pos.length,
    attributes: {
        position: position
    },
    primitive: 'line-list'
})
    draw()
    requestAnimationFrame(lines);
}

lines()