//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../../lib/main';


//convert meshes to a BVH or buffer 
//do ray casting stuff
//read data from texture -- apply sphere texture to 
//write ray casting data to texture 


//vertex draw quad
//fragment draw stuff



//navigate via footsteps sending echolocation 



async function basic () {
const webgpu = await simpleWebgpuInit();


// const abc =     new Array(1e3).fill(0).map(() => Math.random()).map(_ => {
//   const abc = [Math.random() * 500,_ * 500 ]
//   return `  if (distance(uv, vec2<f32>(${abc[0]},${abc[1]})) < 1.) {
//     fragColor.g =  
    
    
    
//     dot(
//       vec2<f32>(${abc[0]},${abc[1]}),
//       vec2<f32>(0, 0)
//     );
//   }`
// }
// ) 


// shoot ray from camera to pixel
// if ray coincides with object
// trace ray from object to light
// return color of lit up surface using Bi-directional-reflectance function
// add stuff like fresnel for the curvy reflection on the inside of glass
//https://raytracing.github.io/books/RayTracingTheRestOfYourLife.html

//ray tracing = quad in fragment shader - for each pixel - for each object
//ray traced particles = opposite - for each object - each pixel it covers 

const drawCube = await webgpu.initDrawCall({
frag: `
  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }

fn ray_color(r: ray) -> vec3<f32> {
    var unit_direction = normalize(r.direction);
    var t = 0.5*(unit_direction.y + 1.0);
    return (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3(0.5, 0.7, 1.0);
}


struct ray {
  origin: vec2<f32>,
  direction: vec3<f32>,
}


@fragment
  fn main(in: VertexOutput) -> @location(0) vec4<f32> {
    var uv = in.fragUV.xy * vec2<f32>(500., 500.);
    var fragColor = vec4<f32>(1.);

    var origin = vec2<f32>(0.);
    var direction = vec3<f32>(0.);

    var r = ray(origin, direction);
    fragColor = vec4<f32>(ray_color(r), 1.);
    // if (distance(in.fragUV.xy, vec2<f32>(.1, .1)) < .1) {
    //   fragColor.x = .0;
    // }

    return fragColor;
  }
`,
  vert: `

  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }

  @vertex
  fn main(
    @builtin(vertex_index) VertexIndex : u32
  ) -> VertexOutput  {
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

    return output;
  }
  `,
  count: 36,
  // uniforms: {
  //   time: () => Date.now()
  // }
})

setInterval(
  function () {
    drawCube({
      //texture: webgpu.texture(img)
    })
  }, 50
)
  
}

basic()