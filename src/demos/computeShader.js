//figure out something new every single second of the day
export const computeShader = `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32,
      mode: f32,
      decayRate: f32
    }

   

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


fn InventSomethingNew (index:u32) -> vec4<f32> {
  
  posBuffer[index] = (f32(index) / 256) * vec4<f32>(cos(f32(index)), sin(f32(index)), 0, 0);


  return vec4<f32>(0.);
}

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


fn smoothStep(edge0:f32, edge1:f32, x:f32) -> f32 {
  // if (x < edge0) {return 0.;}
  
  // if (x >= edge1) {return 1.;}
  
  let c = (x - edge0) / (edge1 - edge0);
  
  return c * c * (3 - 2 * c);
  }

fn travelingGustsOfWind(index:u32) {
  var idx = f32(index);

  var flip = 1.; //sign(cos(uniforms.time * .001 ));
  posBuffer[index] = posBuffer[index] - flip * 
  .01 * vec4<f32>(cos(idx), sin(idx), 0., 0.);
}



//generate and represent places as fast as you can.
//pos, next=w
// stage, mineralCount, mineralMax, mineralType

//map = 
//mapAttributes = 4 things of each pixel
//drill for ore -> minecraft 
//vectorfield can be 10 million = 1000x1000x10

fn castSpell(spellId: f32, index: u32) {
  let pos = posBuffer[index];

}

fn syncBoardState (index:u32) {
  var mineralsGathered = worldState[0];
  var researchPoints = worldState[2];
  var hasWon =  researchPoints > 100. && mineralsGathered > 1e6;
  var spellUsed = worldState[4];


  if (spellUsed > -1) {
    castSpell(spellUsed, index);
  }

  if (hasWon) {
    reInit();
  }
}

fn reInit() {

}


fn slerp(start: vec3<f32>, end: vec3<f32>, t: f32) -> vec3<f32> {
  // Convert the start and end vectors to unit vectors
  var uStart: vec3<f32> = normalize(start);
  var uEnd: vec3<f32> = normalize(end);

  var dotProduct: f32 = dot(uStart, uEnd);
  dotProduct = clamp(dotProduct, -1.0, 1.0);

  if (dotProduct == 1.0) {
      // The start and end vectors are the same, return either vector
      return uStart;
  }

  var theta: f32 = acos(dotProduct);
  var sinTheta: f32 = sin(theta);

  var weightStart: f32 = sin((1.0 - t) * theta) / sinTheta;
  var weightEnd: f32 = sin(t * theta) / sinTheta;

  var interpolated: vec3<f32> = weightStart * uStart + weightEnd * uEnd;

  return normalize(interpolated);
}

fn interpolatePolar(start: vec2<f32>, end: vec2<f32>, t: f32) -> vec2<f32> {
  // Linear interpolation for the radius
  var radiusInterpolated: f32 = mix(start.x, end.x, t);

  // Circular interpolation for the angle
  var angleInterpolated: f32 = mix(start.y, end.y, t);

  return vec2<f32>(radiusInterpolated, angleInterpolated);
}

fn simulationStep(id: u32) {
  syncBoardState(id);
  var i = f32(id);
  var dt = distancetraveled[id];
  var pos = posBuffer[id].xyz;
  var noise = 0.;
  var velocity = 0.;

velocity = .02;

  var person = personBuffer[id];
  var pers = Person(person.x, person.y, person.z, i32(person.w));
 

  var previous = i32(person.y);
  var next = i32(person.x);
  var place = map[next]; //next, terrain, x, y

  var pl = Place(place.x, place.y, place.z, place.w);

      let destination = Place(map[next].x, map[next].y, map[next].z, map[next].w);

      let prev = Place(map[previous].x, map[previous].y, map[previous].z, map[previous].w);

personBuffer[id].w += .1;



let interpolated =
 mix(map[previous].zw, map[next].zw  ,personBuffer[id].w);

//if (id % 2 == 0) {
  posBuffer[id] = sphericalToCartesian(interpolated);

//} else {
  posBuffer[id] = vec4<f32>(interpolated.x, interpolated.y, 0, 0);
//}

  var currentPosition = posBuffer[id];

  if (personBuffer[id].w > 1.) {
    personBuffer[id].w  = -f32(id) / 10000.;
    personBuffer[id].y = personBuffer[id].x;
    personBuffer[id].x = pl.next;
    if (pl.terrain == 0) { //person has reached spaceship, send to ore

      map[0].x = map[0].x + 1;
      if (map[0].x > 1e5) {map[0].x = 1;}
      personBuffer[id].x = map[i32(i)].x + 1.;

      //person.next -> 
          // SpaceShip -> 
          // nextMin -> 
          // nextRefinery 

      //every frame, readback the personList
      //makeSure the next reference is incrementing 
      //next reference is incrementing to placeList.
    } 
  }
}

struct Place {
  next: f32,
  terrain: f32, //blank, iron ore, gold ore, silver ore, 
  latitude: f32,
  longitude: f32
}

struct Person {
  next: f32,
  prev: f32,
  inventory: f32,
  posBufferIndex: i32,
}


fn init (index: u32) {
  let person = personBuffer[index];
  let next = person.x;
  let prev = person.y;
  let inventory = person.z;
  let activeVision = person.w;

  var idx = 3 * (i32(index) % 4);
  
    let place = map[i32(prev)];
//    let pl = Place();
    // posBuffer[index].x += cos(f32(index));
    // posBuffer[index].y  += sin(f32(index));

    // personBuffer[index].x = place.z;
    // personBuffer[index].y = place.w;


    // posBuffer[index].x = place.z + f32(index) / 100.;
    // posBuffer[index].y  += place.w;

    posBuffer[index].x = place.z;
    posBuffer[index].y  = place.w;
}



fn cartesianToSpherical(pos: vec3<f32>) -> vec3<f32> {
  var x = pos.x;
  var y = pos.y;
  var z = pos.z;

  var r = sqrt(x * x + y* y + z * z);
  var θ = acos(z / r);
  var φ = atan(y / x);

  var x1 = r * sin(θ) * cos(φ);
  var y1 = r * sin(θ) * sin(φ);
  var z1 = r * cos(θ);

  return vec3<f32>(x1, y1, z1);
}
const PI = 3.14159;
fn sphericalToCartesian(coords:vec2<f32>) -> vec4<f32> {
  // var φ = phi / 180 * PI;
  // var θ = theta / 180 * PI;
  var φ = coords.x;
  var θ = coords.y;
  var r = 3.;
  var x = r * sin(θ) * cos(φ);
  var y = r * sin(θ) * sin(φ);
  var z = r * cos(θ);

  return vec4<f32>(x, y, z, 0);
}

const sphereRadius = 1.;

@group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
@group(0) @binding(2) var<uniform> uniforms: Uniforms;
@group(0) @binding(3) var<storage,read_write> direction: array<vec3<f32>>;
@group(0) @binding(4) var<storage, read_write> distancetraveled: array<f32>;

@group(0) @binding(5) var<storage, read_write> worldState: array<f32>;

@group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;

@group(0) @binding(6) var<storage,read_write> map: array<vec4<f32>>;

@group(0) @binding(7) var<storage,read_write> personBuffer: array<vec4<f32>>;

//super mario galaxy + spaceShip
//meteor coming in 24 hours -> make a meteor animation
//go from goldmine to refinery to spaceship and accumulate particles within mesh position
//make a dancer mesh that is an antenna that cir·cum·am·bu·lates thoughts + hallucinations
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let index: u32 = GlobalInvocationID.x;

      var pos = posBuffer[index];
      var vel = direction[index];
      var r = worldState[index];
      var dt = distancetraveled[index];
      var vf2 = map[index];
      var person = personBuffer[index]; 
      //destination, prev, inventory, activeVision
      //destinationIndex -> points to vectorFieldBuffer 
      //use vectorFieldBuffer - draw a map of the vectorField which is 1kx1k
      var vf1 = vectorFieldBuffer[index];
      var time = uniforms.time;
      distancetraveled[index] += 1.;
      if (dt < 1) {
        init(index);
      }
      simulationStep(index);
      return;
      var keyframes = (uniforms.time % 10000) / 5000;
    }
    ${noise}
`
import {noise} from './shader2'

















