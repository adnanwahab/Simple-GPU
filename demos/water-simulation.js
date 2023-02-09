//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../lib/main';
import { mat4, vec3 } from 'https://unpkg.com/gl-matrix@3.1.0/esm/index.js';
//import simplegpu from "https://cdn.jsdelivr.net/npm/simple-gpu/+esm";

// //take a cube and modulate vertices to audio
// //take a cube fill it with particles and then modulate with water physics
let webgpu = await simpleWebgpuInit()

const attractors = []
  const attractor = {
      position: [0, 0],
      force: .1 * .1,
  };
  attractor.position[0] = 0
  attractor.position[1] = 0
  attractors.push(attractor);



function buildComputeUniforms(dt, aspectRatio, force, attractors) {
  const buffer = new ArrayBuffer(96);

  new Float32Array(buffer, 0, 2).set([force[0], force[1]]);
  new Float32Array(buffer, 8, 1).set([dt]);
  new Uint32Array(buffer, 12, 1).set([ 3 ]);
  new Float32Array(buffer, 16, 1).set([0.5]);
  new Float32Array(buffer, 20, 1).set([0]);
  new Uint32Array(buffer, 24, 1).set([attractors.length]);

  const attractorsData = [];
  for (const attractor of attractors) {
      attractorsData.push(attractor.position[0]);
      attractorsData.push(attractor.position[1]);
      attractorsData.push(attractor.force);
      attractorsData.push(0); // padding
  }
  new Float32Array(buffer, 32, attractorsData.length).set(attractorsData);

  return buffer;
}


const particlesCount = 1e5
const particleSize = 16

const gpuBufferSize = particlesCount * particleSize;

const gpuBuffer = webgpu.device.createBuffer({
  size: gpuBufferSize,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
  mappedAtCreation: true,
});

const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
for (let iParticle = 0; iParticle < particlesCount; iParticle++) {
    particlesBuffer[4 * iParticle + 0] = Math.random() * 2 - 1;
    particlesBuffer[4 * iParticle + 1] = Math.random() * 2 - 1;
    particlesBuffer[4 * iParticle + 2] = 1
    particlesBuffer[4 * iParticle + 3] = -1
}

async function cool(CReadCopy, n) {
  const C = new Float32Array(n * n)

  // const CReadCopy = device.createBuffer({
  //   size: m * n * 4, 
  //   usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
  // })
  await CReadCopy.mapAsync(GPUMapMode.READ);
  c.set(new Float32Array(CReadCopy.getMappedRange()))
  CReadCopy.unmap()
  return c
} 

gpuBuffer.unmap();

const quadBuffer = webgpu.device.createBuffer({
  size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
  usage: GPUBufferUsage.VERTEX,
  mappedAtCreation: true,
});
new Float32Array(quadBuffer.getMappedRange()).set([
  -1, -1, +1, -1, +1, +1,
  -1, -1, +1, +1, -1, +1
]);
quadBuffer.unmap();

const computeUniformsBuffer = webgpu.device.createBuffer({
  size: 96,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});

const now = Date.now() 
setInterval(function () {
  const elapsed = (Date.now() - now ) * .000001
  const uniformsBufferData = buildComputeUniforms(elapsed, .1, [.5, .5], attractors)
  webgpu.device.queue.writeBuffer(computeUniformsBuffer, 0, uniformsBufferData);
}, 100)


// function reset(wantedParticlesCount) {
//   let particleBatches = []
//   for (const particlesBatch of particleBatches) {
//       if (particlesBatch.gpuBuffer) {
//           particlesBatch.gpuBuffer.destroy();
//       }
//       if (particlesBatch.colorsBuffer) {
//           particlesBatch.colorsBuffer.destroy();
//       }
//   }
//   particleBatches.length = 0;

//   let totalGpuBufferSize = 0, totalColorBufferSize = 0;

//   const particleSize = Float32Array.BYTES_PER_ELEMENT * (2 + 2);
//   const maxDispatchSize = Math.floor(WebGPU.device.limits.maxStorageBufferBindingSize / particleSize / Engine.WORKGROUP_SIZE);

//   let particlesLeftToAllocate = wantedParticlesCount;
//   while (particlesLeftToAllocate > 0) {
//       const idealDispatchSize = Math.ceil(particlesLeftToAllocate / Engine.WORKGROUP_SIZE);

//       const dispatchSize = Math.min(idealDispatchSize, maxDispatchSize);
//       const particlesCount = dispatchSize * Engine.WORKGROUP_SIZE;
//       particlesLeftToAllocate -= particlesCount;

//       const gpuBufferSize = particlesCount * particleSize;
//       const gpuBuffer = WebGPU.device.createBuffer({
//           size: gpuBufferSize,
//           usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
//           mappedAtCreation: true,
//       });
//       totalGpuBufferSize += gpuBufferSize;
//       const colorsBufferSize = particlesCount * Uint32Array.BYTES_PER_ELEMENT;
//       const colorsGpuBuffer = WebGPU.device.createBuffer({
//           size: colorsBufferSize,
//           usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
//           mappedAtCreation: false,
//       });
//       totalColorBufferSize += colorsBufferSize;



//       const computeBindgroup = webgpu.device.createBindGroup({
//           layout: this.computePipeline.getBindGroupLayout(0),
//           entries: [
//               {
//                   binding: 0,
//                   resource: {
//                       buffer: gpuBuffer
//                   }
//               },
//               {
//                   binding: 1,
//                   resource: {
//                       buffer: this.computeUniformsBuffer
//                   }
//               }
//           ]
//       });

//       const initializeColorsComputeBindgroup = webgpu.device.createBindGroup({
//           layout: this.initializeColorsComputePipeline.getBindGroupLayout(0),
//           entries: [
//               {
//                   binding: 0,
//                   resource: {
//                       buffer: gpuBuffer
//                   }
//               },
//               {
//                   binding: 1,
//                   resource: {
//                       buffer: colorsGpuBuffer
//                   }
//               }
//           ]
//       });
//       particleBatches.push({
//           gpuBuffer,
//           computeBindgroup,
//           colorsBuffer: colorsGpuBuffer,
//           initializeColorsComputeBindgroup,
//           particlesCount,
//           dispatchSize,
//       });
//   }
// }

const buffers = [
  {
      attributes: [
          {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
      stepMode: "instance",
  },
  {
      attributes: [
          {
              shaderLocation: 1,
              offset: 0,
              format: "float32x2",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
      stepMode: "vertex",
  }
]


const compute = webgpu.initComputeCall({
  code: `struct Particle {
    position: vec2<f32>,
    velocity: vec2<f32>
};

struct ParticlesBuffer {
    particles: array<Particle>,
};

struct Attractor {                                 //             align(8)  size(16)
    position: vec2<f32>,                           // offset(0)   align(8)  size(8)
    force: f32,                                    // offset(8)   align(4)  size(4)
    // -- implicit padding --                      // offset(12)            size(4)
};

struct Uniforms {                                  //             align(8)  size(48)
    force: vec2<f32>,                              // offset(0)   align(8)  size(8)
    dt: f32,                                       // offset(8)   align(4)  size(4)
    bounce: u32,                                   // offset(12)  align(4)  size(4)

    friction: f32,                                 // offset(16)  align(4)  size(4)
    aspectRatio: f32,                              // offset(20)  align(4)  size(4)
    attractorsCount: u32,                          // offset(24)  align(4)  size(4)
    // -- implicit padding --                      // offset(28)            size(4)
    @align(16) attractors: array<Attractor, 1>,    // offset(32)  align(16) size(16) stride(16)
};

@group(0) @binding(0) var<storage,read_write> particlesStorage: ParticlesBuffer;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;

    var particle = particlesStorage.particles[index];

    let applyAspectRatio = vec2<f32>(uniforms.aspectRatio, 1.0);

    var force: vec2<f32> = uniforms.force * applyAspectRatio;
    for (var i = 0u; i < uniforms.attractorsCount; i = i + 1u) {
        var toAttractor: vec2<f32> = (uniforms.attractors[i].position - particle.position) * applyAspectRatio;
        let squaredDistance: f32 = dot(toAttractor, toAttractor);
        force = force + uniforms.attractors[i].force * toAttractor / (squaredDistance + 0.01);
    }

    particle.velocity = uniforms.friction * (particle.velocity + uniforms.dt * force);
    particle.velocity.y = -.001;
    particle.position = particle.position + particle.velocity * applyAspectRatio;

    if (uniforms.bounce != 0u) {
        if (particle.position.x < -1.0) {
            particle.position.x = -2.0 - particle.position.x;
            particle.velocity.x = -particle.velocity.x;
        }
        if (particle.position.y < -1.0) {
            particle.position.y = -2.0 - particle.position.y;
            particle.velocity.y = -particle.velocity.y;
        }

        if (particle.position.x > 1.0) {
            particle.position.x = 2.0 - particle.position.x;
            particle.velocity.x = -particle.velocity.x;
        }
        if (particle.position.y > 1.0) {
            particle.position.y = 2.0 - particle.position.y;
            particle.velocity.y = -particle.velocity.y;
        }
    }

    particlesStorage.particles[index] = particle;
}`,
exec: function (state){
  const device =  state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(1000);
  computePass.end();
} ,
  bindGroups: function (state, computePipeline) {


    const computeBindgroup = webgpu.device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
          {
              binding: 0,
              resource: {
                  buffer: gpuBuffer
              }
          },
          {
              binding: 1,
              resource: {
                  buffer: computeUniformsBuffer
              }
          }
      ]
  });

  return [computeBindgroup]
  }
})



async function basic () {
// Calling simplewebgpu.init() creates a new partially evaluated draw command

const drawCube = await webgpu.initDrawCall({
  shader: {
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@vertex
fn main_vertex(@location(0) inPosition: vec2<f32>, @location(1) quadCorner: vec2<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.position = vec4<f32>(inPosition + (.004 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
    vsOut.position.y = vsOut.position.y;
    vsOut.localPosition = quadCorner;
    return vsOut;
}

@fragment
fn main_fragment(@location(0) localPosition: vec2<f32>) -> @location(0) vec4<f32> {
    let distanceFromCenter: f32 = length(localPosition);
    if (distanceFromCenter > 1.0) {
        discard;
    }

    return vec4<f32>(0,0,1.,.1);
}`},
  // attributes: {
  //   //uv: new webgpu.attribute(uv, 0, 2),
  // },
  attributeBuffers: buffers,
  attributeBufferData: [
    gpuBuffer, quadBuffer,
    
  ],
  count: 6,
  instances: particlesCount ,
  bindGroup: function ({pipeline}) {
    const uniformsBuffer = webgpu.device.createBuffer({
      size: 32, 
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
    return webgpu.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
          {
              binding: 0,
              resource: {
                  buffer: uniformsBuffer,
              }
          }
      ]
  });
  }
})

setInterval(
  function () {
    compute()
    drawCube({})
  }, 50
)
  
}

export default basic