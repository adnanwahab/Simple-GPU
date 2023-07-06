//delight, surprise, love, connection 
//intention
//figure out something new every single second of the day
const DRAW_ON_SPHERE = true;
export const computeShader = `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32,
      mode: f32,
      decayRate: f32
    }

fn  isAreaOfEffect (pos: vec3<f32>) {
}

fn castSpell(spellId: f32, index: u32) {
  let pos = posBuffer[index];
}

// fn changeLocation (person: Person) {
//   //person only has a currentIndex and a neighborhood
//   //person doesnt have a posBufferIndex because the indices for both buffers line up
//   //person - currentIndex, neighborhood, inventory, spellActive{0-1024 for multiple spells
//   let currentIndex = person.currentIndex;
//   let previous = places[currentIndex];
//   let destination = places[currentIndex+1];
//   var neighborhood = neighborhoods[person.neighborhood];

  
//   posBuffer[person.index] += (destination  - previous) * .1;

//   if (distance(posBuffer[person.index], destination) < .05) {
//     personBuffer[person.index].x += 1.;

//     if (currentIndex > neighborhoods.y) {
//       personBuffer[person.index].x = neighborhood.x;
//     }
//   }
//   //neighborhood has startPlaceIndex, endPlaceIndex, 

//   //worldState needs a lastVisitedNeighborhood - 
//   //to change neighborhood, person has to iterate through neighborhoods and find one with a population < 50
//   //keep neighborhoods balanced
//   //6 neighbors
// }


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
  var pos = posBuffer[id].xyz;
  var noise = 0.;
  var velocity = 0.;

  var person = personBuffer[id];
  var pers = Person(person.x, person.y, person.z, i32(person.w));
 
  var previous = i32(person.y);
  var next = i32(person.x);
  var place = places[next]; //next, terrain, x, y

  var pl = Place(place.x, place.y, place.z, place.w);

  let destination = Place(places[next].x, places[next].y, places[next].z, places[next].w);

  let prev = Place(places[previous].x, places[previous].y, places[previous].z, places[previous].w);

  personBuffer[id].w += .1;

  let interpolated = mix(places[previous].zw, places[next].zw  ,personBuffer[id].w);

  if (${DRAW_ON_SPHERE}) {   
    posBuffer[id] = sphericalToCartesian(interpolated); 
    //tween to spherical projection
   // posBuffer[id] = sphericalToCartesian(interpolated) + .01 * vec4<f32>(curlNoise(sphericalToCartesian(interpolated).xyz), 1.); 

  }
  if (! ${DRAW_ON_SPHERE}) {posBuffer[id] = vec4<f32>(interpolated.x, interpolated.y, 0, 0); } 

  var currentPosition = posBuffer[id];

  //open question - whats better, person arrives at location when distance < epsilon or when dt = 100% 
  //if distance, person.pos += .001 in unit-vector of position
  if (personBuffer[id].w > 1.) {
    personBuffer[id].w = -f32(id) / 100000.;

    personBuffer[id].w = 0.;
    personBuffer[id].y = personBuffer[id].x;
    personBuffer[id].x += f32(id);//pl.next;
    //person doesnt need a previous
    //person only needs a destination -> move a fixed rate toward the destination until 
    //distance is less than epsilon
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
  
    let place = places[i32(prev)];
    // let pl = Place();
    // posBuffer[index].x += cos(f32(index));
    // posBuffer[index].y  += sin(f32(index));

    // personBuffer[index].x = place.z;
    // personBuffer[index].y = place.w;

    // posBuffer[index].x = place.z + f32(index) / 100.;
    // posBuffer[index].y  += place.w;

    posBuffer[index].x = place.z;
    posBuffer[index].y  = place.w;

    posBuffer[index].x = place.z;
    posBuffer[index].y  = place.w;

    personBuffer[index].x = 0;
    personBuffer[index].y = 0;
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
  var φ = coords.x;
  var θ = coords.y;
  var r = 5.;
  var x = r * sin(θ) * cos(φ);
  var y = r * sin(θ) * sin(φ);
  var z = r * cos(θ);

  return vec4<f32>(x, z, y, 0);
}

const sphereRadius = 1.;

@group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
@group(0) @binding(3) var<storage,read_write> distanceTraveled: array<f32>;

@group(0) @binding(2) var<uniform> uniforms: Uniforms;

@group(0) @binding(4) var<storage, read_write> neighborhoods: array<f32>;
@group(0) @binding(5) var<storage, read_write> worldState: array<f32>;
@group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;
@group(0) @binding(6) var<storage,read_write> places: array<vec4<f32>>;
@group(0) @binding(7) var<storage,read_write> personBuffer: array<vec4<f32>>;

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let index: u32 = GlobalInvocationID.x;

      var pos = posBuffer[index];
      var dt = distanceTraveled[index];
      var r = worldState[index];
      var neighborhoods = neighborhoods[index];
      var vf2 = places[index];
      var person = personBuffer[index]; 


      var vf1 = vectorFieldBuffer[index];
      var time = uniforms.time;
      distanceTraveled[index] += 1.;
      if (dt < 1) {
        init(index);
      }
      simulationStep(index);
      posBuffer[index].z += f32(index) / 1e9;
      return;
      var keyframes = (uniforms.time % 10000) / 5000;
    }
    ${noise}
`
import {noise} from './shader2'

















