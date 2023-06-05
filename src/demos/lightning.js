// //draw lines

// //tectonic plates
// //AI in webgpu - cant look anything up
import webgpuInit from '../../lib/main/'

import utils from '../../lib/utils'
function code () {}
let points = []
for(let i = 0; i < 1e6; i++) {
    points[i] = [i / 1e6, i / 1e6, 1, 1];
}

let connectedPoints = [];
let staticElectricity = 0;
function distance (a, b) {
    return a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2]
}
for (let i = 0; i < 1e6-1; i++){
    if (distance(points[i], points[i+1]) < .05) {
        staticElectricity +=  1;
        connectedPoints.push(points[i], points[i+1]);
    }
} 




if (staticElectricity > 50) {
    let arc = [];
    connectedPoints.forEach(function (point) {
        arc[point] += 10;
    });
    point.electrons.replaceConnected.nearestNeighbor;
}

let computeShader = `
fn arcLightning () {
}
`;


let mouse = [0, 0]
function drawArc() {
    let destination = staticElectricity.origin
    let arcs = []
    
    let midpoint = minus(destination, mouse)
    for (let i = 0; i < 1000; i++) {
        
        arcs.push(
            midpoint
        )
        midpoint = minus(midPoint, mouse)
    }
}

var lineData = [
    [0,0], [1,1]
]

let webgpu = await webgpuInit()
let usage = GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
| GPUBufferUsage.COPY_SRC
//(device, size=4, usage, data, type)
let lines = utils.makeBuffer(webgpu.device, 1e6, usage, lineData.flat(), Float32Array)

let position = new webgpu.attribute(lineData, 0, 2)

let draw = webgpu.initDrawCall({
    frag: `   @fragment
    fn main () -> @location(0) vec4<f32> {
        
        return vec4<f32>(0.);
    }`,
    vert: `@vertex
    fn main () -> @builtin(position) vec4<f32> {

        return vec4<f32>(0.);
    }`,
    count: lineData.length,
   // attributes: {position},
   attributeBufferData: [
    lines
   ],
    primitive: 'line-list',
    attributeBuffers: [{
        arrayStride: 4 * 2,
        attributes: [
            {shaderLocation: 0,
            offset: 0,
            format: 'float32x2'
            
            }
        ]
    }]
})

draw()


// //almost worked today because i had a demo
// //it will work if i finish lightning 




// //its not gonna be that simple but we just want to try
// //if they offered you something, what could he do?







































