import simpleWebgpuInit from '../lib/main';
import { mat4, vec3 } from 'https://unpkg.com/gl-matrix@3.1.0/esm/index.js';
//faux lighting
//collision detectiony
//3d camera 

// //take a cube and modulate vertices to audio
// //take a cube fill it with particles and then modulate with water physics

let webgpu = await simpleWebgpuInit()
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 4 * 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

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


function makeBuffer () {
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
  
  gpuBuffer.unmap();
  return gpuBuffer
}
const posBuffer = makeBuffer()
const velocityBuffer = makeBuffer()


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

const buffers = [
  {
      attributes: [
          {
              shaderLocation: 0,
              offset: 0,
              format: "float32x4",
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
  code: `
  struct Velocity {
    velocity: vec4<f32>,
  }
  struct Particle {
      position: vec4<f32>,
  };

  struct PositionBuffer {
      particles: array<Particle>,
  };

  struct VelocityBuffer {
    velocities: array<Velocity>,
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

@group(0) @binding(0) var<storage,read_write> particlesStorage: PositionBuffer;
@group(0) @binding(1) var<storage,read_write> velocityStorage: VelocityBuffer;

@group(0) @binding(2) var<uniform> uniforms: Uniforms;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;

    var particle = particlesStorage.particles[index];
    var velocity = velocityStorage.velocities[index];
    var aspectRatioStuff = uniforms.aspectRatio;

    //let applyAspectRatio = vec4<f32>(uniforms.aspectRatio);

    // var force: vec2<f32> = uniforms.force * applyAspectRatio;
    // for (var i = 0u; i < uniforms.attractorsCount; i = i + 1u) {
    //     var toAttractor: vec2<f32> = (uniforms.attractors[i].position - particle.position) * applyAspectRatio;
    //     let squaredDistance: f32 = dot(toAttractor, toAttractor);
    //     force = force + uniforms.attractors[i].force * toAttractor / (squaredDistance + 0.01);
    // }

    // particle.velocity = uniforms.friction * (particle.velocity + uniforms.dt * force);
    velocity.velocity.y = -.01;
    particle.position.y = particle.position.y + velocity.velocity.y;

    // if (uniforms.bounce != 0u) {
    //     if (particle.position.x < -1.0) {
    //         particle.position.x = -2.0 - particle.position.x;
    //         particle.velocity.x = -particle.velocity.x;
    //     }
    //     if (particle.position.y < -1.0) {
    //         particle.position.y = -2.0 - particle.position.y;
    //         particle.velocity.y = -particle.velocity.y;
    //     }

    //     if (particle.position.x > 1.0) {
    //         particle.position.x = 2.0 - particle.position.x;
    //         particle.velocity.x = -particle.velocity.x;
    //     }
    //     if (particle.position.y > 1.0) {
    //         particle.position.y = 2.0 - particle.position.y;
    //         particle.velocity.y = -particle.velocity.y;
    //     }
    // }

    

    particlesStorage.particles[index] = particle;
    velocityStorage.velocities[index] = velocity;

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
                  buffer: posBuffer
              }
          },
          {
            binding: 1,
            resource: {
              buffer: velocityBuffer
            }
          },
          {
              binding: 2,
              resource: {
                  buffer: computeUniformsBuffer
              }
          },
  
      ]
  });

  return [computeBindgroup]
  }
})
const device = webgpu.device
const aspect = 1
const eyePosition = vec3.fromValues(0, 50, -100);
const upVector = vec3.fromValues(0, 1, 0);
const origin = vec3.fromValues(0, 0, 0);

const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 2000.0);

const viewMatrix = mat4.create();
mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

const viewProjMatrix = mat4.create();
mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);

// Move the model so it's centered.
const modelMatrix = mat4.create();
mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -5, 0));
mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -40, 0));

function getCameraViewProjMatrix() {
  const eyePosition = vec3.fromValues(0, 50, -100);

  const rad = Math.PI * (Date.now() / 5);
  vec3.rotateY(eyePosition, eyePosition, origin, rad);

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

  mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);
  return viewProjMatrix;
}


async function basic () {
  const cameraViewProj = getCameraViewProjMatrix();
  device.queue.writeBuffer(
    cameraUniformBuffer,
    0,
    cameraViewProj.buffer,
    cameraViewProj.byteOffset,
    cameraViewProj.byteLength
  );

// Calling simplewebgpu.init() creates a new partially evaluated draw command
const blend = {
  color: {
    srcFactor: 'src-alpha',
    dstFactor: 'one',
    operation: 'add',
  },
  alpha: {
    srcFactor: 'zero',
    dstFactor: 'one',
    operation: 'add',
  },
}

const drawCube = await webgpu.initDrawCall({
  shader: {
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct Camera {
  viewProjectionMatrix : mat4x4<f32>,
}

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.position =  vec4<f32>(inPosition.xy + (.03 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
    
//    camera.viewProjectionMatrix *      
//     vec4<f32>(inPosition.xy + (10. + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
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
    var viewDir = vec3<f32>(0,0,0);
    var lightSpecularColor = vec3<f32>(1);
    var lightSpecularPower = 1.;
    var lightPosition = vec3<f32>(-1,-1, 0);
    var lightDir = lightPosition - vec3<f32>(localPosition, 1.); //3D position in space of the surface
		var distance = length(lightDir);
		lightDir = lightDir / distance; // = normalize(lightDir);
		distance = distance * distance; //This line may be optimised using Inverse square root
    var normal = vec3(-1.,-1., 0.);
		//Intensity of the diffuse light. Saturate to keep within the 0-1 range.
		var NdotL = dot(normal, lightDir);
		var intensity = saturate(NdotL);

		// Calculate the diffuse light factoring in light color, power and the attenuation
		//OUT.Diffuse = intensity * light.diffuseColor * light.diffusePower / distance;

		//Calculate the half vector between the light vector and the view vector.
		//This is typically slower than calculating the actual reflection vector
		// due to the normalize function's reciprocal square root
		var H = normalize(lightDir + viewDir);

		//Intensity of the specular light
		var NdotH = dot(normal, H);
		//intensity = pow(saturate(NdotH), specularHardness);

		//Sum up the specular light factoring
		let col = vec4<f32>(1. * lightSpecularColor * lightSpecularPower / distance, 1.);

    return  col + vec4<f32>(distanceFromCenter - 1.5, 0,1.,1);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    posBuffer, quadBuffer,
  ],
  count: 6,
  blend,
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
          },
          // {
          //   binding: 1,
          //   resource: {
          //     buffer: cameraUniformBuffer
          //   }
          // }
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


// camera technique https://github.com/jrprice/NBody-WebGPU/blob/main/src/shaders.wgsl