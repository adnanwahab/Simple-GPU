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
  function createCanvas(width = 500, height = 500) {
    let dpi = devicePixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = width + "px";
    document.body.appendChild(canvas);
    return canvas;
  }
  function isBuffer(buffer) {
    return buffer.__proto__.constructor.name === "GPUBuffer";
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
  async function readBuffer(state, buffer) {
    const device = state.device;
    const commandEncoder = device.createCommandEncoder();
    const C = new Float32Array(buffer.size);
    const CReadCopy = device.createBuffer({
      size: buffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const texture = device.createTexture({
      size: [500, 500, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
    });
    commandEncoder.copyBufferToBuffer(buffer, 0, CReadCopy, 0, buffer.size);
    device.queue.submit([commandEncoder.finish()]);
    await CReadCopy.mapAsync(GPUMapMode.READ);
    C.set(new Float32Array(CReadCopy.getMappedRange()));
    CReadCopy.unmap();
    return C;
  }
  function createBuffer(device, stuff) {
    const buffer = device.createBuffer({
      size: 4,
      mappedAtCreation: true,
      usage: GPUBufferUsage.UNIFORM
    });
    new Uint32Array(buffer.getMappedRange())[0] = stuff;
    buffer.unmap();
    return buffer;
  }
  function makeBuffer(device, size = 4, usage, data, type) {
    const buffer = device.createBuffer({
      size,
      mappedAtCreation: true,
      usage: GPUBufferUsage[usage]
    });
    new type(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
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

  // src/demos/points.js
  async function points() {
    let canvas = document.createElement("canvas");
    canvas.style.background = "aliceblue";
    canvas.width = canvas.height = 256;
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu");
    const presentationSize = [canvas.width, canvas.height];
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
      size: presentationSize
    });
    let vertWGSL = `
    @vertex 
    fn main(@location(0) position : vec2<f32>)
        -> @builtin(position) vec4<f32>{
            // var pos = array<vec2<f32>, 4>(
            //     vec2<f32>( -.9, .9),
            //     vec2<f32>( -.9, .9),
            //     vec2<f32>( .9, .9),
            //     vec2<f32>( .9, -.9));
                return vec4<f32>(position, 0.0, 1.0);
            
        }
    
    `;
    var fragWGSL = `@fragment
    fn main() -> @location(0) vec4<f32> {
        return vec4<f32>(1.0, 0.0, 1.0, 1.0);
    }`;
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: device.createShaderModule({ code: vertWGSL }),
        entryPoint: "main",
        buffers: [
          {
            arrayStride: 0,
            //two vertices so 4 bytes each
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: 0,
                format: `float32x2`
              }
            ]
          }
        ]
      },
      fragment: {
        module: device.createShaderModule({ code: fragWGSL }),
        entryPoint: "main",
        targets: [{ format: presentationFormat }]
      },
      primitive: {
        topology: "point-list",
        stripIndexFormat: void 0
      }
    });
    const renderPassDescriptor = {
      colorAttachments: [{
        view: void 0,
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        storeOp: "store"
      }]
    };
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    let points2 = [
      -0.9,
      0.9,
      -0.9,
      0.9,
      0.9,
      0.9,
      0.9,
      -0.9
    ];
    for (var i = 0; i < 1e6; i++) {
      points2[i] = Math.random();
    }
    const vbo = utils_default.makeBuffer(device, 4 * points2.length, "VERTEX", points2, Float32Array);
    console.log(vbo);
    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vbo);
    passEncoder.draw(points2.length, 1, 0, 0);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
    document.body.appendChild(canvas);
  }
  points();
})();
