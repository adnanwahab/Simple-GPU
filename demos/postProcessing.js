import webgpuInit from "../lib/main";
import utils from '../lib/utils'

const tileDim = 128;
//change to sepia and glow
const blurWGSL = `struct Params {
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
`
const fullscreenTexturedQuadWGSL = `
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
`

const batch = [4, 4];

async function postProcessing() {
  let webgpu = await webgpuInit()
  let device = webgpu.device;
  let canvas = webgpu.canvas
  let context = webgpu.context;

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  
    const blurPipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({
          code: blurWGSL,
        }),
        entryPoint: 'main',
      },
    });
  
    const fullscreenQuadPipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: fullscreenTexturedQuadWGSL,
        }),
        entryPoint: 'vert_main',
      },
      fragment: {
        module: device.createShaderModule({
          code: fullscreenTexturedQuadWGSL,
        }),
        entryPoint: 'frag_main',
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });
  
    const sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });
  
    const img = document.createElement('img');
    img.src = new URL(
      '../data/webgpu.png',
      import.meta.url
    ).toString();
    await img.decode();  

    const cubeTexture = await webgpu.texture(img)
  
    const [srcWidth, srcHeight] = [cubeTexture.width, cubeTexture.height];

    const textures = [
      (await webgpu.texture([srcWidth, srcHeight])).texture,
      (await webgpu.texture([srcWidth, srcHeight])).texture,
    ]
  
    const buffer0 = utils.createBuffer(device, 0)

  
    const buffer1 =  utils.createBuffer(device, 1)
  
    const blurParamsBuffer = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
    });
  
    const computeConstants = device.createBindGroup({
      layout: blurPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: sampler,
        },
        {
          binding: 1,
          resource: {
            buffer: blurParamsBuffer,
          },
        },
      ],
    });
  
    const computeBindGroup0 = utils.makeBindGroup(device, [
      blurPipeline.getBindGroupLayout(1),
      [cubeTexture.texture.createView(),
      textures[0].createView(),
      buffer0], 1
    ])

    const computeBindGroup1 = utils.makeBindGroup(device, [
      blurPipeline.getBindGroupLayout(1),
      [textures[0].createView(),
      textures[1].createView(),
      buffer1], 1
    ])

    const computeBindGroup2 = utils.makeBindGroup(device, [
      blurPipeline.getBindGroupLayout(1),
      [textures[1].createView(),
      textures[0].createView(),
      buffer0], 1
    ])

    const showResultBindGroup = utils.makeBindGroup(device, [
      fullscreenQuadPipeline.getBindGroupLayout(0),
      [sampler,
      textures[1].createView(),
      ]
    ])
  
    // const showResultBindGroup = device.createBindGroup({
    //   layout: fullscreenQuadPipeline.getBindGroupLayout(0),
    //   entries: [
    //     {
    //       binding: 0,
    //       resource: sampler,
    //     },
    //     {
    //       binding: 1,
    //       resource: textures[1].createView(),
    //     },
    //   ],
    // });
  
    const settings = {
      filterSize: 35,
      iterations: 10,
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
      const commandEncoder = device.createCommandEncoder();
  
      const computePass = commandEncoder.beginComputePass();
      computePass.setPipeline(blurPipeline);
      computePass.setBindGroup(0, computeConstants);
  
      computePass.setBindGroup(1, computeBindGroup0);
      computePass.dispatchWorkgroups(
        Math.ceil(srcWidth / blockDim),
        Math.ceil(srcHeight / batch[1])
      );
  
      computePass.setBindGroup(1, computeBindGroup1);
      computePass.dispatchWorkgroups(
        Math.ceil(srcHeight / blockDim),
        Math.ceil(srcWidth / batch[1])
      );
  
      for (let i = 0; i < settings.iterations - 1; ++i) {
        computePass.setBindGroup(1, computeBindGroup2);
        computePass.dispatchWorkgroups(
          Math.ceil(srcWidth / blockDim),
          Math.ceil(srcHeight / batch[1])
        );
  
        computePass.setBindGroup(1, computeBindGroup1);
        computePass.dispatchWorkgroups(
          Math.ceil(srcHeight / blockDim),
          Math.ceil(srcWidth / batch[1])
        );
      }
  
      computePass.end();
  
      const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });
  
      passEncoder.setPipeline(fullscreenQuadPipeline);
      passEncoder.setBindGroup(0, showResultBindGroup);
      passEncoder.draw(6, 1, 0, 0);
      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  export default postProcessing;