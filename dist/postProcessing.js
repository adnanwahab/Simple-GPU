"use strict";
(() => {
  // lib/utils.js
  var addMouseEvents = function(canvas, data) {
    canvas.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      data.mouseX = x / event.target.clientWidth;
      data.mouseY = y / event.target.clientHeight;
    });
  };
  function createCanvas(width = 1e3, height = 1e3) {
    let dpi = devicePixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = width + "px";
    document.body.appendChild(canvas);
    return canvas;
  }
  function isBuffer(buffer2) {
    return buffer2.__proto__.constructor.name === "GPUBuffer";
  }
  function makeResource(resource) {
    return isBuffer(resource) ? { buffer: resource } : resource;
  }
  function makeBindGroupDescriptor(layout, resourceList, offset = 0) {
    return {
      layout,
      entries: resourceList.map((resource, i) => {
        return {
          binding: i + offset,
          resource: makeResource(resource)
        };
      })
    };
  }
  async function readBuffer(state2, buffer2, flag = false) {
    const constructor = flag ? Float32Array : Uint32Array;
    const device = state2.device;
    const commandEncoder = device.createCommandEncoder();
    const C = new constructor(buffer2.size);
    const CReadCopy = device.createBuffer({
      size: buffer2.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const texture = device.createTexture({
      size: [500, 500, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
    });
    commandEncoder.copyBufferToBuffer(buffer2, 0, CReadCopy, 0, buffer2.size);
    device.queue.submit([commandEncoder.finish()]);
    await CReadCopy.mapAsync(GPUMapMode.READ);
    C.set(new constructor(CReadCopy.getMappedRange()));
    CReadCopy.unmap();
    return C;
  }
  function createBuffer(device, stuff) {
    const buffer2 = device.createBuffer({
      size: 4,
      mappedAtCreation: true,
      usage: GPUBufferUsage.UNIFORM
    });
    new Uint32Array(buffer2.getMappedRange())[0] = stuff;
    buffer2.unmap();
    return buffer2;
  }
  function makeBuffer(device, size = 4, usage, data, type) {
    const buffer2 = device.createBuffer({
      size,
      mappedAtCreation: true,
      usage: GPUBufferUsage[usage]
    });
    new type(buffer2.getMappedRange()).set(data);
    buffer2.unmap();
    return buffer2;
  }
  var paramsBuffer = function(device) {
    return device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    });
  };
  function makeBindGroup(device, pipelineLayout, resourceList, offset) {
    return device.createBindGroup(makeBindGroupDescriptor(pipelineLayout, resourceList, offset));
  }
  var utils_default = {
    paramsBuffer,
    makeBuffer,
    createBuffer,
    createCanvas,
    addMouseEvents,
    makeBindGroupDescriptor,
    makeBindGroup,
    readBuffer
  };

  // lib/Texture.js
  var makeImgTexture = async (state2) => {
    const img = document.createElement("img");
    const source = img;
    source.width = innerWidth;
    source.height = innerHeight;
    img.src = state2.data.texture;
    await img.decode();
    return await createImageBitmap(img);
  };
  async function makeTexture(device, textureData, options = {}) {
    if (Array.isArray(textureData)) {
      return {
        width: textureData[0],
        height: textureData[1],
        texture: device.createTexture({
          size: {
            width: textureData[0],
            height: textureData[1]
          },
          format: "rgba8unorm",
          usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        })
      };
    }
    if (HTMLImageElement === textureData.constructor) {
      let img = textureData;
      await img.decode();
      await createImageBitmap(img);
      let imageBitmap = await createImageBitmap(img);
      let texture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        mipLevelCount: options.mipLevelCount,
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
      });
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture },
        [imageBitmap.width, imageBitmap.height]
      );
      return {
        imageBitmap,
        texture,
        width: imageBitmap.width,
        height: imageBitmap.height
      };
    } else if ("string" === typeof textureData) {
      let texture = device.createTexture({
        size: [900, 500, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });
      let imageBitmap = await makeImgTexture(state);
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture },
        [imageBitmap.width, imageBitmap.height]
      );
      return texture;
    } else if (typeof textureData === "object") {
      console.log(textureData.format);
      let texture = device.createTexture({
        size: [textureData.width, textureData.height, 1],
        format: textureData.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      });
      return { texture, width: textureData.width, height: textureData.height };
    }
  }

  // lib/computePass.js
  function createComputePass(options, state2) {
    let device = state2.device;
    const pipeline = device.createComputePipeline({
      layout: "auto",
      label: options.label,
      compute: {
        module: device.createShaderModule({
          code: options.code
        }),
        entryPoint: options.entryPoint || "main"
      }
    });
    const mainComputePass = {
      pipeline,
      bindGroups: options.bindGroups(state2, pipeline),
      uniforms: {
        blur: {
          buffer: utils_default.paramsBuffer(device),
          value: 15
        }
      },
      workGroups: [
        [],
        []
      ]
    };
    state2.computePass = mainComputePass;
  }

  // lib/main.js
  function isFunction(fn) {
    return fn.call;
  }
  function bindUniforms(state2, options, device) {
    const context = { tick: Date.now() };
    let size = 0;
    let uniforms = {};
    for (let key in options.uniforms) {
      if (!isFunction(options.uniforms[key]))
        continue;
      if (options.uniforms[key].isProp)
        continue;
      let result = options.uniforms[key](context);
      size += result.byteLength || 4;
      uniforms[key] = function(a) {
        device.queue.writeBuffer(state2.uniformBuffer, size, a.buffer, a.byteOffset, a.byteLength);
      };
    }
    const uniformBuffer = device.createBuffer({
      size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    return [uniformBuffer, uniforms];
  }
  async function makeBindGroup2(state2, options) {
    let { device, pipeline } = state2;
    [state2.uniformBuffer, state2.uniforms] = bindUniforms(state2, options, device);
    state2.bindGroupDescriptor = state2.options.bindGroupDescriptor || {
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: state2.uniformBuffer }
        }
      ]
    };
    if (state2.options?.uniforms?.texture) {
      let texture = await state2.options.uniforms.texture;
      state2.bindGroupDescriptor.entries.push(
        {
          binding: 1,
          resource: texture.sampler
        },
        {
          binding: 2,
          resource: texture.texture.createView()
        }
      );
    }
    return options.bindGroup ? options.bindGroup(state2) : device.createBindGroup(state2.bindGroupDescriptor);
  }
  async function createRenderPasses(state2, options) {
    let device = state2.device;
    const mainRenderPass = {
      renderPassDescriptor: state2.renderPassDescriptor,
      texture: state2.texture,
      pipeline: state2.pipeline = await makePipeline(state2, options),
      attributes: [],
      type: "draw"
    };
    if (options.uniforms || options.bindGroup) {
      mainRenderPass.bindGroup = await makeBindGroup2(state2, options);
    }
    if (options.indices) {
      mainRenderPass.indices = options.indices;
    }
    for (var key in state2.options.attributes) {
      mainRenderPass.attributes.push(updateAttributes(state2, device, key));
    }
    state2.renderPasses.push(mainRenderPass);
  }
  function updateUniforms(state2, device, newScope) {
    let size = 0;
    const context = { tick: Date.now() };
    for (let key in state2.options.uniforms) {
      if (!isFunction(state2.options.uniforms[key]))
        continue;
      if (state2.options.uniforms[key].isProp) {
        return;
      }
      let result = isFunction(state2.options.uniforms[key]) ? state2.options.uniforms[key](context) : state2.options.uniforms[key];
      device.queue.writeBuffer(state2.uniformBuffer, size, result.buffer, result.byteOffset, result.byteLength);
      size += result.byteLength;
    }
  }
  function isTypedArray(array) {
    return array.subarray;
  }
  function updateAttributes(state2, device, name) {
    let cubeVertexArray;
    if (isTypedArray(state2.options.attributes)) {
      cubeVertexArray = state2.options.attributes[name];
    } else {
      cubeVertexArray = new Float32Array(state2.options.attributes[name].data.flat());
    }
    return utils_default.makeBuffer(device, cubeVertexArray.byteLength, "VERTEX", cubeVertexArray, Float32Array);
  }
  var recordRenderPass = async function(state2, newScope = {}, CE) {
    let { device, renderPassDescriptor } = state2;
    const swapChainTexture = state2.context.getCurrentTexture();
    if (state2.options.renderPassDescriptor) {
      renderPassDescriptor = state2.options.renderPassDescriptor;
    } else {
      renderPassDescriptor.colorAttachments[0].view = swapChainTexture.createView();
    }
    const commandEncoder = CE || state2.ctx.commandEncoder || device.createCommandEncoder();
    state2.ctx.commandEncoder = commandEncoder;
    let _ = state2.renderPasses[0];
    if (!_)
      return console.log("no worky");
    if (state2.options?.uniforms)
      updateUniforms(state2, device, newScope);
    let passEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor
    );
    if (state2.options.attributeBufferData) {
      for (let i = 0; i < state2.options.attributeBufferData.length; i++) {
        passEncoder.setVertexBuffer(i, state2.options.attributeBufferData[i]);
      }
    } else {
      for (let i = 0; i < _.attributes.length; i++) {
        passEncoder.setVertexBuffer(i, _.attributes[i]);
      }
    }
    passEncoder.setPipeline(_.pipeline);
    if (_.bindGroup) {
      if (Array.isArray(_.bindGroup)) {
        _.bindGroup.forEach(function(bg, i) {
          passEncoder.setBindGroup(i, bg);
        });
      } else
        passEncoder.setBindGroup(0, _.bindGroup);
    }
    if (_.indices) {
      const icoFaces = utils_default.makeBuffer(device, _.indices.length * 2, "INDEX", _.indices, Uint16Array);
      passEncoder.setIndexBuffer(icoFaces, "uint16");
      passEncoder.drawIndexed(state2.options.indexCount);
    } else {
      passEncoder.draw(state2?.options?.count || 6, state2?.options?.instances || 1, 0, 0);
    }
    passEncoder.end();
    if (state2?.options?.postRender)
      state2?.options?.postRender(commandEncoder, swapChainTexture);
    if (!newScope.noSubmit) {
      device.queue.submit([commandEncoder.finish()]);
      delete state2.ctx.commandEncoder;
    }
  };
  async function makePipeline(state2) {
    let { device } = state2;
    let pipelineDesc = {
      layout: state2.options.layout || "auto",
      label: state2?.options?.label || "simple-gpu-draw",
      vertex: {
        module: device.createShaderModule({
          code: state2?.options?.shader?.code || state2.options.vert
        }),
        entryPoint: state2?.options?.shader?.vertEntryPoint || "main"
      },
      fragment: {
        module: device.createShaderModule({
          code: state2?.options?.shader?.code || state2.options.frag
        }),
        entryPoint: state2?.options?.shader?.fragEntryPoint || "main",
        targets: state2.options.targets ? state2.options.targets.map((format) => {
          return { format };
        }) : [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: state2.options.blend
          }
        ]
      },
      primitive: {
        topology: state2?.options?.primitive || "triangle-list"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus"
      }
    };
    if (state2.options.attributeBuffers) {
      pipelineDesc.vertex.buffers = state2.options.attributeBuffers;
    } else if (state2.options.attributes) {
      pipelineDesc.vertex.buffers = [];
      pipelineDesc.vertex.buffers.push(
        {
          arrayStride: 4 * state2.options.attributes.position.data[0].length,
          //two vertices so 4 bytes each
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: 0,
              format: state2.options.attributes.position.format
            },
            {
              // color
              shaderLocation: 1,
              offset: state2.options.attributes?.uv?.offset || 0,
              //format: state.options.attributes.uv.format,
              format: "float32x2"
            }
          ]
        }
      );
    }
    const depthTexture = device.createTexture({
      size: [1e3 * devicePixelRatio, 1e3 * devicePixelRatio],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: void 0,
          clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    };
    state2.renderPassDescriptor = renderPassDescriptor;
    return device.createRenderPipeline({ ...pipelineDesc });
  }
  async function init(options = {}) {
    let canvas = options.canvas || utils_default.createCanvas();
    let ctx = {};
    const state2 = {
      renderPassDescriptor: {},
      options,
      compute: options.compute,
      //user data
      renderPasses: [],
      //internal state
      canvas,
      ctx
    };
    if (!navigator.gpu)
      return alert("Error: webgpu is not available. Please install canary!!!");
    const context = canvas.getContext("webgpu");
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice({
      //    requiredFeatures: ["timestamp-query"],
      //https://omar-shehata.medium.com/how-to-use-webgpu-timestamp-query-9bf81fb5344a
      //https://www.graphics.rwth-aachen.de/media/papers/splatting1.pdf
    });
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    Object.assign(state2, {
      device,
      context,
      adapter
    });
    context.configure({
      device,
      format: presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      alphaMode: "opaque"
    });
    async function texture(img, options2) {
      const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "nearest"
      });
      const texture2 = await makeTexture(device, img, options2);
      return {
        data: img,
        texture: texture2.texture,
        sampler,
        width: texture2.width,
        height: texture2.height,
        imageBitmap: texture2.imageBitmap,
        read: async function(n) {
          const C = new Float32Array(n * n);
          const CReadCopy = device.createBuffer({
            size: m * n * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
          });
          await CReadCopy.mapAsync(GPUMapMode.READ);
          c.set(new Float32Array(CReadCopy.getMappedRange()));
          CReadCopy.unmap();
          return c;
        }
      };
    }
    return {
      initDrawCall,
      buffer,
      prop,
      clear,
      frame,
      initComputeCall,
      device,
      context,
      texture,
      attribute,
      canvas,
      state: state2
    };
    function initComputeCall(options2) {
      let localState = {
        ...state2
      };
      localState.compute = options2;
      createComputePass(options2, localState);
      function compute(options3, CE) {
        localState.compute.exec(localState, CE);
        return localState;
      }
      compute.submit = function() {
        state2.device.queue.submit([state2.commandEncoder.finish()]);
        delete state2.commandEncoder;
      };
      compute.state = state2;
      return compute;
    }
    function frame(cb) {
      requestAnimationFrame(function recur() {
        cb();
        requestAnimationFrame(recur);
      });
    }
    async function initDrawCall(options2) {
      let localState = Object.assign(
        Object.create(state2),
        {
          options: options2,
          device,
          renderPasses: []
        }
      );
      await createRenderPasses(localState, options2);
      function draw(newScope, commandEncoder) {
        if (Array.isArray(newScope))
          return newScope.map((scope) => draw(scope));
        recordRenderPass(localState, newScope, commandEncoder);
        return draw;
      }
      draw.canvas = canvas;
      draw.prop = prop;
      draw.buffer = buffer;
      draw.initDrawCall = initDrawCall;
      draw.state = localState;
      draw.draw = draw;
      draw.state = localState;
      return draw;
    }
  }
  function clear(options) {
    state.clearValue.r = options.color[0];
    state.clearValue.g = options.color[1];
    state.clearValue.b = options.color[2];
  }
  function buffer(array) {
    if (!(this instanceof buffer))
      return new buffer(array);
    this.array = array;
  }
  function prop(name) {
    let functor = (state2, newScope) => {
      let context = {
        viewportWidth: 500,
        viewportHeight: 500,
        tick: performance.now()
      };
      return newscope[name];
    };
    functor.isProp = true;
    return functor;
  }
  function attribute(data, offset, format) {
    return {
      data,
      offset,
      format: `float32x${format}`
    };
  }
  var main_default = init;

  // src/demos/postProcessing.js
  var import_meta = {};
  var tileDim = 128;
  var blurWGSL = `struct Params {
  filterDim : i32,
  blockDim : u32,
}

@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var<uniform> params : Params;
@group(1) @binding(1) var inputTex : texture_2d<f32>;
@group(1) @binding(2) var outputTex : texture_storage_2d<rgba8unorm, write>;

struct Flip {
  value : u32,
}
@group(1) @binding(3) var<uniform> flip : Flip;

var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;

@compute @workgroup_size(32, 1, 1)
fn main(
  @builtin(workgroup_id) WorkGroupID : vec3<u32>,
  @builtin(local_invocation_id) LocalInvocationID : vec3<u32>
) {
  let filterOffset = (params.filterDim - 1) / 2;
  let dims = vec2<i32>(textureDimensions(inputTex, 0));
  let baseIndex = vec2<i32>(WorkGroupID.xy * vec2(params.blockDim, 4) +
                            LocalInvocationID.xy * vec2(4, 1))
                  - vec2(filterOffset, 0);

  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      var loadIndex = baseIndex + vec2(c, r);
      if (flip.value != 0u) {
        loadIndex = loadIndex.yx;
      }

      tile[r][4 * LocalInvocationID.x + u32(c)] = textureSampleLevel(
        inputTex,
        samp,
        (vec2<f32>(loadIndex) + vec2<f32>(0.25, 0.25)) / vec2<f32>(dims),
        0.0
      ).rgb;
    }
  }
  workgroupBarrier();
  for (var r = 0; r < 4; r++) {
    for (var c = 0; c < 4; c++) {
      var writeIndex = baseIndex + vec2(c, r);
      if (flip.value != 0) {
        writeIndex = writeIndex.yx;
      }

      let center = i32(4 * LocalInvocationID.x) + c;
      if (center >= filterOffset &&
          center < 128 - filterOffset &&
          all(writeIndex < dims)) {
        var acc = vec3(0.0, 0.0, 0.0);
        for (var f = 0; f < params.filterDim; f++) {
          var i = center + f - filterOffset;
          acc = acc + (1.0 / f32(params.filterDim)) * tile[r][i];
        }
        textureStore(outputTex, writeIndex, vec4(acc, 1.0));
      }
    }
  }
}
`;
  var fullscreenTexturedQuadWGSL = `
 @group(0) @binding(0) var mySampler : sampler;
 @group(0) @binding(1) var myTexture : texture_2d<f32>;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) fragUV : vec2<f32>,
}

@vertex
fn vert_main(@builtin(vertex_index) VertexIndex : u32) -> VertexOutput {
  const pos = array(
    vec2( 1.0,  1.0),
    vec2( 1.0, -1.0),
    vec2(-1.0, -1.0),
    vec2( 1.0,  1.0),
    vec2(-1.0, -1.0),
    vec2(-1.0,  1.0),
  );

  const uv = array(
    vec2(1.0, 0.0),
    vec2(1.0, 1.0),
    vec2(0.0, 1.0),
    vec2(1.0, 0.0),
    vec2(0.0, 1.0),
    vec2(0.0, 0.0),
  );

  var output : VertexOutput;
  output.Position = vec4(pos[VertexIndex], 0.0, 1.0);
  output.fragUV = uv[VertexIndex];
  return output;
}

@fragment
fn frag_main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(myTexture, mySampler, fragUV);
}
`;
  async function postProcessing() {
    let webgpu = await main_default();
    let device = webgpu.device;
    let context = webgpu.context;
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });
    const img = document.createElement("img");
    img.src = new URL(
      "../../../data/webgpu.png",
      import_meta.url
    ).toString();
    await img.decode();
    const cubeTexture = await webgpu.texture(img);
    const [srcWidth, srcHeight] = [cubeTexture.width, cubeTexture.height];
    const textures = [
      (await webgpu.texture([srcWidth, srcHeight])).texture,
      (await webgpu.texture([srcWidth, srcHeight])).texture
    ];
    const draw = await webgpu.initDrawCall({
      label: "postprocess-draw",
      shader: {
        code: fullscreenTexturedQuadWGSL,
        fragEntryPoint: "frag_main",
        vertEntryPoint: "vert_main"
      },
      bindGroup: ({ pipeline }) => {
        return utils_default.makeBindGroup(
          device,
          pipeline.getBindGroupLayout(0),
          [sampler, textures[1].createView()]
        );
      }
    });
    const buffer0 = utils_default.createBuffer(device, 0);
    const buffer1 = utils_default.createBuffer(device, 1);
    const blurParamsBuffer = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    });
    const compute = webgpu.initComputeCall({
      code: blurWGSL,
      uniforms: {
        filterSize: 15
      },
      bindGroups: function(state2, computePipeline) {
        const computeConstants = utils_default.makeBindGroup(
          device,
          computePipeline.getBindGroupLayout(0),
          [sampler, blurParamsBuffer]
        );
        const computeBindGroup0 = utils_default.makeBindGroup(
          device,
          computePipeline.getBindGroupLayout(1),
          [
            cubeTexture.texture.createView(),
            textures[0].createView(),
            buffer0
          ],
          1
        );
        const computeBindGroup1 = utils_default.makeBindGroup(
          device,
          computePipeline.getBindGroupLayout(1),
          [
            textures[0].createView(),
            textures[1].createView(),
            buffer1
          ],
          1
        );
        const computeBindGroup2 = utils_default.makeBindGroup(
          device,
          computePipeline.getBindGroupLayout(1),
          [
            textures[1].createView(),
            textures[0].createView(),
            buffer0
          ],
          1
        );
        return [computeConstants, computeBindGroup0, computeBindGroup1, computeBindGroup2];
      },
      exec: function(state2) {
        const device2 = state2.device;
        const tileDim2 = 128;
        const batch = [4, 4];
        const settings2 = {
          filterSize: 15,
          iterations: 10
        };
        const [srcWidth2, srcHeight2] = [512, 512];
        const blockDim2 = tileDim2 - settings2.filterSize;
        state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const commandEncoder = state2.ctx.commandEncoder;
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.setBindGroup(1, state2.computePass.bindGroups[1]);
        computePass.dispatchWorkgroups(
          Math.ceil(srcWidth2 / blockDim2),
          Math.ceil(srcHeight2 / batch[1])
        );
        computePass.setBindGroup(1, state2.computePass.bindGroups[2]);
        computePass.dispatchWorkgroups(
          Math.ceil(srcHeight2 / blockDim2),
          Math.ceil(srcWidth2 / batch[1])
        );
        for (let i = 0; i < settings2.iterations - 1; ++i) {
          computePass.setBindGroup(1, state2.computePass.bindGroups[3]);
          computePass.dispatchWorkgroups(
            Math.ceil(srcWidth2 / blockDim2),
            Math.ceil(srcHeight2 / batch[1])
          );
          computePass.setBindGroup(1, state2.computePass.bindGroups[2]);
          computePass.dispatchWorkgroups(
            Math.ceil(srcHeight2 / blockDim2),
            Math.ceil(srcWidth2 / batch[1])
          );
        }
        computePass.end();
      }
    });
    const settings = {
      filterSize: 35,
      iterations: 10
    };
    let blockDim;
    const updateSettings = () => {
      blockDim = tileDim - (settings.filterSize - 1);
      device.queue.writeBuffer(
        blurParamsBuffer,
        0,
        new Uint32Array([settings.filterSize, blockDim])
      );
    };
    updateSettings();
    function frame() {
      compute();
      draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  postProcessing();
})();
