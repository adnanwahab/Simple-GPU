import simpleWebgpuInit from '../../lib/main';


test()

async function test() {
    console.log(123)
    let leftBar = document.createElement('button');
    leftBar.addEventListener('button', onClick)

    let buffer = new Float32Array(1e6)
    let particles = []
    let velocity = []

    //draw waves using a quad 
    //represent sound using particles or quad 
function onClick () {
    for (let i = 0; i < 1e3; i++) {
        let idx = (i % 180) * Math.PI / 180;
        let radius 
        let particle = [Math.cos(idx),Math.sin(idx),0,0]
        particles.push(particle)
    }

    function reflect (collision) {
        //normal
    }

    function step () {
        particles.forEach((particle, index) => {
            particle[0] += velocity[index][0]
            particle[1] += velocity[index][1]
            particle[2] += velocity[index][2]
            velocity[index][0] *= .99
            velocity[index][1] *= .99
            velocity[index][2] *= .99
            //does sound lose amplitude over time? or does it lower velocity 
            //sound is air compression waves
            let collision = collision(particle, surfaces)
            if (collision) {
                velocity[index] = reflect(collision, velocity)
            }
        })
    }
}

    let webgpu = await simpleWebgpuInit();
    let draw = makeDrawCall(webgpu)
    
    draw()


    

    //onclick leftBar -> wind chimes or voice

    //emit particles from left side of screen in wave pattern

    //draw walls or drag an object that can absorb or refract sound waves

    //finish = web audio = play sound in buffer
}

function makeDrawCall (webgpu) {
    let positionList = []

    for (let i = 0; i < 1000; i++) {
        positionList[i*4] = Math.random()
        positionList[i*4+1] = Math.random()
        positionList[i*4+2] = Math.random()
        positionList[i*4+3] = 0
    }

    let positionBuffer = webgpu.device.createBuffer({
        size: Float32Array.BYTES_PER_ELEMENT * positionList.length,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true
    })

    new Float32Array(positionBuffer.getMappedRange()).set(positionList)
    positionBuffer.unmap()
console.log(positionList)
    let colorList = []

    for (let i = 0; i < 1000; i++) {
        colorList[i*3] = Math.random()
        colorList[i*3+1] = Math.random()
        colorList[i*3+2] = Math.random()
    }

    let colorBuffer = webgpu.device.createBuffer({
        size: Float32Array.BYTES_PER_ELEMENT * colorList.length,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true
    })

    new Float32Array(colorBuffer.getMappedRange()).set(colorList)

    colorBuffer.unmap()


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
              format: "float32x4",
          }
      ],
      arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
      stepMode: "instance",
  },

  ]
      
    let drawDescriptor = {
        attributeBuffers: buffers,
        attributeBufferData: [
         //shapes[0]
         positionBuffer
          //makeBuffer(gridBuffer, 0, 'cube'),
          //makeBuffer(makeCube(), 0, 'cube')
          , quadBuffer , colorBuffer
        ],
        count: 6,
        instances: 1000 / 4,
        bindGroup: function ({pipeline}) {
      
            let uniformsBuffer = webgpu.device.createBuffer({
                size: 48,
                mappedAtCreation: false,
                usage: GPUBufferUsage.UNIFORM
            })
            let cameraUniformBuffer = webgpu.device.createBuffer({
                size: 192,
                mappedAtCreation: false,
                usage: GPUBufferUsage.UNIFORM

            })

        let desc = {
          label: Math.random(),
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
                },
            ]
        }
          return webgpu.device.createBindGroup(desc);
        }
      }
    
    const drawRosePetals =  webgpu.initDrawCall(Object.assign(drawDescriptor , { shader:{
      vertEntryPoint: 'main_vertex',
      fragEntryPoint: 'main_fragment',
      code:`
    struct Uniforms {
      time: f32,             //             align(16)  size(24)
    color: vec3<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
    };
    
    struct Camera {
    projectionMatrix : mat4x4<f32>,
    viewMatrix : mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    }
    
    struct VSOut {
    @builtin(position) position: vec4<f32>,
    @location(0) localPosition: vec2<f32>, // in {-1, +1}^2,
    @location(1) color: vec3<f32>,
    @location(2) globalPosition: vec2<f32>, // in {-1, +1}^2,
  
    };
    
    @group(0) @binding(0) var<uniform> uniforms: Uniforms;
    @group(0) @binding(1) var<uniform> camera : Camera;

    
    @vertex
    fn main_vertex(@location(0) inPosition: vec4<f32>, @location(1) quadCorner: vec2<f32>,
 @location(2) color: vec3<f32>,
    ) -> VSOut {
    var vsOut: VSOut;  
  
    var shit =     camera.projectionMatrix
     * camera.viewMatrix *  camera.modelMatrix;
    var shit2 = uniforms.time;
    vsOut.position = 

    
     vec4<f32>(inPosition.xy + (.01) * quadCorner, inPosition.z, 1.);
    
    vsOut.localPosition = quadCorner;
    vsOut.globalPosition = inPosition.xy;
  
    
    vsOut.color = color;
    return vsOut;
    }
  
  
  
    const size = 4.0;
  
    const b = 0.3;//size of the smoothed border
  
  fn smoothStep(edge0:f32, edge1:f32, x:f32) -> f32 {
  if (x < edge0) {return 0.;}
  
  if (x >= edge1) {return 1.;}
  
  let c = (x - edge0) / (edge1 - edge0);
  
  return c * c * (3 - 2 * c);
  }
  
    fn mainImage(globalPosition: vec2<f32>, iResolution: vec2<f32>
      ) -> vec4<f32> {
      let aspect = iResolution.x/iResolution.y;
      let position = (globalPosition.xy) * aspect;
      let dist = distance(position, vec2<f32>(aspect*0.5, 0.5));
    //   let offset=(uniforms.time) * 0.001;
    //   let shit = uniforms.time;
    let offset = 0.;
      let conv=4.;
      let v=dist*4.-offset;
      let ringr=floor(v);
      
      var stuff = 0.;
      if (v % 3. > .5) {
        stuff = 0.;
      }
  
  var color=smoothStep(-b, b, abs(dist- (ringr+stuff+offset)/conv));
      if (ringr % 2. ==1.) {
       color=2.-color;
      }
  
    let distToMouseX = distance(1., globalPosition.x);
    let distToMouseY = distance(2., globalPosition.y);
  
    return vec4<f32>(
      color, 
      color, 
      color, 
     1.,
      );
  };
  
  fn main(uv: vec2<f32>) -> vec4<f32> {
    let fragCoord = vec2<f32>(uv.x, uv.y);
    let time = 0.;
    var base = vec4<f32>(cos(time * .1), .5, sin(time * 0.000001), 1.);
    //let dist = distance( fragCoord, vec2<f32>(u.mouseX,  u.mouseY));
    return mainImage(fragCoord, vec2<f32>(1000., 1000.));
  }
  
    @fragment
    fn main_fragment(@location(0) localPosition: vec2<f32>, @location(1) color:vec3<f32>,  @location(2) globalPosition:vec2<f32>) -> @location(0) vec4<f32> {
    let distanceFromCenter: f32 = length(localPosition);
    if (distanceFromCenter > 1.0) {
        discard;
    }
    var viewDir = vec3<f32>(0,0,0);
    var lightSpecularColor = vec3<f32>(0., 0., 1.);
    var lightSpecularPower = 1.;
    var lightPosition = vec3<f32>(-1,0., 0);
    
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
    intensity = pow(saturate(NdotH), .1);
    
    //Sum up the specular light factoring
    let col = vec4<f32>(intensity * lightSpecularColor * lightSpecularPower / distance, .1);
//    let m = textureSample(myTexture, mySampler, localPosition);
    //sin(camera.time)
    //
  
    var c = mainImage(localPosition, vec2<f32>(1000., 1000.));
    //color.rgb +
    return vec4<f32>(1,1,1, 1.);
    }
    `}}));
    return drawRosePetals
  }