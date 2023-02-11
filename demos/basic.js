
import simplegpu from "../lib/main";
//import simplegpu from "https://cdn.jsdelivr.net/npm/simple-gpu/+esm";

const time = 0;
async function basic () {
  // Calling simplewebgpu.init() creates a new partially evaluated draw command
let webgpu = await simplegpu()






 webgpu.initDrawCall({
    // Shaders in simplewebgpu. are just strings. 
    frag: `
    @fragment
  fn main(
      //@location(0) position: vec4<f32>,
      //@location(1) color: vec4<f32>,
    ) -> @location(0) vec4<f32> {
      //return color;
      return vec4(${Math.random()}, 0.0, 0, 1.0);
    }`,
  
    vert: `
    struct VertexOutput {
      @builtin(position) Position : vec4<f32>,
      @location(0) fragUV : vec2<f32>,
      @location(1) fragPosition: vec4<f32>,
    }  



  
    @vertex
    fn main(
    @location(0) position : vec4<f32>,
      @location(1) uv : vec2<f32>
    ) -> VertexOutput {
      
      var output : VertexOutput;
      output.Position = position;
      output.fragUV = uv;
      output.fragPosition = position;
      return output;
    }`,
  
    // Here we define the vertex attributes for the above shader
    attributes: {
      // simplewebgpu.buffer creates a new array buffer object
      position: new webgpu.attribute([
        [-1, 0],
        [0, -1],
        [1, 1]
      ], 0, 2)
      
      // simpleWebgpu automatically infers sane defaults for the vertex attribute pointers
    },
  
    // uniforms: {
    //   // This defines the color of the triangle to be a dynamic variable
    //   color: webgpu.prop('color')
    // },
  
    // This tells simpleWebgpu the number of vertices to draw in this command
    count: 3
  }).then(draw => {
    draw({
      color: [
        Math.cos(time * 0.001),
        Math.sin(time * 0.0008),
        Math.cos(time * 0.003),
        1
      ]
    })

    draw({
      color: [
        Math.cos(time * 0.001),
        Math.sin(time * 0.0008),
        Math.cos(time * 0.003),
        1
      ]
    })
  })
}
//https://observablehq.com/d/51527d1654b706ab
export default basic