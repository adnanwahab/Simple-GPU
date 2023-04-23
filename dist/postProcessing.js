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
  async function readBuffer(state2, buffer, flag = false) {
    const constructor = flag ? Float32Array : Uint32Array;
    const device = state2.device;
    const commandEncoder = device.createCommandEncoder();
    const C = new constructor(buffer.size);
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
    C.set(new constructor(CReadCopy.getMappedRange()));
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

  // src/demos/postProcessing.js
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
  //return vec4<f32>(1, 0., 0., 1.);
  return textureSample(myTexture, mySampler, fragUV);
}
`;
  async function postProcessing(webgpu, texture) {
    let device = webgpu.device;
    let context = webgpu.context;
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear"
    });
    const cubeTexture = texture;
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
            cubeTexture.createView(),
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
          iterations: 1
        };
        const [srcWidth2, srcHeight2] = [2e3, 2e3];
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
    console.log(555);
    return function frame() {
      compute();
    };
  }
  var postProcessing_default = postProcessing;
})();
