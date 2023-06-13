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
    @group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
    @group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;
    @group(0) @binding(7) var<storage,read_write> groupBuffer: array<f32>;

  
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

  fn makeMagnets () -> array<vec3<f32>, 4> {
    var result = array<vec3<f32>, 4>();

    result[0] = vec3<f32>(0, 0, 0);
    result[1] = vec3<f32>(0, 0, 0);
    result[2] = vec3<f32>(0, 0, 0);
    result[3] = vec3<f32>(0, 0, 0);


    return result;
  }

  fn getField(pos: vec3<f32>, mag: vec3<f32>) -> f32{
    var radius = distance(pos, mag);
    var theta = atan(pos.y / pos.x);
    return 1;
  }

  fn applyMagnets(pos: vec3<f32>) -> f32 {
    var idx = hashPosition(pos);

    var magnets = makeMagnets();


    vectorFieldBuffer[idx] = vec4<f32>(0);
    //sin(distance(pos.x, mag.x)), cos(distance(pos.y, mag.y));
    vectorFieldBuffer[idx] +=  vec4<f32>((magnets[0] - pos),1);
    vectorFieldBuffer[idx] +=  vec4<f32>((magnets[1] - pos),1);
    vectorFieldBuffer[idx] +=  vec4<f32>((magnets[2] - pos),1);
    vectorFieldBuffer[idx] +=  vec4<f32>((magnets[3] - pos),1);
    return 1.;
  }

  fn hashPosition(pos: vec3<f32>) ->  i32{
    var x = (pos.x + 1) / 2.;
    var y = (1. - (pos.y)) / 2.;
    var z = (1. - (pos.z)) / 2.;
    //if (z < .1) {z = .9;}
    
    // 
    // var idx = i32(floor(x * 1000) + floor(floor(y * 1000) * 1000)
    // + floor(floor(z * 1000) * 1000) * 10
    // );


    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }


fn helix(index: u32) -> vec3<f32>  {
  var dir = direction[index];


  if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}


  var theta = atan2(dir.z, dir.x);

  // dir.x = cos(theta * 1.5);
  // dir.z = sin(theta * 1.5);


  dir.x =  cos(theta + 1.2);
  //dir.y = .1 * .000001;
  dir.z = sin(theta + 1.2);

  // dir.x = .1;
  // dir.y = .1;

  //posBuffer[index] = vec4<f32>(0.);

  direction[index] = dir;
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
    //pos += .05;
    //pos.z -= 1.1;
    let idx = hashPosition(pos);

    var x = pos.x;
    var y = pos.y;
    var z = pos.z;
  //if uniforms.mode == 2 ?
    // if (idx < 0) {
    //   //return vec3<f32>(-x, -y, 0);
    // }
    // if (idx > 1000000) {
    //   //return vec3<f32>(-x, -y, 0);
    // }

    let vf = vectorFieldBuffer[idx];

    var shit = uniforms.time;
    //vectorFieldBuffer[idx] += vec4<f32>(abs(pos.x), abs(pos.y), 0, 1);



    let vf1 = vectorFieldBuffer2[idx];
    var vt = mix(vec3<f32>(vectorFieldBuffer[idx].xyz) ,
                vec3<f32>(vectorFieldBuffer2[idx].xyz), 
                uniforms.time / 3000);

                //return vec3<f32>(-x, -y, -z);
                // if (uniforms.mode ==0 )
                //  { return vec3<f32>(0,); }
    return vf.xyz;
  }



  fn changeDirection (pos:vec3<f32>, index: u32) -> vec3<f32> {
    var dir = direction[index];// + vec3<f32>(1, 1, 1);
    if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  
    // if (false) {
    //   dir.x += .5;
    //   dir.y += .5;  
    // } else {
    //   dir.x += cos(1.75);
    //   dir.y += sin(1.75);
    //   // dir.x += 1. * cos(group *10 );
    //   // dir.y += 1 * sin(group * 10);
    // }
  
    var theta = atan2(dir.y, dir.x);
    // // dir.x += cos(theta * 1);
    // // dir.y += sin(theta * 1);
  
    dir.x =  cos(theta + 1.6);
    dir.y = .1 * sin(theta + 1.6 * f32(index) / 100);
  
    // if (group == 0) {
    //   dir = vec3<f32>(1, 0, 0);
    // } else if (group == 1)  {
    //   dir = vec3<f32>(0, 1, 0);
    // } else if (group == 2)  {
    // dir = vec3<f32>(0, -1, 0);
    // } else if (group == 3)  {
    //   dir = vec3<f32>(-1, 0, 0);
    // }
    direction[index] = dir;
    return dir;
  }
  
  
  // fn drawCoolShape () -> vec3<f32>  {
  //   //helix = circle + z direction
  //   return vec3<f32>(0.);
  // }
  
  
  // fn helix(index: u32) -> vec3<f32>  {
  // var dir = direction[index];
  
  
  // if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  
  
  // var theta = atan2(dir.z, dir.x);
  
  // // dir.x = cos(theta * 1.5);
  // // dir.z = sin(theta * 1.5);
  
  
  // dir.x =  cos(theta + 1.2);
  // //dir.y = .1 * .000001;
  // dir.z = sin(theta + 1.2);
  
  // // dir.x = .1;
  // // dir.y = .1;
  
  // //posBuffer[index] = vec4<f32>(0.);
  
  // direction[index] = dir;
  // return dir;
  // }
  
  //windowing function for direction ?? 
  
  //distance traveled is on a per index basis
  //distance traveled vs time elapsed = 
  
  
  fn test123 (index: u32, flag: f32) {
    var dir = direction[index];
//    var idx = indexBuffer[index];
  var idx = f32(index);
    
    let pos = posBuffer[index];
  //    dir.x = pos.x - pos.y;
    if (distancetraveled[index] < 1000) {
      posBuffer[index] = vec4<f32>(0);
    }
    //f32(index)
  if (uniforms.time > 30000 - f32(index)) {
  
    //posBuffer[index]= vec4<f32>(idx / 256., idx / 256., 0., 1.);
    //return;
  }
    if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  

    var i = (uniforms.time  % 3);
  
    //choose 2/3 indices based on a timer 
    var theta = atan2(dir.z, dir.x);
  
    // dir.z =  cos(theta + 1.2);
    // dir.x = sin(theta + 1.2);
  
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
  
    dir.y = dir.x;//cos(idx);
    dir.x = dir.y;// sin(idx);
  
  
    dir.y = cos(idx);
    dir.x = sin(idx);

    // if (length(dir) > 5) {
    //   dir.x *= -1;
    //   dir.y *= -1;
   
    // }
  
  //show the demo to people and demo has to be really good 
  //the process has to be good too
  
    //if (u32(uniforms.time) <= index * 1000) {
    //  dir = vec3<f32>(-1000);
    //}
    //if (shouldAnimate(direction[index])) {
      direction[index] = dir;
    //}
    return;
  }
  
  fn vortex (index: u32) {
    var dir = direction[index];
    var idx = f32(index);
  
    //f32(index)
  if (uniforms.time > 30000 - f32(index)) {
  
    //posBuffer[index]= vec4<f32>(idx / 256., idx / 256., 0., 1.);
    //return;
  }
    if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
  
    dir.y = .1;
    if (idx > 128){
      dir.y *= -1;
    }
    // * idx * cos(idx);
    direction[index] = dir;
    let pos = posBuffer[index];
    dir.x = pos.x - pos.y;
  
  
    if (hasCollided(posBuffer[index].xyz)) {
      dir.y = -dir.x;
      dir.x = -dir.y;
    }
  } 
  
  //   fn lastWeek(pos: vec3<f32>, idx: u32) -> f32{
  //     //rotate hues so that rainbow flies toward camera 
  //     //no direction
  //     let index = f32(idx);
  // let i = index / 10000;
  //     posBuffer[idx] = vec4<f32>(3. * i * cos(index + uniforms.time * .001), 3. * i * sin(index + uniforms.time * .001), index / 256, 1.);
  
  //     //posBuffer[idx] = vec4<f32>(3. * cos(index + uniforms.time * .001), 3. * sin(index + uniforms.time * .001), index / 256, 1.);
  
  //     return -1;
  //   }
  
  fn vines (idx: u32) -> f32{
  return -1;
  }
  
  
  fn Mandala (pos:vec3<f32>, idx: u32) -> f32{
  
  
  //cpu graphics = draw 20 lines in a spiral curved from 4 attachment points 
  
  if (uniforms.time < 20) {}
  
  
  
  
  return -1;  
  }
  
  fn web (pos: vec3<f32>, idx: u32) -> f32{
  
  var index = f32(idx);
  //ditch conditionals in favor of building up a variable and then using it at the end 
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
    //rotate hues so that rainbow flies toward camera 
    //no direction
    let index = f32(idx);
    let i = index / 10000;
    posBuffer[idx] = vec4<f32>(3. * i * cos(index + uniforms.time * .001), 3. * i * sin(index + uniforms.time * .001), index / 256, 1.);
  
    //posBuffer[idx] = vec4<f32>(3. * cos(index + uniforms.time * .001), 3. * sin(index + uniforms.time * .001), index / 256, 1.);
  
    return -1;
  }
  
  //dont think anything else - just fnish the shader
  //delete group -> implicit group created by index -> 1-1e5 = group 1, 1e5-2e5   = group 2
  //make a new buffer that links particle to thet5 index in the buffer
  //buffer that has a range of 0-1e6 ? so instead of thread index its a particle index
  fn runAlongRoute (pos:vec3<f32>, index:f32) -> vec3<f32> {
  var idx = u32(index);
  
  var dir =  direction[idx];
  
  //time, mode, attenuationRate, particleIndex, groupIndex 
  //synchronized swimmers - all particles of certain color do similar stuff 
  //noise Buffer = unique ID = Math.random () * coefficent for each particle 
  var dt = sin(uniforms.time);
  
  var group = f32(index) % 20;
    distancetraveled[idx] += 1;

    // if (group == 0 || group == 3) { 
    //   distancetraveled[idx] -= 100;
    //     //dir = drawCoolShape();
    //     lastMonth(pos,idx);
    //     dir = changeDirection(pos,idx);
    // }
  
    for (var i = 0.; i < 20.; i += 1.) {
     // if (distancetraveled[idx] < 100)  {
      if (uniforms.mode == 1) {
        //makeParticlesFly(idx);
        //test123(idx, 1.);
        // vortex(idx);
         //makeCoolShader(idx);
        //helix(idx);
        //makeASpiralWithoutSinCosineOrIndex(idx);
        continue;
      }
        if (uniforms.mode == 0 && group < 20) {
           ribbon(idx);
          continue;
        }
      
      //}
    }
    // if (hasCollided(pos.xyz))  {
    //   var vel = direction[idx];
    //   direction[idx] = vec3<f32>(vel.y, -vel.x, vel.z);
    //   direction[idx] *= .0;
    //   //direction[index] = direction[index] + .1 * vf;
    // }

  
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




fn makeGreatStuff(idx:u32) -> f32 {
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
      posBuffer[idx] = reset[idx];
      //vec4<f32>(0.);
    }
    return -1;
  }

//make it change through different phases - 5 phases 


//improve the patterns
  fn ribbon(idx: u32) -> f32 {
    var dt = distancetraveled[idx];
    var pos = posBuffer[idx];
    var theta = atan2(pos.y, pos.x);
    distancetraveled[idx] += 1.;
    //uniforms.time / 3000000
    //.001 * 
    
    if (idx > 256 ){
          direction[idx] = -.001 * f32(idx) * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    } else {
      let radius = distance(vec2<f32>(0,0), pos.xy);
    direction[idx] =  1/ radius * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    }

    direction[idx] = vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);

    direction[idx] = vec3<f32>(direction[idx].y, -direction[idx].x, 0.);

    // if (distancetraveled[idx] > 1000) {
    //   distancetraveled[idx]= 0;
    //   posBuffer[idx] = vec4<f32>(0.);
    //   //direction[idx] = vec3<f32>(direction[idx].y, -direction[idx].x, 0.);
    //   // f32(idx) / 256.
    // }
    return -1;
  }

  fn makeVectorFieldSlot () {
    //return vec4<f32>(,,,);
  }

fn applyVF(pos: vec3<f32>, index:u32) -> vec3<f32> {
  var theta = 1. * atan2(pos.y, pos.x);
  var theta2 = atan2(pos.x, pos.z);
  let idx = hashPosition(pos);



  //use time to gain 3 way variation 

  let t = uniforms.time * .0001; 
//vectorFieldBuffer[idx] += 10 * vec4<f32>(cos(theta) * t, sin(theta) * t,  sin(theta  )* t, 1);

  // vectorFieldBuffer[idx] +=  10. * vec4<f32>(cos(theta)
  //  , sin(theta) ,  sin(theta  ), 1);

  //vectorFieldBuffer[idx] *= .9;
  //  vectorFieldBuffer[idx] *=  10. * vec4<f32>(cos(theta)
  //  , sin(theta) ,  sin(theta  ), 1);

  //  vectorFieldBuffer[idx] = vec4<f32>(mix(vectorFieldBuffer[idx].xyz,
  //  vec3<f32>(vectorFieldBuffer2[idx].xyz), 
  //  1.), 1.);
  //add wind
  //

   //generate both vector fields on the gpu
   //tween between them

   //draw a curve from bottom left to top right
   //

   //vectorFieldBuffer[idx] =  makeVectorFieldSlot();
  vectorFieldBuffer[idx] += 10 * vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);

  let vf = vectorFieldBuffer[idx];

if (hasCollided(pos.xyz)) {
  posBuffer[index] = //f32(index) * 
  vec4<f32>(cos(f32(index)), sin(f32(index)), 0.,0.);
}

  // distancetraveled[index] += 1.;
  // if (distancetraveled[index] > 10000) {
  //   var abc = vectorFieldBuffer[idx];
  //   posBuffer[index] = vec4<f32>(0.);
  //   distancetraveled[index] = 0.;
  // }

  return vec3<f32>(1.);
}


fn dragon (index: u32) -> f32 {

  var pos = posBuffer[index];
  var vel = direction[index];
  applyVF(pos.xyz, index);

  // if (groupBuffer[index] > 1) {
    //   dragon(index);
    // }

    if (length(direction[index]) == 0.) {
      direction[index] = vec3<f32>(0, 0, -1);
    }
    var r = reset[index];
    runAlongRoute(pos.xyz, f32(index));
    var abc = posBuffer[index];

    var vf = hash(pos.xyz);

    let t = uniforms.time;
  
   //direction[index] = direction[index] + vec3<f32>(.00001 * f32(index), 0., 0.);
   posBuffer[index] = vec4<f32>(pos.xyz + .01 * direction[index].xyz,  1);

  //  direction[index] *= .0;
 
   distancetraveled[index] += 1.;
    if (hasCollided(pos.xyz)) {
      posBuffer[index] = vec4<f32>(0.);
    }


    //wind turbulence
    //sphere

    var mouse = (uniforms.mouse - .5) * vec2<f32>(2,-2);
    if (distance(posBuffer[index].xy, mouse) < .1) {
      // direction[index].x = direction[index].y;
      // direction[index].y = -direction[index].x;
      //posBuffer[index]= vec4<f32>(posBuffer[index].xy - vec2<f32>(distance(posbuffer[index].xy, mouse)), 0., 1.);
      //posBuffer[index] = posBuffer[index] - vec4<f32>(mouse, 0,0);
      //direction[index]*= .001;
    }
    //helix(index);
     direction[index] *= .0;

     if (groupBuffer[index] > -1) {
      direction[index] = direction[index] + .001 * vf;
      posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
    }

    //vector field toward camera with shapes superIMpose
    //if (groupBuffer[index] == 8) {  lastMonth(pos.xyz, index); }
    //draw cool shapes and then dont deform them in the vector field until some time 
    //var group = groupBuffer[index];
    //runAlongRoute(pos.xyz, f32(index));

    // if (groupBuffer[index] > 8) {
    //   sphereEvaporate(pos, index);
    // }

  return -1;
}

fn mutateField(index: u32) -> f32 {
  vectorFieldBuffer[index] = vec4<f32>(0, 0., 0., 0.);
  return -1;
} 


fn vf(index:u32) {

}
    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {

      let index: u32 = GlobalInvocationID.x;
      var pos = posBuffer[index];
      var vel = direction[index];
      var r = reset[index];
      var dt = distancetraveled[index];
      var vf2 = vectorFieldBuffer2[index];
      var g = groupBuffer[index];
      var vf = vectorFieldBuffer[index];

      var time = uniforms.time;



      direction[index] = .01 *vec3<f32>(sin(time * .001));
      posBuffer[index] = posBuffer[index] + .01 * vec4<f32>(direction[index],1 );








    }
    
    
    
    
    fn hexagon (p: vec3<f32>, time: f32) -> vec3<f32> {
      var shit = array<vec3<f32>,3 >();
      shit[0] = vec3<f32>(.1, 0., 0.);
      return p + shit[0] - p;
      return p;
    }
    
    
    `