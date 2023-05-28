import utils from '../../lib/utils';
import simpleWebgpuInit from '../../lib/main';

const main = async function () {
    const webgpu = await simpleWebgpuInit();


    
    let vertices = [-1, -1, -1, 1, 1, 1, 
                    -1, -1, 1, -1, 1, 1
                    ]

    //var quad = webgpu.device.createBuffer(vertices)

    let buffer = webgpu.device.createBuffer({
        size: 128,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
    })

    
    let map = new Float32Array(buffer.getMappedRange());

    map.set(vertices);


    //just a shader with a fragment and a vertex
    let draw = webgpu.initDrawCall({
        shader: {
            code: `

            struct VSOut {
                @builtin position: vec4<f32>,
            }

            @fragment 
            fn main_fragment(@location(0) inPosition: vec4<f32>) -> @location(0) vec4<f32> {
                return vec4<f32>(1., 0., 0., 1.);
            }
            
            @vertex
            fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
            ) -> VSOut {
            var vsOut: VSOut;  
            return vsOut;
            }
            `,
        },
        bufferAttributes: [buffer]
    });

    requestAnimationFrame(function redo() {
        draw()
        requestAnimationFrame(redo)
    })
}


main()