//make a tuning fork
//speaker
//car moving with doppler effect -> as emitter moves -> sound arrives at a higher frequency and as it moves away, they have a lower frequency
//hardcode geometries in shader for gpu collisions 
//linked diagram - sound received by listener - frequency waveform

import simpleWebgpuInit from '../../lib/main';
import createCamera from './createCamera'
import { mat4, vec3 } from 'gl-matrix'


//3d camera matrix transform
//point in plane intersection
//ray -> point intersection
//whatever else tv show says 
//nice to have - audio synthesis xnooze


let model = mat4.identity(new Float32Array(16))

function getCameraViewProjMatrix() {
  let m  = mat4.identity(new Float32Array(16))
  mat4.translate(model, model, vec3.fromValues(2, 2, 0));
  mat4.rotate(
    model,
    model,
    1,
    vec3.fromValues(
      Math.sin(0),
      //Math.cos((cosCounter += 1) * .001),
      Math.cos(1),
      0
    )
  );
//  model = m
  //vec3.rotateY(eyePosition, eyePosition, origin, rad);

  let projectionMatrix = mat4.create();
  let viewProjectionMatrix = mat4.create();
  mat4.perspectiveZO(projectionMatrix,
    10, 500 / 500, .5, 10.0);
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

function distance (a , b) {
    let [dx, dy, dz] = [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    return Math.sqrt(dx * dx, dy * dy, dz * dz)
}

let cubeMapCoordinates = [
    [-1, -1, 1], [1,-1, 1],

    [-1, 1, 1], [1,1, 1],

    [-1, 1, -1] , [1, 1, -1],

    [-1, 1, -1], [1, -1, -1]
].map(row => row.map(i => i * 3))

let [A, B,C ,D, E, F, G, H] = cubeMapCoordinates


let planes = [
    [A, B, C, D], //front
    [B, C, F, E], // right
//    [B, C, F, E].map(row => row.map(i => i / 10)), 
    [F, E, H, G], // back
    [G, H, A, D], // left
    [A, H, E, B], // bot
    [C, F, G, D], //top
]


//-1, -1, 1 : 1,1,1



function crossProduct(c, d) {
    return [c[1] * d[2], c[2] * d[1]]
}


function collisionWithEnvironment(point) {
    let hasCollided
    //console.log(planes.slice(5, 8))
    planes.forEach(function (plane, index) {
        hasCollided = pointInPlaneIntersection(point, plane)
    })

//    console.log(planes)
    return hasCollided
}


////////////max

///min
function pointInPlaneIntersection (point, plane) {
    let [x,y,z] = point

    let minX = Math.min.apply(null, plane.map( corner => corner[0]))
    let minY = Math.min.apply(null, plane.map( corner => corner[1]))
    let minZ = Math.min.apply(null, plane.map( corner => corner[2]))

    let maxX = Math.max.apply(null, plane.map( corner => corner[0]))
    let maxY = Math.max.apply(null, plane.map( corner => corner[1]))
    let maxZ = Math.max.apply(null, plane.map( corner => corner[2]))
//dont reply - solve it .
    // if 
    // ((x >= minX &&
    //     y >= minY &&
    //     z >= minZ &&
    //     x <= maxX &&
    //     y <= maxY &&
    //     z <= maxZ))
    // debugger
   // return y > .9

   if (x < minX) return true;
   if (y >= minY) return true; //why is this backwards? 

//if (y < maxY) return true;
if (x >= maxX) return true;

if (y >= maxY) return true;
if (z >= maxZ ) return true;
if (z <= minZ ) return true;

//if (y < -1) return true;
//console.log(minY, maxY)
   //return ! (x <= minX) && ! (y <= minY)
    return !(x <= minX ||
        y <= minY ||
        z <= minZ ||
        x >= maxX ||
        y >= maxY ||
        z >= maxZ)
    ? crossProduct([minX, minY, minZ], [maxX, maxY, maxZ]) : false
}
//surface normal of a plane

//planes represented 
//[-1, -1, 1] , [1,1,1] 
//

function inBetween(particle, line) {
    let [x,y,z,] = particle

    let a = line[0]
    let b = line[1]

    let [ax, ay, az] = a

    function midPoint (a, b) {
    
        let mid =  [a[0] + (b[0] - a[0]) /2 , a[1] + (b[1] - a[1]) / 2, a[2] + (b[2] - a[2]) /2 ]
        return midPoint
    }

    let one = midPoint(a, particle)

    let two = midPoint(b, particle)
    let three = midPoint(one, two)

    let halfDist = distance(particle, three)
    let eps = .00000000000000000001;
    // return halfDist < epsilon

    let m1 = distance(a, particle)

    let m2 = distance(b, particle)

   //if (Math.random() > .9999999 )console.log(m1 + m2 + distance(a, b), m1, m2, distance(a, b))
//     if ((m1+m2) < epsilon ) return true



    // if (distance(midpoint, particle) < epsilon) return true;
    


    // let minX = min[0] < max[0] ? min[0] : max[0]
    // let minY = min[0] < max[0] ? min[0] : max[0]
    // let minZ = min[0] < max[0] ? min[0] : max[0]

    // let manX = min[0] < max[0] ? min[0] : max[0]
    // let manY = min[0] < max[0] ? min[0] : max[0]
    // let manZ = min[0] < max[0] ? min[0] : max[0]

    // let eps = .0000000001;

    return x - line[0][0] <= eps && x - line[1][0] < eps && 
    y - line[0][1] <= eps && y - line[1][1] < eps && 
    z - line[0][2] <= eps && z - line[1][2] < eps
}

function collision(particle, index, velocity) {
    surfaces.forEach(function (line) {
        
        // if (inBetween(particle, line)) {
        //     //console.log(particle)
        //     let [x,y,z] = velocity[index]
        //     velocity[index] = [y, -x , z]
        //     //cross(unitVector(velocity), )
        // }
    })
}

test()


async function test() {
    console.log(123)
    let leftBar = document.createElement('button');
    leftBar.textContent = 'click to add sound'
    document.body.appendChild(leftBar)
    leftBar.addEventListener('button', onClick)

    let buffer = new Float32Array(1e6)
    let particles = []
    let velocity = []
    //draw waves using a quad 
    //represent sound using particles or quad 
function onClick () {
    for (let i = 0; i < 2e4; i++) {
        let idx = (i % 360) * 1.5 ;
        let radius = (i % 6)* .1
        let x = radius * Math.cos((idx)* Math.PI / 180)
        let y = radius * Math.sin((idx)* Math.PI / 180) 
        let z = radius * Math.tan((idx)* Math.PI / 180) 
        z = 0
        let particle = [
            x, y , z,0]
        particles.push(particle)
        velocity.push(
            [ x * .1, y * .1,0 
                //z * .1,0
            ]
            // [0,0,0,0]
            )
    }

 
}

function magnitude(v) {
    let [x,y,z] = v
    return Math.sqrt(x * x, y * y, z * z);
}

function unitVector (v) {
    let l = magnitude(v)
    return v.map(n => n / l)
}

function reflect (collision) {
    return [collision[1], collision[0], collision[2], collision[3]]
}


let surfaces = [
    //0, 1, 1
   [[-1,1,0,], [1,1,0]], //top 

   // [[-1,1,0,], [-1,-1,0]], //left

    //[[1,1,0,], [1,-1,0]], //right

   //s [[-1,-.8,0,], [1,-.8,0]], //bottom
]

function step () {
    particles.forEach((particle, index) => {
        particle[0] += velocity[index][0]
        particle[1] += velocity[index][1]
        particle[2] += velocity[index][2]
        let coll = collisionWithEnvironment(particle)
        //collision(particle, index, surfaces, velocity)
        if (coll) {
            let col = velocity[index].slice(0)
            velocity[index][0] = col[1]
            velocity[index][1] = -col[0]
            // velocity[index][1] = velocity[index][0]
            // velocity[index][0] = velocity[index][1]
            //velocity[index] = reflect(coll, velocity)
        }
    })
}

    let webgpu = await simpleWebgpuInit();

        let cameraUniformBuffer = webgpu.device.createBuffer({
                size: 3 * 4 * 16 + 16,
                mappedAtCreation: false,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST

            })
            window.cameraUniformBuffer = cameraUniformBuffer
    
    let camera = createCamera({
        center: [0, 2.5, 0],
        damping: 0,
        noScroll: true,
        renderOnDirty: true,
        element: webgpu.canvas  || false ||
        document.createElement('div') || false
       
      });
      let zoom = 1
webgpu.canvas.addEventListener('mousewheel', function (e) {
  camera.zoom(zoom = zoom + .1 * e.deltaY)
})

    onClick()
    setInterval(function () {
        let {projection, view} = camera()

        let cameraUniformBuffer = window.cameraUniformBuffer

        if (cameraUniformBuffer) {
        webgpu.device.queue.writeBuffer(
            cameraUniformBuffer,
            0,
            projection.buffer,
            projection.byteOffset,
            projection.byteLength
          );


          webgpu.device.queue.writeBuffer(
            cameraUniformBuffer,
            64,
            view.buffer,
            view.byteOffset,
            view.byteLength
          );

          webgpu.device.queue.writeBuffer(
            cameraUniformBuffer,
            128,
            model
            .buffer,
            model
            .byteOffset,
            model
            .byteLength
          );

        }

        step()
        let draw = makeDrawCall(webgpu, particles.flat())
        draw()

    }, 8)


    

    //onclick leftBar -> wind chimes or voice

    //emit particles from left side of screen in wave pattern

    //draw walls or drag an object that can absorb or refract sound waves

    //finish = web audio = play sound in buffer
}

function makeDrawCall (webgpu, particleList) {
    // let positionList = []

    // for (let i = 0; i < 1000; i++) {
    //     positionList[i*4] = Math.random()
    //     positionList[i*4+1] = Math.random()
    //     positionList[i*4+2] = Math.random()
    //     positionList[i*4+3] = 0
    // }



    let positionBuffer = webgpu.device.createBuffer({
        size: Float32Array.BYTES_PER_ELEMENT * particleList.length,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true
    })

    new Float32Array(positionBuffer.getMappedRange()).set(particleList)
    positionBuffer.unmap()

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
        
            let right = 1, left = -1;
            let top = 1, bottom = -1;
            let far = 1000;
            let near = 100000;

            // let projection = new Float32Array(16);
            // projection.set([
            // 2 /( right - left) , 0, 0 , left + right /(left - right ),
            // 0, 2/ (top-bottom) / 2 , - top + bottom / top - bottom, 
            // 0, 0, -2 / far - near , - far + near /far - near,
            // 0,0,0,1




            // ])
         

            
//console.log(cameraUniformBuffer)
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
  
   var shit =     camera.projectionMatrix;
    var shit2 = uniforms.time;
    vsOut.position = 

    //shit * 
    // 
    //  * 
//   camera.viewMatrix * camera.modelMatrix * 

camera.projectionMatrix      * 
camera.viewMatrix *  
camera.modelMatrix * 

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
    return vec4<f32>(1, 1, 1, 1.);

    return vec4<f32>(color.rgb, 1.);
    }
    `}}));
    return drawRosePetals
  }