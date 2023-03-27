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
    var t = hit_sphere(vec3<f32>(0,0,-1), .5, r);

    if (t > 0.0) {
      var N = normalize(rayAt(r, t) - vec3<f32>(0, 0, -1));
      return 0.5 * vec3<f32>(N.x+1, N.y+1, N.z+1);
    }



    var unit_direction = normalize(r.direction);
    t = 0.5*(unit_direction.y + 1.0);
    return (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3(0.5, 0.7, 1.0);
}


struct ray {
  origin: vec3<f32>,
  direction: vec3<f32>,
}

fn rayAt(r:ray , t: f32) -> vec3<f32> {
  return r.origin + t * r.direction;
}

fn hit_sphere(center: vec3<f32>, radius:f32, r:ray) -> f32 {
  var oc = r.origin - center; 
  var a = pow(length(r.direction), 2.);
  var half_b = dot(oc, r.direction);
  var c = dot(oc, oc) - radius * radius;
  var discriminant = half_b*half_b - a*c;
  if (discriminant < 0) {
    return -1.0;
  } else {
    return (-half_b - sqrt(discriminant)) / a;
  }
}




@fragment
  fn main(in: VertexOutput) -> @location(0) vec4<f32> {


    const aspect_ratio = 1.;
    const image_width = 500.;
    const image_height = f32(image_width / aspect_ratio);
    
    // Camera
    
    const viewport_height = 2.0;
    const viewport_width = aspect_ratio * viewport_height;
    const focal_length = 1.0;
    

    var origin = vec3<f32>(0.);
    var direction = vec3<f32>(0.);

    let horizontal = vec3(viewport_width, 0, 0);
    let vertical = vec3(0, viewport_height, 0);
    let lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);
    



    var uv = in.fragUV.xy * vec2<f32>(500., 500.);
    var fragColor = vec4<f32>(1.);
    var u = uv.x / image_width;
    var v = uv.y / image_height;

    var r = ray(origin, lower_left_corner + u*horizontal + v*vertical - origin);
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