`fn sphereEvaporate(pos: vec4<f32>, index: u32) -> bool {
  
  var idx = f32(index);
  var radius = idx / 256;
   //4 / 3 * pow(idx / 256, 3);
  //circle 
  posBuffer[index] = vec4<f32>(
    
    cos(idx) , idx /2000., 
    
    sin(idx), 1.);

  //if (posBuffer[index].y > .74) {
//    buffer.xz /= 
    posBuffer[index].x *= pow(sin(posBuffer[index].y), .5);
    posBuffer[index].z *= pow(sin(posBuffer[index].y), .5);
 // }

  posBuffer[index].y *= .6;

  return false;
}

// fn makeParticlesFly(idx: u32)  -> bool {
//   var index = f32(idx);
//   var pos = posBuffer[idx];
//   var theta = atan2(pos.y, pos.x);
//   var r = 1 / distance(vec2<f32>(0,0) , pos.xy);
//   direction[idx] = vec3<f32>(r * cos(theta * 2), r * sin(theta * 2), 1);
//   return false;
// }

// fn sphereEvaporate(pos: vec4<f32>, index: u32) -> bool {

//   var idx = f32(index);
//   // var radius = idx / 256;
//   //  //4 / 3 * pow(idx / 256, 3);
//   // //circle 
//   posBuffer[index] = vec4<f32>(
//     cos(idx) - sin(idx / 2000), idx /2000., 
//     sin(idx) - (1-sin(idx / 2000)), 1.);

//     posBuffer[index].x *= pow(sin(posBuffer[index].y), .5);
//     posBuffer[index].z *= pow(sin(posBuffer[index].y), .5);

//     posBuffer[index].y *= .6;

//   // posBuffer[index] = vec4<f32>(.001 * direction[index] +  posBuffer[index].xyz, 1.);
//   // direction[index] = vec3<f32>(.1, 0., 0.);

//   // // if (posBuffer[index].x > .75) {
//   // //   direction[index] = -vec3<f32>(.1, 0., 0.);
//   // // }


//   return false;
// }
`


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



function buildQuadTree(dancer) {
  let tree = {}
  let id = 0

  function pop () {
    return id++
  }

  let calcBounds = function (x,y,z) {
    return z * 1e6 + y * 1e4 + x * 1e2
  }

  let idxToBounds = function (idx) {
    let z = (idx / 1e6).toPrecision(2);
    idx -= z;
    let y = (idx / 1e4).toPrecision(2)
    idx -= y;
    let x = (idx / 1e2).toPrecision(2);
    return [x, y, z]
  }

  let childNodes = function (min, max) {
    let dimensions = [(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2, ]

    return [min + dimensions[0], min + dimensions[1], min + dimensions[2]]
  }

  tree[pop()] = [pop(), pop(), calcBounds(-1, -1, -1), calcBounds(1,1,1)]

  function atMaxCapacity (node) {
    return node[0] < 0 && node[1] < 0;
  }

  function contains(node, point ) {
    let min = idxToBounds(node[2])
    let max = idxToBounds(node[2])

    return point[0] > min[0] &&
    point[1] > min[1] &&
    point[2] > min[2] &&
    point[0] < max[0] &&
    point[1] < max[1] &&
    point[2] < max[2] 
  }

  function addPoint(point) {

    let [x,y,z]= point

    let root = tree[0]

    while (atMaxCapacity(root)) {
      let left = root[0]
      let right = root[1]
      if (contains(left, point)) root = left
      else root = right
    }

    let leaf=  tree[id]
    if (leaf.length < 4)
      tree[id].push(point)
      else {
        tree[id] = [pop(), pop(), min, max]


      }


      //tree root = 4 ids of next leaves and their bounds
    //on collision show sparks
    //record collisions in a buffer 
    //one buffer to hold bounds
    
    //leaf id has min, max bottom left and top right
    //bottom left and top right
    // when a leaf has more than 4 points -> create 4 new leaves and put those points and rebalance


    //add point to bucket
    //split space into 4 
    //top left= -1,-,1,-1 to 0,0,0 0 to 1
    //bottom left = -1
    //add points to leaf
    //if leaf has more than 8 points -> split leaf into more
    //if 


    //buffer = id
    //buffer = holds points or index to next bucket
    //one buffer holds 

    // buffer holds vec4
    //vec4 holds 4 indexes or if a terminal leaf then 



    /// buffer
    ////  | | | | 
    //   / 
    //  /
    // /
    // A
    // / | | \
    // 1 2 3 4 
    // 100,000 points = 25,000 leaves or vec4

  }

  dancer.forEach(addPoint)
}