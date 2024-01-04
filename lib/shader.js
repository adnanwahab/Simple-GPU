import utils from "./utils";

let defaultShader = `@fragment
fn main_fragment(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(.5, 0, .5, 1);
}`

function validateData(data) {
    if (typeof data.width !== "number") throw new Error("bad data!!");
  }

function makeShaderModule(state, source) {
    const { device, data } = state;
    if (!source) source = defaultShader;
    validateData(data);
  
    const uniforms = Object.keys(data)
      .filter((name) => typeof data[name] === "number")
      .map((name) => `${name}: f32,`)
      .join("\n");
  
    let code = `
      struct Uniforms {
       ${uniforms}
     }
    @binding(0) @group(0) var<uniform> u: Uniforms;
    @binding(1) @group(0) var mySampler: sampler;
    @binding(2) @group(0) var myTexture: texture_2d<f32>;
  
    struct VertexOutput {
      @builtin(position) Position : vec4<f32>,
      @location(0) fragUV : vec2<f32>,
      @location(1) fragPosition: vec4<f32>,
    }
    
    @vertex
    fn main_vertex(
      @builtin(vertex_index) VertexIndex : u32,
    ) -> VertexOutput {
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
      output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
      output.fragUV = uv[VertexIndex];
      output.fragPosition = (output.Position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
      output.fragPosition.g = 1.5 - output.fragPosition.g;
      return output;
    }
    ${source}`;
  
    if (state.options.vs) {
      code = state.options.vs + state.options.shader
    }
  
    console.log('state.options', state.options);
  
    if (state.options.frag && state.options.vert) {
      code = state.options.frag + state.options.vert
    }
    return device.createShaderModule({ code });
  }

  function updateUniforms(state, modelViewProjectionMatrix=new Float32Array(16)) {
    let { data, device } = state;
  
    let values = Object.values(data).filter(
      (val) => typeof val !== "object"
    );
  
//    let uniformsArray = new Float32Array(values.length);
    let uniformsArray = new Float32Array(16);
    uniformsArray.set(modelViewProjectionMatrix, 0);

    if (state.uniformsBuffer) {
      device.queue.writeBuffer(
        state.uniformsBuffer,
        0,
        uniformsArray.buffer,
        0,
        // 4 * uniformsArray.length
        28
      );
      return state.uniformsBuffer;
    } else {
      return (state.uniformsBuffer = utils.createBuffer(
        device,
        uniformsArray,
        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      ));
    }
  }

  export {makeShaderModule, updateUniforms}