// high res vector field  +
// reflection mapping - 
// glow post processing -
// coolness < (what am i missing) - do exactly what they say - consciously, slowly build using high degree of mental effort - to preclculate effect on particle mathematically 
// no reactivity, no drama, no disobedience, every second of every hour for 2-3 weeks 
//no lying - i shall not lie
//better than published research - in one week continuously nonstop
        //write particle position to vector field ->
               //for each particle - pick 2 others and orbit around mid points or each other 
        //change modes based when a certain amount of time has passed.

//workgroup indices - 256,256,256 - cube 
//use probability - fork and diverge and converge 
//make an eye shape
//could've become anyone 3 months ago - 1 week ago - 8 monhts ago
//now - inflect -youtube was end - harry potter was end - 3 weeks ago - 
const shared_functions = 
`fn hashPosition(pos: vec3<f32>) ->  i32{
    var x = clamp((pos.x + 1) / 2., 0, 1);
    var y = clamp((1. - (pos.y)) / 2., 0, 1);
    var z = clamp((1. - (pos.z)) / 2., 0, 1);

    //if (z < .1) {z = .9;}
    // 
    // var idx = i32(floor(x * 1000) + floor(floor(y * 1000) * 1000)
    // + floor(floor(z * 1000) * 1000) * 10
    // );


    var idx = i32(floor(x * 100) + floor(floor(y * 100) * 100)
    + floor(floor(z * 100) * 100) * 100
    );
    return idx;
  }`




export const process = `

@group(0) @binding(0) var<storage,read_write> vectorFieldBuffer: array<vec4<f32>>;
@group(0) @binding(1) var<storage,read_write> posBuffer: array<vec4<f32>>;
//@group(0) @binding(2) var<uniform> uniforms: Uniforms;
@group(0) @binding(3) var<storage,read_write> direction: array<vec3<f32>>;
@group(0) @binding(4) var<storage, read_write> distancetraveled: array<f32>;
@group(0) @binding(5) var<storage, read_write> reset: array<vec4<f32>>;
@group(0) @binding(6) var<storage,read_write> vectorFieldBuffer2: array<vec4<f32>>;
@group(0) @binding(7) var<storage,read_write> groupBuffer: array<f32>;

//spiral --acts on 8 - 2D xy,  yz
//sphere
//cube
//make a cube with 100,000 x/y and 10 z
//harmonic oscilations
//walk indexes to create flow fields 


fn justCode(pos:vec3<f32>) -> i32 {
    let idx = hashPosition(pos.xyz);
    vectorFieldBuffer[idx] = vec4<f32>(.3, .6, .9, 1);

    return -1;
}

fn hashPosition(pos: vec3<f32>) ->  i32{
    var x = (pos.x + 1) / 2.;
    var y = (1. - pos.y) / 2.;
    var z = (1. - pos.z) / 2.;
    //make vector field infinite = win tv show; - outside 0-1 repeat
    //no buffer = make the vector field
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

@compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
        let index: u32 = GlobalInvocationID.x;
        var z0 = vectorFieldBuffer[index];
        var z1 = posBuffer[index];
        var z2 = direction[index];
        
        var z3 = distancetraveled[index];
        var z4 = reset[index];
        var z5 = vectorFieldBuffer2[index];
        var z6 = groupBuffer[index];

        
        justCode(z1.xyz);
    }
`
        export const  demo = `
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


    fn surpriseEveryoneWithCoolIdeas(qqq:vec3<f32>) -> vec3<f32> {
        //draw a circle then xy% start a new circle that is rotated by xy degrees
        return vec3<f32>(qqq.x-qqq.x, qqq.y-qqq.z, qqq.x - qqq.y);
    }



    fn makeOpportunity() -> f32 {
        var v1 = vec3<f32>(0,2, 3);
        var v2 = vec3<f32>(1,1,1);
        //0 * 1 + 2 * 1 + 3 * 1
        var m = dot(v1, v2);
        //look at all 27 neighboring vectors and make current vector perpendicular to all of them if < sin time> 


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

${shared_functions}


  // fn changeDirection (pos:vec3<f32>, index: u32) -> vec3<f32> {
  //   var dir = direction[index];// + vec3<f32>(1, 1, 1);
  //   if (length(dir) == 0.){ dir = vec3<f32>(.1, 0., 0. );}
 
  //   // if (false) {
  //   //   dir.x += .5;
  //   //   dir.y += .5;  
  //   // } else {
  //   //   dir.x += cos(1.75);
  //   //   dir.y += sin(1.75);
  //   //   // dir.x += 1. * cos(group *10 );
  //   //   // dir.y += 1 * sin(group * 10);
  //   // }

  //   var theta = atan2(dir.y, dir.x);
  //   // // dir.x += cos(theta * 1);
  //   // // dir.y += sin(theta * 1);

  //   dir.x =  cos(theta + 1.6);
  //   dir.y = .1 * sin(theta + 1.6 * f32(index) / 100);

  //   // if (group == 0) {
  //   //   dir = vec3<f32>(1, 0, 0);
  //   // } else if (group == 1)  {
  //   //   dir = vec3<f32>(0, 1, 0);
  //   // } else if (group == 2)  {
  //   // dir = vec3<f32>(0, -1, 0);
  //   // } else if (group == 3)  {
  //   //   dir = vec3<f32>(-1, 0, 0);
  //   // }
  //   direction[index] = dir;
  //   return dir;
  // }
  // fn drawCoolShape () -> vec3<f32>  {
  //   //helix = circle + z direction
  //   return vec3<f32>(0.);
  // }

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
    var pos = p;
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
 //          ribbon(idx);
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

    return -1;
  }


fn changeAcceleration () -> f32{

  return -1;
}



fn vectorFieldCreator(index: u32) -> vec3<f32> {
  var pos = posBuffer[index];
  var dir= direction[index];
  
  var soFar = distancetraveled[index];
  var reset = reset[index];
  var other = vectorFieldBuffer2[index];
  var groupIndex = groupBuffer[index];
  var x = pos.x;
  var y = pos.y;
  var z = pos.z;


  // return (1 - dir) * vec3<f32>(
  //   y,-x,0 
  // );

  return groupIndex * vec3<f32>(y, -x, 0);

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

  //return vec3<f32>(10 * y * sin(uniforms.time * .1), dot(dir, dir) ,0 );
}


fn somethingNew () -> vec3<f32> {
    return vec3<f32>(0.);
}

fn createVectorField(index: u32) -> vec3<f32> {
    var dir= direction[index];
    var soFar = distancetraveled[index];
    var reset = reset[index];
    var other = vectorFieldBuffer2[index];
    var groupIndex = groupBuffer[index];
    var pos = posBuffer[index];
 
    var i = 0.;
    var j = 0.;

    return vec3<f32>(.0001,0,0);
    
    //try hi-res, 2d, and 3d, and spherical 

    //soh - sin opp hyp
    //toa - opposite / adjacent - 4/5

//serious means 20 hour work days for as long as it takes
//400 hours
    //8 data points - 4 per quadrant because coordinate system changes
    // return vec3<f32>(
    //     log(pos.x), 0, 0
    // );
//return vec3<f32>(sin(pos.x * 3.14), 0., 0.);
    //return vec3<f32>((pos.x * 100 % 3)  * (pos.y * 100 % 3));
    //return vec3<f32>(pos.x * pos.y, 0, 0);
    //return vec3<f32>(pos.x / pos.y, 0, 0);
   //return vec3<f32>(pos.x - pos.y, 0, 0);
}

//render buffer we're trying to teach you that our time has more value than youurs
//if you waste our time then we wont let you do anything
//you must work till a window of opportunity arises
//story of a lifetime 
//is it all about the story?
//is a demop really of anything? 
//then you will work for 100 hours straight without sleeping




fn somethingFromNothing () -> vec3<f32> {
    var jkl = 92.;
    var ppp = jkl % 32;
    var okm = jkl * 123123;
    var vcf = modf(okm);


    //var rty = dot(vec3<f32>(1., 2., 3.), vec3<f32>(4., 3., 2.));
    return vec3<f32>(vcf.fract, jkl / 10., jkl / 21);
}


// fn tangent (y:f32, x:f32) -> f32 {
//     var unitCircle = array<vec2<f32>, 8>;


//     unitCircle[0] = vec2<f32>(1, 0);
//     var hypotenuse = sqrt(x * x + y * y);

//     let arcDistance = 0;
//     let less = floor(arcDistance);
//     let on = ceiling(arcDistance);
//     //arc distance of hypotenuse

//     return unitCircle[];
// }

// fn createVectorField(index: u32) -> vec3<f32> {
//     var dir= direction[index];
//     var soFar = distancetraveled[index];
//     var reset = reset[index];
//     var other = vectorFieldBuffer2[index];
//     var groupIndex = groupBuffer[index];
//     var pos = posBuffer[index];
//     //link the indices of 3-4 points and have them travel in clusters or orbit each other, swap places
//     //dont use position
//     var theta = atan2(pos.y, pos.x) * 1;
//     var i = cos(theta) - pos.x;
//     var j = sin(theta) - pos.y;
//     //var k = sin(j * 3.1415);
//     var radius = distance(pos.xyz, vec3<f32>(0));
//     return radius * vec3<f32>(i, j, 0);
// }

// fn createVectorField(index: u32) -> vec3<f32> {
//     var dir= direction[index];
//     var soFar = distancetraveled[index];
//     var reset = reset[index];
//     var other = vectorFieldBuffer2[index];
//     var groupIndex = groupBuffer[index];
//     var pos = posBuffer[index];
//     //link the indices of 3-4 points and have them travel in clusters or orbit each other, swap places
//     //dont use position
//     var theta = atan2(pos.y, pos.x);
//     var angle = floor(degrees(theta) / 8);
//     var point = 10. * vec3<f32>(cos(angle), sin(angle), 0);
//     var i = point.x - pos.x;
//     var j = point.y - pos.y;
//     var m = 0.;
//     return vec3<f32>(i, j, 0);
// }

// fn createVectorField(index: u32) -> vec3<f32> {
//         var dir= direction[index];
//         var soFar = distancetraveled[index];
//         var reset = reset[index];
//         var other = vectorFieldBuffer2[index];
//         var groupIndex = groupBuffer[index];
//         var pos = posBuffer[index];

//         var a1 = distance(pos.xyz, vec3<f32>(0));
//         // var a2 = distance(pos.xyz, vec3<f32>(1,1,1,));
//         var a3 = distance(pos.xyz, pos.zxy);
//         // vf is cool - w/o any functions 
//         var i = 10.;
//         var j = 0.;
     
//         return vec3<f32>(y,-x, 0);
//     }

fn createVectorField2(index: u32) -> vec3<f32> {
  var pos = posBuffer[index];


//   return vec3<f32>(
//     .1 * reflect(pos, vec4<f32>(0,0,0, 0)).xyz
//   );

//return vec3<f32>(0.,0., 0.);


var dir= direction[index];

var soFar = distancetraveled[index];
var reset = reset[index];
var other = vectorFieldBuffer2[index];
var groupIndex = groupBuffer[index];


var cmu = groupIndex % 3.;


//terrence tao says 10 tricks is all you need
//telepaths want a perfect shader thats typed up and from scratch 
//you dont have a choice, you just have to make it 
//dont sing or you cant code
//lost privledges cause didnt do enough work
//consciously code without making any mistakes - dont want 
//you were given priveledges and didnt use them well thousands 

//just make 1 shader without functions
//then make a shader with functions and do it right and try to end it which means no experimentation and iteration- none
//return vec3<f32>(pos.x - pos.y - pos.z, 0,0);


//return vec3<f32>((pos.x - pos.y * pos.y) / pos.z,0,0);




// return vec3<f32>(
//     pos.y / pos.z, -pos.x, 0
// )  ; 


//return vec3<f32>(1, 2, pos.z * pos.y);


//left corner  = -2
//right corner = 0
// return vec3<f32>(
//     pos.x - pos.y, 0, 0
// );
//divergence






//yes geometric
//fire, - simulate plasma differential equation 
//magnets ?? maybe 
//please finish this today
//we want this done today
//do it right 
//plan it out in head and comments
//xyz
//invent something out of nothing 
//rotation
//triplet - each particle looks up the position of 3 linked particles  -- original but not cool
//cross, dot
//inverse sqrt 
//sin, cos, tan
//index?
//sdf
//-distance6



//



//produce enough original stuff by monday - wizards are satisifed that data cube level algorithim was created from nothing 
//then add in like 20 other algorithms from looking stuff up 

//binary stars like stellar bodies 
//binary stars - orbiting around them

//ternary star systems 


//accretion disks like satturn


//sphere - orbit along multiple angles - imaginary sphere - decompose sphere in 9, 16 , 25, 100 spheres and change oribts 
//orbits can be in 6 dimensions and jump from one orbit to another 

//make a buffer that links each point with 3 others - triad graph linkage - invention
//these 3-4 dots orbit around each other like a quaternary or trinary star system
//two binary star tuples 
//we dont like this idea 




//take distance to 4 corners or 8 corners of entire space 
//turn that distance into a path that the point travels along to reach each one, sorted by least 
//cancel 


//no
//take dot product to point from center of camera 
//ricochet light from opposite edge to create velocity - heat of light - light leaves heat signature on light bulb 
var x = pos.x;
var y = pos.y;
var z = pos.z;
//
//
//
let r = reset[index];


//pivot between a  = y,-x, b = z,y,x, c = x,z,y
var v1 = 2. * sin(uniforms.time * .001);
var v2 = -2 * cos(uniforms.time * .001);

//so good the aliens did it - 8 pyramid blocks 

//return vec3<f32>(x * y,0,0);
//return v1 * vec3<f32w>(y,-x,0) + 
//v2 * vec3<f32>(0,z,-y);
//rotate 90degrees
//reseting the location is good when it goes past the boundaries
//this looks more cool when it goes past the boundary, so resetting it at different rates is what makes it look cool
//so the vector field will look most cool when you vary the rebirth location
// attenuation rate in w slot which is usually for camera transforms 
//use the previous state of the vector in the vector field to adjust the next iteration somehow 
// return cross(vec3<f32>(
//      x, 
//     y,
//      z
// ),  vec3<f32>(sin(uniforms.time * .001),cos(uniforms.time * .001),cos(uniforms.time * .01))
//  );
//16 cool vector fields - acting on 8 regions - or 8 time slices 
//reflections + post processing = done by monday deterministic - fun - cool- differential equations for fire and rainbow fire and smoke and 
  //return vectorFieldCreator(index);

  var theta = atan2(y,x);
  theta += 1.5;
//   return .1 * vec3<f32>(
//  pow(y, .5) + y ,
//  -pow(x, .5) + x,
//     0, 
//   );

// var x1 = cos(groupIndex);
// var y1 = sin(groupIndex);

//var y = pos.y;


var magnets = array<vec3<f32>,3>();
//return other.xyz;

var g = groupIndex / 1e5;
//g = 1;

// return vec3<f32>(
//   sin(g), cos(g), tan(g)
// );



var pick = uniforms.time % 10;
var otherPick = groupIndex % 10;

//know  that it looks cool

// return groupIndex * vec3<f32>(
//     x,y,z
// );

// return vec3<f32>(
//     pos.x, pos.y, pos.z
// );
var i = f32(index);
// return vec3<f32>(
//   z , 0, x
// );
var coef = 4.;// + sin(uniforms.time * .001);


//coef = otherPick;
//distance to corner +


var x3 = x / y;
var y3 = x / y;
var z3 = x / x;

//return vec3<f32>(x3, y3, z3 );


// if (otherPick < 5){
//     return vec3<f32>(y, -x, 0);

// } else {
//     return vec3<f32>(cos(theta * coef), sin(theta * coef), 0);
// }



// return vec3<f32>(y, -x, 0) +
// vec3<f32>(cos(theta * coef), sin(theta * coef), 0)
// + .01 * vec3<f32>(.5  *abs(pos.x)-pos.y * tan(g),
// pos.y, sin(pos.z * abs(pos.x))
// );



var noise = 1. + sin(uniforms.time  * .0001);

var x1 = noise * (cos(theta * coef));
var y1 = noise * (sin(theta * coef));
var z1 = sin(pos.z * abs(pos.x)) + uniforms.time * (groupIndex / 1e8);


//return vec3<f32>(pos.x - pos.z);


// if (distance(pos.xyz, vec3<f32>(0.)) < .1) { return vec3<f32>(x * x, y * y, z * z);} 
// return noise * 10. * vec3<f32>(x1, y1, .0001 * z1); 

//  vec3<f32>(
//     10. * y,  10. * -x, sin(z) * 10
// );  
//no experimentation


let idx = f32(index);
let rad = radians(idx );
let j = 20. * cos(uniforms.time * .001)  * sin(rad);
let k = 10. *cos(rad) ;
let m = groupIndex / 1e6 ;
//* distance(vec3<f32>(0.), pos);
return vec3<f32>(j, k, m);

 if (otherPick < 3) {
    return 1 * vec3<f32>(.5  *abs(pos.x)-pos.y * tan(g),
    pos.y, sin(pos.z * abs(pos.x))
   );
} else {
    var coolDist = distance(vec3<f32>(0,0,0), pos.xyz) * vec3<f32>(x,y,z);

    g /= 10.;
    var coolShards = vec3<f32>(pos.z * pos.x * pos.y ,
      //length(dir) * 
      pos.z * -pos.x,
       1 / length(pos.xy));
    
       return coolShards;
}






// return 2 * vec3<f32>(pos.y+ sin(uniforms.time) ,
//   -pos.x + sin(uniforms.time),
//    1 / length(pos.xy));


// return vec3<f32>(pos.x, pos.y, abs(pos.z) * 2);

// return  vec3<f32>(
//   pos.x / pos.y, pos.y / pos.z, pos.z / pos.x
//  );

// return  vec3<f32>(
//   pos.x * pos.y, pos.y * pos.z, pos.z  * pos.x
//  ); cool

// return  .1 * vec3<f32>(
//    pos.x - pos.y, pos.y - pos.z, pos.z  - pos.x
//   );


// return  vec3<f32>(
//  sqrt(pos.x), pos.y, pos.z 
// );



// return  vec3<f32>(
//   2 * pos.y,  pos.z, sqrt(pos.x)
// );

// return vec3<f32>(
//   pos.y * pos.y, -5 * pos.x, sin(1. / pos.z)
// );

// return vec3<f32>(
//   5 * pos.y, -5 * pos.x, sin(1. / pos.z)
// );

// return vec3<f32>(
//   5 * pos.y, -5 * pos.x, (1. / pos.z)
// );

//make a spiral by taking the spiral from earlier and make differeentiation

// return vec3<f32>(
//   5 * pos.y, -5 * pos.x,(1. - pos.z)
// );



// return vec3<f32>(
//   5 * pos.y * sin(pos.z * .5), -5 * pos.x * sin(pos.z * .5), pos.z - pos.x
// );

// return vec3<f32>(
//   1,pos.x - pos.z, pos.y - pos.z
// );

//distance
// return vec3<f32>(
//   1,pos.x - pos.z, reflect(pos, vec4<f32>(0,0,0, 0)).x
// );

return vec3<f32>(
  10 * sin(uniforms.time * .001), 0., 0.
);

//return   vec3<f32>(cos(groupIndex / 1e6), sin(groupIndex / 1e6), sin(groupIndex / 1e6));
}


fn applyVF(pos: vec3<f32>, index:u32) -> f32 {

  let idx = hashPosition(pos);
  var theta = 1. * atan2(pos.y, pos.x);
  var radius = distance(pos, vec3<f32>(0));

  //theta *= 4. * (sin(uniforms.time * .001));
  //if (groupBuffer[index] > uniforms.time) {
    //vectorFieldBuffer[index] +=  vec4<f32>(cos(theta) , sin(theta) , 0, 1); 
    //vectorFieldBuffer[idx] = vec4<f32>(pos.xyz, 1);
  //}
 
 var vf = hash(pos.xyz);
 direction[index] *= .1; 

  direction[index] = direction[index] + .05 * vf;

  posBuffer[index] = posBuffer[index] + vec4<f32>(direction[index], 1.);

  if (hasCollided(pos.xyz)) {
    posBuffer[index] = reset[index];
    //+ (vec4<f32>(10.) - posBuffer[index]);
    
    
    ;//subtract the difference from the component that has gone over
    direction[index] = vec3<f32>(0.);
  }


  return -1;
}


fn applyVF9(pos: vec3<f32>, index:u32) -> f32 {
  let idx = hashPosition(pos);
  var theta = 1. * atan2(pos.y, pos.x);
  var radius = distance(pos, vec3<f32>(0));

  //theta *= 4. * (sin(uniforms.time * .001));
  //if (groupBuffer[index] > uniforms.time) {
    // vectorFieldBuffer[idx] =  vec4<f32>(cos(theta) , sin(theta) , 0, 1); 
    vectorFieldBuffer[idx] = vec4<f32>(sin(f32(index) / 1e6), 0, 0, 1);
  //}

    var vf = hash(pos.xyz);


    vectorFieldBuffer[idx] = vectorFieldBuffer[idx].yxzw;

  direction[index] = direction[index] + .01 * vf;

  posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;

  direction[index] *= .1;


  if (hasCollided(pos.xyz)) {
    posBuffer[index] = reset[index];
    direction[index] = vec3<f32>(0.);
  }


  return -1;
}


  fn applyVF6(pos: vec3<f32>, index:u32) -> f32 {
    let idx = hashPosition(pos);
    var theta = 1. * atan2(pos.y, pos.x);
    var radius = distance(pos, vec3<f32>(0));

    theta *= 4. * (sin(uniforms.time * .001));
    vectorFieldBuffer[idx] =  vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);   
      var vf = hash(pos.xyz);


      vectorFieldBuffer[idx] = vectorFieldBuffer[idx].yxzw;

    direction[index] = direction[index] + .01 * vf;

    posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
 
    direction[index] *= .9;


    if (hasCollided(pos.xyz)) {
      posBuffer[index] = reset[index];
      direction[index] = vec3<f32>(0.);
    }


    return -1;
  }
  fn applyVF5(pos: vec3<f32>, index:u32) -> f32 {
    let idx = hashPosition(pos);
    var theta = 1. * atan2(pos.y, pos.x);
    var radius = distance(pos, vec3<f32>(0));

    theta *= (sin(uniforms.time * .001));
    vectorFieldBuffer[idx] = 10. * vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);   
      var vf = hash(pos.xyz);


      vectorFieldBuffer[idx] = vectorFieldBuffer[idx].yxzw;

    direction[index] = direction[index] + .01 * vf;

    posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
 
    direction[index] *= .9;


    if (hasCollided(pos.xyz)) {
      posBuffer[index] = reset[index];
      direction[index] = vec3<f32>(0.);
    }


    return -1;
  }


  fn applyVF2(pos: vec3<f32>, index:u32) -> f32 {
    let idx = hashPosition(pos);
    var theta = 1. * atan2(pos.y, pos.x);

    vectorFieldBuffer[idx] = 10 * vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);   
      var vf = hash(pos.xyz);

    direction[index] = direction[index] + .01 * vf;
    posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
    // posBuffer[index] = vec4<f32>(pos.xyz + .01 * direction[index].xyz,  1);
    direction[index] *= .9;

    return -1;
  }

fn applyVF0(pos: vec3<f32>, index:u32) -> vec3<f32> {
  //ribbon(index);
  var theta = 1. * atan2(pos.y, pos.x);
  var theta2 = atan2(pos.x, pos.z);
  let idx = hashPosition(pos);
  vectorFieldBuffer[idx] += 10 * vec4<f32>(cos(theta) , sin(theta) ,  sin(theta), 1);

  var vf = vectorFieldBuffer[idx];
  direction[index] = vec3<f32>(0.);

  direction[index] = direction[index] + .001 * vf.xyz;
  //ribbon(index);
  posBuffer[index]= posBuffer[index] + vec4<f32>(direction[index], 1.) * .1;
var bounds = 10.;

var z = vectorFieldBuffer[index];
var z1 = posBuffer[index];
var z2 = direction[index];

var z3 = distancetraveled[index];
var z4 = reset[index];
var z5 = vectorFieldBuffer2[index];
var z6 = groupBuffer[index];


// if hasCollided(pos) {
//     posBuffer[index] = vec4<f32>(0.);
// }

//    if pos.x > bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

//    if pos.y > bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

//    if pos.z < -bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

//    if pos.x < -bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

//    if pos.y < -bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

//    if pos.z > bounds {
//     posBuffer[index] = vec4<f32>(0.);
//    }

  return vec3<f32>(1.);
}

fn dragon (index: u32) -> f32 {

  var pos = posBuffer[index];
  var vel = direction[index];
  //applyVF(pos.xyz, index);
  //use distanceTraveled to change group, direction
  //distanceTraveled += length(direction)
  //var lifetime = distanceTraveled[index];
  
  // if (length(direction[index]) == 0.) {
  //   direction[index] = vec3<f32>(0, 0, -1);
  // }

  //   var theta = atan2(direction[index].z, direction[index].x);
  //   direction[index] = vec3<f32>(cos(theta * f32(index) /256), 0., sin(theta * f32(index) /256 ));

  //   //1 rotation in 6 dimensions in order 
  //   var theta = atan2(direction[index].y, direction[index].x);
  //   direction[index] = vec3<f32>(cos(theta), sin(theta ), 0);

  // //change velocity every few frames 
  // posBuffer[index] =  posBuffer[index]  + .1 * vec4<f32>(direction[index], 0.);

  // if (pos.x < 0 ||
  //   pos.x > 0 ||
  //   pos.z > 0 ||
  //   pos.z < 0 ) {
  //   var swap = direction[index].z;
  //   direction[index].z = direction[index].x;
  //   direction[index].x = swap;
  //   direction[index] = vec3<f32>(0.);
  // }

  return -1;
}

fn trySpiral(idx:u32) -> f32{
    var index = idx;
    var z = vectorFieldBuffer[index];
var z1 = posBuffer[index];
var z2 = direction[index];

var z3 = distancetraveled[index];
var z4 = reset[index];
var z5 = vectorFieldBuffer2[index];
var z6 = groupBuffer[index];

    var dt = distancetraveled[idx];
    var pos = posBuffer[idx];
    var theta = atan2(pos.y, pos.x);
    distancetraveled[idx] += 1.;
    //uniforms.time / 3000000
    //.001 * 
    
    // if (idx > 256 ){
    //       direction[idx] = -.001 * f32(idx) * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    // } else {
    //   let radius = distance(vec2<f32>(0,0), pos.xy);
    // direction[idx] =  1/ radius * vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    // }


//rotate x, y , z  then -s -y - z

    if dt > 10 {
        direction[idx] = vec3<f32>(0, 1, 0);
    }

    // if dt > 10 {
    //     direction[idx] = vec3<f32>(0, 1, 0);
    //     direction[idx] = vec3<f32>(cos(theta * 1.1), sin(theta * 1.1), 0.);
    // }

    if dt > 20 {
        direction[idx] = vec3<f32>(direction[idx].y, -direction[idx].x, 0.);
        distancetraveled[idx] = 1.;
    }


    posBuffer[idx] += .1 * vec4<f32>(direction[idx], 1.);

    return -1;
}


fn drawLines(index: u32) {
    var p = posBuffer[index];
    var x = p.x;
    var y = p.y;
    var z = p.z;
    var w =1.;
    var z6 = groupBuffer[index];


    //no state variables
    //no trig functions
    //y slopes at increasing rate 
    //y = mx + b
    //m has to be power, sqrt, 
    //x = 0, 1,2, 3
    //y = infiniity, 1, 1/2, 1/3
    //z = pos.x / pos.y
    // 0 / infinity, 1 / 1, 2 / 1 / 2
    //x/x
    for (var i = 0; i < 1000; i++){
        var yy = f32(i) / 1000.;
        posBuffer[index + u32(i)] = vec4<f32>(
            f32(i) / 1000.,  x + y,  .0, 0.
         );
        }


    var z0 = vectorFieldBuffer[index];
    var z1 = posBuffer[index];
    var z2 = direction[index];
    var z3 = distancetraveled[index];
    var z4 = reset[index];
    var z5 = vectorFieldBuffer2[index];
   
}

fn solveDifficultProblem (index: u32) {
  


    var z0 = vectorFieldBuffer[index];
    var z1 = posBuffer[index];
    var z2 = direction[index];
    var z3 = distancetraveled[index];
    var z4 = reset[index];
    var z5 = vectorFieldBuffer2[index];
    //sphereEvaporate(z1, index);



    // posBuffer[index] -= vec4<f32>(
    //     .1 * cos(uniforms.time * .001), .1 * sin(uniforms.time * .001), .1 * sin(uniforms.time * .001), 0
    //  );





    //make points fly around box 
    //make points swap positions with other point in box infinitely 
    //make points go toward outside of box and run along the edge
    //make points fly in a halo or mandala around box 
    //make points 
}

fn sphereEvaporate2(pos: vec4<f32>, index: u32) -> bool {
  
    var idx = f32(index);
    var radius = idx / 256;
     //4 / 3 * pow(idx / 256, 3);
    //circle 
    posBuffer[index] = vec4<f32>(
      
      cos(idx) , idx /2000., 
      
      sin(idx), 1.);
  
      posBuffer[index].x *= pow(cos(posBuffer[index].y), .5);
      posBuffer[index].z *= pow(cos(posBuffer[index].y), .5);
  
    posBuffer[index].y *= .6;
  
    return false;
  }


  fn docoolstuff (index:u32) {
//    posBuffer[index]
  }

    @compute @workgroup_size(256)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
        let index: u32 = GlobalInvocationID.x;

      //docoolstuff(index);

      //solveDifficultProblem(index);
      var pos = posBuffer[index];
      //applyMagnets(pos.xyz);
      var r = reset[index];
      //runAlongRoute(pos.xyz, f32(index));
      applyVF(pos.xyz, index);
      
      //trySpiral(index);

      //drawLines(index);
      let t = uniforms.time;
      var g = groupBuffer[index];
  
     distancetraveled[index] += 1.;
      var n = groupBuffer[index];
      var mouse = (uniforms.mouse - .5) * vec2<f32>(2,-2);
      if (distance(posBuffer[index].xy, mouse) < .1) {
        // direction[index].x = direction[index].y;
        // direction[index].y = -direction[index].x;
        //posBuffer[index]= vec4<f32>(posBuffer[index].xy - vec2<f32>(distance(posbuffer[index].xy, mouse)), 0., 1.);
        //posBuffer[index] = posBuffer[index] - vec4<f32>(mouse, 0,0);
        //direction[index]*= .001;
      }
      //helix(index);
       //direction[index] *= .0;
      //vector field toward camera with shapes superIMposed
      //if (groupBuffer[index] == 8) {  lastMonth(pos.xyz, index); }
      //draw cool shapes and then dont deform them in the vector field until some time 
      //var group = groupBuffer[index];
      //runAlongRoute(pos.xyz, f32(index));
    }
    
    
    
    
    fn hexagon (p: vec3<f32>, time: f32) -> vec3<f32> {
      var shit = array<vec3<f32>,3 >();
      shit[0] = vec3<f32>(.1, 0., 0.);
      return p + shit[0] - p;
      return p;
    }
    
    


    fn makeBobTheBuilderTheOnlyThing() -> f32 {





        return -1;
    }
    `;


    //this isnt the ending we wanted
//you can earn your functions, data and demo back
//you can lose them too
//you cant give up, you must perservere
//you must get everything right on the first time without drawing 
//cant look anything up
//i deserve this because i failed the water simulation, was negative, irresponsible and rude to people who were trying really hard to help me
//i can get her back - looks unlikely
//23 days left 

//we share consciousness every second of the day, dont waste anyones time ever 
//i deserve this cause i wasted peoples time by caring about anything other than helping them
//i helped myself instead of helping others

///no consolation prize - pass / fail - pass bar is higher than you know
//needs 1million views at least in like 3 months or 3 weeks 
//i really need you to figure out how to do this on command
//they cant give up on me, cause last time i gave up, and i cant give up either

//in one year, i'll earn my functions back and freedom to draw and use all the data
//in 23 days, 

//you have no idea this story could have been    vectorFieldBuffer[idx] = vec4<f32>(cross(pos.xyz, pos.zyx), 1);
