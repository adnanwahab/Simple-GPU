// finish Demo - 5hours

// rotating camera - 1hr

// randomize spheres - 1hr

// denoise - 1hr []

// glass sphere - 1hr 10am [x]


//interactivity

//triangular - compute shader bvh

//audio-reactive w/o uniforms

import simpleWebgpuInit from '../../lib/main';
//if you finish this ray tracer then we can finish the story of renderbuffer

//convert meshes to a BVH or buffer 
//do ray casting stuff
//read data from texture -- apply sphere texture to 
//write ray casting data to texture 

async function basic () {
const webgpu = await simpleWebgpuInit();

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
struct sphere {
  center: vec3<f32>,
  radius: f32,
  material: f32,
  albedo: vec3<f32>
}

struct mat {
  scattered: ray,
  albedo: vec3<f32>,
  isScatter: bool
}

fn reflect(v:vec3<f32>, n:vec3<f32>) -> vec3<f32> {
  return v - 2*dot(v,n)*n;
}

struct ray {
  origin: vec3<f32>,
  direction: vec3<f32>,
}

fn unit_vector(v: vec3<f32>) -> vec3<f32>  {
  return v/ length(v);
} 

fn material (r:ray, s: sphere, rec: hit_record, xy: vec2<f32>) -> mat {

  var albedo = s.albedo;

  if (s.material == 0.) {
    //metal
    var reflected = reflect(normalize(r.direction), rec.normal);
    var scattered = ray(rec.p, reflected);
    var attenuation = albedo;
    var isScatter = dot(scattered.direction, rec.normal) > 0;
    return mat(scattered, attenuation, isScatter);
  } else if (s.material == 1.) {
    //diffuse
    var direction = rec.p + rec.normal + random_in_unit_sphere(xy);
    var attenuation = albedo;

    var scattered = ray(rec.p, direction);
    return mat(
      scattered, attenuation, true
    );
  } else if (s.material == 2.) {
    var outward_normal: vec3<f32>;
    var reflected = reflect(r.direction, rec.normal);
    var ni_over_nt:f32;
    //var refracted: vec3<f32>;
    var reflect_prob = 0.;
    var cosine = 0.;
    var ref_idx=1.5;
    if (dot(r.direction, rec.normal) > 0) {
      outward_normal = -rec.normal;
      ni_over_nt =  1.5;
      cosine = dot(r.direction, rec.normal) / length(r.direction);
    } else {
      outward_normal = rec.normal;
      ni_over_nt = 1.0 / 1.5;
      cosine = -dot(r.direction, rec.normal) / length(r.direction);
    }
    var scattered:ray;
    var refracted = refract2(r.direction, outward_normal, ni_over_nt);
    if (refracted.x < -1000.) {
      reflect_prob = reflectance(cosine, ref_idx);
      scattered = ray(rec.p, refracted );
    } else {
      scattered = ray(rec.p, reflected);
      reflect_prob = 1.0;
    }

    if (random(xy) > reflect_prob) {
      scattered = ray(rec.p, reflected);
    } else {
      scattered = ray(rec.p, refracted);
    }

    return mat(scattered, vec3<f32>(1.), true);

    // var ir = 1.5;
    // var attenuation = vec3<f32>(1.);
    // var refraction_ratio:f32;
    // if (rec.front_face) {
    //   refraction_ratio = 1.0 / ir;
    // } else {
    //   refraction_ratio = ir;
    // }

    // var unit_direction = unit_vector(r.direction);
    // var cos_theta = min(dot(-unit_direction, rec.normal) , 1.0);
    // var sin_theta = sqrt(1.0 - cos_theta * cos_theta);
    // var cannot_refract = refraction_ratio * sin_theta > 1.0;

    // var direction:vec3<f32>;
    // if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random(xy)) {
    //    direction = reflect(unit_direction, rec.normal);
    // } else {
    //   direction = refract(unit_direction, rec.normal, refraction_ratio);
    // }
    // var scattered = ray(rec.p, direction);
    // return mat(scattered, attenuation, true);
  }
  return mat();
}

fn refract2(v:vec3<f32>, n:vec3<f32>, ni_over_nt:f32) -> vec3<f32> {
  var uv = unit_vector(v);
  var dt = dot(uv, n);
  var discriminant = 1.0 - ni_over_nt*ni_over_nt*(1-dt*dt);
  if (discriminant > 0) {
//    return vec3<f32>(0.);
    return ni_over_nt*(uv - n * dt)- n * sqrt(discriminant);
  } else {
    return vec3<f32>(-1000.);
  }
}

fn reflectance (cosine:f32, ref_idx:f32) -> f32{
  var r0 = (1 -ref_idx) / (1 + ref_idx);
  r0 = r0*r0;
  return r0 + (1-r0)*pow((1 - cosine), 5);
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
  hit.hit_anything = discriminant > 0.;
  hit.sphere = s;
  var outward_normal = (hit.p - s.center) / s.radius;
  hit.front_face = dot(r.direction, outward_normal) > 0;
  if (hit.front_face) {
    hit.normal = outward_normal; 
  } else {
    hit.normal = - -outward_normal;
  }

  return hit;
}


  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) vertexIndex: f32
  }




struct hit_record {
  p: vec3<f32>,
  normal: vec3<f32>,
  t: f32,
  front_face: bool,
  hit_anything: bool,
  sphere: sphere
}
 
fn world_hit(sphereList:array<sphere,10>, r: ray, t_min: f32, t_max: f32) -> hit_record {
  var hit: hit_record;
  var closest_so_far = t_max;

  for (var i =0; i < 10; i += 1) {
    var didHit = sphereHit(sphereList[i], r, t_min, closest_so_far);
    if (didHit.hit_anything) { 
      closest_so_far = didHit.t;
      hit = didHit;
    }
  }

  return hit;
}

fn random (st: vec2<f32>) -> f32 {
  var hello = st.xy ;
  return fract(sin(dot(hello,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}

fn length_squared(e:vec3<f32>) -> f32 {
  return e.x * e.x + e.y * e.y + e.z * e.z;
}


fn random_in_unit_sphere(st: vec2<f32>) -> vec3<f32> {
  // return vec3<f32>(.4, .3, .3);

 var p = vec3<f32>(random(st ), random(st ), random(st ));
  return p;
}

const infinity = 1.;
fn ray_color(r: ray, world:array<sphere, 10>, depth:f32, xy: vec2<f32>) -> vec3<f32> {
    var color = vec3<f32>(0);

    var current_ray = r;
    var hit = world_hit(world, r, 0, infinity); //a, b, sky

    //ray from camera hits sphere A
    // ray from sphere A hits sphere B
    // ray from sphere B hits sky 
    var cur_attenuation = 1.0;
    for (var i = 0; i < 50; i+= 1) {
      hit = world_hit(world, current_ray, .0000001, 1000000.); 
      if (hit.hit_anything) {
          var targ = hit.p + hit.normal;
          let mat = material(current_ray, hit.sphere, hit, xy);
          
          current_ray = mat.scattered;
          //if (hit.sphere.material != 2.) {
            color += mat.albedo; 
            cur_attenuation *= .5;
          //} else {
            //cur_attenuation = .2 ;
          //}
      } else {
        var t = hit_sphere(vec3<f32>(0,0,-1), .5, r);
        var unit_direction = normalize(r.direction);
        t = 0.5*(unit_direction.y + 1.0);
        color += (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
        return cur_attenuation * color;
      }
    }
    return color;
}
//https://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
//https://web.cse.ohio-state.edu/~shen.94/681/Site/Slides_files/reflection_refraction.pdf


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
//discriminant coefficent of polynomal which describes root fx=fx^2



@fragment
  fn main(in: VertexOutput) -> @location(0) vec4<f32> {
    var Hit: hit_record;
    var world:array<sphere, 10>;
    var red = vec3<f32>(1., 0., 0.);
    var green = vec3<f32>(0., 1., 0.);
    var blue = vec3<f32>(0., 0., 1.);

    world[0] = sphere(vec3<f32>(0,0,-2), -.4, 2., red);
    world[1] = sphere(vec3<f32>(0,-100.5,-1), 100, 1, green);

     world[2] = sphere(vec3<f32>(-1.,0,-2.), .35, 1, blue);
     world[3] = sphere(vec3<f32>(0,.7,-1.), .35, 0, red);
    world[4] = sphere(vec3<f32>(.4,.3,-0.), .35, 0, green);
     world[5] = sphere(vec3<f32>(.9,.2,-0.), .35, 1, blue);
     world[6] = sphere(vec3<f32>(.9,.9,-0.), .35, 1, red);
    world[7] = sphere(vec3<f32>(-.9,.8,-2.), .35, 1, green);
    world[8] = sphere(vec3<f32>(-3.,.8,-2.), .35, 1, blue);
    world[9] = sphere(vec3<f32>(-0,0, -3), .35, 1, red);


    //try a better random function


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
    fragColor = vec4<f32>(sqrt(ray_color(r, world, 50, uv *  in.vertexIndex + 123.)), 1.);

    return fragColor;
  }
`,
  vert: `

  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) vertexIndex: f32
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
    output.vertexIndex = f32(VertexIndex);

    return output;
  }
  `,
  count: 6,
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


//https://www.shadertoy.com/view/tddSz4
//spectral ray tracing
//https://www.shadertoy.com/view/stSXzm