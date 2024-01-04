import utils from '../lib/utils'

import initWebGPU from '../lib/main'

const spriteWGSL = `@vertex
fn vert_main(
  @location(0) a_particlePos : vec2<f32>,
  @location(1) a_particleVel : vec2<f32>,
  @location(2) a_pos : vec2<f32>
) -> @builtin(position) vec4<f32> {
  let angle = -atan2(a_particleVel.x, a_particleVel.y);
  let pos = vec2(
    (a_pos.x * cos(angle)) - (a_pos.y * sin(angle)),
    (a_pos.x * sin(angle)) + (a_pos.y * cos(angle))
  );
  return vec4(pos + a_particlePos, 0.0, 1.0);
}

@fragment
fn frag_main() -> @location(0) vec4<f32> {
  return vec4(1.0, 1.0, 1.0, 1.0);
}
`;
const updateSpritesWGSL = `struct Particle {
  pos : vec2<f32>,
  vel : vec2<f32>,
}
struct SimParams {
  deltaT : f32,
  rule1Distance : f32,
  rule2Distance : f32,
  rule3Distance : f32,
  rule1Scale : f32,
  rule2Scale : f32,
  rule3Scale : f32,
}
struct Particles {
  particles : array<Particle>,
}
@binding(0) @group(0) var<uniform> params : SimParams;
@binding(1) @group(0) var<storage, read> particlesA : Particles;
@binding(2) @group(0) var<storage, read_write> particlesB : Particles;

// https://github.com/austinEng/Project6-Vulkan-Flocking/blob/master/data/shaders/computeparticles/particle.comp
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
  var index = GlobalInvocationID.x;

  var vPos = particlesA.particles[index].pos;
  var vVel = particlesA.particles[index].vel;
  var cMass = vec2(0.0);
  var cVel = vec2(0.0);
  var colVel = vec2(0.0);
  var cMassCount = 0u;
  var cVelCount = 0u;
  var pos : vec2<f32>;
  var vel : vec2<f32>;

  for (var i = 0u; i < arrayLength(&particlesA.particles); i++) {
    if (i == index) {
      continue;
    }

    pos = particlesA.particles[i].pos.xy;
    vel = particlesA.particles[i].vel.xy;
    if (distance(pos, vPos) < params.rule1Distance) {
      cMass += pos;
      cMassCount++;
    }
    if (distance(pos, vPos) < params.rule2Distance) {
      colVel -= pos - vPos;
    }
    if (distance(pos, vPos) < params.rule3Distance) {
      cVel += vel;
      cVelCount++;
    }
  }
  if (cMassCount > 0) {
    cMass = (cMass / vec2(f32(cMassCount))) - vPos;
  }
  if (cVelCount > 0) {
    cVel /= f32(cVelCount);
  }
  vVel += (cMass * params.rule1Scale) + (colVel * params.rule2Scale) + (cVel * params.rule3Scale);

  // clamp velocity for a more pleasing simulation
  vVel = normalize(vVel) * clamp(length(vVel), 0.0, 0.1);
  // kinematic update
  vPos = vPos + (vVel * params.deltaT);
  // Wrap around boundary
  if (vPos.x < -1.0) {
    vPos.x = 1.0;
  }
  if (vPos.x > 1.0) {
    vPos.x = -1.0;
  }
  if (vPos.y < -1.0) {
    vPos.y = 1.0;
  }
  if (vPos.y > 1.0) {
    vPos.y = -1.0;
  }
  // Write back
  particlesB.particles[index].pos = vPos;
  particlesB.particles[index].vel = vVel;
}
`
const init = async () => {  
  const webGPU = await initWebGPU()
  const device = webGPU.device;
  const buffers = [
    {
      // instanced particles buffer
      arrayStride: 4 * 4,
      stepMode: 'instance',
      attributes: [
        {
          // instance position
          shaderLocation: 0,
          offset: 0,
          format: 'float32x2',
        },
        {
          // instance velocity
          shaderLocation: 1,
          offset: 2 * 4,
          format: 'float32x2',
        },
      ],
    },
    {
      // vertex buffer
      arrayStride: 2 * 4,
      stepMode: 'vertex',
      attributes: [
        {
          // vertex positions
          shaderLocation: 2,
          offset: 0,
          format: 'float32x2',
        },
      ],
    },
  ]

  const vertexBufferData = new Float32Array([
    -0.01, -0.02, 0.01,
    -0.02, 0.0, 0.02,
  ]);

  const spriteVertexBuffer = utils.makeBuffer(device, vertexBufferData.length * 4, 'VERTEX', vertexBufferData, Float32Array)

  const simParams = {
    deltaT: 0.04,
    rule1Distance: 0.1,
    rule2Distance: 0.025,
    rule3Distance: 0.025,
    rule1Scale: 0.02,
    rule2Scale: 0.05,
    rule3Scale: 0.005,
  };

  const simParamBufferSize = 7 * Float32Array.BYTES_PER_ELEMENT;
  const simParamBuffer = device.createBuffer({
    size: simParamBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  function updateSimParams() {
    device.queue.writeBuffer(
      simParamBuffer,
      0,
      new Float32Array([
        simParams.deltaT,
        simParams.rule1Distance,
        simParams.rule2Distance,
        simParams.rule3Distance,
        simParams.rule1Scale,
        simParams.rule2Scale,
        simParams.rule3Scale,
      ])
    );
  }

  updateSimParams();
 
  const numParticles = 1500;
  const initialParticleData = new Float32Array(numParticles * 4);
  for (let i = 0; i < numParticles; ++i) {
    initialParticleData[4 * i + 0] = 2 * (Math.random() - 0.5);
    initialParticleData[4 * i + 1] = 2 * (Math.random() - 0.5);
    initialParticleData[4 * i + 2] = 2 * (Math.random() - 0.5) * 0.1;
    initialParticleData[4 * i + 3] = 2 * (Math.random() - 0.5) * 0.1;
  }

  const particleBuffers = new Array(2);
  const particleBindGroups = new Array(2);
  for (let i = 0; i < 2; ++i) {
    particleBuffers[i] = device.createBuffer({
      size: initialParticleData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
      mappedAtCreation: true,
    });
    new Float32Array(particleBuffers[i].getMappedRange()).set(
      initialParticleData
    );
    particleBuffers[i].unmap();
  }

  let t = 0
  const compute = webGPU.initComputeCall({
    code: updateSpritesWGSL,
    bindGroups: function (state, computePipeline) {
        for (let i = 0; i < 2; ++i) {
            particleBindGroups[i] = utils.makeBindGroup(
                device,
                computePipeline.getBindGroupLayout(0),
                [simParamBuffer, particleBuffers[i], particleBuffers[(i + 1) % 2]]
            )
          }
        return particleBindGroups
    },
    exec: function (state) {
        const computePipeline = state.computePass.pipeline
        t = t + 1
        t = t % 2
        const device = state.device;
        console.log(state)
        state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();
        const passEncoder = state.ctx.commandEncoder.beginComputePass();
        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, particleBindGroups[t]);
        passEncoder.dispatchWorkgroups(Math.ceil(numParticles / 64));
        passEncoder.end();
    }
  })

  const draw = await webGPU.initDrawCall({
    shader: { code: spriteWGSL,
        fragEntryPoint: "frag_main",
        vertEntryPoint: "vert_main"
    },
    attributeBuffers: buffers,
    attributeBufferData: [
        particleBuffers[0],
        spriteVertexBuffer
    ],
    // attributes: {
    //     stuff: initialParticleData,
    //     vertexBufferData
    // },
    instances: numParticles,
    count: 3
  });

  function frame() {
    compute()
    draw()
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

export default init