import simpleWebgpuInit from '../lib/main';
import { mat4, vec3 } from 'gl-matrix'

const IncompressionShader = `  struct Velocity {
  velocity: vec4<f32>,
}
struct Particle {
    position: vec4<f32>,
};

struct PositionBuffer {
    particles: array<Particle>,
};

struct VelocityBuffer {
  velocities: array<Velocity>,
};

struct Attractor {                                
  position: vec2<f32>,                           
  force: f32,                                    
  // -- implicit padding --                     
};

struct Uniforms {                                  
  force: vec2<f32>,                              
  dt: f32,                                       
  bounce: u32,                                   
  friction: f32,                                 
  aspectRatio: f32,                              
  w: f32,
  h: f32,
};

const ABS_WALL_POS = vec3<f32>(1.,1.,1.);
const GRID_CELL_SIZE = vec3<f32>(5.,5.,5.);
const GRID_RES = 500;




const effectRadius = 0.3f;
const restDensity = 450.0f;
const relaxCFM = 600.0f;
const timeStep = 0.010f;
const dim = 3;
const isArtPressureEnabled = 1;
const artPressureRadius = 0.006f;
const artPressureCoeff = 0.001f;
const artPressureExp = 4;
const isVorticityConfEnabled = 1;
const vorticityConfCoeff = 0.0004f;
const xsphViscosityCoeff = 0.0001f;

const POLY6_COEFF = 1.;
const SPIKY_COEFF = 1.;
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


fn getCell3DIndexFromPos(pos:vec4<f32>) -> vec3<i32> {
  // Moving particles in [0 - 2 * ABS_WALL_POS] to have coords matching with cellIndices
  let posXYZ = clamp(pos.xyz, -ABS_WALL_POS, ABS_WALL_POS) + (ABS_WALL_POS);

  let cell3DIndex = (floor(posXYZ / GRID_CELL_SIZE));

  return vec3<i32>(i32(cell3DIndex.x), i32(cell3DIndex.y), i32(cell3DIndex.z));
}

fn getCell1DIndexFromPos(pos:vec4<f32>) -> i32 {
  var cell3DIndex = getCell3DIndexFromPos(pos);

  var cell1DIndex = cell3DIndex.x * GRID_RES * GRID_RES
                         + cell3DIndex.y * GRID_RES
                         + cell3DIndex.z;

  return cell1DIndex;
}

var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;

@group(0) @binding(0) var<storage,read_write> particlesStorage: array<vec4<f32>>;
@group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
@group(0) @binding(2) var<storage,read_write> vorticity: array<vec4<f32>>;
@group(0) @binding(3) var<storage,read_write> predPos: array<vec4<f32>>;
@group(0) @binding(4) var<storage,read_write> densityStorage: array<f32>;


@group(0) @binding(5) var<uniform> uniforms: Uniforms;

fn ID(x : f32, y : f32) -> u32 { return u32(x + y * uniforms.w); }

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
  let index: u32 = GlobalInvocationID.x;

  var pos = particlesStorage[index];
  var velocity = velocityStorage[index];
  var vort = vorticity[index];
  var density = densityStorage[index];
  var aspectRatioStuff = uniforms.aspectRatio;

  var startEndCell = vec2<u32>(GlobalInvocationID.x,GlobalInvocationID.y);

  var fluidDensity = 0.0;
  var startEndN = 0;

//for each particle
//integrate particle data with each neighboring cell
//loop from 


  for (var iX = -1; iX <= 1; iX++)
  {
    for (var iY = -1; iY <= 1; iY++)
    {
      for (var iZ = -1; iZ <= 1; iZ++)
      {
        var cellNIndex3D = getCell3DIndexFromPos(pos);

        cellNIndex3D = (cellNIndex3D) + vec3<i32>(iX, iY, iZ);

        // Removing out of range cells
        if(cellNIndex3D.x < 0 ||
          cellNIndex3D.y < 0 ||
          cellNIndex3D.z < 0 ||
        cellNIndex3D.x >= (GRID_RES) ||
        cellNIndex3D.y >= (GRID_RES) ||
        cellNIndex3D.z >= (GRID_RES)   
        ) {
          continue;
        }

        let cellNIndex1D = (cellNIndex3D.x * GRID_RES + cellNIndex3D.y) * GRID_RES + cellNIndex3D.z;

       // startEndN = i32(startEndCell[cellNIndex1D]);

        //for (var e = startEndN.x; e <= startEndN.y; e++) {
          fluidDensity += poly6(pos - predPos[cellNIndex1D], effectRadius);
        //}
      }
    }
  }
  densityStorage[index] = fluidDensity;
}`;

//predict position
//compute density
//compute constraint factor
//compute constraint correction
//correct the position
//compute vorticity - twist
//apply vorticity confinement
//apply XsphViscosityCorrection
//apply bounding walls
//update position


const computeCode = `  struct Velocity {
  velocity: vec4<f32>,
}
struct Particle {
    position: vec4<f32>,
};

struct PositionBuffer {
    particles: array<Particle>,
};

struct VelocityBuffer {
  velocities: array<Velocity>,
};

struct Attractor {                                
  position: vec2<f32>,                           
  force: f32,                                    
  // -- implicit padding --                     
};

struct Uniforms {                                  
  force: vec2<f32>,                              
  dt: f32,                                       
  bounce: u32,                                   
  friction: f32,                                 
  aspectRatio: f32,                              
  w: f32,
  h: f32,
};

var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;


@group(0) @binding(0) var<storage,read_write> particlesStorage: array<vec4<f32>>;
@group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
@group(0) @binding(2) var<storage,read_write> vorticity: array<vec4<f32>>;
@group(0) @binding(3) var<storage,read_write> prediction: array<vec4<f32>>;
@group(0) @binding(4) var<storage,read_write> densityStorage: array<vec4<f32>>;


@group(0) @binding(5) var<uniform> uniforms: Uniforms;

fn ID(x : f32, y : f32) -> u32 { return u32(x + y * uniforms.w); }


@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
  let index: u32 = GlobalInvocationID.x;

  var particle = particlesStorage[index];
  var velocity = velocityStorage[index];
  var vort = vorticity[index];
  var predPos = prediction[index];
  var density = densityStorage[index];


  var aspectRatioStuff = uniforms.aspectRatio;

  if (particle.y < -.9) { velocity.y = .01;}
  else {
    velocity.y += -.0001;
  }
  particle.y = particle.y + velocity.y;

  //prediction[index] = particle + vec4<f32>(0, -.01, 0, 0);
  for (var ix = -1; ix <= 1; ix+=1) {
    for (var iy = -1; iy <= 1; iy+=1) {
      //for (var iz = -1; iz <= 1; iz+=1) {
        // var cellNIndex3D = convert_int3(cellIndex3D) + (int3)(iX, iY, iZ);
        // var cellIndex = ID(particle.x, particle.y);

      //}
    }
  }

  particlesStorage[index] = particle;
  velocityStorage[index] = velocity;

}`;


//faux lighting
//collision detectiony
//3d camera 

// //take a cube and modulate vertices to audio
// //take a cube fill it with particles and then modulate with water physics

let webgpu = await simpleWebgpuInit()
const cameraUniformBuffer = webgpu.device.createBuffer({
  size: 4 * 16, // 4x4 matrix
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const particlesCount = 1e5
const particleSize = 16

const computeUniformsBuffer = webgpu.device.createBuffer({
  size: 96,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});

function makeBuffer (size=particlesCount, flag=1) {
  const gpuBufferSize = particlesCount * particleSize;

  const gpuBuffer = webgpu.device.createBuffer({
    size: gpuBufferSize,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
    mappedAtCreation: true,
  });
  
  const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
  for (let iParticle = 0; iParticle < particlesCount; iParticle++) {
      particlesBuffer[4 * iParticle + 0] = flag && (Math.random() * 2 - 1);
      particlesBuffer[4 * iParticle + 1] = flag &&(Math.random() * 2 - 1);
      particlesBuffer[4 * iParticle + 2] = 0
      particlesBuffer[4 * iParticle + 3] = 1
  }
  
  gpuBuffer.unmap();
  return gpuBuffer
} 


const posBuffer = makeBuffer()
const velocityBuffer = makeBuffer(particlesCount, 0)
const vorticityBuffer = makeBuffer()
const predictionBuffer = makeBuffer()
const densityBuffer = makeBuffer(1e3)


function makeCompute(code=computeCode) {
  const compute = webgpu.initComputeCall({
//    canvasSize: innerWidth,
    code,
  exec: function (state){
    const device =  state.device
    const commandEncoder = state.ctx.commandEncoder = state.ctx.commandEncoder || device.createCommandEncoder();
  
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
    computePass.dispatchWorkgroups(1000);
    computePass.end();
  } ,
    bindGroups: function (state, computePipeline) {
      const computeBindgroup = webgpu.device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: posBuffer
                }
            },
            {
              binding: 1,
              resource: {
                buffer: velocityBuffer
              }
            },
            {
              binding: 2,
              resource: {
                buffer: vorticityBuffer
              }
            },
            {
              binding: 3,
              resource: {
                buffer: predictionBuffer
              }
            },
            {
              binding: 4,
              resource: {
                buffer: densityBuffer
              }
            },
            {
                binding: 5,
                resource: {
                    buffer: computeUniformsBuffer
                }
            },
    
        ]
    });
  
    return [computeBindgroup]
    }
  })
  return compute
}


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


const makeIncompressible = makeCompute(IncompressionShader)

const compute = makeCompute()

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
  }
]


const device = webgpu.device
const aspect = 1


function getCameraViewProjMatrix() {
  const eyePosition = vec3.fromValues(.0, 0.0, -1.5);
  const upVector = vec3.fromValues(0, 1, 0);
  const origin = vec3.fromValues(0, 0, 0);
  const rad = Math.PI * (Date.now() / 5);
  //mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, -5, 0));

  //vec3.rotateY(eyePosition, eyePosition, origin, rad);

  let projectionMatrix = mat4.create();
  let viewProjectionMatrix = mat4.create();
  mat4.perspectiveZO(projectionMatrix,
    1, 500 / 500, .1, 50.0);
  mat4.translate(viewProjectionMatrix, viewProjectionMatrix, eyePosition);
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);

  // Write the render parameters to the uniform buffer.
  let renderParamsHost = new ArrayBuffer(4 * 4 * 4);
  let viewProjectionMatrixHost = new Float32Array(renderParamsHost);
  viewProjectionMatrixHost.set(viewProjectionMatrix);
  return viewProjectionMatrixHost
}


async function basic () {
  const cameraViewProj = getCameraViewProjMatrix();
  device.queue.writeBuffer(
    cameraUniformBuffer,
    0,
    cameraViewProj.buffer,
    cameraViewProj.byteOffset,
    cameraViewProj.byteLength
  );

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
  viewProjectionMatrix : mat4x4<f32>,
}

struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var<uniform> camera : Camera;


@vertex
fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.position =  //vec4<f32>(inPosition.xy + (.03 + uniforms.spriteSize) * quadCorner, 0.0, 1.0);
    
    camera.viewProjectionMatrix *      
   vec4<f32>(inPosition.xy + (.005 + uniforms.spriteSize) * quadCorner, 0., 1.);
    vsOut.position.y = vsOut.position.y;
    vsOut.localPosition = quadCorner;
    return vsOut;
}

@fragment
fn main_fragment(@location(0) localPosition: vec2<f32>) -> @location(0) vec4<f32> {
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

    return  col + vec4<f32>(distanceFromCenter - 1.5, 0,1.,1.);
}
`},
  attributeBuffers: buffers,
  attributeBufferData: [
    posBuffer, quadBuffer,
  ],
  count: 6,
  blend,
  instances: particlesCount ,
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

setInterval(
  function () {
    makeIncompressible()
    compute()
    drawCube({})
  }, 50
)
  
}

export default basic


// camera technique https://github.com/jrprice/NBody-WebGPU/blob/main/src/shaders.wgsl


//make a buffer of 1 million particles (position + velocity )
//Grid - make a buffer of 250,000 "grid" = record velocity, density or ID's of particles
//for each particle - write the location into grid




//constraint solver = update prediction 

//for each particle, integrate velocity of nearest neighbors 


//https://www.youtube.com/watch?v=MhzFbCqoTxw

///https://github.com/regl-project/regl-camera/blob/master/regl-camera.js