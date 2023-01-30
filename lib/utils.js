const createBuffer = (device, arr, usage,) => {
    let desc = {
      size: (arr.byteLength + 3) & ~3,
      usage,
      mappedAtCreation: true,
    };
    let buffer = device.createBuffer(desc);
    arr[5] = Date.now();

    const writeArray =
      arr instanceof Uint16Array
        ? new Uint16Array(buffer.getMappedRange())
        : new Float32Array(buffer.getMappedRange());
    writeArray.set(arr);
    buffer.unmap();

    return buffer;
  };

  const addMouseEvents = function (canvas, data) {
    canvas.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      data.mouseX = x / event.target.clientWidth;
      data.mouseY = y / event.target.clientHeight;
    });
  };

  function createCanvas (width=500, height=500) {

  let dpi = devicePixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = width + "px";
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

function makeBindGroupDescriptor(layout, resourceList,offset=0) {
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

function makeBuffer(device) {
  const buffer = device.createBuffer({
    size: 4,
    mappedAtCreation: true,
    usage: GPUBufferUsage.UNIFORM,
  });
  new Uint32Array(buffer.getMappedRange())[0] = 1;
  buffer.unmap();
  return buffer;
}

const paramsBuffer = function (device) {
  return device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    });
}

function makeBindGroup(device, ...args) {
  return device.createBindGroup(makeBindGroupDescriptor(...args))
}

  export default {
    paramsBuffer,  
    makeBuffer, createBuffer,  createCanvas, addMouseEvents, makeBindGroupDescriptor,
    makeBindGroup
  }