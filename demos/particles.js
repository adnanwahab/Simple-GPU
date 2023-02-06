import { mat4, vec3 } from 'gl-matrix';
import initWebGPU from '../lib/main';
import utils from '../lib/utils';


const particleWGSL = `var<private> rand_seed : vec2<f32>;

fn rand() -> f32 {
  rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);
  rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);
  return rand_seed.y;
}

////////////////////////////////////////////////////////////////////////////////
// Vertex shader
////////////////////////////////////////////////////////////////////////////////
struct RenderParams {
  modelViewProjectionMatrix : mat4x4<f32>,
  right : vec3<f32>,
  up : vec3<f32>
}
@binding(0) @group(0) var<uniform> render_params : RenderParams;

struct VertexInput {
  @location(0) position : vec3<f32>,
  @location(1) color : vec4<f32>,
  @location(2) quad_pos : vec2<f32>, // -1..+1
}

struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) color : vec4<f32>,
  @location(1) quad_pos : vec2<f32>, // -1..+1
}

@vertex
fn vs_main(in : VertexInput) -> VertexOutput {
  var quad_pos = mat2x3<f32>(render_params.right, render_params.up) * in.quad_pos;
  var position = in.position + quad_pos * 0.01;
  var out : VertexOutput;
  out.position = render_params.modelViewProjectionMatrix * vec4<f32>(position, 1.0);
  out.color = in.color;
  out.quad_pos = in.quad_pos;
  return out;
}

////////////////////////////////////////////////////////////////////////////////
// Fragment shader
////////////////////////////////////////////////////////////////////////////////
@fragment
fn fs_main(in : VertexOutput) -> @location(0) vec4<f32> {
  var color = in.color;
  // Apply a circular particle alpha mask
  color.a = color.a * max(1.0 - length(in.quad_pos), 0.0);
  return color;
}

////////////////////////////////////////////////////////////////////////////////
// Simulation Compute shader
////////////////////////////////////////////////////////////////////////////////
struct SimulationParams {
  deltaTime : f32,
  seed : vec4<f32>,
}

struct Particle {
  position : vec3<f32>,
  lifetime : f32,
  color    : vec4<f32>,
  velocity : vec3<f32>,
}

struct Particles {
  particles : array<Particle>,
}

@binding(0) @group(0) var<uniform> sim_params : SimulationParams;
@binding(1) @group(0) var<storage, read_write> data : Particles;
@binding(2) @group(0) var texture : texture_2d<f32>;

@compute @workgroup_size(64)
fn simulate(
  @builtin(global_invocation_id) GlobalInvocationID : vec3<u32>
) {
  rand_seed = (sim_params.seed.xy + vec2<f32>(GlobalInvocationID.xy)) * sim_params.seed.zw;

  let idx = GlobalInvocationID.x;
  var particle = data.particles[idx];

  // Apply gravity
  particle.velocity.z = particle.velocity.z - sim_params.deltaTime * 0.5;

  // Basic velocity integration
  particle.position = particle.position + sim_params.deltaTime * particle.velocity;

  // Age each particle. Fade out before vanishing.
  particle.lifetime = particle.lifetime - sim_params.deltaTime;
  particle.color.a = smoothstep(0.0, 0.5, particle.lifetime);

  // If the lifetime has gone negative, then the particle is dead and should be
  // respawned.
  if (particle.lifetime < 0.0) {
    // Use the probability map to find where the particle should be spawned.
    // Starting with the 1x1 mip level.
    var coord : vec2<i32>;
    for (var level = u32(textureNumLevels(texture) - 1); level > 0; level--) {
      // Load the probability value from the mip-level
      // Generate a random number and using the probabilty values, pick the
      // next texel in the next largest mip level:
      //
      // 0.0    probabilites.r    probabilites.g    probabilites.b   1.0
      //  |              |              |              |              |
      //  |   TOP-LEFT   |  TOP-RIGHT   | BOTTOM-LEFT  | BOTTOM_RIGHT |
      //
      let probabilites = textureLoad(texture, coord, level);
      let value = vec4<f32>(rand());
      let mask = (value >= vec4<f32>(0.0, probabilites.xyz)) & (value < probabilites);
      coord = coord * 2;
      coord.x = coord.x + select(0, 1, any(mask.yw)); // x  y
      coord.y = coord.y + select(0, 1, any(mask.zw)); // z  w
    }
    let uv = vec2<f32>(coord) / vec2<f32>(textureDimensions(texture));
    particle.position = vec3<f32>((uv - 0.5) * 3.0 * vec2<f32>(1.0, -1.0), 0.0);
    particle.color = textureLoad(texture, coord, 0);
    particle.velocity.x = (rand() - 0.5) * 0.1;
    particle.velocity.y = (rand() - 0.5) * 0.1;
    particle.velocity.z = rand() * 0.3;
    particle.lifetime = 0.5 + rand() * 2.0;
  }

  // Store the new particle value
  data.particles[idx] = particle;
}
`



const probabilityMapWGSL = `
struct UBO {
  width : u32,
}

struct Buffer {
  weights : array<f32>,
}

@binding(0) @group(0) var<uniform> ubo : UBO;
@binding(1) @group(0) var<storage, read> buf_in : Buffer;
@binding(2) @group(0) var<storage, read_write> buf_out : Buffer;
@binding(3) @group(0) var tex_in : texture_2d<f32>;
@binding(3) @group(0) var tex_out : texture_storage_2d<rgba8unorm, write>;


////////////////////////////////////////////////////////////////////////////////
// import_level
//
// Loads the alpha channel from a texel of the source image, and writes it to
// the buf_out.weights.
////////////////////////////////////////////////////////////////////////////////
@compute @workgroup_size(64)
fn import_level(@builtin(global_invocation_id) coord : vec3<u32>) {
  _ = &buf_in;
  let offset = coord.x + coord.y * ubo.width;
  buf_out.weights[offset] = textureLoad(tex_in, vec2<i32>(coord.xy), 0).w;
}

////////////////////////////////////////////////////////////////////////////////
// export_level
//
// Loads 4 f32 weight values from buf_in.weights, and stores summed value into
// buf_out.weights, along with the calculated 'probabilty' vec4 values into the
// mip level of tex_out. See simulate() in particle.wgsl to understand the
// probability logic.
////////////////////////////////////////////////////////////////////////////////
@compute @workgroup_size(64)
fn export_level(@builtin(global_invocation_id) coord : vec3<u32>) {
  if (all(coord.xy < vec2<u32>(textureDimensions(tex_out)))) {
    let dst_offset = coord.x    + coord.y    * ubo.width;
    let src_offset = coord.x*2u + coord.y*2u * ubo.width;

    let a = buf_in.weights[src_offset + 0u];
    let b = buf_in.weights[src_offset + 1u];
    let c = buf_in.weights[src_offset + 0u + ubo.width];
    let d = buf_in.weights[src_offset + 1u + ubo.width];
    let sum = dot(vec4<f32>(a, b, c, d), vec4<f32>(1.0));

    buf_out.weights[dst_offset] = sum / 4.0;

    let probabilities = vec4<f32>(a, a+b, a+b+c, sum) / max(sum, 0.0001);
    textureStore(tex_out, vec2<i32>(coord.xy), probabilities);
  }
}


`

const numParticles = 100000;
const particlePositionOffset = 0;
const particleColorOffset = 4 * 4;
const particleInstanceByteSize =
  3 * 4 + // position
  1 * 4 + // lifetime
  4 * 4 + // color
  3 * 4 + // velocity
  1 * 4 + // padding
  0;

const init = async () => {
  const webgpu = await initWebGPU()
  const canvas = webgpu.canvas;

  const device = webgpu.device;
  const context = webgpu.context;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  const particlesBuffer = device.createBuffer({
    size: numParticles * particleInstanceByteSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
  });

  const buffers = [
    {
      // instanced particles buffer
      arrayStride: particleInstanceByteSize,
      stepMode: 'instance',
      attributes: [
        {
          // position
          shaderLocation: 0,
          offset: particlePositionOffset,
          format: 'float32x3',
        },
        {
          // color
          shaderLocation: 1,
          offset: particleColorOffset,
          format: 'float32x4',
        },
      ],
    },
    {
      // quad vertex buffer
      arrayStride: 2 * 4, // vec2<f32>
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
  ];

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

 

  const renderPipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: particleWGSL,
      }),
      entryPoint: 'vs_main',
      buffers,
    },
    fragment: {
      module: device.createShaderModule({
        code: particleWGSL,
      }),
      entryPoint: 'fs_main',
      targets: [
        {
          format: presentationFormat,
          blend: blend,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },

    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: 'less',
      format: 'depth24plus',
    },
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const uniformBufferSize =
    4 * 4 * 4 + // modelViewProjectionMatrix : mat4x4<f32>
    3 * 4 + // right : vec3<f32>
    4 + // padding
    3 * 4 + // up : vec3<f32>
    4 + // padding
    0;
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const uniformBindGroup = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined, // Assigned later
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  //////////////////////////////////////////////////////////////////////////////
  // Quad vertex buffer
  //////////////////////////////////////////////////////////////////////////////
  const quadVertexBuffer = device.createBuffer({
    size: 6 * 2 * 4, // 6x vec2<f32>
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  // prettier-ignore
  const vertexData = [
    -1.0, -1.0, +1.0, -1.0, -1.0, +1.0, -1.0, +1.0, +1.0, -1.0, +1.0, +1.0,
  ];
  new Float32Array(quadVertexBuffer.getMappedRange()).set(vertexData);
  quadVertexBuffer.unmap();

  //////////////////////////////////////////////////////////////////////////////
  // Texture
  //////////////////////////////////////////////////////////////////////////////
  let texture;
  let textureWidth = 1;
  let textureHeight = 1;
  let numMipLevels = 1;
  {
    const img = document.createElement('img');
    img.src = new URL(
      '../data/webgpu.png',
      import.meta.url
    ).toString();
    await img.decode();
    const imageBitmap = await createImageBitmap(img);

    //Calculate number of mip levels required to generate the probability map
    while (
      textureWidth < imageBitmap.width ||
      textureHeight < imageBitmap.height
    ) {
      textureWidth *= 2;
      textureHeight *= 2;
      numMipLevels++;
    }
    

    texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      mipLevelCount: numMipLevels,
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );
  }


  //////////////////////////////////////////////////////////////////////////////
  // Probability map generation
  // The 0'th mip level of texture holds the color data and spawn-probability in
  // the alpha channel. The mip levels 1..N are generated to hold spawn
  // probabilities up to the top 1x1 mip level.
  //////////////////////////////////////////////////////////////////////////////
  {
  

    // const compute2 = webgpu.initComputeCall({
    //     code: probabilityMapWGSL,
    //     entryPoints: 'export_level'
    // })

    const probabilityMapImportLevelPipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({ code: probabilityMapWGSL }),
        entryPoint: 'import_level',
      },
    });
    const probabilityMapExportLevelPipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({ code: probabilityMapWGSL }),
        entryPoint: 'export_level',
      },
    });

    const probabilityMapUBOBufferSize =
      1 * 4 + // stride
      3 * 4 + // padding
      0;
    const probabilityMapUBOBuffer = device.createBuffer({
      size: probabilityMapUBOBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const buffer_a = device.createBuffer({
      size: textureWidth * textureHeight * 4,
      usage: GPUBufferUsage.STORAGE,
    });
    const buffer_b = device.createBuffer({
      size: textureWidth * textureHeight * 4,
      usage: GPUBufferUsage.STORAGE,
    });
    device.queue.writeBuffer(
      probabilityMapUBOBuffer,
      0,
      new Int32Array([textureWidth])
    );
    const commandEncoder = device.createCommandEncoder();
    let compute1
    for (let level = 0; level < 10; level++) {
      const levelWidth = textureWidth >> level;
      const levelHeight = textureHeight >> level;
 
      const pipeline =
        level == 0
          ? probabilityMapImportLevelPipeline.getBindGroupLayout(0)
          : probabilityMapExportLevelPipeline.getBindGroupLayout(0);

          compute1 = webgpu.initComputeCall({
            code: probabilityMapWGSL,
            entryPoint: level == 0 ? 'import_level' : 'export_level',
            bindGroups: function (state, pipeline) {
                const device = state.device;
                  const probabilityMapBindGroup = utils.makeBindGroup(device,
                    pipeline.getBindGroupLayout(0),
                    [probabilityMapUBOBuffer, 
                        level & 1 ? buffer_a : buffer_b,
                        level & 1 ? buffer_b : buffer_a,
                        texture.createView({
                            format: 'rgba8unorm',
                            dimension: '2d',
                            baseMipLevel: level,
                            mipLevelCount: 1,
                          }) 
                    ]
                  )
    
    
                return [probabilityMapBindGroup]
            },
            exec: function (state) {
                const computePipeline = state.computePass.pipeline
                const device = state.device;
                if (!state.commandEncoder) console.log('hello')
                state.commandEncoder = state.commandEncoder || device.createCommandEncoder();
                const passEncoder = state.commandEncoder.beginComputePass();
                passEncoder.setPipeline(computePipeline);
                passEncoder.setBindGroup(0, state.computePass.bindGroups[0]);
                passEncoder.dispatchWorkgroups(Math.ceil(levelWidth / 64), levelHeight);
                passEncoder.end();        
            }
        })
      if (level == 0) {
        compute1()
      } else {
        compute1()
      }
    }
    compute1.submit()
  }

  //////////////////////////////////////////////////////////////////////////////
  // Simulation compute pipeline
  //////////////////////////////////////////////////////////////////////////////
  const simulationParams = {
    simulate: true,
    deltaTime: 0.04,
  };

  const simulationUBOBufferSize =
    1 * 4 + // deltaTime
    3 * 4 + // padding
    4 * 4 + // seed
    0;
  const simulationUBOBuffer = device.createBuffer({
    size: simulationUBOBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const compute = webgpu.initComputeCall({
    code: particleWGSL,
    entryPoint: 'simulate',
    bindGroups: function (state, pipeline) {
        

        return utils.makeBindGroup(device, pipeline.getBindGroupLayout(0),
            [simulationUBOBuffer,
            particlesBuffer, 
            texture.createView()
            ]
        )
    }
  })

  const computePipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        code: particleWGSL,
      }),
      entryPoint: 'simulate',
    },
  });
  const computeBindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: simulationUBOBuffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: particlesBuffer,
          //size: numParticles * particleInstanceByteSize,
        },
      },
      {
        binding: 2,
        resource: texture.createView(),
      },
    ],
  });

  const aspect = canvas.width / canvas.height;
  const projection = mat4.create();
  const view = mat4.create();
  const mvp = mat4.create();
  mat4.perspective(projection, (2 * Math.PI) / 5, aspect, 1, 100.0);


//   const draw = await webgpu.initDrawCall({
//     shader: {
//         code: particleWGSL,
//         entryPoint: 'vs_main',
//         entryPoint: 'fs_main',
//     },
//     attributeBuffers: buffers,
//     blend,
//     instances: numParticles,
//     attributeBuffers: [
//         particlesBuffer,
//         quadVertexBuffer
//     ]
//   })
  function frame() {
    // Sample is no longer the active page.
    device.queue.writeBuffer(
      simulationUBOBuffer,
      0,
      new Float32Array([
        simulationParams.simulate ? simulationParams.deltaTime : 0.0,
        0.0,
        0.0,
        0.0, // padding
        Math.random() * 100,
        Math.random() * 100, // seed.xy
        1 + Math.random(),
        1 + Math.random(), // seed.zw
      ])
    );

    mat4.identity(view);
    mat4.translate(view, view, vec3.fromValues(0, 0, -3));
    mat4.rotateX(view, view, Math.PI * -0.2);
    mat4.multiply(mvp, projection, view);

    // prettier-ignore
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      new Float32Array([
        // modelViewProjectionMatrix
        mvp[0], mvp[1], mvp[2], mvp[3],
        mvp[4], mvp[5], mvp[6], mvp[7],
        mvp[8], mvp[9], mvp[10], mvp[11],
        mvp[12], mvp[13], mvp[14], mvp[15],

        view[0], view[4], view[8], // right

        0, // padding

        view[1], view[5], view[9], // up

        0, // padding
      ])
    );
    const swapChainTexture = context.getCurrentTexture();
    // prettier-ignore
    renderPassDescriptor.colorAttachments[0].view = swapChainTexture.createView();

    const commandEncoder = device.createCommandEncoder();
    {
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, computeBindGroup);
      passEncoder.dispatchWorkgroups(Math.ceil(numParticles / 64));
      passEncoder.end();
//    compute()
    }
    {
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(renderPipeline);
      passEncoder.setBindGroup(0, uniformBindGroup);
      passEncoder.setVertexBuffer(0, particlesBuffer);
      passEncoder.setVertexBuffer(1, quadVertexBuffer);
      passEncoder.draw(6, numParticles, 0, 0);
      passEncoder.end();
    }

    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

export default init;