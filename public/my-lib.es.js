var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const createBuffer = (device, arr, usage) => {
  let desc = {
    size: arr.byteLength + 3 & ~3,
    usage,
    mappedAtCreation: true
  };
  let buffer2 = device.createBuffer(desc);
  arr[5] = Date.now();
  const writeArray = arr instanceof Uint16Array ? new Uint16Array(buffer2.getMappedRange()) : new Float32Array(buffer2.getMappedRange());
  writeArray.set(arr);
  buffer2.unmap();
  return buffer2;
};
const addMouseEvents = function(canvas, data) {
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
var utils = {
  createBuffer,
  createCanvas,
  addMouseEvents
};
let makeImgTexture = async (state2) => {
  const img = document.createElement("img");
  const source = img;
  source.width = innerWidth;
  source.height = innerHeight;
  img.src = state2.data.texture;
  await img.decode();
  return await createImageBitmap(img);
};
async function makeTexture(state2) {
  var _a, _b;
  if (HTMLImageElement === ((_b = (_a = state2 == null ? void 0 : state2.data) == null ? void 0 : _a.texture) == null ? void 0 : _b.constructor)) {
    let img = state2.data.texture;
    await img.decode();
    await createImageBitmap(img);
    await img.decode();
    let imageBitmap = await createImageBitmap(img);
    let texture = state2.device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    state2.device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, [imageBitmap.width, imageBitmap.height]);
    state2.texture = texture;
    updateTexture(state2);
    return texture;
  } else if (typeof state2.data.texture === "string") {
    let texture = state2.device.createTexture({
      size: [900, 500, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    let imageBitmap = await makeImgTexture(state2);
    state2.device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, [imageBitmap.width, imageBitmap.height]);
    state2.texture = texture;
    updateTexture(state2);
    return texture;
  } else {
    let texture = state2.device.createTexture({
      size: [256, 1, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    let music = new Float32Array(new Array(800).fill(5).map((d, i) => state2.data.texture ? state2.data.texture[i % state2.data.texture.length + d] : Math.random()));
    state2.texture = texture;
    state2.data.music = music;
    updateTexture(state2);
    return texture;
  }
}
function updateTexture(state2) {
  if (!state2.texture)
    return;
  if (state2.data.texture) {
    let data = new Uint8Array(new Array(1024).fill(5).map((d, i) => {
      return state2.data.texture ? state2.data.texture[i % state2.data.texture.length] : Math.random();
    }));
    state2.device.queue.writeTexture({ texture: state2.texture }, data.buffer, {
      bytesPerRow: 3200,
      rowsPerImage: 600
    }, [256, 1]);
  }
}
function updateUniforms(state2) {
  let { data, device } = state2;
  let values = Object.values(data).filter((val) => typeof val !== "object");
  let uniformsArray = new Float32Array(values.length);
  uniformsArray.set(values, 0);
  if (state2.uniformsBuffer) {
    device.queue.writeBuffer(state2.uniformsBuffer, 0, uniformsArray.buffer, 0, 4 * uniformsArray.length);
    return state2.uniformsBuffer;
  } else {
    return state2.uniformsBuffer = utils.createBuffer(device, uniformsArray, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
  }
}
function createRenderPasses(state2) {
  var _a;
  let {
    particleBuffers,
    computeVertexBufferData,
    device
  } = state2;
  const bindGroup = device.createBindGroup(state2.bindGroupDescriptor);
  const mainRenderPass = {
    renderPassDescriptor: state2.renderPassDescriptor,
    texture: state2.texture,
    pipeline: state2.pipeline,
    bindGroup,
    type: "draw"
  };
  if ((_a = state2 == null ? void 0 : state2.compute) == null ? void 0 : _a.numVertices)
    mainRenderPass.numVertices = state2.compute.numVertices();
  if (state2.compute && particleBuffers)
    mainRenderPass.vertexBuffers = [
      particleBuffers[0],
      computeVertexBufferData
    ];
  state2.renderPasses.push(mainRenderPass);
}
const recordRenderPass = async function(state2) {
  let { device, renderPassDescriptor } = state2;
  renderPassDescriptor.colorAttachments[0].view = state2.context.getCurrentTexture().createView();
  const commandEncoder = device.createCommandEncoder();
  let _ = state2.renderPasses[0];
  if (!_)
    return console.log("no worky");
  let cubeVertexArray = new Float32Array(state2.options.attributes.position.array.flat());
  const verticesBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  });
  new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
  verticesBuffer.unmap();
  let passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(_.pipeline);
  passEncoder.setBindGroup(0, _.bindGroup);
  passEncoder.setVertexBuffer(0, verticesBuffer);
  passEncoder.draw(3, 1, 0, 0);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
};
async function makePipeline(state2) {
  let { device } = state2;
  const cubeVertexArray = new Float32Array(new Array(1e4).fill(5).map((_, i) => {
    let n = i / 1e3;
    if (i % 2 === 1)
      return n % 1;
    if (i % 2 === 0)
      return n / 10;
  }));
  const verticesBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  });
  new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
  verticesBuffer.unmap();
  state2.cubeVertices = verticesBuffer;
  let pipelineDesc = {
    layout: "auto",
    vertex: {
      module: device.createShaderModule({
        code: state2.options.vert
      }),
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 2 * 4,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2"
            },
            {
              shaderLocation: 1,
              offset: 0,
              format: "float32x2"
            }
          ]
        }
      ]
    },
    fragment: {
      module: device.createShaderModule({
        code: state2.options.frag
      }),
      entryPoint: "main",
      targets: [{ format: "bgra8unorm" }]
    },
    primitive: {
      topology: "triangle-list"
    }
  };
  if (state2.compute) {
    applyCompute(pipeline.vertexBuffers);
  }
  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "nearest"
  });
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        buffer: {
          type: "uniform",
          minBindingSize: 4 * 7
        }
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        type: "sampler",
        sampler
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
        texture: {}
      }
    ]
  });
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout]
  });
  state2.bindGroupLayout = bindGroupLayout;
  updateUniforms(state2);
  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: void 0,
        clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
        loadOp: "clear",
        storeOp: "store"
      }
    ]
  };
  state2.renderPassDescriptor = renderPassDescriptor;
  let pipeline = device.createRenderPipeline(__spreadProps(__spreadValues({}, pipelineDesc), {
    layout: pipelineLayout
  }));
  let texture = await makeTexture(state2);
  state2.bindGroupDescriptor = {
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: state2.uniformsBuffer }
      },
      {
        binding: 1,
        resource: sampler
      },
      {
        binding: 2,
        resource: texture.createView({
          baseMipLevel: 0,
          mipLevelCount: 1
        }),
        texture: {
          sampleType: "float",
          viewDimension: "2d",
          multisampled: 0
        }
      }
    ]
  };
  state2.bindGroupDescriptor.entries[0].resource.buffer = updateUniforms(state2);
  state2.bindGroupDescriptor.entries[2].resource = texture.createView({
    baseMipLevel: 0,
    mipLevelCount: 1
  });
  return pipeline;
}
async function compile(state2, options) {
  state2.options.shader;
  state2.pipeline = await makePipeline(state2);
  createRenderPasses(state2);
}
let defaultData = {
  width: innerWidth,
  height: innerHeight,
  pixelRatio: 2,
  time: 0,
  mouseX: 0,
  mouseY: 0,
  angle: 0
};
async function init(options = {}) {
  let canvas = options.canvas || utils.createCanvas();
  const state2 = {
    renderPassDescriptor: {},
    options,
    data: Object.assign(defaultData, options.data),
    compute: options.compute,
    renderPasses: []
  };
  utils.addMouseEvents(canvas, state2.data);
  if (!navigator.gpu)
    return console.log("Error: webgpu is not available. Please install canary!!!");
  const context = canvas.getContext("webgpu");
  const adapter = await navigator.gpu.requestAdapter();
  const device = await (adapter == null ? void 0 : adapter.requestDevice());
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  Object.assign(state2, {
    device,
    context,
    adapter
  });
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "opaque",
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });
  function draw(newScope) {
    if (Array.isArray(newScope))
      return newScope.map((scope) => draw(scope));
    updateTexture(state2);
    updateUniforms(state2);
    recordRenderPass(state2);
    return draw;
  }
  draw.canvas = canvas;
  draw.prop = prop;
  draw.buffer = buffer;
  draw.initDrawCall = initDrawCall;
  draw.state = state2;
  draw.draw = draw;
  return {
    initDrawCall,
    buffer,
    prop,
    clear,
    frame,
    version: "0.10.0"
  };
  function frame(cb) {
    requestAnimationFrame(function anon() {
      cb();
      requestAnimationFrame(anon);
    });
  }
  async function initDrawCall(options2) {
    state2.options = options2;
    await compile(state2, state2.options);
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
  return () => {
    return state.uniforms.color;
  };
}
var main = { init };
export { main as default };
