// //https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-2
//https://github.com/rreusser/regl-gpu-lines/tree/main
// //https://observablehq.com/@kylebarron/geoarrow-and-geoparquet-in-deck-gl
let currentColumn = 0
import { mat4, mat3, vec4, quat, vec3 } from 'gl-matrix'


let selectedAttractor = {"deriv":"alpha * x * (1.0 - y) - beta * z,\n      -gamma * y * (1.0 - x * x),\n      mu * x","parameters":{"alpha":3,"beta":2.2,"gamma":1,"mu":1.51},"dt":0.02,"initializationOrigin":[1,1,0],"transform":{"0":2.4492935397342132e-17,"1":0,"2":-0.4000000059604645,"3":0,"4":0,"5":0.4000000059604645,"6":0,"7":0,"8":0.4000000059604645,"9":0,"10":2.4492935397342132e-17,"11":0,"12":0,"13":-0.30000001192092896,"14":0,"15":1},"tex":["\\alpha x (1 - y) - \\beta z","-y (1 - x^2)","\\mu x"],"references":[{"url":"https://arxiv.org/abs/1311.6128","title":"A 3D Strange Attractor with a Distinctive Silhouette. The Butterfly Effect Revisited","authors":["S. Bouali"],"deets":"(2013)."}]}
let userAttractorParameters = {
  alpha: 3.0,
  beta: 2.2,
  gamma: 1,
  mu: 1.51,
}


const regl = createREGLLatest({
  //canvas,
  //extensions: ['ANGLE_instanced_arrays']
  attributes: {
    antialias: true,
    preserveDrawingBuffer: true
  },
  extensions: [
    'OES_standard_derivatives',
    'ANGLE_instanced_arrays',
    'OES_texture_float'
  ],
  optionalExtensions: ['OES_vertex_array_object']
});
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

let state = (() => {
  const fbo = regl.framebuffer({
    depthStencil: false,
    //height: config.particleCount,
    height: 1024,
    //width: config.stepCount,
    width: 10,
    colorType: 'float',
    colorFormat: 'rgba'
  });

  // Clean up resources when Observable reevaluates this cell
  //invalidation.then(() => fbo.destroy());

  return fbo;
})()

let tmpState = (() => {
  const fbo = regl.framebuffer({
    depthStencil: false,
    //height: config.particleCount,
    height: 1024,
    width: 1,
    colorType: 'float',
    colorFormat: 'rgba'
  });
  //invalidation.then(() => fbo.destroy());
  return fbo;
})();


let parsedAttractorShader = { 
  params: {
    alpha: 3.0,
    beta: 2.2,
    gamma: 1,
    mu: 1.51
  },
  uniforms: {
    alpha: 3.0,
    beta: 2.2,
    gamma: 1,
    mu: 1.51
  },
  glsl: `uniform float alpha;
  uniform float beta;
  uniform float gamma;
  uniform float mu;
  vec3 derivative (float x, float y, float z, float t) {
    return vec3(
      alpha * x * (1.0 - y) - beta * z,
      -gamma * y * (1.0 - x * x),
      mu * x
    );
  }`
}
import bunny from "https://cdn.skypack.dev/bunny@1.0.1"
import normals from "https://cdn.skypack.dev/angle-normals@1.0.0"
import createREGLLatest from 'https://cdn.skypack.dev/regl@2.1.0?min'
import reglLines from 'regl-gpu-lines';
//import {createReglCamera} from './createReglCamera';
import createReglCamera from "https://cdn.skypack.dev/regl-camera@2.1.1"
//const canvas = document.createElement("canvas");
//document.body.appendChild(canvas)



let camera = createReglCamera(regl, {
  element: regl._gl.canvas,
  center: [0, 3.5, 0],
  theta: (3.0 * Math.PI) / 4.0,
  phi: Math.PI / 6.0,
  distance: 20.0,
  damping: 0,
  noScroll: true,
  renderOnDirty: true
})

let viewport = {
  width: innerWidth * .7,
  height: innerHeight * .7,
  pixelRatio: devicePixelRatio
}

let drawBunny = regl({
  frag: `
    precision mediump float;
    varying vec3 vnormal;
    void main () {
      gl_FragColor = vec4(vnormal * 0.75 + 0.25, 1.0);
    }`,
  vert: `
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position, normal;
    varying vec3 vnormal;
    void main () {
      vnormal = normal;
      gl_Position = projection * view * vec4(position, 1.0);
    }`,
  attributes: {
    position: bunny.positions,
    normal: normals(bunny.cells, bunny.positions)
  },
  elements: bunny.cells
})

// let regl = createREGLLatest(this, {
//   canvas: canvas,
//   width: viewport.width,
//   height: viewport.height,
//   pixelRatio: viewport.pixelRatio,
//   attributes: {
//     antialias: ~contextOpts.indexOf('Antialiasing'),
//     preserveDrawingBuffer: true
//   },
//   extensions: [
//     'OES_standard_derivatives',
//     'ANGLE_instanced_arrays',
//     'OES_texture_float'
//   ],
//   optionalExtensions: ['OES_vertex_array_object']
// })

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

  let capOrientation = (() => {
    let orientation = [];
    const { particleCount } = config;
    for (let j = 0; j < particleCount; j++) {
      orientation.push(reglLines.CAP_START, reglLines.CAP_END);
    }
    return orientation;
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

  let endpointAttributes = (() => {
    let position = regl.buffer(endpointPositions);
    let orientation = regl.buffer(new Uint8Array(capOrientation));
    // invalidation.then(() => {
    //   position.destroy();
    //   orientation.destroy();
    // });
    return { position, orientation };
  })()


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


  let copyStateColumn = regl({
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

const integrate = regl({
  vert: `
    precision highp float;
    attribute vec2 xy;
    varying vec2 srcTexCoord;
    uniform float srcTexCoordU;
    void main () {
      // Map clip coords ([-1, 1] x [-1, 1]) to texture coords
      // ([0, 1] x [0, 1]) and store in a varying to be used
      // in the fragment shader:
      srcTexCoord = vec2(srcTexCoordU, 0.5 * xy.y + 0.5);
      gl_Position = vec4(xy, 0, 1);
    }`,
  frag: `
    precision highp float;
    uniform sampler2D srcTex;
    uniform float _dt, _t;
    varying vec2 srcTexCoord;

    ${parsedAttractorShader.glsl}

    vec3 _deriv (vec3 p, float t) {
      // Unpack, for convenience
      return derivative(p.x, p.y, p.z, t);
    }

    void main () {
      vec3 p = texture2D(srcTex, srcTexCoord).xyz;

      // Runge-Kutta 4th order integration
      vec3 k1 = _deriv(p, _t);
      vec3 k2 = _deriv(p + (0.5 * _dt) * k1, _t + 0.5 * _dt);
      vec3 k3 = _deriv(p + (0.5 * _dt) * k2, _t + 0.5 * _dt);
      vec3 k4 = _deriv(p + _dt * k3, _t + _dt);

      // Evaluate the derivative there and use for a whole step:
      gl_FragColor = vec4(p + (_dt / 6.0) * (k1 + k4 + 2.0 * (k2 + k3)), 1);

      // If the particle diverges off to infinity, place it back near the origin
      if (dot(gl_FragColor.xyz, gl_FragColor.xyz) > 1e6) {
        gl_FragColor.xyz *= 0.0001;
      }
    }`,
  attributes: {
    // A single big triangle which covers the viewport, [-1, 1] x [-1, 1],
    // and draws to all texels
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
  uniforms: {
    _dt: regl.prop('dt'),
    _t: regl.prop('t'),
    srcTex: regl.prop('src'),
    srcTexCoordU: (ctx, props) => (props.srcColumn + 0.5) / config.stepCount,
    ...parsedAttractorShader.uniforms
  },
  framebuffer: regl.prop('dst'),
  count: 3
})

let customLineConfig = regl({
  uniforms: {
    color1: regl.prop('color1'),
    color2: regl.prop('color2'),
    borderColor: regl.prop('borderColor'),
    src: regl.prop('src'),
    squareCap: (ctx, props) => props.cap === 'square',
    fade: regl.prop('fade'),
    width: (ctx, props) => props.width * ctx.pixelRatio,
    borderWidth: (ctx, props) => [
      2.0 * props.borderWidth * ctx.pixelRatio + 0.75,
      2.0 * props.borderWidth * ctx.pixelRatio - 0.75
    ],
    antialiasThreshold: (ctx, props) =>
      1.0 - 2.0 / (ctx.pixelRatio * props.width),
    pixelRatio: regl.context('pixelRatio'),
    transform: regl.prop('transform'),
    texOffset: regl.prop('texOffset'),
    particleCount: regl.prop('particleCount'),
    colorBy: regl.prop('colorBy'),
    shading: regl.prop('shading')
  },
  blend: {
    enable: !~contextOpts.indexOf('Antialiasing'),
    func: {
      srcRGB: 'src alpha',
      srcAlpha: 1,
      dstRGB: 'one minus src alpha',
      dstAlpha: 1
    },
    equation: {
      rgb: 'add',
      alpha: 'add'
    }
  },
  depth: {
    enable: regl.prop('depth')
  }
})

let drawLinesVAO = (() => {
  const vao = drawLines.vao({
    vertexAttributes,
    endpointAttributes
  });
  return vao;
})()

let t = 0;
let drawFancyAxes = (() => {
  const boxVertices = regl.buffer(
    [0, 1, 2].map(() => [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ])
  );
  const boxFaceNormal = regl.buffer(
    [0, 1, 2].map(i =>
      [...Array(8).keys()].map(() =>
        [0, 1, 2].map(j => (i === (5 - j) % 3 ? 1 : 0))
      )
    )
  );
  const boxFaceTangent = regl.buffer(
    [0, 1, 2].map(i =>
      [...Array(8).keys()].map(() =>
        [0, 1, 2].map(j => (i === (3 - j) % 3 ? 1 : 0))
      )
    )
  );
  const boxFaceBitangent = regl.buffer(
    [0, 1, 2].map(i =>
      [...Array(8).keys()].map(() =>
        [0, 1, 2].map(j => (i === (4 - j) % 3 ? 1 : 0))
      )
    )
  );
  // prettier-ignore
  const boxFaceElements = regl.elements([
    [0, 1, 2],
    [0, 2, 3],
    [6, 4, 7],
    [6, 5, 4],
    
    [0, 4, 5].map(i => i + 8),
    [0, 5, 1].map(i => i + 8),
    [2, 7, 3].map(i => i + 8),
    [2, 6, 7].map(i => i + 8),
    
    [1, 5, 2].map(i => i + 16),
    [2, 5, 6].map(i => i + 16),
    [0, 3, 7].map(i => i + 16),
    [0, 7, 4].map(i => i + 16),
  ]);
  // invalidation.then(() => {
  //   boxVertices.destroy();
  //   boxFaceElements.destroy();
  //   boxFaceNormal.destroy();
  //   boxFaceTangent.destroy();
  //   boxFaceBitangent.destroy();
  // });

  const transform = mat4.create();
  const normalMatrix = mat3.create();

  const drawFaces = regl({
    vert: `
    precision highp float;
    uniform mat4 uProjectionView, transform;
    uniform mat3 normalMatrix;
    attribute vec3 position, tangent, bitangent, normal;
    varying vec2 coord;
    varying vec3 p, n, t, b;

    
    void main () {
      p = (transform * vec4(position, 1)).xyz;
      n = normalMatrix * normal;
      t = normalMatrix * tangent;
      b = normalMatrix * bitangent;
      coord = vec2(dot(position, b), dot(position, t));
      gl_Position = uProjectionView * vec4(p, 1);
    }`,
    frag: `
    #extension GL_OES_standard_derivatives : enable
    precision mediump float;
    varying vec2 coord;
    varying vec3 p, n, t, b;
    uniform vec3 eye;

    float gridFactor (vec2 parameter, float width) {
      vec2 d = fwidth(parameter);
      vec2 looped = 0.5 - abs(mod(parameter, 1.0) - 0.5);
      vec2 a2 = smoothstep(d * (width + 0.5), d * (width - 0.5), looped);
      return max(a2.x, a2.y);
    }

    void main () {
      float vDotN = dot(normalize(p - eye), n);
      float fade = smoothstep(0.02, 0.25, abs(vDotN));
      float alpha = fade * 0.25 * (
        gridFactor(coord * 4.0, 0.5) + 
        0.2 * gridFactor(coord * 10.0 * 4.0, 0.5)
      );
      gl_FragColor = vec4(vec3(0), alpha);
      if (alpha < 0.001) discard;
    }`,
    attributes: {
      position: boxVertices,
      normal: boxFaceNormal,
      tangent: boxFaceTangent,
      bitangent: boxFaceBitangent
    },
    uniforms: {
      transform: mat4.scale(
        mat4.create(),
        mat4.fromTranslation(transform, [0, 1.5, 0]),
        [2, 2, 2]
      ),
      normalMatrix: mat3.normalFromMat4(
        normalMatrix,
        mat4.scale(
          mat4.create(),
          mat4.translate(mat4.create(), mat4.create(), [0, 1.5, 0]),
          [2, 2, 2]
        )
      ),
      eye: regl.context('eye')
    },
    depth: { enable: true, mask: true },
    cull: { enable: true, face: 'back' },
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        dstRGB: 'one minus src alpha',
        srcAlpha: 1,
        dstAlpha: 1
      },
      equation: { rgb: 'add', alpha: 'add' }
    },
    primitive: 'triangles',
    elements: boxFaceElements
  });

  function labelMaker() {}

  return function() {
    drawFaces();
  };
})()


function renderFrame({ simulate = false, dTheta = 0, tick = 0 } = {}) {
    if (dTheta) camera.params.dTheta = dTheta;
    console.log('rendering a frame')
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
  
      // if (displayParams.shadow && camera.state.eye[1] > -0.5) {
      //   const shadowColor = [1, 1, 1].fill(1 - displayParams.shadow).concat(1);
      //   customLineConfig(
      //     {
      //       ...lines,
      //       depth: false,
      //       color1: shadowColor
      //     },
      //     () => drawLineShadows({ ...lineData, vao: shadowLinesVAO })
      //   );
      // }
  
      //if (~displayParams.opts.indexOf('Axes'))
      //  drawAxes({ transform: selectedAttractor.transform });
  
      // customLineConfig(lines, () => {
      //   drawLines({ ...lineData, vao: drawLinesVAO });
      // });
  
      //if (true) drawFancyAxes();
    });
}

let actions = ['Simulate']
let mainDrawLoop
function hexRgbToFloat (hex) {
  let match
  if ((match = hex.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/))) {
    return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
  } else if ((match = hex.match(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/))) {
    return [parseInt(match[1], 16) / 15, parseInt(match[2], 16) / 15, parseInt(match[3], 16) / 15]
  }
  return [0, 0, 0]
}
let displayParams =  {
  width: 10,
  fade: 0.25,
  borderOpacity: 0.8,
  borderWidth: 0.5,
  shading: 0.1,
  shadow: 0.07,
  colorBy: "radius",
  color1: "#1c51a6",
  color2: "#8de2a7",
  borderColor: "#492727",
  opts: ["Axes"],
}
let lineParams =  {
  join: "bevel",
  cap: "round",
  capResolution: 5,
  joinResolution: 3,
  miterLimit: 2
}

function main() {
      document.body.innerHTML += 'make this work'
      console.log('does this work?')
      // mainDrawLoop = (() => {
      //   console.log('it should  work')
      //   const simulate = ~actions.simulateOpts.indexOf('Simulate');
      //   camera.taint();
      //   let frame = regl.frame(({ tick }) => {
      //     try {
      //       renderFrame({ simulate, tick });
      //     } catch (e) {
      //       console.error(e);
      //       frame && frame.cancel();
      //       frame = null;
      //     }
      //   });
      // })
  //const simulate = ~actions.simulateOpts.indexOf('Simulate');
  const simulate = true
  document.querySelector('#root').appendChild(regl._gl.canvas)
  regl.frame(() => {
    //console.log('this is a frame')
    camera(function (context) {
      console.log('this should render', context)
      regl.clear({ color: [0, 0.1, 0.26, 1] });
      drawBunny();
      //renderFrame({ simulate, tick: context.tick });
    });
  })
}

export default main