var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp.call(b, prop2))
      __defNormalProp(a, prop2, b[prop2]);
  if (__getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop2))
        __defNormalProp(a, prop2, b[prop2]);
    }
  return a;
};
const addMouseEvents = function(canvas, data) {
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
  device.createTexture({
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
const paramsBuffer = function(device) {
  return device.createBuffer({
    size: 8,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
  });
};
function makeBindGroup$1(device, pipelineLayout, resourceList, offset) {
  return device.createBindGroup(makeBindGroupDescriptor(pipelineLayout, resourceList, offset));
}
var utils = {
  paramsBuffer,
  makeBuffer,
  createBuffer,
  createCanvas,
  addMouseEvents,
  makeBindGroupDescriptor,
  makeBindGroup: makeBindGroup$1,
  readBuffer
};
let count = 0;
function makeTexture(device, textureData, options = {}) {
  if (textureData instanceof GPUTexture)
    return {
      id: count++,
      texture: textureData,
      width: textureData.width,
      height: textureData.height
    };
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
  if (HTMLCanvasElement === textureData.constructor) {
    let texture = device.createTexture({
      size: [textureData.width, textureData.height, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    return {
      id: count++,
      texture,
      width: textureData.width,
      height: textureData.height
    };
  }
  if (ImageBitmap === textureData.constructor) {
    let imageBitmap = textureData;
    let texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      mipLevelCount: options.mipLevelCount,
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
    });
    device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, [imageBitmap.width, imageBitmap.height]);
    return {
      imageBitmap,
      texture,
      width: imageBitmap.width,
      height: imageBitmap.height
    };
  } else if (typeof textureData === "string")
    ;
  else if (typeof textureData === "object") {
    let texture = device.createTexture({
      size: [textureData.width, textureData.height, 1],
      format: textureData.format,
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    return {
      id: count++,
      texture,
      width: textureData.width,
      height: textureData.height
    };
  }
}
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
        buffer: utils.paramsBuffer(device),
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
function makeBindGroup(state2, options) {
  let { device, pipeline } = state2;
  [state2.uniformBuffer, state2.uniforms] = bindUniforms(state2, options, device);
  state2.bindGroupDescriptor = state2.options.bindGroupDescriptor || {
    layout: pipeline.getBindGroupLayout(0),
    entries: []
  };
  let result = options.bindGroup ? options.bindGroup(state2) : device.createBindGroup(state2.bindGroupDescriptor);
  return result;
}
function createRenderPasses(state2, options) {
  let device = state2.device;
  const mainRenderPass = {
    renderPassDescriptor: state2.renderPassDescriptor,
    texture: state2.texture,
    pipeline: state2.pipeline = makePipeline(state2),
    attributes: [],
    type: "draw"
  };
  if (options.uniforms || options.bindGroup) {
    mainRenderPass.bindGroup = makeBindGroup(state2, options);
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
  return utils.makeBuffer(device, cubeVertexArray.byteLength, "VERTEX", cubeVertexArray, Float32Array);
}
const recordRenderPass = function(state2, newScope = {}, CE) {
  var _a, _b, _c, _d, _e;
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
  if ((_a = state2.options) == null ? void 0 : _a.uniforms)
    updateUniforms(state2, device);
  let passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
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
    const icoFaces = utils.makeBuffer(device, _.indices.length * 2, "INDEX", _.indices, Uint16Array);
    passEncoder.setIndexBuffer(icoFaces, "uint16");
    passEncoder.drawIndexed(state2.options.indexCount);
  } else {
    passEncoder.draw(((_b = state2 == null ? void 0 : state2.options) == null ? void 0 : _b.count) || 6, ((_c = state2 == null ? void 0 : state2.options) == null ? void 0 : _c.instances) || 1, 0, 0);
  }
  passEncoder.end();
  {
    state2.wtf = "true";
    const cubeTexture = state2.swapChainTexture || device.createTexture({
      size: [2e3, 2e3],
      format: navigator.gpu.getPreferredCanvasFormat(),
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    });
    commandEncoder.copyTextureToTexture({
      texture: swapChainTexture
    }, {
      texture: cubeTexture
    }, [2e3, 2e3]);
    state2.swapChainTexture = cubeTexture;
  }
  if ((_d = state2 == null ? void 0 : state2.options) == null ? void 0 : _d.postRender) {
    (_e = state2 == null ? void 0 : state2.options) == null ? void 0 : _e.postRender(commandEncoder, swapChainTexture);
  }
  if (!newScope.noSubmit) {
    device.queue.submit([commandEncoder.finish()]);
    delete state2.ctx.commandEncoder;
  }
};
function makePipeline(state2) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  let { device } = state2;
  let pipelineDesc = {
    layout: state2.options.layout || "auto",
    label: ((_a = state2 == null ? void 0 : state2.options) == null ? void 0 : _a.label) || "simple-gpu-draw",
    vertex: {
      module: device.createShaderModule({
        code: ((_c = (_b = state2 == null ? void 0 : state2.options) == null ? void 0 : _b.shader) == null ? void 0 : _c.code) || state2.options.vert
      }),
      entryPoint: ((_e = (_d = state2 == null ? void 0 : state2.options) == null ? void 0 : _d.shader) == null ? void 0 : _e.vertEntryPoint) || "main"
    },
    fragment: {
      module: device.createShaderModule({
        code: ((_g = (_f = state2 == null ? void 0 : state2.options) == null ? void 0 : _f.shader) == null ? void 0 : _g.code) || state2.options.frag
      }),
      entryPoint: ((_i = (_h = state2 == null ? void 0 : state2.options) == null ? void 0 : _h.shader) == null ? void 0 : _i.fragEntryPoint) || "main",
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
      topology: ((_j = state2 == null ? void 0 : state2.options) == null ? void 0 : _j.primitive) || "triangle-list"
    },
    cullMode: "back",
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
    pipelineDesc.vertex.buffers.push({
      arrayStride: 4 * state2.options.attributes.position.data[0].length,
      attributes: [
        {
          shaderLocation: 0,
          offset: 0,
          format: state2.options.attributes.position.format
        },
        {
          shaderLocation: 1,
          offset: ((_l = (_k = state2.options.attributes) == null ? void 0 : _k.uv) == null ? void 0 : _l.offset) || 0,
          format: "float32x2"
        }
      ]
    });
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
        clearValue: { r: 0.1, g: 0.1, b: 0.3, a: 1 },
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
  return device.createRenderPipeline(__spreadValues({}, pipelineDesc));
}
async function init(options = {}) {
  let canvas = options.canvas || utils.createCanvas();
  let ctx = {};
  const state2 = {
    renderPassDescriptor: {},
    options,
    compute: options.compute,
    renderPasses: [],
    canvas,
    ctx
  };
  if (!navigator.gpu)
    return alert("Error: webgpu is not available. Please install canary!!!");
  const context = canvas.getContext("webgpu");
  const adapter = await navigator.gpu.requestAdapter();
  const device = await (adapter == null ? void 0 : adapter.requestDevice({}));
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  Object.assign(state2, {
    device,
    context,
    adapter
  });
  context.configure({
    device,
    format: presentationFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
    alphaMode: "opaque"
  });
  function texture(img, options2) {
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "nearest"
    });
    const texture2 = makeTexture(device, img, options2);
    return {
      id: texture2.id,
      data: img,
      texture: texture2.texture,
      sampler,
      width: texture2.width,
      height: texture2.height,
      imageBitmap: texture2.imageBitmap,
      read: async function(n) {
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
    let localState = __spreadValues({}, state2);
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
  function initDrawCall(options2) {
    let localState = Object.assign(Object.create(state2), {
      options: options2,
      device,
      renderPasses: [],
      wtf: true
    });
    createRenderPasses(localState, options2);
    function draw(newScope = {}, commandEncoder) {
      if (Array.isArray(newScope))
        return newScope.map((scope) => draw(scope));
      {
        localState.renderPasses[0].bindGroup = makeBindGroup(localState, options2);
      }
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
    draw.swapAttributeBuffer = function(data, i) {
      localState.options.attributeBufferData[i] = data;
    };
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
    ({
      viewportWidth: 500,
      viewportHeight: 500,
      tick: performance.now()
    });
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
export { init as default };
