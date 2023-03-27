//import simpleWebgpu from "../lib/main";
import simpleWebgpuInit from '../../lib/main';
//if you finish this ray tracer then we can finish the story of renderbuffer

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

//const compute = 

const drawCube = await webgpu.initDrawCall({
frag: `
  fn set_face_normal(h:hit_record, r: ray, outward_normal: vec3<f32>) {
    //h.front_face = dot(r.direction, outward_normal) < 0;
    if (h.front_face) {
      //h.normal = outward_normal; 
    } else {
      //h.normal = - -outward_normal;
    }
}

struct sphere {
  center: vec3<f32>,
  radius: f32
}



fn sphereHit(s: sphere, r:ray, t_min: f32, t_max: f32) -> hit_record {
  var hit: hit_record;



  var oc = r.origin - s.center; 
  var a = pow(length(r.direction), 2.);
  var half_b = dot(oc, r.direction);
  var c = dot(oc, oc) - s.radius * s.radius;
  var discriminant = half_b*half_b - a*c;
  if (discriminant < 0) {
    return hit;
  }
  var sqrtd = sqrt(discriminant);

  var root = (-half_b - sqrtd) / a;
  if (root < t_min || t_max < root) {
    root = (-half_b +sqrtd) / a;
    if (root < t_min || t_max < root) {
      return hit;
    }
  }

  hit.t = root;
  hit.p = rayAt(r, hit.t);
  hit.normal = (hit.p - s.center) / s.radius;
  hit.hit_anything = discriminant > 0;

  return hit;
}


  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }


struct hit_record {
  p: vec3<f32>,
  normal: vec3<f32>,
  t: f32,
  front_face: bool,
  hit_anything: bool
}
 
fn world_hit(sphereList:array<sphere,3>, r: ray, t_min: f32, t_max: f32) -> hit_record {
  var hit: hit_record;
  var closest_so_far = t_max;

  for (var i =0; i < 3; i += 1) {
    var hit = sphereHit(sphereList[i], r, t_min, t_max);
    if (hit.hit_anything) { 
      return hit;
    }
  }

  return hit;
}

fn random (st: vec2<f32>) -> f32 {
  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}

fn length_squared(e:vec3<f32>) -> f32 {
  return e.x * e.x + e.y * e.y + e.z * e.z;
}


fn random_in_unit_sphere(st: vec2<f32>) -> vec3<f32> {
  while (true) {
    var p = vec3<f32>(random(st), random(st), random(st));
    if (length_squared(p) > 1) {
      continue;
    }
    return p;
  }
  return vec3<f32>(0.);
}



//bounces = 0
//if it hits a sphere - scatter it 
// else collect light from sky




const infinity = 10000000000000000000000000000.;
fn ray_color(r: ray, world:array<sphere, 3>, depth:f32, xy: vec2<f32>) -> vec3<f32> {
    var color = vec3<f32>(0);

    var t = hit_sphere(vec3<f32>(0,0,-1), .5, r);
    var hit = world_hit(world, r, 0, infinity);


    if (hit.hit_anything) {
        var targ = hit.p + hit.normal + random_in_unit_sphere(xy);
        return 0.5 * (hit.normal + vec3(1,1,1));
        //return 0.5 * ray_color(ray(hit.p, targ - hit.p, world, depth -1));
    }




    

    var unit_direction = normalize(r.direction);
    t = 0.5*(unit_direction.y + 1.0);
    return (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
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
    var Hit: hit_record;
    var world:array<sphere, 3>;
    world[0] = sphere(vec3<f32>(0,0,-1), .5);
    world[1] = sphere(vec3<f32>(0,-100.5,-1), 100);

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
    var u = uv.x / image_width; //fragment position
    var v = 1. - (uv.y / image_height); //fragment position

    var r = ray(origin, lower_left_corner + u*horizontal + v*vertical - origin);
    fragColor = vec4<f32>(ray_color(r, world, 50, uv), 1.);

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