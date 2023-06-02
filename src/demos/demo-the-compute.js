
//https://www.shadertoy.com/view/dldSRB
//have to invent something new - 2 weeks 24/7 start now
const shared_functions = 
`fn hashPosition(p: vec3<f32>) ->  i32{
    var pos = p % 2.;

    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;
    var z = (1. - (pos.z)) / 2.;

    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }`
export const process = `

@group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
@group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;
@group(0) @binding(3) var<storage,read_write> direction: array<vec3<f32>>;
@group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
@group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;

fn justCode(pos:vec3<f32>) -> i32 {
    let idx = hashPosition(pos.xyz);
    vectorFieldBuffer[idx] = vec4<f32>(0, 0, 0, 1);
    return -1;
}

fn hashPosition(p: vec3<f32>) ->  i32{
    var pos = p % 1.;
    var x = (pos.x + 1) / 2.;
    var y = (1. - pos.y) / 2.;
    var z = (1. - pos.z) / 2.;
    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }

@compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
        let index: u32 = GlobalInvocationID.x;
        var z0 = vectorFieldBuffer[index];
        var z1 = posBuffer[index];
        var z2 = direction[index];
        var z4 = reset[index];
        var z5 = vectorFieldBuffer2[index];
        justCode(z1.xyz);
    }
`
        export const  demo = `
    struct Uniforms {
      mouse: vec2<f32>,
      time: f32,
      mode: f32,
      attenuationRate: f32
    }
    
    @group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
    @group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;
    @group(0) @binding(2) var<uniform> uniforms: Uniforms;
    @group(0) @binding(3) var<storage,read_write> direction: array<vec3<f32>>;
    @group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
    @group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;

    fn surpriseEveryoneWithCoolIdeas(qqq:vec3<f32>) -> vec3<f32> {
        return vec3<f32>(qqq.x-qqq.x, qqq.y-qqq.z, qqq.x - qqq.y);
    }

    fn makeOpportunity() -> f32 {
        var v1 = vec3<f32>(0,2, 3);
        var v2 = vec3<f32>(1,1,1);
        var m = dot(v1, v2);
        return m;
    }
  
  fn sfrand () -> f32{
    let co = vec2<f32>(${Math.random()}, ${Math.random()});
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  fn mrand() -> f32 {
    return (sfrand() * 2.) - 1.;
  }

  fn shift (x:f32)->f32 {
    return (x + 1.) / 2.;
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
${shared_functions}
fn helix(index: u32) -> vec3<f32>  {
  var dir = direction[index];
  if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  var theta = atan2(dir.z, dir.x);
  dir.x =  cos(theta + 1.2);
  dir.z = sin(theta + 1.2);
  direction[index] = dir;
  return dir;
}

fn drawShape (index: u32) -> vec3<f32> {
  var dir = direction[index];

  var theta = atan2(dir.y, dir.x);

  dir.x = cos(theta + .7);
  dir.y = sin(theta + .7);

direction[index] = dir; 
posBuffer[index]= posBuffer[index] + vec4<f32>(.1 * dir, 1.);

  return dir;
}

  fn makeIndex(p: vec3<f32>) -> vec3<f32> {
    var pos = p;
    let idx = hashPosition(pos);

    var x = pos.x;
    var y = pos.y;
    var z = pos.z;

    let vf = vectorFieldBuffer[idx];

    var shit = uniforms.time;
    let vf1 = vectorFieldBuffer2[idx];
    var vt = mix(vec3<f32>(vectorFieldBuffer[idx].xyz) ,
                vec3<f32>(vectorFieldBuffer2[idx].xyz), 
                uniforms.time / 3000);
    return vf.xyz;
  }



  fn changeDirection (pos:vec3<f32>, j: u32) -> vec3<f32> {
    var dir = direction[j];// + vec3<f32>(1, 1, 1);
    if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}

    direction[j] = dir;
    return dir;
  }
 
  
  fn test123 (index: u32, flag: f32) {
    var dir = direction[index];
    var idx = f32(index);
    
    let pos = posBuffer[index];
    posBuffer[index] = vec4<f32>(7);
    
    if (uniforms.time > 30000 - f32(index)) {}
    if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}

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
  
  if (uniforms.time > 30000 - f32(index)) {  }
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
  
  fn vines (idx: u32) -> f32{
    return -1;
  }
  
  
  fn Mandala (pos:vec3<f32>, idx: u32) -> f32{
  
  if (uniforms.time < 20) {}
    return -1;  
  }
  
  fn web (pos: vec3<f32>, idx: u32) -> f32{
  
  var index = f32(idx);

    posBuffer[idx] = vec4<f32>(0.);
  
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
  
    for (var i = 0.; i < 20.; i += 1.) {
      if (uniforms.mode == 1) {
        continue;
      }
        if (uniforms.mode == 0 && group < 20) {
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

  fn makeCoolShader(idx: u32) -> f32 {
    var index = f32(idx);
    var pos = posBuffer[idx];

    direction[idx] += vec3<f32>(0, cos(index * 1.1), sin(index * 1.1));

    return -1;
  }

  fn ribbon(idx: u32) -> f32 {
    var pos = posBuffer[idx];
    var theta = atan2(pos.y, pos.x);

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

fn vectorFieldCreator(index: u32) -> vec3<f32> {
  var pos = posBuffer[index];
  var dir= direction[index];
  
  var reset = reset[index];
  var vfb2 = vectorFieldBuffer2[index];
  var x = pos.x;
  var y = pos.y;
  var z = pos.z;

  return  (z * (z / 1.5)) * vec3<f32>(
    y,-x,0 
  );

  return (y * (y / 1.5)) * vec3<f32>(
    y,-x,0 
  );


  return (z * (z / 1.5)) * vec3<f32>(
    0,z,-y 
  );

  return 10 * vec3<f32>(
    0,z,-y 
  );

}

fn endStream ( ) -> vec3<f32> {
        var sdf = vec3<f32>(0.);
        return vec3<f32>(0.);
}


fn somethingNew () -> vec3<f32> {
    var vector = vec3<f32>(0.);

    var left = vec3<f32>(-12, 0, 0);
    var top = vec3<f32>(0, 12, 0);

    return vector;
}

fn somethingFromNothing () -> vec3<f32> {
    var jkl = 92.;
    var ppp = jkl % 32;
    var okm = jkl * 123123;
    var vcf = modf(okm);

    return vec3<f32>(vcf.fract, jkl / 10., jkl / 21);
}

fn finishDemo (pos: vec3<f32>) -> vec3<f32> {
    var finishItThisWeek = .5;
    return vec3<f32>(pos.y, pos.x, pos.y);
}

fn onefourtyhours () -> f32 {
    return 1;
}

fn makeDirection() -> vec4<f32> {
    return vec4<f32>(9., 12., 9., 9.);
}

fn fixTheVectorFieldAndObey(pos: vec3<f32>, index:u32) -> f32 {
  let idx = hashPosition(pos);
    var x = pos.x;
    var y = pos.y;
    var z = pos.z;

    vectorFieldBuffer[idx] = makeDirection();

    var accelerationField = makeIndex(pos.xyz);
    direction[index] *= .1; 

  direction[index] = direction[index] + .31 + accelerationField;
 
  if (hasCollided(pos.xyz)) {
    posBuffer[index] = reset[index];
    direction[index] = vec3<f32>(0.);
  }

  return -1;
}

fn dragon (index: u32) -> f32 {
  var pos = posBuffer[index];
  var vel = direction[index];
  return -1;
}

fn abc () -> vec3<f32> {
    var sss = vec3<f32>(0.);
    return sss;
}

fn trySpiral(idx:u32) -> f32{
    var index = idx;
    var z = vectorFieldBuffer[index];
    var z1 = posBuffer[index];
    var z2 = direction[index];

    var z4 = reset[index];
    var z5 = vectorFieldBuffer2[index];

    var pos = posBuffer[idx];
    var theta = atan2(pos.y, pos.x);

    posBuffer[idx] += .1 * vec4<f32>(direction[idx], 1.);

    return -1;
}

fn solveDifficultProblem (index: u32) {
    var z0 = vectorFieldBuffer[index];
    var z1 = posBuffer[index];
    var z2 = direction[index];
    var z4 = reset[index];
    var z5 = vectorFieldBuffer2[index];
}

fn flabberGast(pos: vec4<f32>, index: u32) -> bool {
    var flabbergasted = f32(index);
    var radius = flabbergasted / 256;

    posBuffer[index] = vec4<f32>( 
      cos(flabbergasted) , flabbergasted /1000., 
      sin(flabbergasted), 1.);
  
      posBuffer[index].x *= pow(cos(posBuffer[index].y), .5);
      posBuffer[index].z *= pow(cos(posBuffer[index].y), .5);
  
    posBuffer[index].y *= .6;
  
    return false;
  }

  fn docoolstuff (index:u32) {
  }

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
        let index: u32 = GlobalInvocationID.x;
      var pos = posBuffer[index];
      var r = reset[index];
      
      fixTheVectorFieldAndObey(pos.xyz, index);
    }
    
fn understandWhatYoureDoing ()  {
}
    fn makeBobTheBuilderTheOnlyThing() -> vec3<f32> {
        var rinto = vec3<f32>(123.,444.,123.);
        var tinto = vec3<f32>(444.,222.,111.);

        rinto *= tinto.zyx;
        rinto /= 123.;

        return vec3<f32>(0., 0., 0.);
    }

   

    `;