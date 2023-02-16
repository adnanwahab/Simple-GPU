"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });

  // lib/utils.js
  var addMouseEvents = function(canvas, data) {
    canvas.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      data.mouseX = x / event.target.clientWidth;
      data.mouseY = y / event.target.clientHeight;
    });
  };
  function createCanvas(width = 500, height = 500) {
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
  function createBuffer(device, stuff2) {
    const buffer2 = device.createBuffer({
      size: 4,
      mappedAtCreation: true,
      usage: GPUBufferUsage.UNIFORM
    });
    new Uint32Array(buffer2.getMappedRange())[0] = stuff2;
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
    makeBindGroup
  };

  // src/demos/icosahedron.js
  var import_esm = __require("https://unpkg.com/gl-matrix@3.1.0/esm/index.js");

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
      console.log(options.uniforms[key]);
      if (options.uniforms[key].isProp)
        continue;
      let result = options.uniforms[key](context);
      size += result.byteLength || 4;
      stuff[key] = function(a) {
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
      size: [500 * devicePixelRatio, 500 * devicePixelRatio],
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
    const device = await adapter?.requestDevice();
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
      canvas
    };
    function initComputeCall(options2) {
      let localState = {
        ...state2
      };
      localState.compute = options2;
      createComputePass(options2, localState);
      function compute(options3, CE) {
        localState.compute.exec(localState, CE);
      }
      compute.submit = function() {
        state2.device.queue.submit([state2.commandEncoder.finish()]);
        delete state2.commandEncoder;
      };
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

  // src/demos/icosahedron.js
  async function main() {
    const webgpu = await main_default();
    const canvas = webgpu.canvas;
    const VERTS = [
      [-1, -1.6180340051651, 0],
      [
        1,
        -1.6180340051651,
        0
      ],
      [
        -1,
        1.6180340051651,
        0
      ],
      [
        1,
        1.6180340051651,
        0
      ],
      [
        0,
        -1,
        -1.6180340051651
      ],
      [
        0,
        1,
        -1.6180340051651
      ],
      [
        0,
        -1,
        1.6180340051651
      ],
      [
        0,
        1,
        1.6180340051651
      ],
      [
        -1.6180340051651,
        0,
        -1
      ],
      [
        -1.6180340051651,
        0,
        1
      ],
      [
        1.6180340051651,
        0,
        -1
      ],
      [
        1.6180340051651,
        0,
        1
      ]
    ];
    const icoFaceData = [
      5,
      2,
      3,
      6,
      0,
      1,
      8,
      2,
      5,
      9,
      0,
      6,
      9,
      6,
      7,
      9,
      2,
      8,
      10,
      1,
      4,
      10,
      4,
      5,
      11,
      3,
      7,
      11,
      1,
      10,
      4,
      1,
      0,
      7,
      3,
      2,
      8,
      4,
      0,
      8,
      5,
      4,
      9,
      7,
      2,
      9,
      8,
      0,
      10,
      5,
      3,
      11,
      6,
      1,
      11,
      7,
      6,
      11,
      10,
      3
    ];
    const matrixBuffer = new Float32Array(3 * 16);
    const a = matrixBuffer.subarray(0, 16);
    const b = matrixBuffer.subarray(16, 32);
    const c2 = matrixBuffer.subarray(32, 48);
    const shader = {
      code: `
struct Camera {
  model: mat4x4<f32>,
  view: mat4x4<f32>,
  proj: mat4x4<f32>,
}
@binding(0) @group(0) var<uniform> camera : Camera;
struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) fragColor : vec3<f32>,
}
@vertex
fn vertMain(
    @location(0) meshPosition : vec3<f32>
) -> VertexOutput {
  var result : VertexOutput;
  result.clipPosition = camera.proj * camera.view * camera.model * vec4(meshPosition, 1.);
  result.fragColor = 0.25 * (2. + meshPosition);
  return result;
}
  
@fragment
fn fragMain(@location(0) fragColor : vec3<f32>) -> @location(0) vec4<f32> {
    return vec4(fragColor, 1.0);
}`
    };
    const draw = await webgpu.initDrawCall({
      label: "postprocess-draw",
      shader: {
        code: shader.code,
        fragEntryPoint: "fragMain",
        vertEntryPoint: "vertMain"
      },
      attributes: {
        position: new webgpu.attribute(VERTS, 0, 3)
      },
      indices: icoFaceData,
      indexCount: icoFaceData.length,
      uniforms: {
        fromRotation: ({ tick }) => import_esm.mat4.fromRotation(a, 1e-3 * tick, [0.3, 0.5, -0.2]),
        lookAt: () => import_esm.mat4.lookAt(b, [0, 0, -5], [0, 0, 0], [0, 1, 0]),
        projection: () => import_esm.mat4.perspective(c2, Math.PI / 4, canvas.width / canvas.height, 0.01, 50)
      }
    });
    function frame(tick) {
      draw();
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  main();
})();
