// Procedural Terrain Generation: You can use compute shaders to generate complex terrain using noise functions. To do this, you would first create a heightmap using a noise function such as Perlin noise. Then, you would use the compute shader to generate the terrain mesh from the heightmap.

// To make this demo more interesting, you can add additional features such as rivers, lakes, and vegetation. You can use another noise function such as Worley noise to generate patterns for water and vegetation. You can also use physics simulations to add realistic erosion effects to the terrain.

// To visualize the terrain, you can use a graphics shader to add textures, lighting, and shadows. You can also implement LOD (level of detail) to optimize performance for large terrains.

// Overall, this demo can be a fun and creative way to showcase the power and versatility of compute shaders.
//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../../lib/main';
import { mat4, vec3 } from 'gl-matrix';
//import simplegpu from "https://cdn.jsdelivr.net/npm/simple-gpu/+esm";
//dont look up anything not even noise





async function basic () {
  const position = ([
    //float4 position, float4 color, float2 uv,
    [1, -1, 1, 1,   ],
    [-1, -1, 1, 1,  ],
    [-1, -1, -1, 1, ],
    [1, -1, -1, 1,  ],
    [1, -1, 1, 1,   ],
    [-1, -1, -1, 1, ],
  
    [1, 1, 1, 1,    ],
    [1, -1, 1, 1,   ],
    [1, -1, -1, 1,  ],
    [1, 1, -1, 1,   ],
    [1, 1, 1, 1,    ],
    [1, -1, -1, 1,  ],
  
    [-1, 1, 1, 1,   ],
    [1, 1, 1, 1,    ],
    [1, 1, -1, 1,   ],
    [-1, 1, -1, 1,  ],
    [-1, 1, 1, 1,   ],
    [1, 1, -1, 1,   ],
  
    [-1, -1, 1, 1,  ],
    [-1, 1, 1, 1,   ],
    [-1, 1, -1, 1,  ],
    [-1, -1, -1, 1, ],
    [-1, -1, 1, 1,  ],
    [-1, 1, -1, 1,  ],
  
    [1, 1, 1, 1,    ],
    [-1, 1, 1, 1,   ],
    [-1, -1, 1, 1, ],
    [-1, -1, 1, 1,  ],
    [1, -1, 1, 1,   ],
    [1, 1, 1, 1,    ],
  
    [1, -1, -1, 1,  ],
    [-1, -1, -1, 1, ],
    [-1, 1, -1, 1, ],
    [1, 1, -1, 1,   ],
    [1, -1, -1, 1,  ],
    [-1, 1, -1, 1,  ],
  ]);
  const uv = ([
    //float4 position, float4 color, float2 uv,
    [  1, 1],
    [ 0, 1],
    [ 0, 0],
    [  1, 0],
    [  1, 1],
    [  0, 0],
  
    [  1, 1],
    [  0, 1],
    [  0, 0],
    [  1, 0],
    [  1, 1],
    [  0, 0],
  
    [  1, 1],
    [  0, 1],
    [  0, 0],
    [  1, 0],
    [  1, 1],
    [  0, 0],
  
    [  1, 1],
    [  0, 1],
    [  0, 0],
    [  1, 0],
    [  1, 1],
    [  0, 0],
  
    [  1, 1],
    [  0, 1],
    [  0, 0],
    [  0, 0],
    [  1, 0],
    [  1, 1],
  
    [  1, 1],
    [  0, 1],
    [  0, 0],
    [  1, 0],
    [  1, 1],
    [  0, 0],
  ]);
  
  

  //code using your own module - no lookups...?

  
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

  for (var i = 0; i < cubeVertexArray.length; i+= 1){
    cubeVertexArray[i][0] = -1
    cubeVertexArray[i][1] = -1
    cubeVertexArray[i][2] = -1
    cubeVertexArray[i][3] = -1
  }
  
  function getTransformationMatrix() {
    const presentationSize = [500, 500]
    const aspect = presentationSize[0] / presentationSize[1];
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 100.0);
  
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
// Calling simplewebgpu.init() creates a new partially evaluated draw command
let webgpu = await simpleWebgpuInit()


const quadBuffer = webgpu.device.createBuffer({
  size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
  usage: GPUBufferUsage.VERTEX,
  mappedAtCreation: true,
});

const stuff = [
  -1,-1,0,
  1,-1,0
  -1,-1,-1,
  1,-1,-1
]
new Float32Array(quadBuffer.getMappedRange()).set([
  stuff
  // -1, -1, +1, -1, +1, +1,
  // -1, -1, +1, +1, -1, +1
]);
quadBuffer.unmap();



const buffers = [
  {
    arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
      attributes: [
          {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
          }
      ],
  },
]

const drawCube = await webgpu.initDrawCall({
frag:
`
  @group(0) @binding(1) var mySampler: sampler;
  @group(0) @binding(2) var myTexture: texture_2d<f32>;
  @fragment
  fn main(
   // @location(0) fragUV: vec2<f32>,
    @location(0) fragPosition: vec4<f32>
  ) -> @location(0) vec4<f32> {
      return fragPosition;
  }`,
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
   // @location(1) uv : vec2<f32>
  ) -> VertexOutput {
    var output : VertexOutput;
    output.Position = uniforms.modelViewProjectionMatrix * position;
    //output.fragUV = uv;
    output.fragPosition = position;
    return output;
  }`,
  buffers: buffers,
  attributeBufferData: [
    quadBuffer,
  ],
  // attributes: {
  //   //uv: new webgpu.attribute(uv, 0, 2),
  //   position: new webgpu.attribute(
  //     cubeVertexArray, 0, 4),
  // },
  uniforms: {
    modelViewProjectionMatrix: getTransformationMatrix,
  },
  count: 6
})

setInterval(
  function () {
    drawCube({
    })
  }, 50
)
  
}

basic()