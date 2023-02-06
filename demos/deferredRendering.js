const vertexWriteGBuffers = `struct Uniforms {
    modelMatrix : mat4x4<f32>,
    normalModelMatrix : mat4x4<f32>,
  }
  struct Camera {
    viewProjectionMatrix : mat4x4<f32>,
  }
  @group(0) @binding(0) var<uniform> uniforms : Uniforms;
  @group(0) @binding(1) var<uniform> camera : Camera;
  
  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragPosition: vec3<f32>,  // position in world space
    @location(1) fragNormal: vec3<f32>,    // normal in world space
    @location(2) fragUV: vec2<f32>,
  }
  
  @vertex
  fn main(
    @location(0) position : vec3<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>
  ) -> VertexOutput {
    var output : VertexOutput;
    output.fragPosition = (uniforms.modelMatrix * vec4(position, 1.0)).xyz;
    output.Position = camera.viewProjectionMatrix * vec4(output.fragPosition, 1.0);
    output.fragNormal = normalize((uniforms.normalModelMatrix * vec4(normal, 1.0)).xyz);
    output.fragUV = uv;
    return output;
  }
  `

  const fragmentWriteGBuffers = `struct GBufferOutput {
    @location(0) position : vec4<f32>,
    @location(1) normal : vec4<f32>,
  
    // Textures: diffuse color, specular color, smoothness, emissive etc. could go here
    @location(2) albedo : vec4<f32>,
  }
  
  @fragment
  fn main(
    @location(0) fragPosition: vec3<f32>,
    @location(1) fragNormal: vec3<f32>,
    @location(2) fragUV : vec2<f32>
  ) -> GBufferOutput {
    // faking some kind of checkerboard texture
    let uv = floor(30.0 * fragUV);
    let c = 0.2 + 0.5 * ((uv.x + uv.y) - 2.0 * floor((uv.x + uv.y) / 2.0));
  
    var output : GBufferOutput;
    output.position = vec4(fragPosition, 1.0);
    output.normal = vec4(fragNormal, 1.0);
    output.albedo = vec4(c, c, c, 1.0);
  
    return output;
  }
  `

  const vertexTextureQuad = `@vertex
  fn main(
    @builtin(vertex_index) VertexIndex : u32
  ) -> @builtin(position) vec4<f32> {
    const pos = array(
      vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
      vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0),
    );
  
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  }
  `

  const fragmentGBuffersDebugView = `@group(0) @binding(0) var gBufferPosition: texture_2d<f32>;
  @group(0) @binding(1) var gBufferNormal: texture_2d<f32>;
  @group(0) @binding(2) var gBufferAlbedo: texture_2d<f32>;
  
  override canvasSizeWidth: f32;
  override canvasSizeHeight: f32;
  
  @fragment
  fn main(
    @builtin(position) coord : vec4<f32>
  ) -> @location(0) vec4<f32> {
    var result : vec4<f32>;
    let c = coord.xy / vec2<f32>(canvasSizeWidth, canvasSizeHeight);
    if (c.x < 0.33333) {
      result = textureLoad(
        gBufferPosition,
        vec2<i32>(floor(coord.xy)),
        0
      );
    } else if (c.x < 0.66667) {
      result = textureLoad(
        gBufferNormal,
        vec2<i32>(floor(coord.xy)),
        0
      );
      result.x = (result.x + 1.0) * 0.5;
      result.y = (result.y + 1.0) * 0.5;
      result.z = (result.z + 1.0) * 0.5;
    } else {
      result = textureLoad(
        gBufferAlbedo,
        vec2<i32>(floor(coord.xy)),
        0
      );
    }
    return result;
  }
  `

const fragmentDeferredRendering = `@group(0) @binding(0) var gBufferPosition: texture_2d<f32>;
@group(0) @binding(1) var gBufferNormal: texture_2d<f32>;
@group(0) @binding(2) var gBufferAlbedo: texture_2d<f32>;

struct LightData {
  position : vec4<f32>,
  color : vec3<f32>,
  radius : f32,
}
struct LightsBuffer {
  lights: array<LightData>,
}
@group(1) @binding(0) var<storage, read> lightsBuffer: LightsBuffer;

struct Config {
  numLights : u32,
}
@group(1) @binding(1) var<uniform> config: Config;

@fragment
fn main(
  @builtin(position) coord : vec4<f32>
) -> @location(0) vec4<f32> {
  var result : vec3<f32>;

  let position = textureLoad(
    gBufferPosition,
    vec2<i32>(floor(coord.xy)),
    0
  ).xyz;

  if (position.z > 10000.0) {
    discard;
  }

  let normal = textureLoad(
    gBufferNormal,
    vec2<i32>(floor(coord.xy)),
    0
  ).xyz;

  let albedo = textureLoad(
    gBufferAlbedo,
    vec2<i32>(floor(coord.xy)),
    0
  ).rgb;

  for (var i = 0u; i < config.numLights; i++) {
    let L = lightsBuffer.lights[i].position.xyz - position;
    let distance = length(L);
    if (distance > lightsBuffer.lights[i].radius) {
      continue;
    }
    let lambert = max(dot(normal, normalize(L)), 0.0);
    result += vec3<f32>(
      lambert * pow(1.0 - distance / lightsBuffer.lights[i].radius, 2.0) * lightsBuffer.lights[i].color * albedo
    );
  }

  // some manual ambient
  result += vec3(0.2);

  return vec4(result, 1.0);
}
`

const lightUpdate = `struct LightData {
    position : vec4<f32>,
    color : vec3<f32>,
    radius : f32,
  }
  struct LightsBuffer {
    lights: array<LightData>,
  }
  @group(0) @binding(0) var<storage, read_write> lightsBuffer: LightsBuffer;
  
  struct Config {
    numLights : u32,
  }
  @group(0) @binding(1) var<uniform> config: Config;
  
  struct LightExtent {
    min : vec4<f32>,
    max : vec4<f32>,
  }
  @group(0) @binding(2) var<uniform> lightExtent: LightExtent;
  
  @compute @workgroup_size(64, 1, 1)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    var index = GlobalInvocationID.x;
    if (index >= config.numLights) {
      return;
    }
  
    lightsBuffer.lights[index].position.y = lightsBuffer.lights[index].position.y - 0.5 - 0.003 * (f32(index) - 64.0 * floor(f32(index) / 64.0));
  
    if (lightsBuffer.lights[index].position.y < lightExtent.min.y) {
      lightsBuffer.lights[index].position.y = lightExtent.max.y;
    }
  }
  `
import utils from '../lib/utils'
import initwebgpu from '../lib/main'

import { mesh } from './stanfordDragon'
import { mat4, vec3, vec4 } from 'gl-matrix';

const kMaxNumLights = 1024;
const lightExtentMin = vec3.fromValues(-50, -30, -50);
const lightExtentMax = vec3.fromValues(50, 50, 50);

const init = async () => {
const webgpu = await initwebgpu()
  const canvas = webgpu.canvas
  
  const device = webgpu.device

  const context = webgpu.context;

  const aspect = 1
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  // Create the model vertex buffer.
  const kVertexStride = 8;

  //utils.makeBuffer(device, mesh.positions.length * kVertexStride * Float32Array.BYTES_PER_ElEMENT, 'VERTEX', Float32Array)

  const vertexBuffer = device.createBuffer({
    // position: vec3, normal: vec3, uv: vec2
    size:
      mesh.positions.length * kVertexStride * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  {
    const mapping = new Float32Array(vertexBuffer.getMappedRange());
    for (let i = 0; i < mesh.positions.length; ++i) {
      mapping.set(mesh.positions[i], kVertexStride * i);
      mapping.set(mesh.normals[i], kVertexStride * i + 3);
      mapping.set(mesh.uvs[i], kVertexStride * i + 6);
    }
    vertexBuffer.unmap();
  }

  // Create the model index buffer.
  const indexCount = mesh.triangles.length * 3;
  const indexBuffer = device.createBuffer({
    size: indexCount * Uint16Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.INDEX,
    mappedAtCreation: true,
  });
  {
    const mapping = new Uint16Array(indexBuffer.getMappedRange());
    for (let i = 0; i < mesh.triangles.length; ++i) {
      mapping.set(mesh.triangles[i], 3 * i);
    }
    indexBuffer.unmap();
  }

  // GBuffer texture render targets
  const gBufferTexture2DFloat = device.createTexture({
    size: [canvas.width, canvas.height, 2],
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    format: 'rgba32float',
  });
  const gBufferTextureAlbedo = device.createTexture({
    size: [canvas.width, canvas.height],
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    format: 'bgra8unorm',
  });
  const gBufferTextureViews = [
    gBufferTexture2DFloat.createView({
      dimension: '2d',
      baseArrayLayer: 0,
      arrayLayerCount: 1,
    }),
    gBufferTexture2DFloat.createView({
      dimension: '2d',
      baseArrayLayer: 1,
      arrayLayerCount: 1,
    }),
    gBufferTextureAlbedo.createView(),
  ];

  const vertexBuffers = [
    {
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 8,
      attributes: [
        {
          // position
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        },
        {
          // normal
          shaderLocation: 1,
          offset: Float32Array.BYTES_PER_ELEMENT * 3,
          format: 'float32x3',
        },
        {
          // uv
          shaderLocation: 2,
          offset: Float32Array.BYTES_PER_ELEMENT * 6,
          format: 'float32x2',
        },
      ],
    },
  ];

  const primitive = {
    topology: 'triangle-list',
    cullMode: 'back',
  };


  const modelUniformBuffer = device.createBuffer({
    size: 4 * 16 * 2, // two 4x4 matrix
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const cameraUniformBuffer = device.createBuffer({
    size: 4 * 16, // 4x4 matrix
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const writeGBuffers = await webgpu.initDrawCall({
    vert: vertexWriteGBuffers,
    frag: fragmentWriteGBuffers,
    attributeBuffers: vertexBuffers,
    targets: [
        'rgba32float',
        'rgba32float',
        'bgra8unorm'
    ],
    indices: mesh.triangles,
    bindGroup: function ({pipeline}) {
    return utils.makeBindGroup(device, pipeline.getBindGroupLayout(0),
        [modelUniformBuffer, cameraUniformBuffer]
    )
    },
    renderPassDescriptor: function () {
        return writeGBufferPassDescriptor
    }
  })

  const writeGBuffersPipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: device.createShaderModule({
        code: vertexWriteGBuffers,
      }),
      entryPoint: 'main',
      buffers: vertexBuffers,
    },
    fragment: {
      module: device.createShaderModule({
        code: fragmentWriteGBuffers,
      }),
      entryPoint: 'main',
      targets: [
        // position
        { format: 'rgba32float' },
        // normal
        { format: 'rgba32float' },
        // albedo
        { format: 'bgra8unorm' },
      ],
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    },
    primitive,
  });

  const gBufferTexturesBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'unfilterable-float',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'unfilterable-float',
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'unfilterable-float',
        },
      },
    ],
  });

  const lightsBufferBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: {
          type: 'read-only-storage',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: {
          type: 'uniform',
        },
      },
    ],
  });

  const gBuffersDebugViewPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [gBufferTexturesBindGroupLayout],
    }),
    vertex: {
      module: device.createShaderModule({
        code: vertexTextureQuad,
      }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({
        code: fragmentGBuffersDebugView,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
      constants: {
        canvasSizeWidth: canvas.width,
        canvasSizeHeight: canvas.height,
      },
    },
    primitive,
  });

  const deferredRenderPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        gBufferTexturesBindGroupLayout,
        lightsBufferBindGroupLayout,
      ],
    }),
    vertex: {
      module: device.createShaderModule({
        code: vertexTextureQuad,
      }),
      entryPoint: 'main',
    },
    fragment: {
      module: device.createShaderModule({
        code: fragmentDeferredRendering,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
    },
    primitive,
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const writeGBufferPassDescriptor = {
    colorAttachments: [
      {
        view: gBufferTextureViews[0],

        clearValue: {
          r: Number.MAX_VALUE,
          g: Number.MAX_VALUE,
          b: Number.MAX_VALUE,
          a: 1.0,
        },
        loadOp: 'clear',
        storeOp: 'store',
      },
      {
        view: gBufferTextureViews[1],

        clearValue: { r: 0.0, g: 0.0, b: 1.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
      {
        view: gBufferTextureViews[2],

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

  const textureQuadPassDescriptor = {
    colorAttachments: [
      {
        // view is acquired and set in render loop.
        view: undefined,

        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  };

  const settings = {
    mode: 'rendering',
    numLights: 128,
  };
  const configUniformBuffer = (() => {
    const buffer = device.createBuffer({
      size: Uint32Array.BYTES_PER_ELEMENT,
      mappedAtCreation: true,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    new Uint32Array(buffer.getMappedRange())[0] = settings.numLights;
    buffer.unmap();
    return buffer;
  })();


  

  const sceneUniformBindGroup = utils.makeBindGroup(device, writeGBuffersPipeline.getBindGroupLayout(0),
  [modelUniformBuffer, cameraUniformBuffer]
  )
  


  const gBufferTexturesBindGroup = device.createBindGroup({
    layout: gBufferTexturesBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: gBufferTextureViews[0],
      },
      {
        binding: 1,
        resource: gBufferTextureViews[1],
      },
      {
        binding: 2,
        resource: gBufferTextureViews[2],
      },
    ],
  });

  // Lights data are uploaded in a storage buffer
  // which could be updated/culled/etc. with a compute shader
  const extent = vec3.create();
  vec3.sub(extent, lightExtentMax, lightExtentMin);
  const lightDataStride = 8;
  const bufferSizeInByte =
    Float32Array.BYTES_PER_ELEMENT * lightDataStride * kMaxNumLights;

  const lightsBuffer = device.createBuffer({
    size: bufferSizeInByte,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true,
  });

  // We randomaly populate lights randomly in a box range
  // And simply move them along y-axis per frame to show they are
  // dynamic lightings
  const lightData = new Float32Array(lightsBuffer.getMappedRange());
  const tmpVec4 = vec4.create();
  let offset = 0;
  for (let i = 0; i < kMaxNumLights; i++) {
    offset = lightDataStride * i;
    // position
    for (let i = 0; i < 3; i++) {
      tmpVec4[i] = Math.random() * extent[i] + lightExtentMin[i];
    }
    tmpVec4[3] = 1;
    lightData.set(tmpVec4, offset);
    // color
    tmpVec4[0] = Math.random() * 2;
    tmpVec4[1] = Math.random() * 2;
    tmpVec4[2] = Math.random() * 2;
    // radius
    tmpVec4[3] = 20.0;
    lightData.set(tmpVec4, offset + 4);
  }
  lightsBuffer.unmap();

  const lightExtentBuffer = device.createBuffer({
    size: 4 * 8,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const lightExtentData = new Float32Array(8);
  lightExtentData.set(lightExtentMin, 0);
  lightExtentData.set(lightExtentMax, 4);
  device.queue.writeBuffer(
    lightExtentBuffer,
    0,
    lightExtentData.buffer,
    lightExtentData.byteOffset,
    lightExtentData.byteLength
  );

  const lightUpdateComputePipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        code: lightUpdate,
      }),
      entryPoint: 'main',
    },
  });
  const lightsBufferBindGroup = device.createBindGroup({
    layout: lightsBufferBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: lightsBuffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: configUniformBuffer,
        },
      },
    ],
  });
  const lightsBufferComputeBindGroup = device.createBindGroup({
    layout: lightUpdateComputePipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: lightsBuffer,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: configUniformBuffer,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: lightExtentBuffer,
        },
      },
    ],
  });
  //--------------------

  // Scene matrices
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

  const cameraMatrixData = viewProjMatrix;
  device.queue.writeBuffer(
    cameraUniformBuffer,
    0,
    cameraMatrixData.buffer,
    cameraMatrixData.byteOffset,
    cameraMatrixData.byteLength
  );
  const modelData = modelMatrix;
  device.queue.writeBuffer(
    modelUniformBuffer,
    0,
    modelData.buffer,
    modelData.byteOffset,
    modelData.byteLength
  );
  const invertTransposeModelMatrix = mat4.create();
  mat4.invert(invertTransposeModelMatrix, modelMatrix);
  mat4.transpose(invertTransposeModelMatrix, invertTransposeModelMatrix);
  const normalModelData = invertTransposeModelMatrix;
  device.queue.writeBuffer(
    modelUniformBuffer,
    64,
    normalModelData.buffer,
    normalModelData.byteOffset,
    normalModelData.byteLength
  );

  // Rotates the camera around the origin based on time.
  function getCameraViewProjMatrix() {
    const eyePosition = vec3.fromValues(0, 50, -100);

    const rad = Math.PI * (Date.now() / 5000);
    vec3.rotateY(eyePosition, eyePosition, origin, rad);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

    mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);
    return viewProjMatrix;
  }

  function frame() {

    const cameraViewProj = getCameraViewProjMatrix();
    device.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      cameraViewProj.buffer,
      cameraViewProj.byteOffset,
      cameraViewProj.byteLength
    );

    const commandEncoder = device.createCommandEncoder();
    {
//        writeGBuffers({submit: false})
      // Write position, normal, albedo etc. data to gBuffers
      const gBufferPass = commandEncoder.beginRenderPass(
        writeGBufferPassDescriptor
      );
      gBufferPass.setPipeline(writeGBuffersPipeline);
      gBufferPass.setBindGroup(0, sceneUniformBindGroup);
      gBufferPass.setVertexBuffer(0, vertexBuffer);
      gBufferPass.setIndexBuffer(indexBuffer, 'uint16');
      gBufferPass.drawIndexed(indexCount);
      gBufferPass.end();
    }
    {
      // Update lights position
      const lightPass = commandEncoder.beginComputePass();
      lightPass.setPipeline(lightUpdateComputePipeline);
      lightPass.setBindGroup(0, lightsBufferComputeBindGroup);
      lightPass.dispatchWorkgroups(Math.ceil(kMaxNumLights / 64));
      lightPass.end();
    }
    {
      if (settings.mode === 'gBuffers view') {
        // GBuffers debug view
        // Left: position
        // Middle: normal
        // Right: albedo (use uv to mimic a checkerboard texture)
        textureQuadPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView();
        const debugViewPass = commandEncoder.beginRenderPass(
          textureQuadPassDescriptor
        );
        debugViewPass.setPipeline(gBuffersDebugViewPipeline);
        debugViewPass.setBindGroup(0, gBufferTexturesBindGroup);
        debugViewPass.draw(6);
        debugViewPass.end();
      } else {
        // Deferred rendering
        textureQuadPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView();
        const deferredRenderingPass = commandEncoder.beginRenderPass(
          textureQuadPassDescriptor
        );
        deferredRenderingPass.setPipeline(deferredRenderPipeline);
        deferredRenderingPass.setBindGroup(0, gBufferTexturesBindGroup);
        deferredRenderingPass.setBindGroup(1, lightsBufferBindGroup);
        deferredRenderingPass.draw(6);
        deferredRenderingPass.end();
      }
    }
    device.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

export default init