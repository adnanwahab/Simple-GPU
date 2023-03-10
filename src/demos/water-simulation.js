import mouseChange from 'mouse-change'
import mouseWheel from 'mouse-wheel'
// import identity from 'gl-mat4/identity'
// import perspective from 'gl-mat4/perspective'
// import lookAt from 'gl-mat4/lookAt'
  //when particles move -> record ID location in bucket neighborhood in 
  //loop through IDs in neighborhood
  //look up velocity[id] and integrate them across neighbors
  //figure out particle IDs
import { WebGPUScan } from './scan'

const stuff = 10

const NUM_PARTICLES = 256 * 4 * stuff
const particlesCount = NUM_PARTICLES
const SCAN_THREADS = 256
const PARTICLE_WORKGROUP_SIZE = SCAN_THREADS
const NGROUPS = NUM_PARTICLES / 256 
console.log(NGROUPS)
var isBrowser = typeof window !== 'undefined'

const COLLISION_TABLE_SIZE = particlesCount / stuff


const HASH_VEC = [
  1,
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 1 / 3)),
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 2 / 3))
] 
//const PARTICLE_RADIUS = 1.18

const PARTICLE_RADIUS = 1.18
const GRID_SPACING = 2 * PARTICLE_RADIUS


function createCamera (props_) {
  var props = props_ || {}

  // Preserve backward-compatibilty while renaming preventDefault -> noScroll
  if (typeof props.noScroll === 'undefined') {
    props.noScroll = props.preventDefault;
  }

  var cameraState = {
    view: mat4.identity(new Float32Array(16)),
    projection: mat4.identity(new Float32Array(16)),
    center: new Float32Array(props.center || 3),
    theta: props.theta || 0,
    phi: props.phi || 0,
    distance: Math.log(props.distance || 10.0),
    eye: new Float32Array(3),
    up: new Float32Array(props.up || [0, 1, 0]),
    fovy: props.fovy || Math.PI / 4.0,
    near: typeof props.near !== 'undefined' ? props.near : 0.01,
    far: typeof props.far !== 'undefined' ? props.far : 1000.0,
    noScroll: typeof props.noScroll !== 'undefined' ? props.noScroll : false,
    flipY: !!props.flipY,
    dtheta: 0,
    dphi: 0,
    rotationSpeed: typeof props.rotationSpeed !== 'undefined' ? props.rotationSpeed : 1,
    zoomSpeed: typeof props.zoomSpeed !== 'undefined' ? props.zoomSpeed : 1,
    renderOnDirty: typeof props.renderOnDirty !== undefined ? !!props.renderOnDirty : false
  }

  var element = props.element
  var damping = typeof props.damping !== 'undefined' ? props.damping : 0.9

  var right = new Float32Array([1, 0, 0])
  var front = new Float32Array([0, 0, 1])

  var minDistance = Math.log('minDistance' in props ? props.minDistance : 0.1)
  var maxDistance = Math.log('maxDistance' in props ? props.maxDistance : 1000)

  var ddistance = 0

  var prevX = 0
  var prevY = 0

  if (isBrowser && props.mouse !== false) {
    var source = element

    function getWidth () {
      return element ? element.offsetWidth : window.innerWidth
    }

    function getHeight () {
      return element ? element.offsetHeight : window.innerHeight
    }

    mouseChange(source, function (buttons, x, y) {
      if (buttons & 1) {
        var dx = (x - prevX) / getWidth()
        var dy = (y - prevY) / getHeight()

        cameraState.dtheta += cameraState.rotationSpeed * 4.0 * dx
        cameraState.dphi += cameraState.rotationSpeed * 4.0 * dy
        cameraState.dirty = true;
      }
      prevX = x
      prevY = y
 
    })

    //scan to figure out relative offset for each position
    //underlying idea 
    //sparse array and compacting it  into a single contiguous flat array 
    //accumulator s
    //read element out of s 
    //integral from 0 to i
    //prefix sum = how many particles are in that bucket
    //from bucket[i] - list of particle IDs inside there
    //n particles = id 
    //array of pointers - grid cell = start of array in that bucket
    //7-15
    //take the particle and put it in the right spot

    //query = list of all particles 
    //hashCounts store start of bucket

    //cant know location of particleID - bucket 2 until all have been counted

    //numerical instability


    //resolved intersections
    //tag each particle with chemical species 
    //these particles are all - hydrogen+oxygen = burn - different rules for combine
    //reaction diffusion equation - rate and tag them - underlying particle model for advenction fluid

    //neural graphics - webGPU - nerf studio



    //separate pass to generate all pairs of particles that are colliding 

    //count number of collisions with lower number of particles in that grid or neighboring

    // mouseWheel(source, function (dx, dy) {
    //   ddistance += dy / getHeight() * cameraState.zoomSpeed
    //   cameraState.dirty = true;
    // }, props.noScroll)
  }

  function damp (x) {
    var xd = x * damping
    if (Math.abs(xd) < 0.1) {
      return 0
    }
    cameraState.dirty = true;
    return xd
  }

  function clamp (x, lo, hi) {
    return Math.min(Math.max(x, lo), hi)
  }

  function updateCamera (props) {
    Object.keys(props).forEach(function (prop) {
      cameraState[prop] = props[prop]
    })

    var center = cameraState.center
    var eye = cameraState.eye
    var up = cameraState.up
    var dtheta = cameraState.dtheta
    var dphi = cameraState.dphi

    cameraState.theta += dtheta
    cameraState.phi = clamp(
      cameraState.phi + dphi,
      -Math.PI / 2.0,
      Math.PI / 2.0)
    cameraState.distance = clamp(
      cameraState.distance + ddistance,
      minDistance,
      maxDistance)

    cameraState.dtheta = damp(dtheta)
    cameraState.dphi = damp(dphi)
    ddistance = damp(ddistance)

    var theta = cameraState.theta
    var phi = cameraState.phi
    var r = Math.exp(cameraState.distance)

    var vf = r * Math.sin(theta) * Math.cos(phi)
    var vr = r * Math.cos(theta) * Math.cos(phi)
    var vu = r * Math.sin(phi)

    for (var i = 0; i < 3; ++i) {
      eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i]
    }

    mat4.lookAt(cameraState.view, eye, center, up)
  }

  cameraState.dirty = true

  function setupCamera () {

      updateCamera(props)
      cameraState.perspective = mat4.perspective(cameraState.projection,
        cameraState.fovy,
        1,
        cameraState.near,
        cameraState.far)

    return {
      projection: cameraState.projection,
      view: cameraState.view
    }
  }
  return setupCamera
}


import simpleWebgpuInit from '../../lib/main';
import utils from '../../lib/utils';

import { mat4, vec3 } from 'gl-matrix'

const bucketHash = `fn bucketHash (p:vec3<i32>) -> u32 {
  return u32((p.x * 73856093) ^ (p.y * 19349663) ^ (p.z * 83492791)) % ${COLLISION_TABLE_SIZE};

  // var h = (p.x * ${HASH_VEC[0]}) + (p.y * ${HASH_VEC[1]}) + (p.z * ${HASH_VEC[2]});
  // if h < 0 {
  //   return ${COLLISION_TABLE_SIZE}u - (u32(-h) % ${COLLISION_TABLE_SIZE}u);
  // } else {
  //   return u32(h) % ${COLLISION_TABLE_SIZE}u;
  // }
}`

const predefines = `struct Uniforms {                                  
  force: vec2<f32>,                              
  dt: f32,                                       
  bounce: u32,                                   
  friction: f32,                                 
  aspectRatio: f32,                              
  w: f32,
  h: f32,
};

struct BucketContents {
  indices : array<i32, 200>,
  count : u32,
}

${bucketHash}

fn particleBucket (p:vec3<f32>) -> vec3<i32> {
  return vec3<i32>(floor(p * ${(1 / GRID_SPACING).toFixed(3)}));
}
fn particleHash (p:vec3<f32>) -> u32 {
  return bucketHash(particleBucket(p));
} 

//getNeighbors only works for first particle
//particle0 returns all neighbors and then pushes them apart 


fn getNeighbors (centerId: u32) -> BucketContents {
  var result : BucketContents;

  //var stuff: array<i32, 100>;
  if (centerId == 2u) {
    // for (var i = 0; i < 100; i = i + 1) {
    //   result.indices[i] = i;
    // }
    return result;
  }
  //if (centerId < 1000u) { return result;}
  //for 27 neighboring bucketHashes, append particleId onto list 
  var p = particlesStorage[centerId].xyz;
  var pos = bucketHash(vec3(i32(p.x), i32(p.y), i32(p.z)));
    for (var i = -1; i < 2; i = i + 1) {
        for (var j = -1; j < 2; j = j + 1) {
          for (var k = -1; k < 2; k = k + 1) {
            var bucketId = (pos + bucketHash(vec3<i32>(i, j, k))) % ${COLLISION_TABLE_SIZE}u;
            var bucketStart = hashCounts[bucketId];
            var bucketEnd = ${NUM_PARTICLES}u;
            if bucketId < ${COLLISION_TABLE_SIZE - 1} {
              bucketEnd = hashCounts[bucketId + 1];
            }
            for (var n = 0u; n < 20; n = n + 1u) {
              var p = bucketStart + n;
              if p >= bucketEnd {
                break;
              } else {
                var m = particleIds[p];
                result.indices[n+ result.count] = i32(m);
                result.count += 1u;
              }
            }
           }
        }
      }
      return result;
    }

//particle Ids keeps getting bigger 


const ABS_WALL_POS = vec3<f32>(.7,.7,.7);

const effectRadius = 0.3f;
const restDensity = 4f;
const relaxCFM = 400.0f;
const isArtPressureEnabled = 1;
const artPressureRadius = 0.006f;

const artPressureCoeff = .0001f;
const artPressureExp = 40;
const isVorticityConfEnabled = 1;
const vorticityConfCoeff = 0.0004f;
const xsphViscosityCoeff = 0.0001f;
const PI = 3.14156932;
const timeStep = 0.0000000000010f;

const POLY6_COEFF = 315. / (64. * PI * pow(effectRadius, 9));
const SPIKY_COEFF = 15 / PI * pow(effectRadius, 6);
const FLOAT_EPS = 0.00000001;

 fn poly6( vec:vec4<f32>, effectRadius: f32) -> f32 {
  var vecLength = length(vec);
  return (1.0f - step(effectRadius, vecLength)) * POLY6_COEFF * pow((effectRadius * effectRadius - vecLength * vecLength), 3);
}

fn poly6L(vecLength:f32, effectRadius:f32) -> f32 {
  return (1.0f - step(effectRadius, vecLength)) * POLY6_COEFF * pow((effectRadius * effectRadius - vecLength * vecLength), 3);
}

fn gradSpiky(vec:vec4<f32>,  effectRadius:f32) -> vec4<f32> {
  var vecLength = length(vec);

  if(vecLength <= FLOAT_EPS) {
    return vec4<f32>(0.0f);
}

  return vec * (1.0f - step(effectRadius, vecLength)) * SPIKY_COEFF * -3 * pow((effectRadius - vecLength), 2) / vecLength;
}

fn artPressure( vec:vec4<f32>) -> f32 {
  if(isArtPressureEnabled == 0) {
    return 0.0f;
  }
  return - artPressureCoeff * pow((poly6(vec, effectRadius) / poly6L(artPressureRadius * effectRadius, effectRadius)), artPressureExp);
}
`
async function basic () {
let webgpu = await simpleWebgpuInit()
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 3 * 4 * 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const particleSize = 16

const computeUniformsBuffer = webgpu.device.createBuffer({
  size: 96,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});

function makeBuffer (size=particlesCount, flag, log) {
  const gpuBufferSize = particlesCount * particleSize
  //const gpuBufferSize = particlesCount * (flag ? particleSize :1)

  const gpuBuffer = webgpu.device.createBuffer({
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
  for (let iParticle = 0; iParticle < particlesCount; iParticle++) {
      particlesBuffer[4 * iParticle + 0] = flag && (Math.random());
      particlesBuffer[4 * iParticle + 1] = flag &&(Math.random() );
      particlesBuffer[4 * iParticle + 2] = flag &&(Math.random() );
      particlesBuffer[4 * iParticle + 3] = 0
  }


  particlesBuffer[0] = .2
  particlesBuffer[1] = -1
  particlesBuffer[2] = 1

  gpuBuffer.unmap();
  return gpuBuffer
} 

const posBuffer = makeBuffer(particlesCount, 1)
const velocityBuffer = makeBuffer(particlesCount, 0)
const vorticityBuffer = makeBuffer(particlesCount, 0)
const predictionBuffer = makeBuffer(particlesCount, 0)
const densityBuffer = makeBuffer(particlesCount / 4, 0)
const constBuffer = makeBuffer(particlesCount, 0)
const correctParticle = makeBuffer(particlesCount, 0)
const hashCounts = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)
const particleIds = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)
const debugGetNeighbors = makeBuffer(COLLISION_TABLE_SIZE * 4, 0, false)


const resetPass = webgpu.initComputeCall({
  label: `resetPass`,
  code:`  
  @binding(0) @group(0) var<storage, read_write> hashCounts : array<u32>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    hashCounts[index] = 0;
  }`,

  exec: function (state){
    const device = state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(NGROUPS);
    computePass.end();
  },
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [
        hashCounts
      ])
    return [computeBindGroup]
  }
})

const COMMON_SHADER_FUNCS = `
${bucketHash}

fn particleBucket (p:vec3<f32>) -> vec3<i32> {
  return vec3<i32>(floor(p * ${(1 / GRID_SPACING).toFixed(3)}));
}

fn particleHash (p:vec3<f32>) -> u32 {
  return bucketHash(particleBucket(p));
}
`

const predictedPosition = webgpu.initComputeCall({
  label: `predictedPosition`,
  code:`
  @group(0) @binding(0) var<storage,read_write> velocityStorage: array<vec4<f32>>;
   @group(0) @binding(1) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    var velocity = velocityStorage[index];
  
    var GRAVITY_ACC = vec4<f32>(0, -1., 0, 0);
    velocityStorage[index] = velocity;

    //1. predicted Position
    const timeStep = 0.10f;
    var newVel = velocityStorage[index] + GRAVITY_ACC * timeStep;

    predPos[index] = particlesStorage[index] + newVel * .01;
  }`,

  exec: function (state){
    const device = state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass();
    state.computePass.computePass = computePass;

    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(NGROUPS);
    computePass.end();
  },
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [
        velocityBuffer,
        predictionBuffer,
        posBuffer,
        //correctParticle
      ])
    return [computeBindGroup]
  }
})

const computeDensity = webgpu.initComputeCall({
  label: `computeDensity`,
  code:`
  ${predefines}
   @group(0) @binding(0) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(1) var<storage,read_write> density: array<f32>;

  @group(0) @binding(2) var<storage,read_write> hashCounts: array<u32>;
  @group(0) @binding(3) var<storage,read_write> particleIds: array<u32>;

  @group(0) @binding(4) var<storage,read_write> particlesStorage: array<vec4<f32>>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;  

    let pos = predPos[index];
    var fluidDensity = 0.;


    var startEnd = getNeighbors(index);

      
    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      fluidDensity += poly6(pos - predPos[e], effectRadius);
    }

    density[index] = fluidDensity;
  }`,

  exec: function (state){
    const device = state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass();
    state.computePass.computePass = computePass;

    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(NGROUPS);
    computePass.end();
  },
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [
        predictionBuffer,
        densityBuffer,
        hashCounts,
        particleIds,
        posBuffer
        
      ])
    return [computeBindGroup]
  }
})



const gridCountPipeline = webgpu.initComputeCall({
  label: `gridCountPipeline`,
  code:`
  ${COMMON_SHADER_FUNCS}
  @binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
  @binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;
  
  @compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn main (@builtin(global_invocation_id) globalVec : vec3<u32>) {
    var id = globalVec.x;
    var bucket = particleHash(positions[id].xyz);
    atomicAdd(&hashCounts[bucket], 1u);
  }`,
exec: function (state){
  const device = state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(NGROUPS);
  computePass.end();
} ,
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
    utils.makeBindGroup(state.device,
      computePipeline.getBindGroupLayout(0),
    [posBuffer, hashCounts
    ])
  return [computeBindGroup]
  }
})


const gridCopyParticlePipeline = webgpu.initComputeCall({
  label: `gridCopyParticlePipeline`,
  code:`
  ${COMMON_SHADER_FUNCS}
  @binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
  @binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;
  @binding(2) @group(0) var<storage, read_write> particleIds : array<u32>;

  @compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn main (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var bucket = particleHash(positions[id].xyz);
  var offset = atomicSub(&hashCounts[bucket], 1u) - 1u;
  particleIds[offset] = id;
}`,
exec: function (state) {
  const device = state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(NGROUPS);
  computePass.end();
} ,
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
    utils.makeBindGroup(state.device,
      computePipeline.getBindGroupLayout(0),
    [posBuffer, hashCounts, particleIds,

    ])
  return [computeBindGroup]
  }
})


const applyVorticityCompute = webgpu.initComputeCall({
  label: `applyVorticityCompute`,
  code: `
  ${predefines}
  
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> vorticity: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(4) var<storage,read_write> constFactor: array<f32>;
  @group(0) @binding(5) var<storage,read_write> correctParticle: array<vec4<f32>>;

  @binding(6) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(7) @group(0) var<storage, read_write> hashCounts : array<u32>;
  @binding(8) @group(0) var<storage, read_write> particlesStorage : array<vec4<f32>>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    var f = uniforms.friction;
    let index: u32 = GlobalInvocationID.x;
    var velocity = velocityStorage[index];
    var vort = vorticity[index];
    var correctPar = correctParticle[index];
  
    {
      var pos = predPos[index];    
      var n = vec4<f32>(0);

      var vort = vec4<f32>(0);
      var startEnd = getNeighbors(index);

      
      for (var i = 0u; i < startEnd.count; i++) {
        var e = startEnd.indices[i];
        vort = vec4<f32>(cross((velocityStorage[e] - velocity).xyz, gradSpiky(pos - predPos[index], effectRadius).xyz), 1.);
      }
      vorticity[index] = vort;
    }
  
    //7 vorticity confinement
    {
      let pos = particlesStorage[index];
      var n = vec4<f32>(0.0f);
      var startEnd = getNeighbors(index);

      for (var i = 0u; i < startEnd.count; i++) {
        var e = startEnd.indices[i];
        //n += 1.;//(vorticity[e]);
        //* gradSpiky(pos - predPos[e], effectRadius);
      }
      velocityStorage[index] += 
      
      vec4<f32>(vorticityConfCoeff * cross(normalize(n).xyz, vorticity[index].xyz) * .1, 0.);
    }
  
  
    //8 apply XsphViscosityCorrection
  {
    var pos = predPos[index];
    var velocity = velocityStorage[index];
    var viscosity = vec4<f32>(0.);
  
    var lambdaI = constFactor[index];

    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      viscosity += (velocityStorage[e] - velocity) * poly6(pos - predPos[e], effectRadius);
    }
    velocityStorage[index] = velocity + xsphViscosityCoeff * viscosity;
  }
  
  //9 apply Bounding Wall
  }`,

  exec: function (state){
    const device = state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(NGROUPS);
    computePass.end();
  },
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [computeUniformsBuffer,
        velocityBuffer,
        vorticityBuffer,
        predictionBuffer,
        constBuffer,
   
        correctParticle,

        hashCounts,
        particleIds,
        posBuffer
      ])
    return [computeBindGroup]
  }
})

//particle is stuck because its corrected Position is itself 

const applyConstraintCompute = webgpu.initComputeCall({
  label: `applyConstraintCompute`,
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [computeUniformsBuffer,
        velocityBuffer,
        predictionBuffer,
        densityBuffer,
        constBuffer,
        posBuffer,
        correctParticle,

        hashCounts,
        particleIds,
      ])
    return [computeBindGroup]
  },
  code:`
  ${predefines}
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> densityStorage: array<f32>;
  @group(0) @binding(4) var<storage,read_write> constFactor: array<f32>;
  @group(0) @binding(5) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  @group(0) @binding(6) var<storage,read_write> correctParticle: array<vec4<f32>>;

  @binding(7) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(8) @group(0) var<storage, read_write> hashCounts : array<u32>;


  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    var pos = particlesStorage[index];
    var velocity = velocityStorage[index];
    var correctPar = correctParticle[index];
    var aspectRatioStuff = uniforms.aspectRatio;
    var constraint = constFactor[index];
    var fluidDensity = densityStorage[index];
    //3. compute constraint factor
  {
    var vec = vec4<f32>(0);
    var grad = vec4<f32>(0);
    var sumGradCi = vec4<f32>(0);
    var sumSqGradC = 0.;
    var pos = predPos[index];
    let densityC = fluidDensity / restDensity - 1.0;
    
    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      vec = pos - predPos[e];

      grad = gradSpiky(vec, effectRadius);

      sumGradCi += grad;

      sumSqGradC += dot(grad, grad);
    }
    
    sumSqGradC += dot(sumGradCi, sumGradCi);
    sumSqGradC /= restDensity * restDensity;
  
    constFactor[index] = - densityC / (sumSqGradC + relaxCFM);
  }

  // //4. compute constraint correction
  // {
  //   var pos = particlesStorage[index];
  //   var lambdaI = constFactor[index];
  //   var corr = vec4<f32>(0.0);
  //   var vec = vec4<f32>(0.0);

  //   var startEnd = getNeighbors(index);

  //   for (var i = 0u; i < startEnd.count; i++) {
  //     var e = startEnd.indices[i];
  //     vec = pos - predPos[e];
  //     if (u32(e) == index) { 
  //       continue; 
  //     };

  //     corr += (lambdaI + constFactor[e] + artPressure(vec)) * gradSpiky(vec, effectRadius);
  //   }

  //   //particles are only getting neighbors for 1st index

  //   correctParticle[index] = corr / restDensity;

  //   predPos[index] = predPos[index] + correctParticle[index];
  
  //   //velocityStorage[index] = predPos[index] - particlesStorage[index];
  //   const MAX_VEL = vec4<f32>(30.);

  //   //velocityStorage[index] = clamp((predPos[index] - pos[index]) / (5.), -MAX_VEL, MAX_VEL);
  // }
    
  
   //particlesStorage[index] = vec4<f32>(clamp(predPos[index].xyz, -ABS_WALL_POS, ABS_WALL_POS), 1.);

  //9 apply Bounding Wall
  }`,
exec: function (state){
  const device = state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(NGROUPS);
  computePass.end();
} 
})


const applyConstraintCorrection = webgpu.initComputeCall({
  label: `applyConstraintCompute`,
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
      utils.makeBindGroup(state.device,
        computePipeline.getBindGroupLayout(0),
      [computeUniformsBuffer,
        velocityBuffer,
        predictionBuffer,
        densityBuffer,
        constBuffer,
        posBuffer,
        correctParticle,

        hashCounts,
        particleIds,
      ])
    return [computeBindGroup]
  },
  code:`
  ${predefines}
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> densityStorage: array<f32>;
  @group(0) @binding(4) var<storage,read_write> constFactor: array<f32>;
  @group(0) @binding(5) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  @group(0) @binding(6) var<storage,read_write> correctParticle: array<vec4<f32>>;

  @binding(7) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(8) @group(0) var<storage, read_write> hashCounts : array<u32>;


  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    var pos = particlesStorage[index];
    var velocity = velocityStorage[index];
    var correctPar = correctParticle[index];
    var aspectRatioStuff = uniforms.aspectRatio;
    var constraint = constFactor[index];
    var fluidDensity = densityStorage[index];
    //3. compute constraint factor
  // {
  //   var vec = vec4<f32>(0);
  //   var grad = vec4<f32>(0);
  //   var sumGradCi = vec4<f32>(0);
  //   var sumSqGradC = 0.;
  //   var pos = predPos[index];
  //   let densityC = fluidDensity / restDensity - 1.0;
    
  //   var startEnd = getNeighbors(index);

  //   for (var i = 0u; i < startEnd.count; i++) {
  //     var e = startEnd.indices[i];
  //     vec = pos - predPos[e];

  //     grad = gradSpiky(vec, effectRadius);

  //     sumGradCi += grad;

  //     sumSqGradC += dot(grad, grad);
  //   }
    
  //   sumSqGradC += dot(sumGradCi, sumGradCi);
  //   sumSqGradC /= restDensity * restDensity;
  
  //   constFactor[index] = - densityC / (sumSqGradC + relaxCFM);
  // }

  //4. compute constraint correction
  {
    var pos = particlesStorage[index];
    var lambdaI = constFactor[index];
    var corr = vec4<f32>(0.0);
    var vec = vec4<f32>(0.0);

    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      vec = pos - predPos[e];
      if (u32(e) == index) { 
        continue; 
      };

      corr += (lambdaI + constFactor[e] + artPressure(vec)) * gradSpiky(vec, effectRadius);
    }

    //particles are only getting neighbors for 1st index

    correctParticle[index] = corr / restDensity;

    predPos[index] = predPos[index] + correctParticle[index];
  
    //velocityStorage[index] = predPos[index] - particlesStorage[index];
    const MAX_VEL = vec4<f32>(30.);

    //velocityStorage[index] = clamp((predPos[index] - pos[index]) / (5.), -MAX_VEL, MAX_VEL);
  }
    
  
   //particlesStorage[index] = vec4<f32>(clamp(predPos[index].xyz, -ABS_WALL_POS, ABS_WALL_POS), 1.);

  //9 apply Bounding Wall
  }`,
exec: function (state){
  const device = state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(NGROUPS);
  computePass.end();
} 
})

const updatePositionCompute = webgpu.initComputeCall({
  label: `updatePositionCompute`,
  code:`  
${predefines}
  @group(0) @binding(0) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(1) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  @binding(2) @group(0) var<storage, read_write> debugGetNeighbors : array<f32>;

  @binding(3) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(4) @group(0) var<storage, read_write> hashCounts : array<u32>;

  
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    let predPos = predPos[index];
  
  const ABS_WALL_POS = vec3<f32>(.7,.7,.5);
 var stuff = f32(getNeighbors(index).count);

  debugGetNeighbors[index] = stuff;//f32(index);

  particlesStorage[index] = vec4<f32>(clamp(predPos.xyz, -ABS_WALL_POS, ABS_WALL_POS), 1.);
  //9 apply Bounding Wall
}`,
exec: function (state){
  const device = state.device
  const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();

  const computePass = commandEncoder.beginComputePass();
  computePass.setPipeline(state.computePass.pipeline);
  computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  computePass.dispatchWorkgroups(NGROUPS);
  //workItems = 256 
  computePass.end();
} ,
  bindGroups: function (state, computePipeline) {
    const computeBindGroup =
    utils.makeBindGroup(state.device,
      computePipeline.getBindGroupLayout(0),
    [predictionBuffer,
      posBuffer,
      debugGetNeighbors,
      hashCounts,
      particleIds,
    ])
  return [computeBindGroup]
  }
})

const attractors = []
  const attractor = {
      position: [0, 0],
      force: .1 * .1,
  };
  attractor.position[0] = 0
  attractor.position[1] = 0
  attractors.push(attractor);

function buildComputeUniforms(dt, aspectRatio, force, attractors) {
  const buffer = new ArrayBuffer(96);

  new Float32Array(buffer, 0, 2).set([force[0], force[1]]);
  new Float32Array(buffer, 8, 1).set([dt]);
  new Uint32Array(buffer, 12, 1).set([ 3 ]);
  new Float32Array(buffer, 16, 1).set([0.5]);
  new Float32Array(buffer, 20, 1).set([0]);
  new Uint32Array(buffer, 24, 1).set([500]);
  new Uint32Array(buffer, 28, 1).set([500]);

  return buffer;
}
const quadBuffer = webgpu.device.createBuffer({
  size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
  usage: GPUBufferUsage.VERTEX,
  mappedAtCreation: true,
});
new Float32Array(quadBuffer.getMappedRange()).set([
  -1, -1, +1, -1, +1, +1,
  -1, -1, +1, +1, -1, +1
]);
quadBuffer.unmap();


const now = Date.now() 
setInterval(function () {
  const elapsed = (Date.now() - now ) * .000001
  const uniformsBufferData = buildComputeUniforms(elapsed, .1, [.5, .5], attractors)
  webgpu.device.queue.writeBuffer(computeUniformsBuffer, 0, uniformsBufferData);
}, 100)

const buffers = [
  {
      attributes: [
          {
              shaderLocation: 0,
              offset: 0,
              format: "float32x4",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
      stepMode: "instance",
  },
  {
      attributes: [
          {
              shaderLocation: 1,
              offset: 0,
              format: "float32x2",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
      stepMode: "vertex",
  },
  {
    attributes: [
        {
            shaderLocation: 2,
            offset: 0,
            format: "float32",
        }
    ],
    arrayStride: 4,
    stepMode: "vertex",
}
]

const device = webgpu.device
const model = mat4.identity(new Float32Array(16))

function getCameraViewProjMatrix() {
  const eyePosition = vec3.fromValues(.0, 0.0, -1.5);
  const upVector = vec3.fromValues(0, 1, 0);
  const origin = vec3.fromValues(0, 0, 0);
  const rad = Math.PI * (Date.now() / 5);
  //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -5, 0));
  mat4.rotate(
    model,
    model,
    1,
    vec3.fromValues(
      Math.sin(0),
      Math.cos(1),
      0
    )
  );
  //vec3.rotateY(eyePosition, eyePosition, origin, rad);

  let projectionMatrix = mat4.create();
  let viewProjectionMatrix = mat4.create();
  mat4.perspectiveZO(projectionMatrix,
    1, 500 / 500, .1, 500.0);
  //mat4.translate(viewProjectionMatrix, viewProjectionMatrix, eyePosition);
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);

  //mat4.lookAt(viewProjectionMatrix, eyePosition, origin, upVector);


  // Write the render parameters to the uniform buffer.
  let renderParamsHost = new ArrayBuffer(4 * 4 * 4);
  let viewProjectionMatrixHost = new Float32Array(renderParamsHost);
  viewProjectionMatrixHost.set(viewProjectionMatrix);
  return viewProjectionMatrixHost
}


  const cameraViewProj = getCameraViewProjMatrix();


// Calling simplewebgpu.init() creates a new partially evaluated draw command
const blend = {
  color: {
    srcFactor: 'src-alpha',
    dstFactor: 'one',
    operation: 'add',
  },
  alpha: {
    srcFactor: 'zero',
    dstFactor: 'one',
    operation: 'add',
  },
}

const drawCube = await webgpu.initDrawCall({
  shader: {
    vertEntryPoint: 'main_vertex',
    fragEntryPoint: 'main_fragment',
    code:`struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct Camera {
  projectionMatrix : mat4x4<f32>,
  viewMatrix : mat4x4<f32>,
  modelMatrix: mat4x4<f32>
}

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
    @location(2) density: f32

};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
@location(2) density: f32
) -> VSOut {
    var vsOut: VSOut;
    vsOut.position =  //vec4<f32>(inPosition.xy + (.03 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
    
     camera.projectionMatrix * camera.viewMatrix *  camera.modelMatrix * 
   vec4<f32>(inPosition.xy + (.009 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
    vsOut.position.y = vsOut.position.y;
    vsOut.localPosition = quadCorner;
    vsOut.density = density;
    return vsOut;
}

@fragment
fn main_fragment(@location(0) localPosition: vec2<f32>,
@location(2) density: f32) -> @location(0) vec4<f32> {
    let distanceFromCenter: f32 = length(localPosition);
    if (distanceFromCenter > 1.0) {
        discard;
    }
    var viewDir = vec3<f32>(0,0,0);
    var lightSpecularColor = vec3<f32>(1);
    var lightSpecularPower = 1.;
    var lightPosition = vec3<f32>(-1,-1, 0);

    var lightDir = lightPosition - vec3<f32>(localPosition, 1.); //3D position in space of the surface

		var distance = length(lightDir);

		lightDir = lightDir / distance; // = normalize(lightDir);
		distance = distance * distance; //This line may be optimised using Inverse square root
    var normal = vec3(-1.,-1., 0.);

		//Intensity of the diffuse light. Saturate to keep within the 0-1 range.
		var NdotL = dot(normal, lightDir);
		var intensity = saturate(NdotL);

		// Calculate the diffuse light factoring in light color, power and the attenuation
		//OUT.Diffuse = intensity * light.diffuseColor * light.diffusePower / distance;

		//Calculate the half vector between the light vector and the view vector.
		//This is typically slower than calculating the actual reflection vector
		// due to the normalize function's reciprocal square root
		var H = normalize(lightDir + viewDir);

		//Intensity of the specular light
		var NdotH = dot(normal, H);
		//intensity = pow(saturate(NdotH), specularHardness);

		//Sum up the specular light factoring
		let col = vec4<f32>(1. * lightSpecularColor * lightSpecularPower / distance, .1);

    return  col + vec4<f32>(distanceFromCenter - 1.5, density / 500,1.,.1);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    posBuffer, quadBuffer, densityBuffer
  ],
  count: 6,
  blend,
  instances: particlesCount,
  bindGroup: function ({pipeline}) {
    const uniformsBuffer = webgpu.device.createBuffer({
      size: 32, 
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
    return webgpu.device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
          {
              binding: 0,
              resource: {
                  buffer: uniformsBuffer,
              }
          },
          {
            binding: 1,
            resource: {
            buffer: cameraUniformBuffer
            }
          }
      ]
  });
  }
})
let camera = createCamera({
  center: [-7., -0.0, -0],
  damping: 0,
  noScroll: true,
  renderOnDirty: true,
  element: webgpu.canvas
});
let stuff = camera();

const gridCountScan = new WebGPUScan({
  device,
  threadsPerGroup: SCAN_THREADS,
  itemsPerThread: 4,
  dataType: 'u32',
  dataSize: 4,
  dataFunc: 'A + B',
  dataUnit: '0u'
})

const gridCountScanPass = await gridCountScan.createPass(COLLISION_TABLE_SIZE, hashCounts)
let hasRun = 0;
setInterval(
  async function () {
    let {projection, view} = camera()
    cameraViewProj

    device.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      cameraViewProj.buffer,
      cameraViewProj.byteOffset,
      cameraViewProj.byteLength
    );

    device.queue.writeBuffer(
      cameraUniformBuffer,
      0,
      projection.buffer,
      projection.byteOffset,
      projection.byteLength
    );

    device.queue.writeBuffer(
      cameraUniformBuffer,
      64,
      view.buffer,
      view.byteOffset,
      view.byteLength
    );
     device.queue.writeBuffer(
      cameraUniformBuffer,
      128,
      model.buffer,
      model.byteOffset,
      model.byteLength
    );
    let localState = resetPass()
  
    let commandEncoder = localState.ctx.commandEncoder;

    predictedPosition()

    gridCountPipeline()

     if (hasRun < 10) utils.readBuffer(webgpu.state, hashCounts).then(d =>{ 
      
    //  console.log(d)
    window.hashCounts = d
    })
     hasRun += 1;

    const computePass = commandEncoder.beginComputePass();


    gridCountScanPass.run(computePass)

    computePass.end();

    gridCopyParticlePipeline()

    computeDensity()

    for (var i = 0; i < 1; i++) {
      applyConstraintCompute()
      //await sleep(5000)

      applyConstraintCorrection()
    }
    
    //applyVorticityCompute()
    updatePositionCompute()

    drawCube({})

    //may call command encoder from previous pass
    //make it all totally sync
    //cant debug it by reading buffers
    //mutex lock 

    //exact same command encoder 
    //run once

    //pause drawing 
    //dont run any updates or any code
    //pause draw loop till reads have completed 

    window.debugGetNeighbors = await utils.readBuffer(webgpu.state, debugGetNeighbors)


    window.particleIds = await utils.readBuffer(webgpu.state, particleIds)

    // window.density = await utils.readBuffer(webgpu.state, densityBuffer)

    // window.constBuffer = await utils.readBuffer(webgpu.state, constBuffer)

    // window.predictionBuffer = await utils.readBuffer(webgpu.state, predictionBuffer)

    // window.correctParticle = await utils.readBuffer(webgpu.state, correctParticle)

    // window.velocityBuffer = await utils.readBuffer(webgpu.state, velocityBuffer)
    //   window.countY = function countY() {
    //     let stuff = window.w
    //     let result = []
    //     for (let i = 0; i < stuff.length; i += 4) {
    //       result.push(stuff[i+1])
    //     }
    //     console.log(result)
    //   }

    }, 8) 
}

basic()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// camera technique https://github.com/jrprice/NBody-WebGPU/blob/main/src/shaders.wgsl
//make a buffer of 1 million particles (position + velocity )
//Grid - make a buffer of 250,000 "grid" = record velocity, density or ID's of particles
//for each particle - write the location into grid
//constraint solver = update prediction 

//for each particle, integrate velocity of nearest neighbors 


//https://www.youtube.com/watch?v=MhzFbCqoTxw

///https://github.com/regl-project/regl-camera/blob/master/regl-camera.js

//https://mmacklin.com/pbf_sig_preprint.pdf


//Attribution https://github.com/axoloto/RealTimeParticles/blob/master/physics/Fluids.cpp
//http://www.perceptualedge.com/articles/visual_business_intelligence/time_on_the_horizon.pdf

//https://www.youtube.com/watch?v=irDNJNKAjps&ab_channel=SPH-DVHCNR-INM
//https://github.com/dli/fluid


// take a bucket and write the contents to screen
// write bucket contents to texture -> green dot = 0,1 - 8 max particles per cell


//file:///Users/adnanwahab/Downloads/CAVW_27.pdf