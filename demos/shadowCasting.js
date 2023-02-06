import { mat4, vec3 } from 'gl-matrix';

import { mesh } from './stanfordDragon';
import initWebGPU from '../lib/main';
import utils from '../lib/utils';

const vertexShadowWGSL =
`struct Scene {
  lightViewProjMatrix: mat4x4<f32>,
  cameraViewProjMatrix: mat4x4<f32>,
  lightPos: vec3<f32>,
}

struct Model {
  modelMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> scene : Scene;
@group(1) @binding(0) var<uniform> model : Model;

@vertex
fn main(
  @location(0) position: vec3<f32>
) -> @builtin(position) vec4<f32> {
  return scene.lightViewProjMatrix * model.modelMatrix * vec4(position, 1.0);
}`

const vertexWGSL = `struct Scene {
  lightViewProjMatrix: mat4x4<f32>,
  cameraViewProjMatrix: mat4x4<f32>,
  lightPos: vec3<f32>,
}

struct Model {
  modelMatrix: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> scene : Scene;
@group(1) @binding(0) var<uniform> model : Model;

struct VertexOutput {
  @location(0) shadowPos: vec3<f32>,
  @location(1) fragPos: vec3<f32>,
  @location(2) fragNorm: vec3<f32>,

  @builtin(position) Position: vec4<f32>,
}

@vertex
fn main(
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>
) -> VertexOutput {
  var output : VertexOutput;

  // XY is in (-1, 1) space, Z is in (0, 1) space
  let posFromLight = scene.lightViewProjMatrix * model.modelMatrix * vec4(position, 1.0);

  // Convert XY to (0, 1)
  // Y is flipped because texture coords are Y-down.
  output.shadowPos = vec3(
    posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
    posFromLight.z
  );

  output.Position = scene.cameraViewProjMatrix * model.modelMatrix * vec4(position, 1.0);
  output.fragPos = output.Position.xyz;
  output.fragNorm = normal;
  return output;
}`
const fragmentWGSL = `override shadowDepthTextureSize: f32 = 1024.0;

struct Scene {
  lightViewProjMatrix : mat4x4<f32>,
  cameraViewProjMatrix : mat4x4<f32>,
  lightPos : vec3<f32>,
}

@group(0) @binding(0) var<uniform> scene : Scene;
@group(0) @binding(1) var shadowMap: texture_depth_2d;
@group(0) @binding(2) var shadowSampler: sampler_comparison;

struct FragmentInput {
  @location(0) shadowPos : vec3<f32>,
  @location(1) fragPos : vec3<f32>,
  @location(2) fragNorm : vec3<f32>,
}

const albedo = vec3<f32>(0.9);
const ambientFactor = 0.2;

@fragment
fn main(input : FragmentInput) -> @location(0) vec4<f32> {
  // Percentage-closer filtering. Sample texels in the region
  // to smooth the result.
  var visibility = 0.0;
  let oneOverShadowDepthTextureSize = 1.0 / shadowDepthTextureSize;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      let offset = vec2<f32>(vec2(x, y)) * oneOverShadowDepthTextureSize;

      visibility += textureSampleCompare(
        shadowMap, shadowSampler,
        input.shadowPos.xy + offset, input.shadowPos.z - 0.007
      );
    }
  }
  visibility /= 9.0;

  let lambertFactor = max(dot(normalize(scene.lightPos - input.fragPos), input.fragNorm), 0.0);
  let lightingFactor = min(ambientFactor + visibility * lambertFactor, 1.0);

  return vec4(lightingFactor * albedo, 1.0);
}`

const shadowDepthTextureSize = 1024;

const init = async () => {
  const webgpu = await initWebGPU()
  const canvas = webgpu.canvas;
  
  const device = webgpu.device

  const context = webgpu.context

  const aspect = canvas.width / canvas.height;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  // Create the model vertex buffer.
  const vertexBuffer = device.createBuffer({
    size: mesh.positions.length * 3 * 2 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  {
    const mapping = new Float32Array(vertexBuffer.getMappedRange());
    for (let i = 0; i < mesh.positions.length; ++i) {
      mapping.set(mesh.positions[i], 6 * i);
      mapping.set(mesh.normals[i], 6 * i + 3);
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

  // Create the depth texture for rendering/sampling the shadow map.
  const shadowDepthTexture = device.createTexture({
    size: [shadowDepthTextureSize, shadowDepthTextureSize, 1],
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    format: 'depth32float',
  });
  const shadowDepthTextureView = shadowDepthTexture.createView();

  // Create some common descriptors used for both the shadow pipeline
  // and the color rendering pipeline.
  const vertexBuffers = [
    {
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 6,
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
      ],
    },
  ];

  const primitive = {
    topology: 'triangle-list',
    cullMode: 'back',
  };

  const uniformBufferBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
        },
      },
    ],
  });

  const shadowPipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        uniformBufferBindGroupLayout,
        uniformBufferBindGroupLayout,
      ],
    }),
    vertex: {
      module: device.createShaderModule({
        code: vertexShadowWGSL,
      }),
      entryPoint: 'main',
      buffers: vertexBuffers,
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth32float',
    },
    primitive,
  });

  // Create a bind group layout which holds the scene uniforms and
  // the texture+sampler for depth. We create it manually because the WebPU
  // implementation doesn't infer this from the shader (yet).
  const bglForRender = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'depth',
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        sampler: {
          type: 'comparison',
        },
      },
    ],
  });

  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bglForRender, uniformBufferBindGroupLayout],
    }),
    vertex: {
      module: device.createShaderModule({
        code: vertexWGSL,
      }),
      entryPoint: 'main',
      buffers: vertexBuffers,
    },
    fragment: {
      module: device.createShaderModule({
        code: fragmentWGSL,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: presentationFormat,
        },
      ],
      constants: {
        shadowDepthTextureSize,
      },
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus-stencil8',
    },
    primitive,
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus-stencil8',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
        // view is acquired and set in render loop.
        view: undefined,

        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
      stencilClearValue: 0,
      stencilLoadOp: 'clear',
      stencilStoreOp: 'store',
    },
  };

  const modelUniformBuffer = device.createBuffer({
    size: 4 * 16, // 4x4 matrix
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const sceneUniformBuffer = device.createBuffer({
    // Two 4x4 viewProj matrices,
    // one for the camera and one for the light.
    // Then a vec3 for the light position.
    // Rounded to the nearest multiple of 16.
    size: 2 * 4 * 16 + 4 * 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const sceneBindGroupForShadow = device.createBindGroup({
    layout: uniformBufferBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: sceneUniformBuffer,
        },
      },
    ],
  });

  const sceneBindGroupForRender = device.createBindGroup({
    layout: bglForRender,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: sceneUniformBuffer,
        },
      },
      {
        binding: 1,
        resource: shadowDepthTextureView,
      },
      {
        binding: 2,
        resource: device.createSampler({
          compare: 'less',
        }),
      },
    ],
  });

  const modelBindGroup = device.createBindGroup({
    layout: uniformBufferBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: modelUniformBuffer,
        },
      },
    ],
  });

  const eyePosition = vec3.fromValues(0, 50, -100);
  const upVector = vec3.fromValues(0, 1, 0);
  const origin = vec3.fromValues(0, 0, 0);

  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 1, 2000.0);

  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

  const lightPosition = vec3.fromValues(50, 100, -100);
  const lightViewMatrix = mat4.create();
  mat4.lookAt(lightViewMatrix, lightPosition, origin, upVector);

  const lightProjectionMatrix = mat4.create();
  {
    const left = -80;
    const right = 80;
    const bottom = -80;
    const top = 80;
    const near = -200;
    const far = 300;
    mat4.ortho(lightProjectionMatrix, left, right, bottom, top, near, far);
  }

  const lightViewProjMatrix = mat4.create();
  mat4.multiply(lightViewProjMatrix, lightProjectionMatrix, lightViewMatrix);

  const viewProjMatrix = mat4.create();
  mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);

  // Move the model so it's centered.
  const modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -5, 0));
  mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -40, 0));

  // The camera/light aren't moving, so write them into buffers now.
  {
    const lightMatrixData = lightViewProjMatrix;
    device.queue.writeBuffer(
      sceneUniformBuffer,
      0,
      lightMatrixData.buffer,
      lightMatrixData.byteOffset,
      lightMatrixData.byteLength
    );

    const cameraMatrixData = viewProjMatrix;
    device.queue.writeBuffer(
      sceneUniformBuffer,
      64,
      cameraMatrixData.buffer,
      cameraMatrixData.byteOffset,
      cameraMatrixData.byteLength
    );

    const lightData = lightPosition;
    device.queue.writeBuffer(
      sceneUniformBuffer,
      128,
      lightData.buffer,
      lightData.byteOffset,
      lightData.byteLength
    );

    const modelData = modelMatrix;
    device.queue.writeBuffer(
      modelUniformBuffer,
      0,
      modelData.buffer,
      modelData.byteOffset,
      modelData.byteLength
    );
  }

  // Rotates the camera around the origin based on time.
  function getCameraViewProjMatrix() {
    const eyePosition = vec3.fromValues(0, 50, -100);

    const rad = Math.PI * (Date.now() / 2000);
    vec3.rotateY(eyePosition, eyePosition, origin, rad);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eyePosition, origin, upVector);

    mat4.multiply(viewProjMatrix, projectionMatrix, viewMatrix);
    return viewProjMatrix;
  }

  const shadowPassDescriptor = {
    colorAttachments: [],
    depthStencilAttachment: {
      view: shadowDepthTextureView,
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  function frame() {

    const cameraViewProj = getCameraViewProjMatrix();
    device.queue.writeBuffer(
      sceneUniformBuffer,
      64,
      cameraViewProj.buffer,
      cameraViewProj.byteOffset,
      cameraViewProj.byteLength
    );

    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();

    const commandEncoder = device.createCommandEncoder();
    {
      const shadowPass = commandEncoder.beginRenderPass(shadowPassDescriptor);
      shadowPass.setPipeline(shadowPipeline);
      shadowPass.setBindGroup(0, sceneBindGroupForShadow);
      shadowPass.setBindGroup(1, modelBindGroup);
      shadowPass.setVertexBuffer(0, vertexBuffer);
      shadowPass.setIndexBuffer(indexBuffer, 'uint16');
      shadowPass.drawIndexed(indexCount);

      shadowPass.end();
    }
    {
      const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor);
      renderPass.setPipeline(pipeline);
      renderPass.setBindGroup(0, sceneBindGroupForRender);
      renderPass.setBindGroup(1, modelBindGroup);
      renderPass.setVertexBuffer(0, vertexBuffer);
      renderPass.setIndexBuffer(indexBuffer, 'uint16');
      renderPass.drawIndexed(indexCount);

      renderPass.end();
    }
    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

export default init