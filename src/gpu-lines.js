// //https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-2

// //https://observablehq.com/@kylebarron/geoarrow-and-geoparquet-in-deck-gl


import createREGLLatest from 'https://cdn.skypack.dev/regl@2.1.0?min'
//import reglLines from 'https://unpkg.com/regl-gpu-lines@2.2.0/dist/regl-gpu-lines.js'
//import reglLines from './reglLines'
//import reglLines from ''
import reglLines from 'https://cdn.skypack.dev/regl-gpu-lines';

import {createReglCamera} from './createReglCamera';

let contextOpts = [
    'Antialiasing'
]

let lineData = {
    width: 10,
    fade: 0.25,
    borderOpacity: 1,
    borderWidth: 0.5,
    shading: 0.1,
    shadow: 0.07,
    colorBy: "radius",
    color1: "#1c51a6",
    color2: "#8de2a7",
    borderColor: "#492727",
    opts: ["Axes"],
    vertexCount: 11263,
    endpointCount: 2048,
    join: "bevel",
    cap: "round",
    capResolution: 5,
    joinResolution: 3,
    miterLimit: 2,
  }

// const config = {
//     particleCount: 4096,
//     stepCount: 2000
// }

const canvas = document.createElement("canvas");
document.body.appendChild(canvas)

function normalizeConfig(opts) {
    const normalized = Object.assign(
      {},
      {
        pixelRatio: devicePixelRatio,
        attributes: {},
        extensions: [],
        optionalExtensions: [],
        profile: false
      },
      opts || {}
    );
    delete normalized.width;
    delete normalized.height;
    return normalized;
  }

const config = normalizeConfig({});

//const regl = createREGLLatest({ canvas, ...JSON.parse(JSON.stringify(config)) });

let viewport = {
    width: innerWidth * .7,
    height: innerHeight * .7,
    pixelRatio: devicePixelRatio
}


let regl = createREGLLatest(this, {
    canvas: canvas,
    width: viewport.width,
    height: viewport.height,
    pixelRatio: viewport.pixelRatio,
    attributes: {
      antialias: ~contextOpts.indexOf('Antialiasing'),
      preserveDrawingBuffer: true
    },
    extensions: [
      'OES_standard_derivatives',
      'ANGLE_instanced_arrays',
      'OES_texture_float'
    ],
    optionalExtensions: ['OES_vertex_array_object']
})
//console.log(regl)
  


const positions = (() => {
    let positions = [];
    const { particleCount, stepCount } = config;
    for (let i = 0; i < particleCount; i++) {
      for (let j = 0; j < stepCount; j++) {
        positions.push([(j + 0.5) / stepCount, (i + 0.5) / particleCount]);
      }
      if (i < particleCount - 1) {
        positions.push([-1, -1]);
      }
    }
    return positions;
  })();


  const endpointPositions = (() => {
    let positions = [];
    const { particleCount, stepCount } = config;
    for (let j = 0; j < particleCount; j++) {
      // Start cap
      for (let i = 0; i < 3; i++) {
        positions.push([(i + 0.5) / stepCount, (j + 0.5) / particleCount]);
      }
  
      // End cap
      for (let i = stepCount - 1; i >= stepCount - 3; i--) {
        positions.push([(i + 0.5) / stepCount, (j + 0.5) / particleCount]);
      }
    }
    return positions;
  })();

  let position = regl.buffer(positions);
  let vertexAttributes = { position }


//   let lineData = {
//     ...displayParams,
//     vertexCount: positions.length,
//     endpointCount: endpointPositions.length / 3,
//     ...lineParams
//   }


function reglCanvas(currentCanvas, opts) {
    opts = opts || {};
    const w = opts.width || width;
    const h = opts.height || Math.floor(w * 0.5);
    const createREGL = opts.createREGL || createREGLLatest;
  
    function preserveExisting(canvas, newConfig) {
      const currentConfig = canvas.config;
      if (JSON.stringify(currentConfig) !== JSON.stringify(newConfig)) {
        return false;
      }
      return canvas;
    }
  
    function resizeCanvas(canvas, width, height) {
      if (width) {
        canvas.width = Math.floor(width * config.pixelRatio);
        canvas.style.width = `${Math.floor(width)}px`;
      }
      if (height) {
        canvas.height = Math.floor(height * config.pixelRatio);
        canvas.style.height = `${Math.floor(height)}px`;
      }
    }
  
    if (currentCanvas) {
      if (!(currentCanvas instanceof HTMLCanvasElement)) {
        throw new Error(
          "Unexpected first argument type. Did you forget to pass `this` as the first argument?"
        );
      }
      resizeCanvas(currentCanvas, w, h);
      const existing = preserveExisting(currentCanvas, config);
      if (existing) return existing;
    }
  
 
    // Clone the options since canvas creation mutates the `attributes` object,
    // causing false positives when we then use it to detect changed config.
    const style = config.style;
    //delete config.style;
    resizeCanvas(canvas, w, h);
    canvas.value = regl;
    canvas.config = config;
  
    if (style) {
      for (const [prop, value] of Object.entries(style)) {
        if (canvas.style[prop] !== value) canvas.style[prop] = value;
      }
    }
  
    return canvas;
  }
let shader = `
#pragma param: alpha = 3.0
#pragma param: beta = 2.20
#pragma param: gamma = 1.0
#pragma param: mu = 1.510

vec3 derivative (float x, float y, float z, float t) {
  return vec3(
    alpha * x * (1.0 - y) - beta * z,
    -gamma * y * (1.0 - x * x),
    mu * x
  );
}
`

let actions = ['Simulate']
function main() {
      console.log('does this work')
      mainDrawLoop = (() => {
        //actions;
        initializeState;
        const simulate = ~actions.simulateOpts.indexOf('Simulate');
        camera.taint();
        let frame = regl.frame(({ tick }) => {
          try {
            renderFrame({ simulate, tick });
          } catch (e) {
            console.error(e);
            frame && frame.cancel();
            frame = null;
          }
        });
        // invalidation.then(() => {
        //   frame && frame.cancel();
        //   frame = null;
        // });
      })
}
//console.log(regl)
let drawLines = reglLines(regl, {
    vert: `
      precision highp float;
      
      #pragma lines: attribute vec2 position;
      #pragma lines: attribute float orientation;
      #pragma lines: position = projectPoint(position);
      #pragma lines: width = pointWidth(position);
      #pragma lines: varying float computedWidth = pointWidth(position);
      #pragma lines: orientation = getCapOrientation(orientation);
      #pragma lines: varying vec4 color = pointColor(position);
  
      uniform mat4 uProjectionView, transform;
      uniform sampler2D src;
      uniform float scale, texOffset, width, pixelRatio, fade, particleCount;
      uniform vec3 color1, color2;
      uniform vec4 colorBy;
  
      vec4 projectPoint (vec2 point) {
        if (point.x < 0.0) return vec4(0);
        vec4 position = vec4(texture2D(src, fract(point.xy + vec2(texOffset, 0))).xyz, 1);
        position = transform * position;
        vec4 p = uProjectionView * position;
        float w = p.w;
        p /= w;
        p.z -= 0.0001 * abs(point.y - 0.5);
        return p * w;
      }
  
      float getCapOrientation(float orientation) {
        return orientation;
      }
  
      float pointWidth (vec2 point) {
        return width * exp(-3.0 * fade * (1.0 - point.x));
      }
      
      vec3 quasirandom (float n) {
        const float g = 1.22074408460575947536;
        return fract(0.5 + n * vec3(1.0 / g, 1.0 / (g * g), 1.0 / (g * g * g))).zyx;
      }
  
      vec4 pointColor (vec2 point) {
        vec3 initialPos = quasirandom(point.y * particleCount);
        float coord = dot(vec4(initialPos, point.y), colorBy);
        float fade = exp(-3.0 * fade * (1.0 - point.x));
        return vec4(mix(color1, color2, coord), fade);
      }`,
    frag: `
      precision highp float;
      varying vec3 lineCoord;
      varying float computedWidth, vFade;
      varying vec4 color;
      uniform bool squareCap;
      uniform float antialiasThreshold, shading;
      uniform vec2 borderWidth;
      uniform vec4 borderColor;
      float linearstep(float x0, float x1, float x) {
        return clamp((x - x0) / (x1 - x0), 0.0, 1.0);
      }
      void main() {
        // Apply the end cap style
        float sdf = squareCap ? max(abs(lineCoord.x), abs(lineCoord.y)) : length(lineCoord.xy);
  
        float highlight = 1.0 - sdf * sdf;
  
        float shade = mix(1.0, highlight, shading);
        shade = mix(shade, 1.0, shading * highlight * 0.7);
  
        // Apply the border color
        vec2 borderThreshold = 1.0 - borderWidth / computedWidth;
        float isBorder = linearstep(borderThreshold.x, borderThreshold.y, sdf);
        gl_FragColor = vec4(mix(color.rgb * shade, borderColor.rgb, isBorder * borderColor.a * color.a), 1);
        
        ${
          !~contextOpts.indexOf('Antialiasing')
            ? `
        // Fake antialiasing when MSAA is off
        gl_FragColor.a *= linearstep(1.0, antialiasThreshold, sdf);
        if (gl_FragColor.a < 0.4) discard;`
            : ''
        }
      }`,
    cull: { enable: false }
  })


let drawLineShadows = reglLines(regl, {
    vert: `
      precision highp float;
      
      #pragma lines: attribute vec2 position;
      #pragma lines: attribute float orientation;
      #pragma lines: position = projectPoint(position);
      #pragma lines: orientation = getCapOrientation(orientation);
      #pragma lines: width = pointWidth(position);
  
      uniform mat4 uProjectionView, transform;
      uniform sampler2D src;
      uniform float scale, texOffset, width, fade, particleCount;
  
      vec4 projectPoint (vec2 point) {
        if (point.x < 0.0) return vec4(0);
        vec4 position = vec4(texture2D(src, fract(point.xy + vec2(texOffset, 0))).xyz, 1);
        position = transform * position;
        position.y = -0.5;
        vec4 p = uProjectionView * position;
        float w = p.w;
        p /= w;
        p.z -= 0.001 * abs(point.y - 0.5);
        return p * w;
      }
  
      float getCapOrientation(float orientation) {
        return orientation;
      }
  
      float pointWidth (vec2 point) {
        return width * exp(-3.0 * fade * (1.0 - point.x));
      }`,
    frag: `
      precision highp float;
      uniform vec4 color1;
      void main() {
        gl_FragColor = color1;
      }`
  })


  copyStateColumn = regl({
    vert: `
      precision mediump float;
      attribute vec2 xy;
      varying vec2 uv;
      void main () {
        uv = 0.5 * xy + 0.5;
        gl_Position = vec4(xy, 0, 1);
      }`,
    frag: `
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D srcTex;
      void main () {
        gl_FragColor = texture2D(srcTex, uv);
      }`,
    attributes: { xy: [[-4, -4], [0, 4], [4, -4]] },
    uniforms: {
      srcTex: regl.prop('src')
    },
    framebuffer: regl.prop('dst'),
    scissor: {
      enable: true,
      box: {
        x: regl.prop('dstColumn'),
        y: 0,
        height: config.particleCount,
        width: 1
      }
    },
    count: 3
  })

  
//new stuff
let t = 0
function renderFrame({ simulate = false, dTheta = 0, tick = 0 } = {}) {
    if (dTheta) camera.params.dTheta = dTheta;
    camera(({ dirty }) => {
      if (!simulate && !dirty) return;
  
      if (simulate) {
        integrate({
          src: state,
          dst: tmpState,
          srcColumn: currentColumn,
          dt: selectedAttractor.dt,
          t: t,
          params: userAttractorParameters
        });
  
        t += selectedAttractor.dt;
        currentColumn = (currentColumn + 1) % config.stepCount;
  
        copyStateColumn({
          src: tmpState,
          dst: state,
          dstColumn: currentColumn
        });
      }
  
      regl.clear({ color: [1, 1, 1, 1], depth: 1 });
  
      const texOffset =
        (currentColumn - config.stepCount + 1) / config.stepCount;
  
      const colors = {
        borderColor: hexRgbToFloat(displayParams.borderColor).concat(
          displayParams.borderOpacity
        ),
        color1: hexRgbToFloat(displayParams.color1),
        color2: hexRgbToFloat(displayParams.color2)
      };
  
      const lines = {
        ...displayParams,
        ...lineParams,
        ...config,
        ...colors,
        src: state,
        depth: true,
        transform: selectedAttractor.transform,
        colorBy: {
          radius: [0, 0, 1, 0],
          random: [0, 0, 0, 1]
        }[displayParams.colorBy],
        texOffset
      };
  
      if (displayParams.shadow && camera.state.eye[1] > -0.5) {
        const shadowColor = [1, 1, 1].fill(1 - displayParams.shadow).concat(1);
        customLineConfig(
          {
            ...lines,
            depth: false,
            color1: shadowColor
          },
          () => drawLineShadows({ ...lineData, vao: shadowLinesVAO })
        );
      }
  
      //if (~displayParams.opts.indexOf('Axes'))
      //  drawAxes({ transform: selectedAttractor.transform });
  
      customLineConfig(lines, () => {
        drawLines({ ...lineData, vao: drawLinesVAO });
      });
  
      if (true) drawFancyAxes();
    });
  }




// export default main
// function main() {
//     console.log('hmm')
// }
export default main