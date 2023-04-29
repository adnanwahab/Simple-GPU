import utils from "./utils";
import {updateTexture, makeTexture} from './Texture';
import {makeShaderModule} from './shader'
import { createComputePass } from "./computePass";

//hardcode the grid

function isFunction(fn) {
  return fn.call
}

function bindUniforms(state, options, device) {
  const context = {tick: Date.now()}
  let size = 0
  let uniforms = {}
  for (let key in options.uniforms) {
    if (! isFunction(options.uniforms[key])) continue
    if (options.uniforms[key].isProp) continue
    let result = options.uniforms[key](context)
    size += result.byteLength || 4
    uniforms[key] = function (a) { device.queue.writeBuffer(state.uniformBuffer, size, a.buffer, a.byteOffset, a.byteLength)}

    // if (options.uniforms[key].texture) continue;
    // let result
    // if (isFunction(options.uniforms[key]))  {
    //   result = options.uniforms[key](context)
    // } else {
    //   result = options.uniforms[key]
    // }
    // if (result.byteLength) {
    //   size += result.byteLength
    //   uniforms[key] = function (a) { device.queue.writeBuffer(state.uniformBuffer, size, a.buffer, a.byteOffset, a.byteLength)}
    // } else {
    //   size += 4
    //   uniforms[key] = function (a) { device.queue.writeBuffer(state.uniformBuffer, size, a, 0, 4)}
    // }
    //}
  }

  const uniformBuffer = device.createBuffer({
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  return [uniformBuffer, uniforms]
}

function makeBindGroup(state, options) {
  let {device, pipeline} = state;
    //TODO Construct dynamically
    [state.uniformBuffer, state.uniforms] = bindUniforms(state, options, device)
  
    state.bindGroupDescriptor = state.options.bindGroupDescriptor || {
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        // {
        //   binding: 0,
        //   resource: { buffer: state.uniformBuffer },
        // },
      ],
    };
//  console.log(state.options?.uniforms?.texture)
//console.log(state)
  //  if (state.options?.texture) {
  //   let texture = state.options.texture
  //   state.bindGroupDescriptor.entries.push(
  //     {
  //       binding: 1,
  //       resource: texture.sampler,
  //     },
  //     {
  //       binding: 2,
  //       resource: texture.texture.createView(),
  //     },
  //   )}
    let result = options.bindGroup
    ?  options.bindGroup(state)
    : device.createBindGroup(state.bindGroupDescriptor)


      //result._source = state

    return result
}


function createRenderPasses(state,options) {
  let device = state.device;

  const mainRenderPass = {
    renderPassDescriptor: state.renderPassDescriptor,
    texture: state.texture,
    pipeline: state.pipeline = makePipeline(state, options),
    attributes: [],
    type: "draw",
  };
 
  if (options.uniforms || options.bindGroup) {
    // console.log(options)
    mainRenderPass.bindGroup = makeBindGroup(state, options);
  }

  if (options.indices) {
    mainRenderPass.indices = options.indices;
  }
    
  for (var key in state.options.attributes) {
    mainRenderPass.attributes.push(updateAttributes(state, device, key))
  }

 state.renderPasses.push(mainRenderPass);
}

function updateUniforms(state, device, newScope) {
  let size = 0
  const context = {tick: Date.now()}

  for (let key in state.options.uniforms) {
    if (! isFunction(state.options.uniforms[key])) continue
    if (state.options.uniforms[key].isProp) {

      return 
    }
    
    let result = isFunction(state.options.uniforms[key])
    ? state.options.uniforms[key](context) : state.options.uniforms[key]

    device.queue.writeBuffer(state.uniformBuffer, size, result.buffer, result.byteOffset, result.byteLength)
    size += result.byteLength
  }
  // for (let key in state.uniforms) {
  //   let result = state.options.uniforms[key](context)
  //   state.uniforms[key](result)
  // }

  // for (let key in state.options.uniforms) {
  //   if (! isFunction(state.options.uniforms[key])) continue
    
  //   let result = isFunction(state.options.uniforms[key])
  //   ? state.options.uniforms[key](context) : state.options.uniforms[key]

  //   device.queue.writeBuffer(state.uniformBuffer, size, result.buffer, result.byteOffset, result.byteLength)
  //   size += result.byteLength
  // }
}

function isTypedArray(array) {
  return array.subarray

}

function updateAttributes(state, device, name) {
  let cubeVertexArray 
  if (isTypedArray(state.options.attributes)) {
    cubeVertexArray = state.options.attributes[name]
  } else {
    cubeVertexArray  = new Float32Array(state.options.attributes[name].data.flat());
  }
  return utils.makeBuffer(device, cubeVertexArray.byteLength, 'VERTEX', cubeVertexArray, Float32Array)
}

const recordRenderPass = function (state, newScope={}, CE) {
  let { device, renderPassDescriptor } = state;

  const swapChainTexture = state.context.getCurrentTexture()
  if (state.options.renderPassDescriptor) {
  renderPassDescriptor = state.options.renderPassDescriptor
  } else {
    renderPassDescriptor.colorAttachments[0].view = swapChainTexture.createView();
  }

  const commandEncoder = CE || state.ctx.commandEncoder|| device.createCommandEncoder();
  state.ctx.commandEncoder = commandEncoder

  let _ = state.renderPasses[0]
  if (! _) return console.log('no worky')

  if (state.options?.uniforms) updateUniforms(state, device, newScope)

  let passEncoder = commandEncoder.beginRenderPass(
    renderPassDescriptor
    );

  if (state.options.attributeBufferData) {
    for (let i = 0; i < state.options.attributeBufferData.length; i++) {
      passEncoder.setVertexBuffer(i, state.options.attributeBufferData[i]);
    }
  } else {
    for (let i = 0; i < _.attributes.length; i++) {
      passEncoder.setVertexBuffer(i, _.attributes[i]);
    }
  }

  passEncoder.setPipeline(_.pipeline);

  if (_.bindGroup) {
    if (Array.isArray(_.bindGroup)) {
      _.bindGroup.forEach(function (bg, i) {
        passEncoder.setBindGroup(i, bg);
      })
    }
    else passEncoder.setBindGroup(0, _.bindGroup);
  } 
  if (_.indices) { 
    const icoFaces = utils.makeBuffer(device, _.indices.length * 2, 'INDEX', _.indices, Uint16Array)

    passEncoder.setIndexBuffer(icoFaces, 'uint16')

    passEncoder.drawIndexed(state.options.indexCount) 
  }
  else { 
    passEncoder.draw(state?.options?.count || 6, state?.options?.instances || 1, 0, 0)
  }
  passEncoder.end();
 
  if (true) {
    state.wtf = 'true'
    const cubeTexture = state.swapChainTexture || device.createTexture({
      size: [2000, 2000],
      format: navigator.gpu.getPreferredCanvasFormat(),
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
  
    commandEncoder.copyTextureToTexture(
      {
        texture: swapChainTexture,
      },
      {
        texture: cubeTexture,
      },
      [2000, 2000]
    );
    state.swapChainTexture = cubeTexture;

  }
  if (state?.options?.postRender){
  state?.options?.postRender(commandEncoder, swapChainTexture)
}
  if (! newScope.noSubmit) {
    device.queue.submit([commandEncoder.finish()]); 
    delete state.ctx.commandEncoder 
  }
};

function makePipeline(state) {
  let { device } = state;

  let pipelineDesc = {
    layout: state.options.layout || "auto",
    label: state?.options?.label || 'simple-gpu-draw',
    vertex: {
      module: device.createShaderModule({
        code: state?.options?.shader?.code || state.options.vert,
      }),
      entryPoint: state?.options?.shader?.vertEntryPoint || "main",
    },
    fragment: {
      module: device.createShaderModule({
        code: state?.options?.shader?.code || state.options.frag,
      }),
      entryPoint: state?.options?.shader?.fragEntryPoint || "main",
      targets: 
      state.options.targets ?
      state.options.targets.map((format) => { return {format}}) :[
      
        { 
        format: navigator.gpu.getPreferredCanvasFormat(),
        blend: state.options.blend
      }
    ],
    },
    primitive: {
      topology: state?.options?.primitive || "triangle-list",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus'
    },
  };


  if (state.options.attributeBuffers) {

    pipelineDesc.vertex.buffers = state.options.attributeBuffers


  } else if (state.options.attributes) {
    // pipelineDesc.vertex.buffers = [
    //   {arrayStride : 4 * state.options.attributes.position.data[0].length,
    //     attributes:   Object.values(state.options.attributes).map((descriptor, i) => {
    //       console.log(i, descriptor.offset, descriptor.format)
    //       return {
    //         shaderLocation: i,
    //         offset: descriptor.offset || 0,
    //         format: descriptor.format
    //       }
    //     })
    //   }
    // ]
    pipelineDesc.vertex.buffers = []
    pipelineDesc.vertex.buffers.push(
      {
        arrayStride: 4 * state.options.attributes.position.data[0].length, //two vertices so 4 bytes each
        attributes: [
          {
            // position
            shaderLocation: 0,
            offset: 0, 
            format: state.options.attributes.position.format,
          },
          {
            // color
            shaderLocation: 1,
            offset: state.options.attributes?.uv?.offset || 0,
            //format: state.options.attributes.uv.format,
            format: 'float32x2'
          },
        ],
      }
    )
  }

  const depthTexture = device.createTexture({
    size: [1000 * devicePixelRatio, 1000 * devicePixelRatio],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const renderPassDescriptor = {
    colorAttachments: [
    {
        view: void 0,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),

      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };

  state.renderPassDescriptor = renderPassDescriptor;

  return device.createRenderPipeline({...pipelineDesc });
}

async function init(options={}) {
  let canvas = options.canvas || utils.createCanvas();
  let ctx = {}

  const state = {
    renderPassDescriptor: {},
    options,
    compute: options.compute, //user data
    renderPasses: [], //internal state
    canvas,
    ctx
  };

  if (! navigator.gpu) return alert('Error: webgpu is not available. Please install canary!!!')

  const context = canvas.getContext("webgpu");
  const adapter = (await navigator.gpu.requestAdapter());
  const device = (await adapter?.requestDevice({
//    requiredFeatures: ["timestamp-query"],
//https://omar-shehata.medium.com/how-to-use-webgpu-timestamp-query-9bf81fb5344a
//https://www.graphics.rwth-aachen.de/media/papers/splatting1.pdf
  }));
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  Object.assign(state, {
    device,
    context,
    adapter,
  });

  context.configure({
    device,
    format: presentationFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
    alphaMode: "opaque",
  });

  function texture(img, options) {
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "nearest",
    });

    const texture = makeTexture(device, img, options)
    
    return {
      id: texture.id,
      data: img,
      texture: texture.texture,
      sampler,
      width: texture.width, 
      height: texture.height,
      imageBitmap: texture.imageBitmap,
      read: async function (n) {
        const C = new Float32Array(n * n)

        const CReadCopy = device.createBuffer({
          size: m * n * 4, 
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        })
        await CReadCopy.mapAsync(GPUMapMode.READ);
        c.set(new Float32Array(CReadCopy.getMappedRange()))
        CReadCopy.unmap()
        return c
      } 
    }
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
    state
  }

  

  function initComputeCall(options) {
    //make multiple computes possible with a localState variable
    let localState = {  
      ...state
    }
    localState.compute = options
    createComputePass(options, localState)


    function compute(options, CE) {
      localState.compute.exec(localState, CE)
      return localState
    }
    compute.submit = function () {
      state.device.queue.submit([state.commandEncoder.finish()]);
      delete state.commandEncoder
    }
    compute.state = state;
    return compute
  }
  function frame(cb) {
    requestAnimationFrame(function recur() {
      cb()
      requestAnimationFrame(recur)
    })
  }
  function initDrawCall (options) {
    let localState = Object.assign(Object.create(state),
    {
      options,
      device, 
      renderPasses: [],
      wtf: true
    })
 
    createRenderPasses(localState, options);

    function draw(newScope={}, commandEncoder) {
      if (Array.isArray(newScope)) return newScope.map((scope) => draw(scope))
      if (true) {
        //localState.options.texture = newScope.texture
        localState.renderPasses[0].bindGroup = makeBindGroup(localState, options);
      }
      recordRenderPass(localState, newScope, commandEncoder);
      return draw;
    }
  
    draw.canvas = canvas
    draw.prop = prop
    draw.buffer = buffer
    draw.initDrawCall = initDrawCall
    draw.state = localState
    draw.draw = draw
    draw.state = localState

    draw.swapAttributeBuffer = function (data, i) {
      //console.log(localState)
      localState.options.attributeBufferData[0] = data
    }

    return draw
  }
}

function clear(options) {
  state.clearValue.r = options.color[0]
  state.clearValue.g = options.color[1]
  state.clearValue.b = options.color[2]
}

function buffer(array) {
  if (! (this instanceof buffer)) return new buffer(array);
  this.array = array
}

function prop(name) {
  let functor = (state, newScope) => {
    let context = {
        viewportWidth: 500,
        viewportHeight: 500,
        tick: performance.now()
    }
    //let val = (typeof state.uniforms[name] === 'function') ? state.uniforms[name](context) : state.uniforms[name]
    return newscope[name]
  }
  functor.isProp = true

  return functor
}

function attribute(data, offset, format) {
  return {
    data, offset, format: `float32x${format}`
  }
}

export default init; 
