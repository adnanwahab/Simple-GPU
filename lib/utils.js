const addMouseEvents = function (canvas, data) {
  canvas.addEventListener("mousemove", (event) => {
    let x = event.pageX;
    let y = event.pageY;
    data.mouseX = x / event.target.clientWidth;
    data.mouseY = y / event.target.clientHeight;
  });
};

function createCanvas (width=1000, height=1000) {
  let dpi = devicePixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = width + "px";
    //canvas.style.height = height + "px";

    document.body.appendChild(canvas)
    return canvas;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => { 
      resolve() 
    }, ms)
  })
}


function isBuffer(buffer) {
  return buffer.__proto__.constructor.name === 'GPUBuffer'
}

function makeResource(resource) {
  return isBuffer(resource) ? {buffer: resource} : resource
}

function makeBindGroupDescriptor(layout, resourceList, offset=0) {
return {
    layout,
    entries: resourceList.map((resource, i) => {
      return {
        binding:i+offset,
        resource: makeResource(resource)
      }
    })
  }
}


async function readBuffer(state, buffer, flag=false) {
  const constructor = flag ? Float32Array : Uint32Array

  const device = state.device;
  const commandEncoder = device.createCommandEncoder()
  const C = new constructor(buffer.size)
  const CReadCopy = device.createBuffer({
    size: buffer.size, 
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
  })

  const texture = device.createTexture({
    size: [500, 500, 1],
    format:  "rgba8unorm",
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT |
      GPUTextureUsage.STORAGE_BINDING,
  });

  commandEncoder
  .copyBufferToBuffer(buffer, 0, CReadCopy, 0, buffer.size)

  // commandEncoder
  // .copyBufferToTexture(buffer, texture, buffer.size)

  device.queue.submit([commandEncoder.finish()])

  await CReadCopy.mapAsync(GPUMapMode.READ);
  C.set(new constructor(CReadCopy.getMappedRange()))
  CReadCopy.unmap()



  return C
}


function createBuffer(device, stuff) {
  const buffer = device.createBuffer({
    size: 4,
    mappedAtCreation: true,
    usage: GPUBufferUsage.UNIFORM,
  });
  new Uint32Array(buffer.getMappedRange())[0] = stuff;
  buffer.unmap();
  return buffer;
}

function makeBuffer(device, size=4, usage, data, type) {
  const buffer = device.createBuffer({
    size,
    mappedAtCreation: true,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    | GPUBufferUsage.COPY_SRC,
  });

  new type(buffer.getMappedRange()).set(data)

  buffer.unmap();
  return buffer;
}

const paramsBuffer = function (device) {
  return device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    });
}

function makeBindGroup(device, pipelineLayout, resourceList, offset) {
//  console.log(makeBindGroupDescriptor(pipelineLayout, resourceList, offset))
  return device.createBindGroup(makeBindGroupDescriptor(pipelineLayout, resourceList, offset))
}


// helper methods for debugging compute shader buffers
// copy buffer to texture -> 
// render texture to screen - make helpers 



function makeBuffer2(stuff, flag, label) {
  const particleSize = 4
  const gpuBufferSize = 134217728

  const gpuBuffer = webgpu.device.createBuffer({
    label,
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  gpuBuffer.source = stuff
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());

  if (stuff && stuff.flat) (stuff = stuff.flat(), label)
  particlesBuffer.set(stuff)
  gpuBuffer.unmap();
  return gpuBuffer
} 



  export default {
    paramsBuffer,  
    makeBuffer, createBuffer,  createCanvas, addMouseEvents, makeBindGroupDescriptor,
    makeBindGroup, readBuffer, makeBuffer
  }