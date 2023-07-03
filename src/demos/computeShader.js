//figure out something new every single second of the day
export const computeShader = `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32,
      mode: f32,
      decayRate: f32
    }

    @group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
    @group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;
    @group(0) @binding(2) var<uniform> uniforms: Uniforms;
    @group(0) @binding(3) var<storage,read_write> direction: array<vec3<f32>>;
    @group(0) @binding(4) var<storage, read_write> distancetraveled: array<f32>;
    @group(0) @binding(5) var<storage, read_write> indexBuffer: array<f32>;
    @group(0) @binding(6) var<storage,read_write> tetrad: array<vec4<f32>>;
    @group(0) @binding(7) var<storage,read_write> groupBuffer: array<f32>;

fn  isAreaOfEffect (pos: vec3<f32>) {
}

  fn hasCollided (p: vec3<f32>)-> bool {
    var minX = -1; 
    var bounds = 10.;
    if (p.x < -bounds) {return true;}
    if (p.y <= -bounds) {return true;} //why is this backwards? 
    if (p.x >= bounds) {return true;}
    if (p.y >= bounds) {return true;}
    if (p.z <= -bounds ) {return true;}
    if (p.z >= bounds ){ return true;}
    return false;
  }

  fn makeMagnets () -> array<vec3<f32>, 6> {
    var result = array<vec3<f32>, 6>();

    result[0] = vec3<f32>(0, 10, 0);
    result[1] = vec3<f32>(0, 0, 10);
    result[2] = vec3<f32>(10, 0, 0);
    result[3] = vec3<f32>(0, 0, sin(uniforms.time * .0001));

    result[4] = vec3<f32>(0, 10, 0);
    result[5] = vec3<f32>(0, -10, 0);
    return result;
  }

  fn getField(pos: vec3<f32>, mag: vec3<f32>) -> f32{
    var radius = distance(pos, mag);
    var theta = atan(pos.y / pos.x);
    return 1;
  }

  fn applyMagnets(pos: vec3<f32>, index:u32) -> f32 {
    var idx = hashPosition(pos);

    var magnets = makeMagnets();

    vectorFieldBuffer[idx] = vec4<f32>(0);
    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[0] - pos,1) / 1 / distance(magnets[0], pos);
    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[1] - pos,1) / 1 / distance(magnets[1], pos);
    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[2] - pos,1) / 1 / distance(magnets[2], pos);
    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[3] - pos,1) / 1 / distance(magnets[3], pos);

    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[4] - pos,1) / 1 / distance(magnets[4], pos);
    vectorFieldBuffer[idx] +=  vec4<f32>(magnets[5] - pos,1) / 1 / distance(magnets[5], pos);

    direction[index] += .1 * vectorFieldBuffer[idx].xyz;

    posBuffer[index] = posBuffer[index] + .01 * vec4<f32>(direction[index], 1.);

    return 1.;
  }

  fn hashPosition(pos: vec3<f32>) ->  i32{
    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;
    var z = (1. - (pos.z)) / 2.;
    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }


fn helix(index: u32) -> vec3<f32>  {
  var dir = direction[index];
  if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  var theta = atan2(dir.z, dir.x);

  dir.x = cos(theta + 1.2);
  dir.z = sin(theta + 1.2);

  direction[index] = dir;

  posBuffer[index] = posBuffer[index] + .01 * vec4<f32>(direction[index], 1.);

  return dir;
}

fn drawShape (index: u32) -> vec3<f32> {
  var dir = direction[index];

  var theta = atan2(dir.y, dir.x);

  dir.x = cos(theta + .7);
  dir.y = sin(theta + .7);

  distancetraveled[index] += 1.;

  if (distancetraveled[index] > 100) {
    direction[index] = dir; 
    posBuffer[index]= posBuffer[index] + vec4<f32>(.1 * dir, 1.);
  }

  return dir;
}

  fn hash(p: vec3<f32>) -> vec3<f32> {
    var pos = p * .1;
    let idx = hashPosition(pos);

    var x = pos.x;
    var y = pos.y;
    var z = pos.z;

    let vf = vectorFieldBuffer[idx];

    var vt = mix(vec3<f32>(vectorFieldBuffer[idx].xyz),
                vec3<f32>(vectorFieldBuffer[idx].xyz),
                uniforms.time / 3000);

    return vf.xyz;
  }

  fn changeDirection (pos:vec3<f32>, index: u32) -> vec3<f32> {
    var dir = direction[index];// + vec3<f32>(1, 1, 1);
    if (length(dir) == 0.) { 
      dir = vec3<f32>(.1, 0., 0. );
    }
  
    var theta = atan2(dir.y, dir.x);
  
    dir.x =  cos(theta + 1.6);
    dir.y = .1 * sin(theta + 1.6 * f32(index) / 100);
  
    direction[index] = dir;
    return dir;
  }
 
  fn test123 (index: u32, flag: f32) {
    var dir = direction[index];
    var idx = f32(index);
    
    let pos = posBuffer[index];
    if (distancetraveled[index] < 1000) {
      posBuffer[index] = vec4<f32>(0);
    }

    if (length(dir) == 0.){ 
      dir = vec3<f32>(.1, 0., 0. );
    }
    var i = (uniforms.time  % 3);
    var theta = atan2(dir.z, dir.x);
    if (i == 0) { 
      var theta = atan2(dir.z, dir.x);
      dir.x +=  cos(idx);
      dir.z += sin(idx);
    }

    if (i == 1) { 
      var theta = atan2(dir.y, dir.x);
      dir.x +=  cos(idx);
      dir.y += sin(idx);
    }

    if (i == 2) { 
      var theta = atan2(dir.z, dir.y);
      dir.y +=  cos(idx);
      dir.z += sin(idx);
    }
  
    dir.y = dir.x;
    dir.x = dir.y;
    dir.y = cos(idx);
    dir.x = sin(idx);
    direction[index] = dir;
    return;
  }
  
  fn vortex (index: u32) {
    var dir = direction[index];
    var idx = f32(index);
  
  if (uniforms.time > 30000 - f32(index)) {}
  if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  
    dir.y = .1;
    if (idx > 128){
      dir.y *= -1;
    }

    direction[index] = dir;
    let pos = posBuffer[index];
    dir.x = pos.x - pos.y;
  
    if (hasCollided(posBuffer[index].xyz)) {
      dir.y = -dir.x;
      dir.x = -dir.y;
    }
  } 
  
  fn web (pos: vec3<f32>, idx: u32) -> f32{
  
  var index = f32(idx);
  if (distancetraveled[idx] < 10000) {
    posBuffer[idx] = vec4<f32>(0.);
  }
  if (idx < 256) {
    var i = f32(idx) - 128.;
    posBuffer[idx] = vec4<f32>(-i / 64., i / 64., 0., 1.) + vec4<f32>(-.5, -.5, 0, 0);
  }
  if (idx < 128){
    posBuffer[idx] = vec4<f32>(index / 64., index / 64., 0., 1.) + vec4<f32>(-.5, -.5,0 , 0);
  } 
    return -1;
  }
  
  fn lastMonth(pos: vec3<f32>, idx: u32) -> f32{
    let index = f32(idx);
    let i = index / 10000;
    posBuffer[idx] = vec4<f32>(3. * i * cos(index + uniforms.time * .001), 3. * i * sin(index + uniforms.time * .001), index / 256, 1.);  
    return -1;
  }

  fn runAlongRoute (pos:vec3<f32>, index:f32) -> vec3<f32> {
  var idx = u32(index);
  
  var dir =  direction[idx];

  var dt = sin(uniforms.time);
  
  var group = f32(index) % 20;
  distancetraveled[idx] += 1;
  
    for (var i = 0.; i < 20.; i += 1.) {
      if (uniforms.mode == 1) {
        continue;
      }
      if (uniforms.mode == 0 && group < 20) {
        ribbon(idx);
        continue;
      }
      
    }
  
  posBuffer[idx] += .1 * vec4<f32>(direction[idx], 1.);
  
  return dir;
  }

  fn makeASpiralWithoutSinCosineOrIndex(idx: u32) -> bool {
    var pos = posBuffer[idx];
    direction[idx] = - vec3<f32>(pos.y, -pos.x, pos.z);
    return false;
  }

fn makeParticlesFly(idx: u32) -> bool {
  var index = f32(idx);
  var pos = posBuffer[idx];

  posBuffer[idx] = vec4<f32>(0., 1., 1., 1.);
  var vel = direction[idx];
  direction[idx] = vec3<f32>(pos.x, pos.y * 10., pos.z * 10.);
  if (pos.z != 0.) {
    posBuffer[idx] = vec4<f32>(0., 1., 1., 1.);
  }
  return false;
}

fn makeCoolStuff(idx:u32) -> f32 {



  return -1;
}

  fn makeCoolShader(idx: u32) -> f32 {
    var dt = distancetraveled[idx];
    var index = f32(idx);
    var pos = posBuffer[idx];

    direction[idx] += vec3<f32>(0, cos(index * 1.1), sin(index * 1.1));

    if (dt > 10) {
      direction[idx] = vec3<f32>(cos(index * 1.1), pos.y, cos(index * 1.1));
    }

    if (dt > 10) {
      distancetraveled[idx]= 0;
      //posBuffer[idx] = indexBuffer[idx];
    }

    return -1;
  }

  fn ribbon(idx: u32) -> f32 {
    var dt = distancetraveled[idx];
    var pos = posBuffer[idx];
    var theta = atan2(pos.y, pos.x);
    distancetraveled[idx] += 1.;
    
    if (idx > 256 ){
      direction[idx] = -.001 * f32(idx) * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    } else {
      let radius = distance(vec2<f32>(0,0), pos.xy);
      direction[idx] =  1/ radius * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    }
    direction[idx] = vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    direction[idx] = vec3<f32>(direction[idx].y, -direction[idx].x, 0.);
    return -1;
  }

fn applyVF(pos: vec3<f32>, index:u32) -> vec3<f32> {
  var theta = 1. * atan2(pos.y, pos.x);
  var theta2 = atan2(pos.x, pos.z);
  let idx = hashPosition(pos);
  let t = uniforms.time * .0001; 
  vectorFieldBuffer[idx] += 10 * vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);
  let vf = vectorFieldBuffer[idx];

if (hasCollided(pos.xyz)) {
  posBuffer[index] = sin(uniforms.time * .001) * 
  vec4<f32>(cos(f32(index)), sin(f32(index)), 0.,0.);
}
  return vec3<f32>(1.);
}

fn dragon (index: u32) -> f32 {
  var pos = posBuffer[index];
  var vel = direction[index];
  applyVF(pos.xyz, index);

  if (length(direction[index]) == 0.) {
    direction[index] = vec3<f32>(0, 0, -1);
  }

  var r = indexBuffer[index];
  runAlongRoute(pos.xyz, f32(index));
  var abc = posBuffer[index];

  var vf = hash(pos.xyz);
  let t = uniforms.time;
  
   posBuffer[index] = vec4<f32>(pos.xyz + .01 * direction[index].xyz,  1);
 
   distancetraveled[index] += 1.;
    if (hasCollided(pos.xyz)) {
      var idx = f32(index);
      posBuffer[index] = vec4<f32>(cos(idx), sin(idx), 0., 0.);
    }

    var mouse = (uniforms.mouse - .5) * vec2<f32>(2,-2);
    // if (distance(posBuffer[index].xy, mouse) < .1) {
    //   direction[index].x = direction[index].y;
    //   direction[index].y = -direction[index].x;
    //   posBuffer[index] = vec4<f32>(posBuffer[index].xy - vec2<f32>(distance(posBuffer[index].xy, mouse)), 0., 1.);
    //   posBuffer[index] = posBuffer[index] - vec4<f32>(mouse, 0,0);
    //   direction[index] *= .001;
    // }

     direction[index] *= .00;

     if (groupBuffer[index] > -1) {
      var attenuation = array<f32, 10>();
      attenuation[0] = .001;
      attenuation[1] = .002;
      attenuation[2] = .003;
      attenuation[3] = .004;
      attenuation[4] = .005;
      attenuation[5] = .006;
      attenuation[6] = .007;
      attenuation[7] = .008;
      attenuation[8] = .009;
      attenuation[9] = .010;
      var attenuationFactor = attenuation[i32(groupBuffer[index])];

      attenuationFactor = .001;
      direction[index] = direction[index] + attenuationFactor * vf;
      posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
    }

  return -1;
}

fn sphereEvaporate(pos: vec4<f32>, index: u32) -> bool {
  var idx = f32(index);
  var radius = idx / 256;
  posBuffer[index] = vec4<f32>(cos(idx) , idx /2000., sin(idx), 1.);

  posBuffer[index].x *= pow(sin(posBuffer[index].y), .5);
  posBuffer[index].z *= pow(sin(posBuffer[index].y), .5);

  posBuffer[index].y *= .6;

  return false;
}

fn earth (index:u32) {
  var idx = f32(index);

  var pos = posBuffer[index];
  var radius = .5;
  var i = indexBuffer[index];
  var n = i / 1e6;
  var theta = acos(1 - (2 * n) / (1e6));
  var phi = 2 * 3.14159263 * i;

  var x = radius * sin(phi) * sin(theta);
  var y = radius * cos(phi) * sin(theta);
  var z = radius * cos(phi);

  posBuffer[index] = vec4<f32>(x,y,z,1.); 
  // if (distance(posBuffer[index+1]) < 1) {
  //   posBuffer[index] = posBuffer[index] + vec4<f32>(0, -.1, 0., 0.);
  // }
}

fn vf(index:u32) {
  earth(index);
}

fn rot (a:vec2<f32>, theata:f32) -> vec2<f32> {
  return a.xx * vec2<f32>(cos(theata), sin(theata)) + a.yy * vec2<f32>(-sin(theata), cos(theata));
}

fn cMul(a:vec2<f32>, b:vec2<f32>) -> vec2<f32> {
  return vec2<f32>(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);
}

fn cLog(a:vec2<f32>) -> vec2<f32> {
  var b = atan2(a.y, a.x);
  if (b<0.0) { b+= 2.0 * 3.14151926535; }
  return vec2<f32>(log(length(a)), b);
}

fn cExp(z:vec2<f32>) -> vec2<f32> {
  return exp(z.x) * vec2<f32>(cos(z.y), sin(z.y));
}

fn cDiv(a:vec2<f32>, b: vec2<f32>) -> vec2<f32> {
  var d = dot(b,b);
  return vec2<f32>(dot(a,b), a.y * b.x - a.x * b.y) /d; 
}
const PI=3.1415926535;

fn rotClamp(pos:vec2<f32>, n:i32) -> vec2<f32> {
  var alpha = - atan2(pos.x, pos.y);

  var tmp = PI / f32(n);
  return abs(rot(pos, -alpha+ (alpha % (2.*tmp)) -tmp));
}

fn cPow( z:vec2<f32>, a: vec2<f32>) -> vec2<f32> {
	return cExp(cMul(cLog(z), a));
}

fn f( z: vec2<f32>, c:vec2<f32>) -> vec2<f32>{
  return abs(cPow(z, vec2<f32>(3, 0))) - exp(1.) * abs(z) + c;
}

fn df(z:vec2<f32>, c:vec2<f32>) -> vec2<f32> { 
  var e = vec2<f32>(0.001, 0.0);
  return cDiv(f(z,c) - f(z+e,c), e);
}

fn color(pos0:vec2<f32>) -> vec4<f32> {
  var pos = vec2<f32>(pos0.x, pos0.y);

  const S = 256;
  pos = rot(pos, -PI/6.);
  pos=rotClamp(pos,6);

  const offset=vec2<f32>(0.1, 0.);
  pos += offset;
  pos = rot(pos, -PI/4.);
  pos -=offset;

  var z1 = pos;
  var p = abs(pos+vec2<f32>(0.25, -1.125));

  var dz = vec2<f32>(1., 0.);
  var j =0;
  for (var i = 0; i <= S; i++) {
    j=i;
    if (dot(z1,z1) > 100000) { break; }

    dz = cMul( dz, df(z1, p));

    z1 = f( z1, p);
  }
  var h = 0.5 * log(dot(z1,z1)) * sqrt(dot(z1, z1) / dot(dz, dz));

  var color = vec3<f32>(f32(j) / 2555. * 10.) * clamp(1.-abs(1.-h*50000) * 0.0125,0., 1.);
  return vec4<f32>(color, 1);
}


fn InventSomethingNew (index:u32) -> vec4<f32> {
  
  posBuffer[index] = (f32(index) / 256) * vec4<f32>(cos(f32(index)), sin(f32(index)), 0, 0);


  return vec4<f32>(0.);
}




fn sphere (offsetX: f32, index: u32) -> vec4<f32> {
  var idx = indexBuffer[index];
  var rho = 2.;
  var phi = floor(idx / 100); //yz
  var theta = idx % 100.; //yx
  //each point is at the intersection of two overlapping circles
  var x = rho * (cos(phi) * sin(theta));
  var y = rho * (cos(theta) * sin(phi));
  var z = 0.;
  //rho * (cos(theta));
  
  return vec4<f32>(x + offsetX, y, z, 1.);
}

fn atomicFusion (index: u32) -> vec4<f32> {
  var x = 0.;
  var idx = indexBuffer[index];

  if (idx < 5e5) {x = -1;} else { x = 1;}

  if (uniforms.time < 1000) {
    var y = 0.;
    var z = 0.;
    var w = 0.;
    var idx = f32(index);
    posBuffer[index] = sphere(x, index);
  }

  if (uniforms.time < 2000) {
    // var y = 0.;
    // var z = 0.;
    // var w = 0.;
    // var idx = f32(index);
    // posBuffer[index] = sphere(x, index);
    direction[index]= vec3<f32>(-x, 0,0);
    posBuffer[index] = posBuffer[index] + 10. * vec4<f32>(direction[index], 1.) * .01;
  }


  if (uniforms.time > 3000) {
    // var y = 0.;
    // var z = 0.;
    // var w = 0.;
    // var idx = f32(index);
    // posBuffer[index] = sphere(x, index);
    direction[index]= 10 * vec3<f32>(cos(idx), sin(idx), 0);
    posBuffer[index] = posBuffer[index] + vec4<f32>(direction[index], 1.) * .01;
  }

  return  posBuffer[index];
}

//7. invention of fire - 
//6. discovery of electrictiy  - draw a light bulb as cool as possible -> lightning or something morph
//5. wright brothers to moon -> 60 years -> draw a paper airplane and then an apollo space ship going to moon - draw the date 
//2. atomic fision [CHECK]
//1. 
//0.

//the empire state building was built in a year
// cool morphing
//10 diagrAms 4 hours each - 2 day
//be delighted by the ingenuity of human collaboration
//better algorithm for vector field 
//200,000 years ago
fn proceduralFire(index:u32) {
  var pos = posBuffer[index];
  var idx = hashPosition(pos.xyz);
    //wood = source of particles = block of cinder 
    //each particle has a temperature 
    //when temperature of particle exceeds a certain threshold like 212 farenheit 
    //then particle becomes super-heated plasma which means its breaks the molecular bond between itself and its neighbors 
    //each particle moves back and forth between things 

    let id= f32(index);


    //main force = heat = plasma = move fire upwards 
    //distance traveled = rebirth after heat lowers to 0.


    var dt = distancetraveled[index];
  vectorFieldBuffer[idx] = vec4<f32>(curlNoise(vec3<f32>(pos.xyz) * dt), 1.);
  vectorFieldBuffer[idx].y = max(vectorFieldBuffer[idx].y, 0.);//min , max
  vectorFieldBuffer[idx].y *= 50.;
  vectorFieldBuffer[idx].z *= 50.;
  vectorFieldBuffer[idx] = sin(vec4<f32>(uniforms.time * .1 * id, uniforms.time * .001 * id, 0., 0.));
  vectorFieldBuffer[idx].y = vectorFieldBuffer[idx].y + 1. / 2.;


  //direction[index] = .1 * vectorFieldBuffer[idx].xyz;
//   posBuffer[index] = posBuffer[index] + .1 * vec4<f32>(direction[index], 1.);

  var divisor = indexBuffer[index] / 3e7;
  posBuffer[index] =   posBuffer[index]  + divisor *vec4<f32>(curlNoise(vec3<f32>(pos.xyz)), 1.);

  distancetraveled[index] += 1.;
  // if (distancetraveled[index] > 50.) {
  //   //posBuffer[index] = (id / 256000) * vec4<f32>(cos(id),sin(id), 0., 0.);
  //   distancetraveled[index] = (0.);
  // }
}
//figure lots of cool shit out in like 48 hours.


fn somethingAmazing (index: u32) {

  distancetraveled[index] += 1.;
  let id= f32(index);


  posBuffer[index] = posBuffer[index] + .2 * vec4<f32>(

    cos(distancetraveled[index]),
    .5 * sin(distancetraveled[index]),
    0,0
  );
  // if (distancetraveled[index] > 50.) {
  //   posBuffer[index] = vec4<f32>(cos(id),sin(id), 0., 0.);
  //   distancetraveled[index] = (0.);
  // }


  //posBuffer[index] = vec4<f32>(distancetraveled[index]);


  //get angle from point to corner of moving matrix 
  ///bend row of points along angle until it reaches other side 


  //procedural city => 
  //Fusion Reactor -> Electrical Grid -> light bulb -> smart grid -> torches 
  //each citizen has a visibility based on the light of sorrounding light emitters 
}

fn travelingGustsOfWind(index:u32) {
  var idx = f32(index);

  var flip = 1.; //sign(cos(uniforms.time * .001 ));
  posBuffer[index] = posBuffer[index] - flip * 
  .01 * vec4<f32>(cos(idx), sin(idx), 0., 0.);
}




//48 hour countdown clock
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
     
      let index: u32 = GlobalInvocationID.x;

      var pos = posBuffer[index];
      var vel = direction[index];
      var r = indexBuffer[index];
      var dt = distancetraveled[index];
      var vf2 = tetrad[index];
      var g = groupBuffer[index];
      var vf1 = vectorFieldBuffer[index];
      var time = uniforms.time;

      
var keyframes = (uniforms.time % 10000) / 5000;
 //10 second cycle, 5 second interals
  //var keyframes = indexBuffer[index] / 1e5; 

      if (keyframes > -1) {
        //applyMagnets(pos.xyz, index);

        //proceduralFire(index);
      }  
      // if (keyframes > 1) {
      //   atomicFusion(index);
      // }

      // if (keyframes > 3) {
      //   travelingGustsOfWind(index);
      // } 

      


      // if (keyframes > 4) {
      //   somethingAmazing(index);
      // }

      // if (keyframes > 5) {
      //   //atom discovery
      //   sphereEvaporate(pos, index);
      // }
      //distancetraveled[index] += 1.;

      //   if (dt > 100) {
      //     var idx = f32(index) / 3000;
      //     posBuffer[index] = idx * vec4<f32>(cos(idx), sin(idx), 0, 0);
      //     distancetraveled[index] = 0.;
      //   }
      // return;


      if (keyframes < 7) {
        //information theory -> signal processing 
      } 
    }

    fn hexagon (p: vec3<f32>, time: f32) -> vec3<f32> {
      var shit = array<vec3<f32>,3 >();
      shit[0] = vec3<f32>(.2, 0., 0.);
      return p + shit[0] - p;
      return p;
    }

    fn midPoint(a: vec4<f32>, b: vec4<f32>) -> vec4<f32>{
      var mid = (b - a) / 2;


      return vec4<f32>(0.);
    }

    //make particles orbit a centroid

    //then pick 4 new particles to orbit centroid


    //make particles orbit around a sphere then decompose spheres into smaller spheres

    fn tetradRotation(index:u32) -> f32 {
      var tetrad = tetrad[index];
      var idx = f32(index);
      var a = tetrad.x;
      var b = tetrad.y;
      var c = tetrad.z;
      var d = tetrad.w;

      //var triad = vec4<f32>(a, b, c, ,d);

      //var midpoint = 

      //posBuffer[index] = posBuffer[index] + vec4<f32>(0,0,0,0);
      //pick 4 points and rotate around current orbit for 6 seconds then morph to ice


      //posBuffer[index] += vec4<f32>(cos(uniforms.time),sin(uniforms.time),0,0);
      return -1.;
    }
    ${noise}
`
import {noise} from './shader2'
///make it so good that the other stream is super impressed -> mr bean projected onto particle ->
//fire
//ice https://www.shadertoy.com/view/dldSRB
//wind - leaves 
//earth - earthQuake
//data Cube

//orbit around decomposing things 
//data cube
//2-4 days
  
  //time, mode, attenuationRate, particleIndex, groupIndex 
  //synchronized swimmers - all particles of certain color do similar stuff 
  //noise Buffer = unique ID = Math.random () * coefficent for each particle 

  //dont think anything else - just fnish the shader
  //delete group -> implicit group created by index -> 1-1e5 = group 1, 1e5-2e5   = group 2
  //make a new buffer that links particle to thet5 index in the buffer
  //buffer that has a range of 0-1e6 ? so instead of thread index its a particle index




















//my name is renderbuffer
//from the bottom of my heart
//i let go of telepathy and the stream and the story and everything else
//but i have to code
//eat sleep, code repeat
//no sleep
//just code
//i let go and i want to forget 
