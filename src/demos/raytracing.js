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
fn random ( i: i32) -> f32{
  return fract(sin(f32(i)*43.0)*4790.234);   
 }
struct Light {
  direction: vec3<f32>,
  color: vec3<f32>
}

struct Ray {
  origin :vec3<f32>,
  direction: vec3<f32>,
}; 
struct Material {
  color: vec3<f32>,
  diffuse: f32,
  specular: f32,
}

struct Intersect {
  length: f32,
  normal: vec3<f32> ,
  material: Material
}

struct Sphere {
  radius: f32,
  position: vec3<f32>,
  material: Material
}

struct Plane {
  normal: vec3<f32>,
  material: Material
}

  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
  }

  const epsilon = 1e-3;
  const iterations = 10;

  const exposure = 1e-2;
  const gamma = 2.2;
  const intensity = 100.0;
  const ambient = vec3(0.6, 0.8, 1.0) * intensity / gamma;

  const light:Light = Light(vec3(1.0) * intensity, normalize (vec3<f32>(-1.0, .75, 1.0)));


  const miss:Intersect = Intersect(0.0, vec3(0.0), Material(vec3(0.0), 0.0, 0.0));

  fn intersect(ray: Ray,  sphere: Sphere) ->Intersect {
    // Check for a Negative Square Root
    var oc = sphere.position - ray.origin;
    var l = dot(ray.direction, oc);
    var det = pow(l, 2.0) - dot(oc, oc) + pow(sphere.radius, 2.0);
    if (det < 0.0) {return miss; }

    // Find the Closer of Two Solutions
    var len = l - sqrt(det);
    if (len < 0.0) {len = l + sqrt(det); }
    if (len < 0.0) {return miss;}
    return Intersect(len, (ray.origin + len*ray.direction - sphere.position) / sphere.radius, sphere.material);
}

fn intersectPlane(ray: Ray, plane: Plane) -> Intersect {
  var len = -dot(ray.origin, plane.normal) / dot(ray.direction, plane.normal);
  //if (len < 0.0) {return miss;}
  return Intersect(len, plane.normal, plane.material);
}

fn trace(ray: Ray) -> Intersect{
  const num_spheres = 3;
  var spheres: array<Sphere, 2>;

  spheres[0] = Sphere(2., vec3<f32>(-4., 3.0 + sin(1.), 0), Material(vec3<f32>(1.0, 0.0, 0.2), 1.0, 0.001));
  //spheres[1] = Sphere()

  var intersection = miss;
  var plane = intersectPlane(ray, Plane(vec3(0, 1, 0), Material(vec3(1.0, 1.0, 1.0), 1.0, 0.0)));
  if (plane.material.diffuse > 0.0 || plane.material.specular > 0.0) { intersection = plane; }
  for (var i = 0; i < num_spheres; i++) {
      var sphere = intersect(ray, spheres[i]);
      if (sphere.material.diffuse > 0.0 || sphere.material.specular > 0.0){
          intersection = sphere;
      }
  }
  return intersection;  
}


fn radiance(ray: Ray) -> vec3<f32>{
  var color = vec3<f32>(0.);
  var fresnel = vec3<f32>(0.);
  var mask = vec3(1.0);
  var currentRay = ray;

  for (var i = 0; i <= iterations; i+=1) {
    var hit = trace(ray);
    if (hit.material.diffuse > 0.0 || hit.material.specular > 0.0) {
      var r0 = hit.material.color.rgb * hit.material.specular;
      var hv = clamp(dot(hit.normal, -ray.direction), 0.0, 1.0);
      fresnel = r0 + (10.0 - r0) * pow(1.0 - hv, 5.0);
      mask *= fresnel;

      //if trace === miss(blank ray with 0 values), add color - color of pixel increases by the information of light photon sent from light bulb to object to eye
      if (trace(Ray(ray.origin + hit.length * ray.direction + epsilon * light.direction, light.direction)).length == miss.length) {
          color += clamp(dot(hit.normal, light.direction), 0.0, 1.0) * light.color
                 * hit.material.color.rgb * hit.material.diffuse
                 * (1.0 - fresnel) * mask / fresnel;
      }

      var reflection = reflect(ray.direction, hit.normal);
      currentRay = Ray(ray.origin + hit.length * ray.direction + epsilon * reflection, reflection);
  } else {
      //var spotlight = vec3(1e6) * pow(abs(dot(currentRay.direction, light.direction)), 250.0);
      //color += mask * (ambient + spotlight); break;
    }
  }

  return color;
}
//p = O + t(V - O)


@fragment
  fn main(in: VertexOutput) -> @location(0) vec4<f32> {
    var uv = in.fragUV.xy * vec2<f32>(500., 500.);
    var fragColor = vec4<f32>(.5);
  
    if (distance(in.fragUV.xy, vec2<f32>(.1, .1)) < .1) {
      fragColor.x = 1.;
    }

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