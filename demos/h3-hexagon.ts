 function mustHave<T>(x:T|null|undefined) : T {
  if (!x) {
    document.body.innerHTML = `Your browser does not support WebGPU`	
    throw new Error('WebGPU not supported')
  }
  return x
}
mustHave(navigator.gpu)

 function makeCanvas () {
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, {
    width: '500px',
    height: '500px',
    position: 'absolute',
    left: '0',
    top: '0',
    margin: '0',
    padding: '0'
  })
  canvas.width = window.innerWidth * window.devicePixelRatio
  canvas.height = window.innerHeight * window.devicePixelRatio
  document.body.appendChild(canvas)
  return canvas
}
async function main () {
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

  const shaderModule = device.createShaderModule({
    code: `
@fragment
fn fragMain() -> @location(0) vec4<f32> {
    return vec4(1.0, 0.0, 0.0, 1.0);
}
struct VertexOutput {
  @builtin(position) clipPosition : vec4<f32>,
  //@location(0) fragColor : vec3<f32>,
}

@vertex
fn vertMain(
    @builtin(vertex_index) VertexIndex : u32,   @location(0) position : vec4<f32>,

) -> VertexOutput {
  var result : VertexOutput;
  result.clipPosition = position;
  return result;
}`
  })

  const icoFaces = device.createBuffer({
    size: 3 * 20 * 2,
    usage: GPUBufferUsage.INDEX,
    mappedAtCreation: true
  })
  new Uint16Array(icoFaces.getMappedRange()).set([
    5, 2, 3,  6, 0,  1,  8, 2, 5,  9,  0, 6,
    9, 6, 7,  9, 2,  8, 10, 1, 4, 10,  4, 5,
    11, 3, 7, 11, 1, 10,  4, 1, 0,  7,  3, 2,
    8, 4, 0,  8, 5,  4,  9, 7, 2,  9,  8, 0,
    10, 5, 3, 11, 6,  1, 11, 7, 6, 11, 10, 3
  ])
  icoFaces.unmap()
  //databind hexagons to color
  //set color in shader to complaint texture

  //databind textures to hexagons & use shader to change color according to uniform weights

  //use one texture for each complaint type 

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vertMain',
      buffers: [
        {
          arrayStride: 2 * 4,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: 'float32x2',
            },
              {
                shaderLocation: 1,
                offset: 0,
                format: 'float32x2',
              },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fragMain',
      targets: [
        {
            format: presentationFormat,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
    frontFace: 'ccw',
    cullMode: 'none'
  })

  const cubeVertexArray = new Float32Array(1e6)
  const center = {x:0, y: 0}

  var x = -1; //x coordinate for the center of the hexagon
  var y = -1; //y coordinate for the center of the hexagon
  var r = .09; //radius of the circle upon which the vertices of the hexagon lie.
  var xCoord = new Array(3 * 6);
  var yCoord = new Array(3 * 6);

  const DEG2RAD = Math.PI / 180;

  function makeHexagon2(x, y, r, i, j=0) { 
    let deg1 = (i / 3)  * 60
    let deg2 = (i / 3 + 1) * 60
    xCoord.push(x)
    yCoord.push(y)
    xCoord.push(x + r * Math.cos(deg1 * DEG2RAD))
    yCoord.push(y + r * Math.sin(deg1 * DEG2RAD))
    xCoord.push(x + r * Math.cos(deg2  * DEG2RAD))
    yCoord.push(y + r * Math.sin(deg2 * DEG2RAD))
  }  
   const vert = Math.sqrt(3) * .11
  //horiz = 3/4 * width = 3/2 * size
  //vert = height = sqrt(3) * size

  function makeRow(k) {
    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < 18; i +=3) {
        makeHexagon2(x + (3/2 * .2) * j, y + vert * k, r, i, 18 * (j + k))
        makeHexagon2(x + (3/2 * .2) * j + .15, y + vert * k + .1, r, i, 18 * (j + k))
      }
    }
  }
  for (var m = 0; m < 11; m++)
    makeRow(m)
  
  var vertices = [xCoord[0],yCoord[0]];// Initialize Array
  
    for ( var i = 1; i < xCoord.length; ++i ) {
      vertices.push(xCoord[i]);
      vertices.push(yCoord[i]);
      console.log("Coordinate " + i + ": " + xCoord[i] + "," + yCoord[i]);
    }
    cubeVertexArray.set(
      vertices 
    )

  const verticesBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });
  new Float32Array(verticesBuffer.getMappedRange()).set(cubeVertexArray);
  verticesBuffer.unmap();

  function frame () {
    const commandEncoder = device.createCommandEncoder()
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: 'clear',
          storeOp: 'store',
        } as const,
      ],
    })
    passEncoder.setPipeline(pipeline)
    passEncoder.setVertexBuffer(0, verticesBuffer);

    passEncoder.draw(1e4)
    passEncoder.end()
    device.queue.submit([commandEncoder.finish()])
    requestAnimationFrame(frame)
  }
  frame()
}

export default main