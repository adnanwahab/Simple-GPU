import { makeCanvas, mustHave } from './boilerplate';
const NUM_SPECIES = 4;
const NUM_PARTICLES = 1 << 13;
const BG_COLOR = { r: 0.00392, g: 0.0863, b: 0.153, a: 1.0 };
const PARTICLE_COLORS = [
    [0.969, 0.0902, 0.208],
    [0.255, 0.918, 0.831],
    [0.992, 1, 0.988],
    [1, 0.624, 0.11]
];
const PARTICLE_MASS = 4;
const PARTICLE_SIZE = 0.001;
const COUPLING_COEFFS = new Float32Array(NUM_SPECIES * NUM_SPECIES);
for (let i = 0; i < COUPLING_COEFFS.length; ++i) {
    COUPLING_COEFFS[i] = (Math.random() - 0.5) * Math.random();
}
async function main() {
    const adapter = mustHave(await navigator.gpu.requestAdapter());
    const device = await adapter.requestDevice();
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const canvas = makeCanvas();
    const context = mustHave(canvas.getContext('webgpu'));
    context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'opaque',
    });
    const integrateModule = device.createShaderModule({
        code: `
struct Uniforms {
  aspect : f32,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

@binding(0) @group(1) var<storage, read_write> nextPosition : array<vec2<f32>>;
@binding(1) @group(1) var<storage, read_write> prevPosition : array<vec2<f32>>;
@binding(2) @group(1) var<storage, read_write> force : array<vec2<f32>>;

@compute @workgroup_size(64)
fn integrate(@builtin(global_invocation_id) threadId : vec3<u32>) {
  var index = threadId.x;
  var p1 = nextPosition[index];
  var p0 = prevPosition[index];
  var f = force[index];

  var v = 0.98 * (p1 - p0 + 0.0001 * f * ${1 / PARTICLE_MASS});
  var p2 = p1 + v;

  if p2.x < -1. {
    v.x = -v.x;
    p2.x = -1.;
  }
  if p2.x > 1. {
    v.x = -v.x;
    p2.x = 1.;
  }
  if p2.y < -uniforms.aspect {
    v.y = -v.y;
    p2.y = -uniforms.aspect;
  }
  if p2.y > uniforms.aspect {
    v.y = -v.y;
    p2.y = uniforms.aspect;
  }

  nextPosition[index] = p2;
  prevPosition[index] = p1;
  force[index] = vec2(0., 0.);
}
`
    });
    const integratePipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
            module: integrateModule,
            entryPoint: 'integrate',
        },
    });
    const interactionModule = device.createShaderModule({
        code: `
@binding(0) @group(0) var<storage, read> aPosition : array<vec2<f32>>;
@binding(1) @group(0) var<storage, read_write> aForce : array<vec2<f32>>;

struct Uniforms {
  coupling : f32,
};
@binding(0) @group(1) var<uniform> uniforms : Uniforms;
@binding(1) @group(1) var<storage, read> bPosition : array<vec2<f32>>;

var<workgroup> readPositions : array<vec2<f32>, 64>;

@compute @workgroup_size(64)
fn compute_coupling(
  @builtin(global_invocation_id) GlobalInvocationId : vec3<u32>,
  @builtin(local_invocation_id) LocalInvocationId : vec3<u32>) {
  var particleId = GlobalInvocationId.x;
  var workId = LocalInvocationId.x;

  var p = aPosition[particleId];
  var f = vec2(0., 0.);

  for (var i : u32 = 0; i < ${NUM_PARTICLES}; i = i + 64) {
    readPositions[workId] = bPosition[i + workId];
    workgroupBarrier();

    for (var j : u32  = 0; j < 64; j = j + 1) {
      var d = p - readPositions[j];
      var r = length(d);
      if r > 0.001 && r < 0.1 {
        f += d / r;
      }
    }
  }

  aForce[particleId] = aForce[particleId] + uniforms.coupling * f;
}
`
    });
    const interactionPipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
            module: interactionModule,
            entryPoint: 'compute_coupling',
        },
    });
    const renderModule = device.createShaderModule({
        code: `
struct Uniforms {
  color : vec4<f32>,
  particleSize : f32,
  aspect : f32,
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;
@binding(1) @group(0) var<storage, read> particlePositions : array<vec2<f32>>;

struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) pointCoord : vec2<f32>
}

@vertex
fn vertMain(
  @builtin(instance_index) instanceIdx : u32,
  @location(0) uv : vec2<f32>,
) -> VertexOutput {
  var pos = particlePositions[instanceIdx];

  var result : VertexOutput;
  result.clipPosition = vec4(
    pos.x + uniforms.particleSize * uv.x, 
    uniforms.aspect * (pos.y + uniforms.particleSize * uv.y),
    0.,
    1.);
  result.pointCoord = uv;
  return result;
}
  
@fragment
fn fragMain(
  @location(0) pointCoord : vec2<f32>
) -> @location(0) vec4<f32> {
  let r = length(pointCoord); 
  if r > 0.99 {
    discard;
  }
  return uniforms.color;
}`
    });
    const renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: renderModule,
            entryPoint: 'vertMain',
            buffers: [{
                    arrayStride: 2 * 4,
                    attributes: [{
                            shaderLocation: 0,
                            offset: 0,
                            format: 'float32x2',
                        }]
                }]
        },
        fragment: {
            module: renderModule,
            entryPoint: 'fragMain',
            targets: [{ format: presentationFormat }],
        },
        primitive: {
            topology: 'triangle-strip',
        },
    });
    const spriteQuadUV = device.createBuffer({
        size: 2 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true
    });
    new Float32Array(spriteQuadUV.getMappedRange()).set([
        -1, -1,
        -1, 1,
        1, -1,
        1, 1,
    ]);
    spriteQuadUV.unmap();
    const species = PARTICLE_COLORS.map((color, index) => {
        const renderUniformBuffer = device.createBuffer({
            size: 1024,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true
        });
        const renderUniformData = new Float32Array(renderUniformBuffer.getMappedRange());
        renderUniformData.set(color);
        renderUniformData[3] = 1;
        renderUniformData[4] = PARTICLE_SIZE;
        renderUniformData[5] = canvas.width / canvas.height;
        renderUniformBuffer.unmap();
        const positionBuffers = [];
        const bufferState = [];
        for (let j = 0; j < 2; ++j) {
            const buf = device.createBuffer({
                size: 2 * NUM_PARTICLES * 4,
                usage: GPUBufferUsage.STORAGE,
                mappedAtCreation: true
            });
            positionBuffers.push(buf);
            bufferState.push(new Float32Array(buf.getMappedRange()));
        }
        for (let k = 0; k < 2 * NUM_PARTICLES; ++k) {
            bufferState[0][k] = bufferState[1][k] = Math.random() - 0.5;
        }
        positionBuffers[0].unmap();
        positionBuffers[1].unmap();
        const forceBuffer = device.createBuffer({
            size: 2 * NUM_PARTICLES * 4,
            usage: GPUBufferUsage.STORAGE,
        });
        const renderBindGroup = device.createBindGroup({
            layout: renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: renderUniformBuffer,
                    }
                },
                {
                    binding: 1,
                    resource: {
                        offset: 0,
                        size: 2 * NUM_PARTICLES * 4,
                        buffer: positionBuffers[0]
                    }
                }
            ]
        });
        const integrateBindGroup = device.createBindGroup({
            layout: integratePipeline.getBindGroupLayout(1),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: positionBuffers[0]
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: positionBuffers[1]
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: forceBuffer
                    }
                }
            ]
        });
        const interactionOuterGroup = device.createBindGroup({
            layout: interactionPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: positionBuffers[0],
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: forceBuffer
                    }
                }
            ]
        });
        const interactionBindGroups = [];
        return {
            renderBindGroup,
            integrateBindGroup,
            positionBuffers,
            forceBuffer,
            interactionBindGroups,
            interactionOuterGroup
        };
    });
    const integrateUniformData = new Float32Array([canvas.width / canvas.height]);
    const integrateUniformBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const integrateUniformBindGroup = device.createBindGroup({
        layout: integratePipeline.getBindGroupLayout(0),
        entries: [{
                binding: 0,
                resource: {
                    buffer: integrateUniformBuffer
                }
            }]
    });
    species.forEach((aSpecies, i) => {
        aSpecies.interactionBindGroups = species.map((bSpecies, j) => {
            const interactionUniformBuffer = device.createBuffer({
                size: 4,
                usage: GPUBufferUsage.UNIFORM,
                mappedAtCreation: true
            });
            new Float32Array(interactionUniformBuffer.getMappedRange()).set([
                COUPLING_COEFFS[4 * i + j]
            ]);
            interactionUniformBuffer.unmap();
            return device.createBindGroup({
                layout: interactionPipeline.getBindGroupLayout(1),
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: interactionUniformBuffer,
                        }
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: bSpecies.positionBuffers[0]
                        }
                    }
                ]
            });
        });
    });
    function frame() {
        const commandEncoder = device.createCommandEncoder();
        { // integrate particles
            integrateUniformData[0] = canvas.height / canvas.width;
            device.queue.writeBuffer(integrateUniformBuffer, 0, integrateUniformData.buffer, 0, integrateUniformData.byteLength);
            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(integratePipeline);
            passEncoder.setBindGroup(0, integrateUniformBindGroup);
            species.forEach(({ integrateBindGroup }) => {
                passEncoder.setBindGroup(1, integrateBindGroup);
                passEncoder.dispatchWorkgroups(Math.ceil(NUM_PARTICLES / 64));
            });
            passEncoder.end();
        }
        { // render particles
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: context.getCurrentTexture().createView(),
                        clearValue: BG_COLOR,
                        loadOp: 'clear',
                        storeOp: 'store',
                    }
                ]
            });
            passEncoder.setPipeline(renderPipeline);
            passEncoder.setVertexBuffer(0, spriteQuadUV);
            species.forEach(({ renderBindGroup }) => {
                passEncoder.setBindGroup(0, renderBindGroup);
                passEncoder.draw(4, NUM_PARTICLES);
            });
            passEncoder.end();
        }
        { // apply pairwise interactions
            const passEncoder = commandEncoder.beginComputePass();
            passEncoder.setPipeline(interactionPipeline);
            species.forEach(({ interactionBindGroups, interactionOuterGroup }) => {
                passEncoder.setBindGroup(0, interactionOuterGroup);
                interactionBindGroups.forEach((group) => {
                    passEncoder.setBindGroup(1, group);
                    passEncoder.dispatchWorkgroups(Math.ceil(NUM_PARTICLES / 64));
                });
            });
            passEncoder.end();
        }
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function demo() {
    main().catch(err => console.error(err));
}

export default demo
