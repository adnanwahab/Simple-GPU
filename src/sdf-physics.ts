import { makeCanvas, mustHave } from './boilerplate'
import { WebGPUScan } from './scan'
import { mat4, mat3, vec4, quat, vec3 } from 'gl-matrix'

const PALETTE = [
  [ 0.19215686274509805, 0.2235294117647059, 0.23529411764705882, 1 ],
  [ 0.12941176470588237, 0.4627450980392157, 1, 1 ],
  [ 0.2, 0.6313725490196078, 0.9921568627450981, 1 ],
  [ 0.9921568627450981, 0.792156862745098, 0.25098039215686274, 1 ],
  [ 0.9686274509803922, 0.596078431372549, 0.1411764705882353, 1 ]
]

const SWEEP_RADIUS = 0.03
const DONUT_RADIUS = 0.07
const PARTICLE_RADIUS =  SWEEP_RADIUS + DONUT_RADIUS

const SCAN_THREADS = 256
const SCAN_ITEMS = 4
const NUM_PARTICLE_BLOCKS = 1
const NUM_PARTICLES = NUM_PARTICLE_BLOCKS * SCAN_THREADS * SCAN_ITEMS

const PARTICLE_WORKGROUP_SIZE = SCAN_THREADS

// rendering performance parameters
const RAY_STEPS = 32
const RAY_TOLER = 0.001
const BG_RAY_STEPS = 256
const BG_RAY_TOLER = 0.0001
const BG_TMIN = 0.00
const BG_TMAX = 1000.0
const BG_COLOR = PALETTE[0]
const RADIUS_PADDING = 1.5

// physics simulation
const DT = 0.1
const SUBSTEPS = 10
const SUB_DT = DT / SUBSTEPS
const JACOBI_POS = 0.25
const JACOBI_ROT = 0.25
const GRAVITY = 0.5
const POS_DAMPING = 0.05
const ROT_DAMPING = 0.01

// assume all bodies have same inertia tensor, whatever
const PARTICLE_INERTIA_TENSOR = mat3.identity(mat3.create())
const PARTICLE_INV_INERTIA_TENSOR = mat3.invert(mat3.create(), PARTICLE_INERTIA_TENSOR)

// collision detection parameters
const MAX_BUCKET_SIZE = 16
const GRID_SPACING = 2 * PARTICLE_RADIUS
const COLLISION_TABLE_SIZE = NUM_PARTICLES
const HASH_VEC = [
  1,
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 1 / 3)),
  Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 2 / 3))
]
const CONTACTS_PER_PARTICLE = 16
const CONTACT_TABLE_SIZE = CONTACTS_PER_PARTICLE * NUM_PARTICLES

const COMMON_SHADER_FUNCS = `
fn rigidMotion (q:vec4<f32>, v:vec4<f32>) -> mat4x4<f32> {
  var q2 = q.xyz + q.xyz;

  var xx = q.x * q2.x;
  var xy = q.x * q2.y;
  var xz = q.x * q2.z;
  var yy = q.y * q2.y;
  var yz = q.y * q2.z;
  var zz = q.z * q2.z;
  var wx = q.w * q2.x;
  var wy = q.w * q2.y;
  var wz = q.w * q2.z;

  return mat4x4<f32>(
    1. - (yy + zz),
    xy + wz,
    xz - wy,
    0.,

    xy - wz,
    1. - (xx + zz),
    yz + wx,
    0.,

    xz + wy,
    yz - wx,
    1. - (xx + yy),
    0.,

    v.x,
    v.y,
    v.z,
    1.
  );
}

fn upper3x3 (m:mat4x4<f32>) -> mat3x3<f32> {
  return mat3x3<f32>(
    m[0][0], m[1][0], m[2][0],
    m[0][1], m[1][1], m[2][1],
    m[0][2], m[1][2], m[2][2]);
}

fn particleSDF (p : vec3<f32>) -> f32 {
  /*
  var q = vec2<f32>(length(p.xz)-${DONUT_RADIUS}, p.y);
  return length(q) - ${SWEEP_RADIUS};
  */
 return length(p) - ${SWEEP_RADIUS};
}

fn terrainSDF (p : vec3<f32>) -> f32 {
  return max(p.y + 1., 3. - distance(p, vec3(0., -1, 0.)));
}

fn bucketHash (p:vec3<i32>) -> u32 {
  var h = (p.x * ${HASH_VEC[0]}) + (p.y * ${HASH_VEC[1]}) + (p.z * ${HASH_VEC[2]});
  if h < 0 {
    return ${COLLISION_TABLE_SIZE}u - (u32(-h) % ${COLLISION_TABLE_SIZE}u);
  } else {
    return u32(h) % ${COLLISION_TABLE_SIZE}u;
  }
}

fn particleBucket (p:vec3<f32>) -> vec3<i32> {
  return vec3<i32>(floor(p * ${(1 / GRID_SPACING).toFixed(3)}));
}

fn particleHash (p:vec3<f32>) -> u32 {
  return bucketHash(particleBucket(p));
} 
`

function shapeHelpers ({sdf, suffix}:{
  sdf:string,
  suffix:string
}) {

  function eps(d:number) {
    const v = [0,0,0]
    v[d] = 0.001
    return `vec3<f32>(${v.join()})`
  }

  return `
fn grad${suffix} (p:vec3<f32>) -> vec3<f32> {
  return normalize(
    ${sdf}(p) - vec3<f32>(
      ${sdf}(p - ${eps(0)}),
      ${sdf}(p - ${eps(1)}),
      ${sdf}(p - ${eps(2)})
    )
  );
}

fn sup${suffix} (n:vec3<f32>, x:vec3<f32>, r:f32, offset:f32) -> vec3<f32> {
  var p = x + n * r;
  var f = ${sdf}(p);
  var df = normalize(
    f - vec3<f32>(
      ${sdf}(p - ${eps(0)}),
      ${sdf}(p - ${eps(1)}),
      ${sdf}(p - ${eps(2)})
    )
  );
  return p - (sign(dot(df, n)) * min(abs(f - offset), r)) * df;
}
`
}

function contactHelpers ({sdfA, sdfB, numIters}:{
  sdfA:string,
  sdfB:string,
  numIters: number
}) {
  return `
${shapeHelpers({ sdf: sdfA, suffix: 'A' })}
${shapeHelpers({ sdf: sdfB, suffix: 'B' })}

struct ContactResult {
  ab : vec3<f32>,
  hit : bool,
};

fn solveContact (posA : vec3<f32>, posB : vec3<f32>, scale : f32) -> ContactResult {
  var qA = posB;
  var qB = posA;
  
  var n0 = vec3<f32>();
  var x0 = 0.5 * (qA + qB);

  var offset = scale;
  var fa = ${sdfA}(qB) - offset;
  var fb = ${sdfB}(qA) - offset;

  for (var iter = 0; iter < ${numIters}; iter = iter + 1) {
    offset = 0.5 * offset;

    var rad = length(qA - qB) + max(abs(fa), abs(fb));

    n0 = gradB(x0);
    qA = supA(-n0, x0, rad, offset);
    fb = ${sdfB}(qA) - offset;
    if fb > 0. {
      qA = qA - fb * gradB(qA);
    }
    x0 = qA;

    n0 = gradA(x0);
    qB = supB(-n0, x0, rad, offset);
    fa = ${sdfA}(qB) - offset;
    if fa > 0. {
      qB = qB - fa * gradA(qB);
    }
    x0 = qB;
  }

  var result : ContactResult;
  var q = 0.5 * (qA + qB);
  if max(${sdfA}(q), ${sdfB}(q)) < 0. {
    result.ab = qB - qA;
    result.hit = true;
  } else {
    result.ab = qA - qB;
    result.hit = false;
  }
  return result;
}
`
}

async function main () {
    console.log('hi this is sdf-physics')
  const adapter = mustHave(await navigator.gpu.requestAdapter())
  const device = await adapter.requestDevice()
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

  const canvas = makeCanvas()
  const context = mustHave(canvas.getContext('webgpu'))
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'opaque',
  })

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  })

  const backroundShader = device.createShaderModule({
    label: 'bgRenderShader',
    code: `
${COMMON_SHADER_FUNCS}

struct Uniforms {
  view : mat4x4<f32>,
  proj : mat4x4<f32>,
  projInv: mat4x4<f32>,
  fog : vec4<f32>,
  lightDir : vec4<f32>,
  eye : vec4<f32>
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) rayDirection : vec3<f32>,
}

@vertex
fn vertMain(
  @builtin(vertex_index) vertexIndex : u32
) -> VertexOutput {
  var corners = array<vec2<f32>, 4>(
    vec2(1.0, 1.0),
    vec2(-1.0, 1.0),
    vec2(1.0, -1.0),
    vec2(-1.0, -1.0),
  );

  var screenPos = corners[vertexIndex];
  
  var result : VertexOutput;
  result.clipPosition = vec4(screenPos, 0., 1.);

  var rayCamera = uniforms.projInv * vec4(screenPos, -1., 1.);
  result.rayDirection = upper3x3(uniforms.view) * rayCamera.xyz;

  return result;
}


fn map(p : vec3<f32>) -> f32 {
  return terrainSDF(p);
}

fn traceRay (rayOrigin : vec3<f32>, rayDir : vec3<f32>, tmin : f32, tmax: f32) -> f32 {
  var t = tmin;
  for (var i = 0u; i < ${BG_RAY_STEPS}u; i = i + 1u) {
    var pos = rayOrigin + t * rayDir;
    var h = map(pos);
    if t > tmax {
      return -1.;
    }
    if h < ${BG_RAY_TOLER} {
      return t;
    }
    t += h;
  }
  return -1.;
}

fn surfNormal (pos : vec3<f32>) -> vec3<f32> {
  var e = vec2<f32>(1.0,-1.0)*0.5773;
  const eps = 0.0005;
  return normalize( e.xyy*map( pos + e.xyy*eps ) + 
            e.yyx*map( pos + e.yyx*eps ) + 
            e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}

struct FragmentOutput {
  @builtin(frag_depth) depth : f32,
  @location(0) color : vec4<f32>,
}

@fragment
fn fragMain (@location(0) rayDirectionInterp : vec3<f32>) -> FragmentOutput {
  var result : FragmentOutput;
  
  var rayDirection = normalize(rayDirectionInterp);
  var rayOrigin = uniforms.eye.xyz;
  var rayDist = traceRay(rayOrigin, rayDirection, ${BG_TMIN}, ${BG_TMAX});

  if rayDist < 0. {
    result.depth = 1.;
    result.color = vec4(${BG_COLOR.join(', ')});
    return result;
  }
  
  var rayHit = rayDist * rayDirection + rayOrigin;

  var clipPos = uniforms.proj * uniforms.view * vec4(rayHit, 1.);
  result.depth = clipPos.z / clipPos.w;
  
  var N = surfNormal(rayHit);
  
  var diffuse = max(0., -dot(N, uniforms.lightDir.xyz));
  var ambient = 0.5 + 0.5 * N.y;
  var light = ambient * (diffuse * vec3(0.9, 0.7, 0.6) + vec3(0.1, 0.3, 0.2));
  var color = mix(uniforms.fog.xyz, light * vec3(0.1, 0.2, 1.), exp(-0.01 * result.depth));

  result.color = vec4(sqrt(color), 1.);

  return result;
}
    `
  })

  const renderShader = device.createShaderModule({
    label: 'particleRenderShader',
    code: `
${COMMON_SHADER_FUNCS}

struct Uniforms {
  view : mat4x4<f32>,
  proj : mat4x4<f32>,
  projInv: mat4x4<f32>,
  fog : vec4<f32>,
  lightDir : vec4<f32>,
  eye : vec4<f32>
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;
@binding(0) @group(1) var<storage, read> particlePosition : array<vec4<f32>>;
@binding(1) @group(1) var<storage, read> particleRotation : array<vec4<f32>>;
@binding(2) @group(1) var<storage, read> particleColor : array<vec4<f32>>;

struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  @location(0) particleColor : vec4<f32>,
  @location(1) rayDirection : vec3<f32>,
  @location(2) rayOrigin : vec3<f32>,
  @location(3) model0 : vec4<f32>,
  @location(4) model1 : vec4<f32>,
  @location(5) model2 : vec4<f32>,
  @location(6) model3 : vec4<f32>,
}

@vertex
fn vertMain(
  @builtin(instance_index) instanceIdx : u32,
  @location(0) uv : vec2<f32>,
) -> VertexOutput {
  var result : VertexOutput;
  result.particleColor = particleColor[instanceIdx];

  var sdfMat = rigidMotion(
    particleRotation[instanceIdx],
    particlePosition[instanceIdx]);
  result.model0 = sdfMat[0];
  result.model1 = sdfMat[1];
  result.model2 = sdfMat[2];
  result.model3 = sdfMat[3];
  
  var viewCenter = uniforms.view * sdfMat[3];
  var rayDirection = viewCenter + vec4(${RADIUS_PADDING * PARTICLE_RADIUS} * uv.x, ${RADIUS_PADDING * PARTICLE_RADIUS} * uv.y, 0., 0.);
  result.clipPosition = uniforms.proj * rayDirection;

  var invRot = upper3x3(sdfMat);
  var invTran = -sdfMat[3].xyz;
  result.rayDirection = invRot * upper3x3(uniforms.view) * rayDirection.xyz;
  result.rayOrigin = invRot * (uniforms.eye.xyz + invTran);
  
  return result;
}

fn map(p : vec3<f32>) -> f32 {
  return particleSDF(p);
}

fn traceRay (rayOrigin : vec3<f32>, rayDir : vec3<f32>, tmin : f32, tmax: f32) -> f32 {
  var t = tmin;
  for (var i = 0u; i < ${RAY_STEPS}u; i = i + 1u) {
    var pos = rayOrigin + t * rayDir;
    var h = map(pos);
    if t > tmax {
      return -1.;
    }
    if h < ${RAY_TOLER} {
      return t;
    }
    t += h;
  }
  return -1.;
}

fn surfNormal (pos : vec3<f32>) -> vec3<f32> {
  var e = vec2<f32>(1.0,-1.0)*0.5773;
  const eps = 0.0005;
  return normalize( e.xyy*map( pos + e.xyy*eps ) + 
            e.yyx*map( pos + e.yyx*eps ) + 
            e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}

struct FragmentOutput {
  @builtin(frag_depth) depth : f32,
  @location(0) color : vec4<f32>,
}
    
@fragment
fn fragMain(
  @location(0) particleColor : vec4<f32>,
  @location(1) rayDirectionInterp : vec3<f32>,
  @location(2) rayOrigin : vec3<f32>,
  @location(3) model0 : vec4<f32>,
  @location(4) model1 : vec4<f32>,
  @location(5) model2 : vec4<f32>,
  @location(6) model3 : vec4<f32>,
) -> FragmentOutput {
  var result : FragmentOutput;
  
  var tmid = length(rayDirectionInterp);
  var rayDirection = rayDirectionInterp / tmid;
  var rayDist = traceRay(rayOrigin, rayDirection, tmid - ${RADIUS_PADDING * PARTICLE_RADIUS}, tmid + ${RADIUS_PADDING * PARTICLE_RADIUS});
  if rayDist < 0. {
    discard;
  }
  var rayHit = rayDist * rayDirection + rayOrigin;

  var model = mat4x4<f32>(model0, model1, model2, model3);
  
  var clipPos = uniforms.proj * uniforms.view * model * vec4(rayHit, 1.);
  result.depth = clipPos.z / clipPos.w;
  
  var N = normalize(surfNormal(rayHit) * upper3x3(model));

  var diffuse = max(0., -dot(N, uniforms.lightDir.xyz));
  var ambient = 0.5 + 0.5 * N.y;
  var light = ambient * (diffuse * vec3(0.9, 0.7, 0.6) + vec3(0.1, 0.3, 0.2));
  var color = mix(uniforms.fog.xyz, light * particleColor.xyz, exp(-0.01 * result.depth));

  result.color = vec4(sqrt(color), 1.);
  return result;
}`
  })

  const PHYSICS_COMMON = `
const inertiaTensor = mat3x3<f32>(${Array.prototype.join.call(PARTICLE_INERTIA_TENSOR)});
const invInertiaTensor = mat3x3<f32>(${Array.prototype.join.call(PARTICLE_INV_INERTIA_TENSOR)});

fn qMultiply(a:vec4<f32>, b:vec4<f32>) -> vec4<f32> {
  return vec4<f32>(
    a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y,
    a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z,
    a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x,
    a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
  );
}

fn qMatrix (q:vec4<f32>) -> mat3x3<f32> {
  var q2 = q.xyz + q.xyz;

  var xx = q.x * q2.x;
  var xy = q.x * q2.y;
  var xz = q.x * q2.z;
  var yy = q.y * q2.y;
  var yz = q.y * q2.z;
  var zz = q.z * q2.z;
  var wx = q.w * q2.x;
  var wy = q.w * q2.y;
  var wz = q.w * q2.z;

  return mat3x3<f32>(
    1. - (yy + zz),
    xy + wz,
    xz - wy,

    xy - wz,
    1. - (xx + zz),
    yz + wx,

    xz + wy,
    yz - wx,
    1. - (xx + yy),
  );
}
`

  const particlePredictShader = device.createShaderModule({
    label: 'particlePredict',
    code: `
${PHYSICS_COMMON}

@binding(0) @group(0) var<storage, read> position : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read> velocity : array<vec4<f32>>;
@binding(2) @group(0) var<storage, read_write> predictedPosition : array<vec4<f32>>;
@binding(3) @group(0) var<storage, read_write> positionUpdate : array<vec4<f32>>;

@binding(4) @group(0) var<storage, read> rotation : array<vec4<f32>>;
@binding(5) @group(0) var<storage, read> angVelocity : array<vec4<f32>>;
@binding(6) @group(0) var<storage, read_write> predictedRotation : array<vec4<f32>>;
@binding(7) @group(0) var<storage, read_write> rotationUpdate : array<vec4<f32>>;

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn predictPositions (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;

  var v = velocity[id];
  v.y = v.y - ${(GRAVITY * SUB_DT).toFixed(3)};
  predictedPosition[id] = position[id] + v * ${SUB_DT.toFixed(3)};
  positionUpdate[id] = vec4<f32>(0.);

  var q = rotation[id];
  var omega = angVelocity[id].xyz;

  var nextOmega = omega - ${SUB_DT} * invInertiaTensor * cross(omega, inertiaTensor * omega);
  var nextQ = q + ${0.5 * SUB_DT} * qMultiply(vec4(omega, 0.), q);

  predictedRotation[id] = normalize(nextQ);
  rotationUpdate[id] = vec4<f32>(0.);
}`
  })

  const particleUpdateShader = device.createShaderModule({
    label: 'particleUpdate',
    code: `
${PHYSICS_COMMON}

@binding(0) @group(0) var<storage, read_write> position : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read_write> velocity : array<vec4<f32>>;
@binding(2) @group(0) var<storage, read> predictedPosition : array<vec4<f32>>;
@binding(3) @group(0) var<storage, read> positionUpdate : array<vec4<f32>>;

@binding(4) @group(0) var<storage, read_write> rotation : array<vec4<f32>>;
@binding(5) @group(0) var<storage, read_write> angVelocity : array<vec4<f32>>;
@binding(6) @group(0) var<storage, read> predictedRotation : array<vec4<f32>>;
@binding(7) @group(0) var<storage, read> rotationUpdate : array<vec4<f32>>;


@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn updatePositions (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;

  var p = position[id];
  var prevPosition = p.xyz;
  var nextPosition = predictedPosition[id].xyz + ${JACOBI_POS} * positionUpdate[id].xyz;
  velocity[id] = vec4(${Math.exp(-SUB_DT * POS_DAMPING)} * (nextPosition - prevPosition) * ${(1 / SUB_DT).toFixed(3)}, 0.);
  position[id] = vec4(nextPosition, p.w);

  var prevQ = rotation[id];
  var nextQ = normalize(predictedRotation[id] + ${JACOBI_ROT} * rotationUpdate[id]);

  var dQ = qMultiply(nextQ, vec4(-prevQ.xyz, prevQ.w));
  if dQ.w < 0. {
    angVelocity[id] = vec4(-${(2 / SUB_DT) * Math.exp(-SUB_DT * ROT_DAMPING)} * dQ.xyz, 0.);
  } else {
    angVelocity[id] = vec4(${(2 / SUB_DT) * Math.exp(-SUB_DT * ROT_DAMPING)} * dQ.xyz, 0.);
  }
  rotation[id] = nextQ;
}
`
  })

  const clearBufferPipeline = device.createComputePipeline({
    label: 'clearBufferPipeline',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'clearBufferShader',
        code: `
@binding(0) @group(0) var<storage, read_write> buffer : array<u32>;

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE}, 1, 1) fn clearGrids (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  buffer[globalVec.x] = 0u;
}`
      }),
      entryPoint: 'clearGrids'
    }
  })

  const gridCountPipeline = device.createComputePipeline({
    label: 'gridCountPipeline',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'gridCountShader',
        code: `
${COMMON_SHADER_FUNCS}

@binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn countParticles (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var bucket = particleHash(positions[id].xyz);
  atomicAdd(&hashCounts[bucket], 1u);
}`
      }),
      entryPoint: 'countParticles'
    }
  })

  const gridCopyParticlePipeline = device.createComputePipeline({
    label: 'gridCopyParticles',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'gridCopyShader',
        code: `
${COMMON_SHADER_FUNCS}

@binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;
@binding(2) @group(0) var<storage, read_write> particleIds : array<u32>;

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn copyParticleIds (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var bucket = particleHash(positions[id].xyz);
  var offset = atomicSub(&hashCounts[bucket], 1u) - 1u;
  particleIds[offset] = id;
}
`,
      }),
      entryPoint: 'copyParticleIds'
    }
  })

  const contactCommonCode = `
  ${COMMON_SHADER_FUNCS}

@binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read> hashCounts : array<u32>;
@binding(2) @group(0) var<storage, read> particleIds : array<u32>;

struct BucketContents {
  ids : array<i32, ${MAX_BUCKET_SIZE}>,
  xyz : array<vec3<f32>, ${MAX_BUCKET_SIZE}>,
  count : u32,
}

fn readBucketNeighborhood (centerId:u32) -> array<array<array<BucketContents, 2>, 2>, 2> {
  var result : array<array<array<BucketContents, 2>, 2>, 2>;

  for (var i = 0; i < 2; i = i + 1) {
    for (var j = 0; j < 2; j = j + 1) {
      for (var k = 0; k < 2; k = k + 1) {
        var bucketId = (centerId + bucketHash(vec3<i32>(i, j, k))) % ${COLLISION_TABLE_SIZE}u;
        var bucketStart = hashCounts[bucketId];
        var bucketEnd = ${NUM_PARTICLES}u;
        if bucketId < ${COLLISION_TABLE_SIZE - 1} {
          bucketEnd = hashCounts[bucketId + 1];
        }
        result[i][j][k].count = min(bucketEnd - bucketStart, ${MAX_BUCKET_SIZE}u);
        for (var n = 0u; n < ${MAX_BUCKET_SIZE}u; n = n + 1u) {
          var p = bucketStart + n;
          if p >= bucketEnd {
            result[i][j][k].ids[n] = -1;
          } else {
            result[i][j][k].ids[n] = i32(particleIds[p]);
          }
        }
        for (var n = 0u; n < ${MAX_BUCKET_SIZE}u; n = n + 1u) {
          if (n >= result[i][j][k].count) {
            break;
          }
          result[i][j][k].xyz[n] = positions[result[i][j][k].ids[n]].xyz;
        }
      }
    }
  }

  return result;
}

fn testOverlap (a:vec3<f32>, b:vec3<f32>) -> f32 {
  var d = a - b;
  return dot(d, d) - ${4 * PARTICLE_RADIUS * PARTICLE_RADIUS};
}
`

  const contactCountPipeline = device.createComputePipeline({
    label: 'contactCountPipeline',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'contactCountShader',
        code: `
${contactCommonCode}

@binding(3) @group(0) var<storage, read_write> contactCount : array<u32>;


fn countBucketContacts (a:BucketContents, b:BucketContents) -> u32 {
  var count = 0u;
  for (var i = 0u; i < ${MAX_BUCKET_SIZE}u; i = i + 1u) {
    if (i >= a.count) {
      break;
    }
    for (var j = 0u; j < ${MAX_BUCKET_SIZE}u; j = j + 1u) {
      if (j >= b.count) {
        break;
      }
      if (testOverlap(a.xyz[i], b.xyz[j]) <= 0.) {
        count = count + 1u;
      }
    }
  }
  return count;
}

fn countCenterContacts (a:BucketContents) -> u32 {
  var count = 0u;
  for (var i = 0u; i < ${MAX_BUCKET_SIZE}u; i = i + 1u) {
    if (i >= a.count) {
      break;
    }
    for (var j = 0u; j < i; j = j + 1u) {
      if (testOverlap(a.xyz[i], a.xyz[j]) <= 0.) {
        count = count + 1u;
      }
    }
  }
  return count;
}

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn countContacts (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var buckets = readBucketNeighborhood(id);

  contactCount[id] = countCenterContacts(buckets[0][0][0]) +
    countBucketContacts(buckets[0][0][0], buckets[0][0][1]) +
    countBucketContacts(buckets[0][0][0], buckets[0][1][0]) +
    countBucketContacts(buckets[0][0][0], buckets[0][1][1]) +
    countBucketContacts(buckets[0][0][0], buckets[1][0][0]) +
    countBucketContacts(buckets[0][0][0], buckets[1][0][1]) +
    countBucketContacts(buckets[0][0][0], buckets[1][1][0]) +
    countBucketContacts(buckets[0][0][0], buckets[1][1][1]);
}`
      }),
      entryPoint: 'countContacts'
    }
  })

  const contactListPipeline = device.createComputePipeline({
    label: 'contactListPipeline',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'contactListShader',
        code: `
${contactCommonCode}

@binding(3) @group(0) var<storage, read> contactCount : array<u32>;
@binding(4) @group(0) var<storage, read_write> contactList : array<vec2<i32>>;

fn emitBucketContacts (a:BucketContents, b:BucketContents, offset:u32) -> u32 {
  if (offset >= ${CONTACT_TABLE_SIZE}u) {
    return offset;
  }
  var shift = offset;
  for (var i = 0u; i < ${MAX_BUCKET_SIZE}u; i = i + 1u) {
    if (i >= a.count) {
      break;
    }
    for (var j = 0u; j < ${MAX_BUCKET_SIZE}u; j = j + 1u) {
      if (j >= b.count) {
        break;
      }
      if (testOverlap(a.xyz[i], b.xyz[j]) <= 0.) {
        contactList[shift] = vec2<i32>(a.ids[i], b.ids[j]);
        shift = shift + 1u;
        if (shift >= ${CONTACT_TABLE_SIZE}u) {
          return shift;
        }
      }
    }
  }
  return shift;
}

fn emitCenterContacts (a:BucketContents, offset:u32) -> u32 {
  if (offset >= ${CONTACT_TABLE_SIZE}u) {
    return offset;
  }
  var shift = offset;
  for (var i = 1u; i < ${MAX_BUCKET_SIZE}u; i = i + 1u) {
    if (i >= a.count) {
      break;
    }
    for (var j = 0u; j < i; j = j + 1u) {
      if (testOverlap(a.xyz[i], a.xyz[j]) <= 0.) {
        contactList[shift] = vec2<i32>(a.ids[i], a.ids[j]);
        shift = shift + 1u;
        if (shift >= ${CONTACT_TABLE_SIZE}u) {
          return shift;
        }
      }
    }
  }
  return shift;
}

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn countContacts (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var buckets = readBucketNeighborhood(id);
  var offset = 0u;
  if id > 0u {
    offset = contactCount[id - 1u];
  }

  offset = emitCenterContacts(buckets[0][0][0], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[0][0][1], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[0][1][0], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[0][1][1], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[1][0][0], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[1][0][1], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[1][1][0], offset);
  offset = emitBucketContacts(buckets[0][0][0], buckets[1][1][1], offset);  
}`
      }),
      entryPoint: 'countContacts'
    }
  })

  const debugContactShader = device.createShaderModule({
    label: 'renderContactShader',
    code: `
struct Uniforms {
  view : mat4x4<f32>,
  proj : mat4x4<f32>,
  projInv: mat4x4<f32>,
  fog : vec4<f32>,
  lightDir : vec4<f32>,
  eye : vec4<f32>
}
@binding(0) @group(0) var<uniform> uniforms : Uniforms;
@binding(0) @group(1) var<storage, read> particlePosition : array<vec4<f32>>;
@binding(1) @group(1) var<storage, read> contactId : array<u32>;

@vertex fn vertMain (@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4<f32> {
  var pos = particlePosition[contactId[vertexIndex]].xyz;
  return uniforms.proj * uniforms.view * vec4(pos, 1.);
}

@fragment fn fragMain () -> @location(0) vec4<f32> {
  return vec4(1., 0., 0., 1.);
}
`
  })

  const solveTerrainPositionPipeline = device.createComputePipeline({
    label: 'solveTerrainPositionPipeline',
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        label: 'solveTerrainPositionShader',
        code: `
${COMMON_SHADER_FUNCS}
${PHYSICS_COMMON}


@binding(0) @group(0) var<storage, read_write> position : array<vec4<f32>>;
@binding(1) @group(0) var<storage, read_write> rotation : array<vec4<f32>>;

var<private> shapeRot : mat3x3<f32> = mat3x3<f32>();
var<private> shapePos : vec3<f32> = vec3<f32>();

fn shapeSDF (p : vec3<f32>) -> f32 {
  return particleSDF(shapeRot * (p - shapePos));
}

${contactHelpers({
  sdfA: 'terrainSDF',
  sdfB: 'shapeSDF',
  numIters: 8,
})}

@compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn solveTerrainPosition (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var p = position[id].xyz;
  var d0 = terrainSDF(p);
  if d0 >= ${PARTICLE_RADIUS} {
    return;
  }

  position[id] = vec4(p.xyz - gradA(p) * (d0 - ${PARTICLE_RADIUS}), 0);
  return;
  if d0 <= -${PARTICLE_RADIUS} {
    position[id] = vec4(p.xyz - gradA(p) * (d0 - ${PARTICLE_RADIUS}), 0);
    return;
  }

  shapePos = p;
  var q = rotation[id];
  shapeRot = qMatrix(q);
  
  var contact = solveContact(p - gradA(p) * ${PARTICLE_RADIUS}, p, ${2 * PARTICLE_RADIUS});
  if !contact.hit {
    return;
  }

  position[id] = vec4(p.xyz - contact.ab, 0);
  rotation[id] = vec4(0., 0., 0., 1.);
}
`
      }),
      entryPoint: 'solveTerrainPosition',
    }
  })

  const particleGridCountBuffer = device.createBuffer({
    label: 'particleGridCount',
    size: 4 * COLLISION_TABLE_SIZE,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleGridIdBuffer = device.createBuffer({
    label: 'particleGridEntry',
    size: 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleContactCountBuffer = device.createBuffer({
    label: 'particleContactCount',
    size: 4 * COLLISION_TABLE_SIZE,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const contactListBuffer = device.createBuffer({
    label: 'contactListBuffer',
    size: 2 * 4 * CONTACT_TABLE_SIZE,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  particleGridCountBuffer.unmap()
  particleGridIdBuffer.unmap()
  particleContactCountBuffer.unmap()
  contactListBuffer.unmap()
  
  const particlePositionBuffer = device.createBuffer({
    label: 'particlePosition',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleRotationBuffer = device.createBuffer({
    label: 'particleRotation',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleColorBuffer = device.createBuffer({
    label: 'particleColor',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleVelocityBuffer = device.createBuffer({
    label: 'particleVelocity',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleAngularVelocityBuffer = device.createBuffer({
    label: 'particleAngularVelocity',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particlePositionPredictionBuffer = device.createBuffer({
    label: 'particlePositionPrediction',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particlePositionCorrectionBuffer = device.createBuffer({
    label: 'particlePositionCorrection',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleRotationPredictionBuffer = device.createBuffer({
    label: 'particleRotationPrediction',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  const particleRotationCorrectionBuffer = device.createBuffer({
    label: 'particleRotationCorrection',
    size: 4 * 4 * NUM_PARTICLES,
    usage: GPUBufferUsage.STORAGE,
    mappedAtCreation: true
  })
  {
    const particlePositionData = new Float32Array(particlePositionBuffer.getMappedRange())
    const particleRotationData = new Float32Array(particleRotationBuffer.getMappedRange())
    const particleColorData = new Float32Array(particleColorBuffer.getMappedRange())
    const particleVelocityData = new Float32Array(particleVelocityBuffer.getMappedRange())
    const particleAngularVelocityData = new Float32Array(particleAngularVelocityBuffer.getMappedRange())
    for (let i = 0; i < NUM_PARTICLES; ++i) {
      const color = PALETTE[1 + (i % (PALETTE.length - 1))]
      for (let j = 0; j < 4; ++j) {
        particlePositionData[4 * i + j] = 10.5 * (2 * Math.random() - 1) // + 100
        if (j == 1) {
          particlePositionData[4 * i + j] = 0
        }
        particleColorData[4 * i + j] = color[j]
        particleRotationData[4 *i + j] = Math.random() - 0.5
        particleVelocityData[4 * i + j] = 0
        particleAngularVelocityData[4 * i + j] = Math.random() - 0.5
      }
      const q = particleRotationData.subarray(4 * i, 4 * (i + 1))
      quat.normalize(q, q)
    }

    // particlePositionData[0] = particlePositionData[1] = particlePositionData[2] = 0.01

    // particlePositionData[4] = 0.05
    // particlePositionData[5] = -0.01
    // particlePositionData[6] = -0.05
  }
  particlePositionBuffer.unmap()
  particleRotationBuffer.unmap()
  particleColorBuffer.unmap()
  particleVelocityBuffer.unmap()
  particleAngularVelocityBuffer.unmap()
  particlePositionPredictionBuffer.unmap()
  particlePositionCorrectionBuffer.unmap()
  particleRotationPredictionBuffer.unmap()
  particleRotationCorrectionBuffer.unmap()

  const [ clearGridBindGroup, clearContactBindGroup, clearContactListBindGroup ] =
    [particleGridCountBuffer, particleContactCountBuffer, contactListBuffer].map((buffer) => 
      device.createBindGroup({
        layout: clearBufferPipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: {
            buffer
          }
        }]
      }))

  const gridCountBindGroup = device.createBindGroup({
    layout: gridCountPipeline.getBindGroupLayout(0),
    entries: [{
      binding: 0,
      resource: {
        buffer: particlePositionBuffer
      }
    }, {
      binding: 1,
      resource: {
        buffer: particleGridCountBuffer
      }
    }]
  })

  const gridCopyBindGroup = device.createBindGroup({
    layout: gridCopyParticlePipeline.getBindGroupLayout(0),
    entries: [{
      binding: 0,
      resource: {
        buffer: particlePositionBuffer
      }
    }, {
      binding: 1,
      resource: {
        buffer: particleGridCountBuffer
      }
    }, {
      binding: 2,
      resource: {
        buffer: particleGridIdBuffer
      }
    }]
  })

  const contactCountBindGroup = device.createBindGroup({
    layout: contactCountPipeline.getBindGroupLayout(0),
    entries: [
      particlePositionBuffer,
      particleGridCountBuffer,
      particleGridIdBuffer,
      particleContactCountBuffer
    ].map((buffer, binding) => {
      return {
        binding,
        resource: {
          buffer
        }
      }
    })
  })

  const contactListBindGroup = device.createBindGroup({
    layout: contactListPipeline.getBindGroupLayout(0),
    entries: [
      particlePositionBuffer,
      particleGridCountBuffer,
      particleGridIdBuffer,
      particleContactCountBuffer,
      contactListBuffer
    ].map((buffer, binding) => {
      return {
        binding,
        resource: {
          buffer
        }
      }
    })
  })

  const gridCountScan = new WebGPUScan({
    device,
    threadsPerGroup: SCAN_THREADS,
    itemsPerThread: SCAN_ITEMS,
    dataType: 'u32',
    dataSize: 4,
    dataFunc: 'A + B',
    dataUnit: '0u'
  })

  const gridCountScanPass = await gridCountScan.createPass(COLLISION_TABLE_SIZE, particleGridCountBuffer)
  const contactCountScanPass = await gridCountScan.createPass(COLLISION_TABLE_SIZE, particleContactCountBuffer)

  const spriteQuadUV = device.createBuffer({
    size: 2 * 4 * 4,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  })
  new Float32Array(spriteQuadUV.getMappedRange()).set([
    -1, -1,
    -1, 1,
    1, -1,
    1, 1,
  ])
  spriteQuadUV.unmap()

  const renderUniformBindGroupLayout = device.createBindGroupLayout({
    label: 'renderUniformBindGroupLayout',
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX,
      buffer: {
        type: 'uniform',
        hasDynamicOffset: false,
      }
    }]
  } as const)

  const renderParticleBindGroupLayout = device.createBindGroupLayout({
    label: 'renderParticleBindGroupLayout',
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
        hasDynamicOffset: false,
      }
    },
    {
      binding: 1,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
        hasDynamicOffset: false,
      }
    },
    {
      binding: 2,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
        hasDynamicOffset: false,
      }
    }
    ]
  } as const)

  const debugContactsBindGroupLayout = device.createBindGroupLayout({
    label: 'renderContactsBindGroupLayout',
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
        hasDynamicOffset: false,
      }
    },
    {
      binding: 1,
      visibility: GPUShaderStage.VERTEX,
      buffer: {
        type: 'read-only-storage',
        hasDynamicOffset: false,
      }
    }]
  } as const)

  const renderUniformData = new Float32Array(1024)
  let uniformPtr = 0
  function nextUniform (size:number) {
    const result = renderUniformData.subarray(uniformPtr, uniformPtr + size)
    uniformPtr += size
    return result
  }

  const view = nextUniform(16)
  const projection = nextUniform(16)
  const projectionInv = nextUniform(16)
  const fog = nextUniform(4)
  const lightDir = nextUniform(4)
  const eye = nextUniform(4)

  const renderUniformBuffer = device.createBuffer({
    size: renderUniformData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const renderParticlePipeline = device.createRenderPipeline({
    label: 'renderParticlePipeline',
    layout: device.createPipelineLayout({
      label: 'renderLayout',
      bindGroupLayouts: [
        renderUniformBindGroupLayout,
        renderParticleBindGroupLayout
      ]
    }),
    vertex: {
      module: renderShader,
      entryPoint: 'vertMain',
      buffers: [{
        arrayStride: 2 * 4,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x2',
        }]
      }]
    },
    fragment: {
      module: renderShader,
      entryPoint: 'fragMain',
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: 'triangle-strip',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus'
    }
  } as const)

  const renderBackgroundPipeline = device.createRenderPipeline({
    label: 'renderBackgroundPipeline',
    layout: device.createPipelineLayout({
      label: 'renderBackgroundPipelineLayout',
      bindGroupLayouts: [
        renderUniformBindGroupLayout,
      ]
    }),
    vertex: {
      module: backroundShader,
      entryPoint: 'vertMain',
    },
    fragment: {
      module: backroundShader,
      entryPoint: 'fragMain',
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: 'triangle-strip',
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: 'always',
      format: 'depth24plus'
    }
  } as const)

  const renderContactPipeline = device.createRenderPipeline({
    label: 'renderContactPipeline',
    layout: device.createPipelineLayout({
      label: 'renderContactPipelineLayout',
      bindGroupLayouts: [
        renderUniformBindGroupLayout,
        debugContactsBindGroupLayout
      ]
    }),
    vertex: {
      module: debugContactShader,
      entryPoint: 'vertMain',
    },
    fragment: {
      module: debugContactShader,
      entryPoint: 'fragMain',
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: 'line-list',
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: 'always',
      format: 'depth24plus'
    }
  } as const)

  const predictPipeline = device.createComputePipeline({
    label: 'particlePredictPipeline',
    layout: 'auto',
    compute: {
      module: particlePredictShader,
      entryPoint: 'predictPositions'
    }
  })

  const updatePipeline = device.createComputePipeline({
    label: 'particleUpdatePipeline',
    layout: 'auto',
    compute: {
      module: particleUpdateShader,
      entryPoint: 'updatePositions'
    }
  })

  const predictBindGroup = device.createBindGroup({
    label: 'predictBindGroup',
    layout: predictPipeline.getBindGroupLayout(0),
    entries: [
      particlePositionBuffer,
      particleVelocityBuffer,
      particlePositionPredictionBuffer,
      particlePositionCorrectionBuffer,
      particleRotationBuffer,
      particleAngularVelocityBuffer,
      particleRotationPredictionBuffer,
      particleRotationCorrectionBuffer
    ].map((buffer, binding) => {
      return {
        binding,
        resource: { buffer }
      }
    })
  } as const)

  const updateBindGroup = device.createBindGroup({
    label: 'updatePositionBindGroup',
    layout: updatePipeline.getBindGroupLayout(0),
    entries: [
      particlePositionBuffer,
      particleVelocityBuffer,
      particlePositionPredictionBuffer,
      particlePositionCorrectionBuffer,
      particleRotationBuffer,
      particleAngularVelocityBuffer,
      particleRotationPredictionBuffer,
      particleRotationCorrectionBuffer
    ].map((buffer, binding) => {
      return {
        binding,
        resource: { buffer }
      }
    })
  } as const)

  const solveTerrainPositionBindGroup = device.createBindGroup({
    label: 'solveTerrainPositionBindGroup',
    layout: solveTerrainPositionPipeline.getBindGroupLayout(0),
    entries: [
      particlePositionPredictionBuffer,
      particleRotationPredictionBuffer
    ].map((buffer, binding) => {
      return {
        binding,
        resource: { buffer }
      }
    })
  })

  const renderUniformBindGroup = device.createBindGroup({
    label: 'uniformBindGroup',
    layout: renderUniformBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: renderUniformBuffer,
        }
      }
    ]
  })

  const renderParticleBindGroup = device.createBindGroup({
    label: 'renderParticleBindGroup',
    layout: renderParticleBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: particlePositionBuffer
        }
      },
      {
        binding: 1,
        resource: {
          buffer: particleRotationBuffer
        }
      },
      {
        binding: 2,
        resource: {
          buffer: particleColorBuffer
        }
      }
    ]
  })

  const renderContactBindGroup = device.createBindGroup({
    label: 'renderContactBindGroup',
    layout: debugContactsBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: particlePositionBuffer
        }
      },
      {
        binding: 1,
        resource: {
          buffer: contactListBuffer
        }
      }
    ]
  })
  
    
  function frame (tick:number) {
    mat4.perspective(projection, Math.PI / 4, canvas.width / canvas.height, 0.01, 50)
    mat4.invert(projectionInv, projection)
    // const theta = 0.0001 * tick
    const theta = 0
    vec4.set(eye, 8  * Math.cos(theta), 3, 8 * Math.sin(theta), 0)
    mat4.lookAt(view, eye, [0, -0.5, 0], [0, 1, 0])
    vec4.copy(fog, PALETTE[0] as vec4)
    vec4.set(lightDir, -1, -1, -0.2, 0)
    vec4.normalize(lightDir, lightDir)
    device.queue.writeBuffer(renderUniformBuffer, 0, renderUniformData.buffer, 0, renderUniformData.byteLength)

    const commandEncoder = device.createCommandEncoder()

    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: 'load',
          storeOp: 'store',
        }
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthLoadOp: 'load',
        depthStoreOp: 'store'
      }
    } as const,)

    passEncoder.setBindGroup(0, renderUniformBindGroup)
    passEncoder.setBindGroup(1, renderParticleBindGroup)
    passEncoder.setVertexBuffer(0, spriteQuadUV)
    
    passEncoder.setPipeline(renderBackgroundPipeline)
    passEncoder.draw(4)
    
    passEncoder.setPipeline(renderParticlePipeline);
    passEncoder.draw(4, NUM_PARTICLES)

    passEncoder.setBindGroup(1, renderContactBindGroup)
    passEncoder.setPipeline(renderContactPipeline)
    passEncoder.draw(2 * CONTACT_TABLE_SIZE)

    passEncoder.end()

    const computePass = commandEncoder.beginComputePass()

    // do collision detection
    const NGROUPS = NUM_PARTICLES / PARTICLE_WORKGROUP_SIZE

    // initialize buffers
    computePass.setPipeline(clearBufferPipeline)
    computePass.setBindGroup(0, clearGridBindGroup)
    computePass.dispatchWorkgroups(NGROUPS)
    computePass.setBindGroup(0, clearContactBindGroup)
    computePass.dispatchWorkgroups(NGROUPS)
    computePass.setBindGroup(0, clearContactListBindGroup)
    computePass.dispatchWorkgroups(CONTACT_TABLE_SIZE / PARTICLE_WORKGROUP_SIZE)

    // bin particles
    computePass.setBindGroup(0, gridCountBindGroup)
    computePass.setPipeline(gridCountPipeline)
    computePass.dispatchWorkgroups(NGROUPS)
    gridCountScanPass.run(computePass)
    computePass.setBindGroup(0, gridCopyBindGroup)
    computePass.setPipeline(gridCopyParticlePipeline)
    computePass.dispatchWorkgroups(NGROUPS)

    // find contacts (uses sphere-sphere check only)
    computePass.setBindGroup(0, contactCountBindGroup)
    computePass.setPipeline(contactCountPipeline)
    computePass.dispatchWorkgroups(NGROUPS)
    contactCountScanPass.run(computePass)
    computePass.setBindGroup(0, contactListBindGroup)
    computePass.setPipeline(contactListPipeline)
    computePass.dispatchWorkgroups(NGROUPS)

    for (let i = 0; i < SUBSTEPS; ++i) {
      // predict positions
      computePass.setBindGroup(0, predictBindGroup)
      computePass.setPipeline(predictPipeline)
      computePass.dispatchWorkgroups(NGROUPS)

      // solve terrain contacts
      computePass.setBindGroup(0, solveTerrainPositionBindGroup)
      computePass.setPipeline(solveTerrainPositionPipeline)
      computePass.dispatchWorkgroups(NGROUPS)

      // todo: solve contact position constraints

      // update velocity
      computePass.setBindGroup(0, updateBindGroup)
      computePass.setPipeline(updatePipeline)
      computePass.dispatchWorkgroups(NGROUPS)

      // todo: solve terrain velocity constraints
      // todo: solve contact velocity constraints
    }
    computePass.end()

    device.queue.submit([commandEncoder.finish()])
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

//main().catch(err => console.error(err))

export default main