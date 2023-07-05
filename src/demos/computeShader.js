//figure out something new every single second of the day
const DRAW_ON_SPHERE = false;
export const computeShader = `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32,
      mode: f32,
      decayRate: f32
    }

fn  isAreaOfEffect (pos: vec3<f32>) {
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

fn reInit() {}

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

  var person = personBuffer[id];
  var pers = Person(person.x, person.y, person.z, i32(person.w));
 
  var previous = i32(person.y);
  var next = i32(person.x);
  var place = map[next]; //next, terrain, x, y

  var pl = Place(place.x, place.y, place.z, place.w);

  let destination = Place(map[next].x, map[next].y, map[next].z, map[next].w);

  let prev = Place(map[previous].x, map[previous].y, map[previous].z, map[previous].w);

  personBuffer[id].w += .01;

  let interpolated = mix(map[previous].zw, map[next].zw  ,personBuffer[id].w);

  if (${DRAW_ON_SPHERE}) { posBuffer[id] = sphericalToCartesian(interpolated); }
  if (! ${DRAW_ON_SPHERE}) {posBuffer[id] = vec4<f32>(interpolated.x, interpolated.y, 0, 0); } 

  var currentPosition = posBuffer[id];

  if (personBuffer[id].w > 1.) {
    personBuffer[id].w  = -f32(id) / 100000.;

    personBuffer[id].w  = 0.;
    personBuffer[id].y = personBuffer[id].x;
    personBuffer[id].x = pl.next;
    if (pl.terrain == 0) { //person has reached spaceship, send to ore
      map[0].x = map[0].x + 2;
      if (map[0].x > 1e5) {map[0].x = 1;}
      personBuffer[id].x = map[i32(i)].x + 0.;
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
      //posBuffer[index].z = f32(index) / 1e9;
      return;
      var keyframes = (uniforms.time % 10000) / 5000;
    }
    ${noise}
`
import {noise} from './shader2'

















