
function visualizeVectorField () {
let shouldDraw = true
let dpi = devicePixelRatio;
var canvas = document.createElement("canvas");

canvas.width = width * dpi;
canvas.height = height * dpi;
canvas.style.width = 1000 + "px";
canvas.style.height = 2000 + "px";

var context = canvas.getContext("2d");
context.scale(dpi, dpi);
window.drawVF = function (vf, i) {
context.fillRect(0, 0, innerWidth, innerHeight);

  vf.forEach((vec, i) => {
    let x = 50
    context.fillStyle = i % 2 ===1 ? "orange" : "#FFFFFF";//rgb(${vec[0] * 55}, ${vec[1] * 55}
    context.fillStyle = `rgb(${Math.abs(vec[0]) * 50},  ${vec[2] * 55}, ${Math.abs(vec[1]) * 50})`

    context.fillRect(vec.x * innerWidth, vec.y * innerHeight, 10, 10);

  })
}

setTimeout(() => {
  if (! shouldDraw) return
  canvas.style.opacity = .5
  canvas.style.position = 'absolute'
  canvas.style.zIndex = '600'
  canvas.style.pointerEvents = 'none'
  webgpu.canvas.style.position = 'absolute'
  webgpu.canvas.style.zIndex = '500'
  webgpu.canvas.webgpuCompostingMode = 'alpha-blend'
  document.body.insertBefore(canvas, webgpu.canvas)
}, 500);

}

function recur () {
    i = (i + 1) % (shapes.length)
  
    choice = ! choice;
    let swap = drawCube.state.options.attributeBufferData[
      choice ? 0 : 2
    ]
    drawCube.state.options.attributeBufferData[
      choice ? 0 : 2
    ] = shapes[i]
    d3.transition().duration(3 * 1000)
    .ease(d3.easeCubic)
    .attrTween('animation', function () {
      return function (t) {
        if (choice) t = 1.0 - t
        a.forEach((d, i) => a[i] = t)
      }
    }).on('end', recur)
  }
  //recur()


  function makeCube() {
    let result = []
    let width = 100, height = 100
    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        for (var k = 0; k < height; k++) {
          let [x, y, z] = clipSpace(k, j, i, width, height)
          let [x1, y1, z1]  = zeroToOne(x, y, z)
          result.push([x, y, 0, 0])
        }
      }
    }
    return result;
  }
  
  function distanceTo(b, a) {
        
    return [b[0] - a[0], b[1]-a[1], b[2] - a[2]]
  }
  
  
  function getDist(a, b) {
    return [a[0] - b[0], a[1]-b[1], a[2] - b[2], 0].map(d => Math.pow(d , 2)).reduce((a, b) => {
      return a + b
    })
  }
  
  function minus (v1, v2) {
    return [
      v1[0] - v2[0],
      v1[1] - v2[1],
      v1[2] - v2[2],
    ]
  }
  
  function getDist(a, b) {
    return [a[0] - b[0], a[1]-b[1], a[2] - b[2], 0].map(d => Math.pow(d , 2)).reduce((a, b) => {
      return a + b
    })
  }
  function unitVector (v) {
    let l = magnitude(v)
    return v.map(d => d / l);
  }

  
function magnitude (v) {
    let pow = (e) => Math.pow(e, 2)
    return Math.sqrt(pow(v[0]) + pow(v[1]) + pow(v[2]))
  }

  function clamp (val, min, max) {
    return Math.min(Math.max(val, min), max)
  
  }



function add (v1, v2) {
    return [
      v1[0] + v2[0],
      v1[1] + v2[1],
      v1[2] + v2[2],
    ]
  }
  

  function sdHeart( p )
{

  p[0] = Math.abs(p[0]);
  let sqrt = Math.sqrt, min = Math.min;
  if( p[0]+p[1]>1. )
      return sqrt(dot2(sub(p,[0.25,0.75]))) - sqrt(2.0)/4.0;
  return sqrt(min(dot2(sub(p,[0.00,1.00])),
                  dot2(p.map(d => d -0.5*Math.max(p[0]+p[1],0.0))))) * (p[0]-p[1] > 0 ? 1 : -1);
}



function sdHeart( p ){
    p[0] = Math.abs(p[0]);
    let sqrt = Math.sqrt, min = Math.min;
    if( p[0]+p[1]>1. )
        return sqrt(dot2(sub(p,[0.25,0.75]))) - sqrt(2.0)/4.0;
    return sqrt(min(dot2(sub(p,[0.00,1.00])),
                    dot2(p.map(d => d -0.5*Math.max(p[0]+p[1],0.0))))) * (p[0]-p[1] > 0 ? 1 : -1);
  }
  const dot2 = (p) => {
    let _ = dot(p, p)
    return _
  }
  
  function sub (a, b) {
    return [a[0] - b[0], a[1] - b[1]]
    }