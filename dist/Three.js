"use strict";
(() => {
  // src/demos/Three.js
  var THREE = THREE || { REVISION: "55dev" };
  self.console = self.console || { info: function() {
  }, log: function() {
  }, debug: function() {
  }, warn: function() {
  }, error: function() {
  } };
  self.Int32Array = self.Int32Array || Array;
  self.Float32Array = self.Float32Array || Array;
  String.prototype.startsWith = String.prototype.startsWith || function(a) {
    return this.slice(0, a.length) === a;
  };
  String.prototype.endsWith = String.prototype.endsWith || function(a) {
    var a = String(a), b = this.lastIndexOf(a);
    return (-1 < b && b) === this.length - a.length;
  };
  String.prototype.trim = String.prototype.trim || function() {
    return this.replace(/^\s+|\s+$/g, "");
  };
  (function() {
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c)
      window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    void 0 === window.requestAnimationFrame && (window.requestAnimationFrame = function(b2) {
      var c2 = Date.now(), f = Math.max(0, 16 - (c2 - a)), g = window.setTimeout(function() {
        b2(c2 + f);
      }, f);
      a = c2 + f;
      return g;
    });
    window.cancelAnimationFrame = window.cancelAnimationFrame || function(a2) {
      window.clearTimeout(a2);
    };
  })();
  THREE.CullFaceNone = 0;
  THREE.CullFaceBack = 1;
  THREE.CullFaceFront = 2;
  THREE.CullFaceFrontBack = 3;
  THREE.FrontFaceDirectionCW = 0;
  THREE.FrontFaceDirectionCCW = 1;
  THREE.BasicShadowMap = 0;
  THREE.PCFShadowMap = 1;
  THREE.PCFSoftShadowMap = 2;
  THREE.FrontSide = 0;
  THREE.BackSide = 1;
  THREE.DoubleSide = 2;
  THREE.NoShading = 0;
  THREE.FlatShading = 1;
  THREE.SmoothShading = 2;
  THREE.NoColors = 0;
  THREE.FaceColors = 1;
  THREE.VertexColors = 2;
  THREE.NoBlending = 0;
  THREE.NormalBlending = 1;
  THREE.AdditiveBlending = 2;
  THREE.SubtractiveBlending = 3;
  THREE.MultiplyBlending = 4;
  THREE.CustomBlending = 5;
  THREE.AddEquation = 100;
  THREE.SubtractEquation = 101;
  THREE.ReverseSubtractEquation = 102;
  THREE.ZeroFactor = 200;
  THREE.OneFactor = 201;
  THREE.SrcColorFactor = 202;
  THREE.OneMinusSrcColorFactor = 203;
  THREE.SrcAlphaFactor = 204;
  THREE.OneMinusSrcAlphaFactor = 205;
  THREE.DstAlphaFactor = 206;
  THREE.OneMinusDstAlphaFactor = 207;
  THREE.DstColorFactor = 208;
  THREE.OneMinusDstColorFactor = 209;
  THREE.SrcAlphaSaturateFactor = 210;
  THREE.MultiplyOperation = 0;
  THREE.MixOperation = 1;
  THREE.AddOperation = 2;
  THREE.UVMapping = function() {
  };
  THREE.CubeReflectionMapping = function() {
  };
  THREE.CubeRefractionMapping = function() {
  };
  THREE.SphericalReflectionMapping = function() {
  };
  THREE.SphericalRefractionMapping = function() {
  };
  THREE.RepeatWrapping = 1e3;
  THREE.ClampToEdgeWrapping = 1001;
  THREE.MirroredRepeatWrapping = 1002;
  THREE.NearestFilter = 1003;
  THREE.NearestMipMapNearestFilter = 1004;
  THREE.NearestMipMapLinearFilter = 1005;
  THREE.LinearFilter = 1006;
  THREE.LinearMipMapNearestFilter = 1007;
  THREE.LinearMipMapLinearFilter = 1008;
  THREE.UnsignedByteType = 1009;
  THREE.ByteType = 1010;
  THREE.ShortType = 1011;
  THREE.UnsignedShortType = 1012;
  THREE.IntType = 1013;
  THREE.UnsignedIntType = 1014;
  THREE.FloatType = 1015;
  THREE.UnsignedShort4444Type = 1016;
  THREE.UnsignedShort5551Type = 1017;
  THREE.UnsignedShort565Type = 1018;
  THREE.AlphaFormat = 1019;
  THREE.RGBFormat = 1020;
  THREE.RGBAFormat = 1021;
  THREE.LuminanceFormat = 1022;
  THREE.LuminanceAlphaFormat = 1023;
  THREE.RGB_S3TC_DXT1_Format = 2001;
  THREE.RGBA_S3TC_DXT1_Format = 2002;
  THREE.RGBA_S3TC_DXT3_Format = 2003;
  THREE.RGBA_S3TC_DXT5_Format = 2004;
  THREE.Color = function(a) {
    void 0 !== a && this.set(a);
    return this;
  };
  THREE.Color.prototype = { constructor: THREE.Color, r: 1, g: 1, b: 1, copy: function(a) {
    this.r = a.r;
    this.g = a.g;
    this.b = a.b;
    return this;
  }, copyGammaToLinear: function(a) {
    this.r = a.r * a.r;
    this.g = a.g * a.g;
    this.b = a.b * a.b;
    return this;
  }, copyLinearToGamma: function(a) {
    this.r = Math.sqrt(a.r);
    this.g = Math.sqrt(a.g);
    this.b = Math.sqrt(a.b);
    return this;
  }, convertGammaToLinear: function() {
    var a = this.r, b = this.g, c = this.b;
    this.r = a * a;
    this.g = b * b;
    this.b = c * c;
    return this;
  }, convertLinearToGamma: function() {
    this.r = Math.sqrt(this.r);
    this.g = Math.sqrt(this.g);
    this.b = Math.sqrt(this.b);
    return this;
  }, set: function(a) {
    switch (typeof a) {
      case "number":
        this.setHex(a);
        break;
      case "string":
        this.setStyle(a);
    }
  }, setRGB: function(a, b, c) {
    this.r = a;
    this.g = b;
    this.b = c;
    return this;
  }, setHSV: function(a, b, c) {
    var d, e, f;
    0 === c ? this.r = this.g = this.b = 0 : (d = Math.floor(6 * a), e = 6 * a - d, a = c * (1 - b), f = c * (1 - b * e), b = c * (1 - b * (1 - e)), 0 === d ? (this.r = c, this.g = b, this.b = a) : 1 === d ? (this.r = f, this.g = c, this.b = a) : 2 === d ? (this.r = a, this.g = c, this.b = b) : 3 === d ? (this.r = a, this.g = f, this.b = c) : 4 === d ? (this.r = b, this.g = a, this.b = c) : 5 === d && (this.r = c, this.g = a, this.b = f));
    return this;
  }, getHex: function() {
    return 255 * this.r << 16 ^ 255 * this.g << 8 ^ 255 * this.b << 0;
  }, setHex: function(a) {
    a = Math.floor(a);
    this.r = (a >> 16 & 255) / 255;
    this.g = (a >> 8 & 255) / 255;
    this.b = (a & 255) / 255;
    return this;
  }, getHexString: function() {
    return ("000000" + this.getHex().toString(16)).slice(-6);
  }, getStyle: function() {
    return "rgb(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + ")";
  }, setStyle: function(a) {
    if (/^rgb\((\d+),(\d+),(\d+)\)$/i.test(a))
      return a = /^rgb\((\d+),(\d+),(\d+)\)$/i.exec(a), this.r = Math.min(255, parseInt(a[1], 10)) / 255, this.g = Math.min(255, parseInt(a[2], 10)) / 255, this.b = Math.min(255, parseInt(a[3], 10)) / 255, this;
    if (/^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i.test(a))
      return a = /^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i.exec(a), this.r = Math.min(100, parseInt(a[1], 10)) / 100, this.g = Math.min(100, parseInt(a[2], 10)) / 100, this.b = Math.min(100, parseInt(a[3], 10)) / 100, this;
    if (/^\#([0-9a-f]{6})$/i.test(a))
      return a = /^\#([0-9a-f]{6})$/i.exec(a), this.setHex(parseInt(a[1], 16)), this;
    if (/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a))
      return a = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a), this.setHex(parseInt(a[1] + a[1] + a[2] + a[2] + a[3] + a[3], 16)), this;
    if (/^(\w+)$/i.test(a))
      return this.setHex(THREE.ColorKeywords[a]), this;
  }, getHSV: function(a) {
    var b = this.r, c = this.g, d = this.b, e = Math.max(Math.max(b, c), d), f = Math.min(Math.min(b, c), d);
    if (f === e)
      f = b = 0;
    else {
      var g = e - f, f = g / e, b = (b === e ? (c - d) / g : c === e ? 2 + (d - b) / g : 4 + (b - c) / g) / 6;
      0 > b && (b += 1);
      1 < b && (b -= 1);
    }
    void 0 === a && (a = { h: 0, s: 0, v: 0 });
    a.h = b;
    a.s = f;
    a.v = e;
    return a;
  }, lerpSelf: function(a, b) {
    this.r += (a.r - this.r) * b;
    this.g += (a.g - this.g) * b;
    this.b += (a.b - this.b) * b;
    return this;
  }, clone: function() {
    return new THREE.Color().setRGB(this.r, this.g, this.b);
  } };
  THREE.ColorKeywords = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  };
  THREE.Vector2 = function(a, b) {
    this.x = a || 0;
    this.y = b || 0;
  };
  THREE.Vector2.prototype = {
    constructor: THREE.Vector2,
    set: function(a, b) {
      this.x = a;
      this.y = b;
      return this;
    },
    setX: function(a) {
      this.x = a;
      return this;
    },
    setY: function(a) {
      this.y = a;
      return this;
    },
    setComponent: function(a, b) {
      switch (a) {
        case 0:
          this.x = b;
          break;
        case 1:
          this.y = b;
          break;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    getComponent: function(a) {
      switch (a) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    copy: function(a) {
      this.x = a.x;
      this.y = a.y;
      return this;
    },
    addScalar: function(a) {
      this.x += a;
      this.y += a;
      return this;
    },
    add: function(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      return this;
    },
    addSelf: function(a) {
      this.x += a.x;
      this.y += a.y;
      return this;
    },
    sub: function(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      return this;
    },
    subSelf: function(a) {
      this.x -= a.x;
      this.y -= a.y;
      return this;
    },
    multiplyScalar: function(a) {
      this.x *= a;
      this.y *= a;
      return this;
    },
    divideScalar: function(a) {
      0 !== a ? (this.x /= a, this.y /= a) : this.set(0, 0);
      return this;
    },
    minSelf: function(a) {
      this.x > a.x && (this.x = a.x);
      this.y > a.y && (this.y = a.y);
      return this;
    },
    maxSelf: function(a) {
      this.x < a.x && (this.x = a.x);
      this.y < a.y && (this.y = a.y);
      return this;
    },
    clampSelf: function(a, b) {
      this.x < a.x ? this.x = a.x : this.x > b.x && (this.x = b.x);
      this.y < a.y ? this.y = a.y : this.y > b.y && (this.y = b.y);
      return this;
    },
    negate: function() {
      return this.multiplyScalar(-1);
    },
    dot: function(a) {
      return this.x * a.x + this.y * a.y;
    },
    lengthSq: function() {
      return this.x * this.x + this.y * this.y;
    },
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    normalize: function() {
      return this.divideScalar(this.length());
    },
    distanceTo: function(a) {
      return Math.sqrt(this.distanceToSquared(a));
    },
    distanceToSquared: function(a) {
      var b = this.x - a.x, a = this.y - a.y;
      return b * b + a * a;
    },
    setLength: function(a) {
      var b = this.length();
      0 !== b && a !== b && this.multiplyScalar(a / b);
      return this;
    },
    lerpSelf: function(a, b) {
      this.x += (a.x - this.x) * b;
      this.y += (a.y - this.y) * b;
      return this;
    },
    equals: function(a) {
      return a.x === this.x && a.y === this.y;
    },
    clone: function() {
      return new THREE.Vector2(this.x, this.y);
    }
  };
  THREE.Vector3 = function(a, b, c) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
  };
  THREE.Vector3.prototype = {
    constructor: THREE.Vector3,
    set: function(a, b, c) {
      this.x = a;
      this.y = b;
      this.z = c;
      return this;
    },
    setX: function(a) {
      this.x = a;
      return this;
    },
    setY: function(a) {
      this.y = a;
      return this;
    },
    setZ: function(a) {
      this.z = a;
      return this;
    },
    setComponent: function(a, b) {
      switch (a) {
        case 0:
          this.x = b;
          break;
        case 1:
          this.y = b;
          break;
        case 2:
          this.z = b;
          break;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    getComponent: function(a) {
      switch (a) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    copy: function(a) {
      this.x = a.x;
      this.y = a.y;
      this.z = a.z;
      return this;
    },
    add: function(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      return this;
    },
    addSelf: function(a) {
      this.x += a.x;
      this.y += a.y;
      this.z += a.z;
      return this;
    },
    addScalar: function(a) {
      this.x += a;
      this.y += a;
      this.z += a;
      return this;
    },
    sub: function(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      return this;
    },
    subSelf: function(a) {
      this.x -= a.x;
      this.y -= a.y;
      this.z -= a.z;
      return this;
    },
    multiply: function(a, b) {
      this.x = a.x * b.x;
      this.y = a.y * b.y;
      this.z = a.z * b.z;
      return this;
    },
    multiplySelf: function(a) {
      this.x *= a.x;
      this.y *= a.y;
      this.z *= a.z;
      return this;
    },
    multiplyScalar: function(a) {
      this.x *= a;
      this.y *= a;
      this.z *= a;
      return this;
    },
    divideSelf: function(a) {
      this.x /= a.x;
      this.y /= a.y;
      this.z /= a.z;
      return this;
    },
    divideScalar: function(a) {
      0 !== a ? (this.x /= a, this.y /= a, this.z /= a) : this.z = this.y = this.x = 0;
      return this;
    },
    minSelf: function(a) {
      this.x > a.x && (this.x = a.x);
      this.y > a.y && (this.y = a.y);
      this.z > a.z && (this.z = a.z);
      return this;
    },
    maxSelf: function(a) {
      this.x < a.x && (this.x = a.x);
      this.y < a.y && (this.y = a.y);
      this.z < a.z && (this.z = a.z);
      return this;
    },
    clampSelf: function(a, b) {
      this.x < a.x ? this.x = a.x : this.x > b.x && (this.x = b.x);
      this.y < a.y ? this.y = a.y : this.y > b.y && (this.y = b.y);
      this.z < a.z ? this.z = a.z : this.z > b.z && (this.z = b.z);
      return this;
    },
    negate: function() {
      return this.multiplyScalar(-1);
    },
    dot: function(a) {
      return this.x * a.x + this.y * a.y + this.z * a.z;
    },
    lengthSq: function() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function() {
      return this.divideScalar(this.length());
    },
    setLength: function(a) {
      var b = this.length();
      0 !== b && a !== b && this.multiplyScalar(a / b);
      return this;
    },
    lerpSelf: function(a, b) {
      this.x += (a.x - this.x) * b;
      this.y += (a.y - this.y) * b;
      this.z += (a.z - this.z) * b;
      return this;
    },
    cross: function(a, b) {
      this.x = a.y * b.z - a.z * b.y;
      this.y = a.z * b.x - a.x * b.z;
      this.z = a.x * b.y - a.y * b.x;
      return this;
    },
    crossSelf: function(a) {
      var b = this.x, c = this.y, d = this.z;
      this.x = c * a.z - d * a.y;
      this.y = d * a.x - b * a.z;
      this.z = b * a.y - c * a.x;
      return this;
    },
    angleTo: function(a) {
      return Math.acos(this.dot(a) / this.length() / a.length());
    },
    distanceTo: function(a) {
      return Math.sqrt(this.distanceToSquared(a));
    },
    distanceToSquared: function(a) {
      var b = this.x - a.x, c = this.y - a.y, a = this.z - a.z;
      return b * b + c * c + a * a;
    },
    getPositionFromMatrix: function(a) {
      this.x = a.elements[12];
      this.y = a.elements[13];
      this.z = a.elements[14];
      return this;
    },
    setEulerFromRotationMatrix: function(a, b) {
      function c(a2) {
        return Math.min(Math.max(a2, -1), 1);
      }
      var d = a.elements, e = d[0], f = d[4], g = d[8], h = d[1], i = d[5], k = d[9], l = d[2], m = d[6], d = d[10];
      void 0 === b || "XYZ" === b ? (this.y = Math.asin(c(g)), 0.99999 > Math.abs(g) ? (this.x = Math.atan2(-k, d), this.z = Math.atan2(-f, e)) : (this.x = Math.atan2(m, i), this.z = 0)) : "YXZ" === b ? (this.x = Math.asin(-c(k)), 0.99999 > Math.abs(k) ? (this.y = Math.atan2(g, d), this.z = Math.atan2(h, i)) : (this.y = Math.atan2(-l, e), this.z = 0)) : "ZXY" === b ? (this.x = Math.asin(c(m)), 0.99999 > Math.abs(m) ? (this.y = Math.atan2(-l, d), this.z = Math.atan2(-f, i)) : (this.y = 0, this.z = Math.atan2(h, e))) : "ZYX" === b ? (this.y = Math.asin(-c(l)), 0.99999 > Math.abs(l) ? (this.x = Math.atan2(m, d), this.z = Math.atan2(h, e)) : (this.x = 0, this.z = Math.atan2(-f, i))) : "YZX" === b ? (this.z = Math.asin(c(h)), 0.99999 > Math.abs(h) ? (this.x = Math.atan2(-k, i), this.y = Math.atan2(-l, e)) : (this.x = 0, this.y = Math.atan2(g, d))) : "XZY" === b && (this.z = Math.asin(-c(f)), 0.99999 > Math.abs(f) ? (this.x = Math.atan2(m, i), this.y = Math.atan2(g, e)) : (this.x = Math.atan2(-k, d), this.y = 0));
      return this;
    },
    setEulerFromQuaternion: function(a, b) {
      function c(a2) {
        return Math.min(Math.max(a2, -1), 1);
      }
      var d = a.x * a.x, e = a.y * a.y, f = a.z * a.z, g = a.w * a.w;
      void 0 === b || "XYZ" === b ? (this.x = Math.atan2(2 * (a.x * a.w - a.y * a.z), g - d - e + f), this.y = Math.asin(c(2 * (a.x * a.z + a.y * a.w))), this.z = Math.atan2(2 * (a.z * a.w - a.x * a.y), g + d - e - f)) : "YXZ" === b ? (this.x = Math.asin(c(2 * (a.x * a.w - a.y * a.z))), this.y = Math.atan2(2 * (a.x * a.z + a.y * a.w), g - d - e + f), this.z = Math.atan2(2 * (a.x * a.y + a.z * a.w), g - d + e - f)) : "ZXY" === b ? (this.x = Math.asin(c(2 * (a.x * a.w + a.y * a.z))), this.y = Math.atan2(2 * (a.y * a.w - a.z * a.x), g - d - e + f), this.z = Math.atan2(2 * (a.z * a.w - a.x * a.y), g - d + e - f)) : "ZYX" === b ? (this.x = Math.atan2(2 * (a.x * a.w + a.z * a.y), g - d - e + f), this.y = Math.asin(c(2 * (a.y * a.w - a.x * a.z))), this.z = Math.atan2(2 * (a.x * a.y + a.z * a.w), g + d - e - f)) : "YZX" === b ? (this.x = Math.atan2(2 * (a.x * a.w - a.z * a.y), g - d + e - f), this.y = Math.atan2(2 * (a.y * a.w - a.x * a.z), g + d - e - f), this.z = Math.asin(c(2 * (a.x * a.y + a.z * a.w)))) : "XZY" === b && (this.x = Math.atan2(2 * (a.x * a.w + a.y * a.z), g - d + e - f), this.y = Math.atan2(2 * (a.x * a.z + a.y * a.w), g + d - e - f), this.z = Math.asin(c(2 * (a.z * a.w - a.x * a.y))));
      return this;
    },
    getScaleFromMatrix: function(a) {
      var b = this.set(a.elements[0], a.elements[1], a.elements[2]).length(), c = this.set(a.elements[4], a.elements[5], a.elements[6]).length(), a = this.set(a.elements[8], a.elements[9], a.elements[10]).length();
      this.x = b;
      this.y = c;
      this.z = a;
      return this;
    },
    equals: function(a) {
      return a.x === this.x && a.y === this.y && a.z === this.z;
    },
    clone: function() {
      return new THREE.Vector3(this.x, this.y, this.z);
    }
  };
  THREE.Vector4 = function(a, b, c, d) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
    this.w = void 0 !== d ? d : 1;
  };
  THREE.Vector4.prototype = {
    constructor: THREE.Vector4,
    set: function(a, b, c, d) {
      this.x = a;
      this.y = b;
      this.z = c;
      this.w = d;
      return this;
    },
    setX: function(a) {
      this.x = a;
      return this;
    },
    setY: function(a) {
      this.y = a;
      return this;
    },
    setZ: function(a) {
      this.z = a;
      return this;
    },
    setW: function(a) {
      this.w = a;
      return this;
    },
    setComponent: function(a, b) {
      switch (a) {
        case 0:
          this.x = b;
          break;
        case 1:
          this.y = b;
          break;
        case 2:
          this.z = b;
          break;
        case 3:
          this.w = b;
          break;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    getComponent: function(a) {
      switch (a) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw Error("index is out of range: " + a);
      }
    },
    copy: function(a) {
      this.x = a.x;
      this.y = a.y;
      this.z = a.z;
      this.w = void 0 !== a.w ? a.w : 1;
      return this;
    },
    addScalar: function(a) {
      this.x += a;
      this.y += a;
      this.z += a;
      this.w += a;
      return this;
    },
    add: function(a, b) {
      this.x = a.x + b.x;
      this.y = a.y + b.y;
      this.z = a.z + b.z;
      this.w = a.w + b.w;
      return this;
    },
    addSelf: function(a) {
      this.x += a.x;
      this.y += a.y;
      this.z += a.z;
      this.w += a.w;
      return this;
    },
    sub: function(a, b) {
      this.x = a.x - b.x;
      this.y = a.y - b.y;
      this.z = a.z - b.z;
      this.w = a.w - b.w;
      return this;
    },
    subSelf: function(a) {
      this.x -= a.x;
      this.y -= a.y;
      this.z -= a.z;
      this.w -= a.w;
      return this;
    },
    multiplyScalar: function(a) {
      this.x *= a;
      this.y *= a;
      this.z *= a;
      this.w *= a;
      return this;
    },
    divideScalar: function(a) {
      0 !== a ? (this.x /= a, this.y /= a, this.z /= a, this.w /= a) : (this.z = this.y = this.x = 0, this.w = 1);
      return this;
    },
    minSelf: function(a) {
      this.x > a.x && (this.x = a.x);
      this.y > a.y && (this.y = a.y);
      this.z > a.z && (this.z = a.z);
      this.w > a.w && (this.w = a.w);
      return this;
    },
    maxSelf: function(a) {
      this.x < a.x && (this.x = a.x);
      this.y < a.y && (this.y = a.y);
      this.z < a.z && (this.z = a.z);
      this.w < a.w && (this.w = a.w);
      return this;
    },
    clampSelf: function(a, b) {
      this.x < a.x ? this.x = a.x : this.x > b.x && (this.x = b.x);
      this.y < a.y ? this.y = a.y : this.y > b.y && (this.y = b.y);
      this.z < a.z ? this.z = a.z : this.z > b.z && (this.z = b.z);
      this.w < a.w ? this.w = a.w : this.w > b.w && (this.w = b.w);
      return this;
    },
    negate: function() {
      return this.multiplyScalar(-1);
    },
    dot: function(a) {
      return this.x * a.x + this.y * a.y + this.z * a.z + this.w * a.w;
    },
    lengthSq: function() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },
    length: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    },
    lengthManhattan: function() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    },
    normalize: function() {
      return this.divideScalar(this.length());
    },
    setLength: function(a) {
      var b = this.length();
      0 !== b && a !== b && this.multiplyScalar(a / b);
      return this;
    },
    lerpSelf: function(a, b) {
      this.x += (a.x - this.x) * b;
      this.y += (a.y - this.y) * b;
      this.z += (a.z - this.z) * b;
      this.w += (a.w - this.w) * b;
      return this;
    },
    equals: function(a) {
      return a.x === this.x && a.y === this.y && a.z === this.z && a.w === this.w;
    },
    clone: function() {
      return new THREE.Vector4(this.x, this.y, this.z, this.w);
    },
    setAxisAngleFromQuaternion: function(a) {
      this.w = 2 * Math.acos(a.w);
      var b = Math.sqrt(1 - a.w * a.w);
      1e-4 > b ? (this.x = 1, this.z = this.y = 0) : (this.x = a.x / b, this.y = a.y / b, this.z = a.z / b);
      return this;
    },
    setAxisAngleFromRotationMatrix: function(a) {
      var b, c, d, a = a.elements, e = a[0];
      d = a[4];
      var f = a[8], g = a[1], h = a[5], i = a[9];
      c = a[2];
      b = a[6];
      var k = a[10];
      if (0.01 > Math.abs(d - g) && 0.01 > Math.abs(f - c) && 0.01 > Math.abs(i - b)) {
        if (0.1 > Math.abs(d + g) && 0.1 > Math.abs(f + c) && 0.1 > Math.abs(i + b) && 0.1 > Math.abs(e + h + k - 3))
          return this.set(1, 0, 0, 0), this;
        a = Math.PI;
        e = (e + 1) / 2;
        h = (h + 1) / 2;
        k = (k + 1) / 2;
        d = (d + g) / 4;
        f = (f + c) / 4;
        i = (i + b) / 4;
        e > h && e > k ? 0.01 > e ? (b = 0, d = c = 0.707106781) : (b = Math.sqrt(e), c = d / b, d = f / b) : h > k ? 0.01 > h ? (b = 0.707106781, c = 0, d = 0.707106781) : (c = Math.sqrt(h), b = d / c, d = i / c) : 0.01 > k ? (c = b = 0.707106781, d = 0) : (d = Math.sqrt(k), b = f / d, c = i / d);
        this.set(b, c, d, a);
        return this;
      }
      a = Math.sqrt((b - i) * (b - i) + (f - c) * (f - c) + (g - d) * (g - d));
      1e-3 > Math.abs(a) && (a = 1);
      this.x = (b - i) / a;
      this.y = (f - c) / a;
      this.z = (g - d) / a;
      this.w = Math.acos((e + h + k - 1) / 2);
      return this;
    }
  };
  THREE.Box2 = function(a, b) {
    this.min = void 0 !== a ? a.clone() : new THREE.Vector2(Infinity, Infinity);
    this.max = void 0 !== b ? b.clone() : new THREE.Vector2(-Infinity, -Infinity);
  };
  THREE.Box2.prototype = { constructor: THREE.Box2, set: function(a, b) {
    this.min.copy(a);
    this.max.copy(b);
    return this;
  }, setFromPoints: function(a) {
    if (0 < a.length) {
      var b = a[0];
      this.min.copy(b);
      this.max.copy(b);
      for (var c = 1, d = a.length; c < d; c++)
        b = a[c], b.x < this.min.x ? this.min.x = b.x : b.x > this.max.x && (this.max.x = b.x), b.y < this.min.y ? this.min.y = b.y : b.y > this.max.y && (this.max.y = b.y);
    } else
      this.makeEmpty();
    return this;
  }, setFromCenterAndSize: function(a, b) {
    var c = THREE.Box2.__v1.copy(b).multiplyScalar(0.5);
    this.min.copy(a).subSelf(c);
    this.max.copy(a).addSelf(c);
    return this;
  }, copy: function(a) {
    this.min.copy(a.min);
    this.max.copy(a.max);
    return this;
  }, makeEmpty: function() {
    this.min.x = this.min.y = Infinity;
    this.max.x = this.max.y = -Infinity;
    return this;
  }, empty: function() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }, center: function(a) {
    return (a || new THREE.Vector2()).add(this.min, this.max).multiplyScalar(0.5);
  }, size: function(a) {
    return (a || new THREE.Vector2()).sub(this.max, this.min);
  }, expandByPoint: function(a) {
    this.min.minSelf(a);
    this.max.maxSelf(a);
    return this;
  }, expandByVector: function(a) {
    this.min.subSelf(a);
    this.max.addSelf(a);
    return this;
  }, expandByScalar: function(a) {
    this.min.addScalar(-a);
    this.max.addScalar(a);
    return this;
  }, containsPoint: function(a) {
    return this.min.x <= a.x && a.x <= this.max.x && this.min.y <= a.y && a.y <= this.max.y ? true : false;
  }, containsBox: function(a) {
    return this.min.x <= a.min.x && a.max.x <= this.max.x && this.min.y <= a.min.y && a.max.y <= this.max.y ? true : false;
  }, getParameter: function(a) {
    return new THREE.Vector2((a.x - this.min.x) / (this.max.x - this.min.x), (a.y - this.min.y) / (this.max.y - this.min.y));
  }, isIntersectionBox: function(a) {
    return a.max.x < this.min.x || a.min.x > this.max.x || a.max.y < this.min.y || a.min.y > this.max.y ? false : true;
  }, clampPoint: function(a, b) {
    return (b || new THREE.Vector2()).copy(a).clampSelf(this.min, this.max);
  }, distanceToPoint: function(a) {
    return THREE.Box2.__v1.copy(a).clampSelf(this.min, this.max).subSelf(a).length();
  }, intersect: function(a) {
    this.min.maxSelf(a.min);
    this.max.minSelf(a.max);
    return this;
  }, union: function(a) {
    this.min.minSelf(a.min);
    this.max.maxSelf(a.max);
    return this;
  }, translate: function(a) {
    this.min.addSelf(a);
    this.max.addSelf(a);
    return this;
  }, equals: function(a) {
    return a.min.equals(this.min) && a.max.equals(this.max);
  }, clone: function() {
    return new THREE.Box2().copy(this);
  } };
  THREE.Box2.__v1 = new THREE.Vector2();
  THREE.Box3 = function(a, b) {
    this.min = void 0 !== a ? a.clone() : new THREE.Vector3(Infinity, Infinity, Infinity);
    this.max = void 0 !== b ? b.clone() : new THREE.Vector3(-Infinity, -Infinity, -Infinity);
  };
  THREE.Box3.prototype = { constructor: THREE.Box3, set: function(a, b) {
    this.min.copy(a);
    this.max.copy(b);
    return this;
  }, setFromPoints: function(a) {
    if (0 < a.length) {
      var b = a[0];
      this.min.copy(b);
      this.max.copy(b);
      for (var c = 1, d = a.length; c < d; c++)
        b = a[c], b.x < this.min.x ? this.min.x = b.x : b.x > this.max.x && (this.max.x = b.x), b.y < this.min.y ? this.min.y = b.y : b.y > this.max.y && (this.max.y = b.y), b.z < this.min.z ? this.min.z = b.z : b.z > this.max.z && (this.max.z = b.z);
    } else
      this.makeEmpty();
    return this;
  }, setFromCenterAndSize: function(a, b) {
    var c = THREE.Box3.__v1.copy(b).multiplyScalar(0.5);
    this.min.copy(a).subSelf(c);
    this.max.copy(a).addSelf(c);
    return this;
  }, copy: function(a) {
    this.min.copy(a.min);
    this.max.copy(a.max);
    return this;
  }, makeEmpty: function() {
    this.min.x = this.min.y = this.min.z = Infinity;
    this.max.x = this.max.y = this.max.z = -Infinity;
    return this;
  }, empty: function() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }, center: function(a) {
    return (a || new THREE.Vector3()).add(this.min, this.max).multiplyScalar(0.5);
  }, size: function(a) {
    return (a || new THREE.Vector3()).sub(
      this.max,
      this.min
    );
  }, expandByPoint: function(a) {
    this.min.minSelf(a);
    this.max.maxSelf(a);
    return this;
  }, expandByVector: function(a) {
    this.min.subSelf(a);
    this.max.addSelf(a);
    return this;
  }, expandByScalar: function(a) {
    this.min.addScalar(-a);
    this.max.addScalar(a);
    return this;
  }, containsPoint: function(a) {
    return this.min.x <= a.x && a.x <= this.max.x && this.min.y <= a.y && a.y <= this.max.y && this.min.z <= a.z && a.z <= this.max.z ? true : false;
  }, containsBox: function(a) {
    return this.min.x <= a.min.x && a.max.x <= this.max.x && this.min.y <= a.min.y && a.max.y <= this.max.y && this.min.z <= a.min.z && a.max.z <= this.max.z ? true : false;
  }, getParameter: function(a) {
    return new THREE.Vector3((a.x - this.min.x) / (this.max.x - this.min.x), (a.y - this.min.y) / (this.max.y - this.min.y), (a.z - this.min.z) / (this.max.z - this.min.z));
  }, isIntersectionBox: function(a) {
    return a.max.x < this.min.x || a.min.x > this.max.x || a.max.y < this.min.y || a.min.y > this.max.y || a.max.z < this.min.z || a.min.z > this.max.z ? false : true;
  }, clampPoint: function(a, b) {
    b || new THREE.Vector3();
    return new THREE.Vector3().copy(a).clampSelf(this.min, this.max);
  }, distanceToPoint: function(a) {
    return THREE.Box3.__v1.copy(a).clampSelf(
      this.min,
      this.max
    ).subSelf(a).length();
  }, getBoundingSphere: function(a) {
    a = a || new THREE.Sphere();
    a.center = this.center();
    a.radius = 0.5 * this.size(THREE.Box3.__v0).length();
    return a;
  }, intersect: function(a) {
    this.min.maxSelf(a.min);
    this.max.minSelf(a.max);
    return this;
  }, union: function(a) {
    this.min.minSelf(a.min);
    this.max.maxSelf(a.max);
    return this;
  }, transform: function(a) {
    a = [a.multiplyVector3(THREE.Box3.__v0.set(this.min.x, this.min.y, this.min.z)), a.multiplyVector3(THREE.Box3.__v1.set(this.min.x, this.min.y, this.max.z)), a.multiplyVector3(THREE.Box3.__v2.set(
      this.min.x,
      this.max.y,
      this.min.z
    )), a.multiplyVector3(THREE.Box3.__v3.set(this.min.x, this.max.y, this.max.z)), a.multiplyVector3(THREE.Box3.__v4.set(this.max.x, this.min.y, this.min.z)), a.multiplyVector3(THREE.Box3.__v5.set(this.max.x, this.min.y, this.max.z)), a.multiplyVector3(THREE.Box3.__v6.set(this.max.x, this.max.y, this.min.z)), a.multiplyVector3(THREE.Box3.__v7.set(this.max.x, this.max.y, this.max.z))];
    this.makeEmpty();
    this.setFromPoints(a);
    return this;
  }, translate: function(a) {
    this.min.addSelf(a);
    this.max.addSelf(a);
    return this;
  }, equals: function(a) {
    return a.min.equals(this.min) && a.max.equals(this.max);
  }, clone: function() {
    return new THREE.Box3().copy(this);
  } };
  THREE.Box3.__v0 = new THREE.Vector3();
  THREE.Box3.__v1 = new THREE.Vector3();
  THREE.Box3.__v2 = new THREE.Vector3();
  THREE.Box3.__v3 = new THREE.Vector3();
  THREE.Box3.__v4 = new THREE.Vector3();
  THREE.Box3.__v5 = new THREE.Vector3();
  THREE.Box3.__v6 = new THREE.Vector3();
  THREE.Box3.__v7 = new THREE.Vector3();
  THREE.Matrix3 = function(a, b, c, d, e, f, g, h, i) {
    this.elements = new Float32Array(9);
    this.set(void 0 !== a ? a : 1, b || 0, c || 0, d || 0, void 0 !== e ? e : 1, f || 0, g || 0, h || 0, void 0 !== i ? i : 1);
  };
  THREE.Matrix3.prototype = { constructor: THREE.Matrix3, set: function(a, b, c, d, e, f, g, h, i) {
    var k = this.elements;
    k[0] = a;
    k[3] = b;
    k[6] = c;
    k[1] = d;
    k[4] = e;
    k[7] = f;
    k[2] = g;
    k[5] = h;
    k[8] = i;
    return this;
  }, identity: function() {
    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
    return this;
  }, copy: function(a) {
    a = a.elements;
    this.set(a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]);
    return this;
  }, multiplyVector3: function(a) {
    var b = this.elements, c = a.x, d = a.y, e = a.z;
    a.x = b[0] * c + b[3] * d + b[6] * e;
    a.y = b[1] * c + b[4] * d + b[7] * e;
    a.z = b[2] * c + b[5] * d + b[8] * e;
    return a;
  }, multiplyVector3Array: function(a) {
    for (var b = THREE.Matrix3.__v1, c = 0, d = a.length; c < d; c += 3)
      b.x = a[c], b.y = a[c + 1], b.z = a[c + 2], this.multiplyVector3(b), a[c] = b.x, a[c + 1] = b.y, a[c + 2] = b.z;
    return a;
  }, multiplyScalar: function(a) {
    var b = this.elements;
    b[0] *= a;
    b[3] *= a;
    b[6] *= a;
    b[1] *= a;
    b[4] *= a;
    b[7] *= a;
    b[2] *= a;
    b[5] *= a;
    b[8] *= a;
    return this;
  }, determinant: function() {
    var a = this.elements, b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], i = a[7], a = a[8];
    return b * f * a - b * g * i - c * e * a + c * g * h + d * e * i - d * f * h;
  }, getInverse: function(a, b) {
    var c = a.elements, d = this.elements;
    d[0] = c[10] * c[5] - c[6] * c[9];
    d[1] = -c[10] * c[1] + c[2] * c[9];
    d[2] = c[6] * c[1] - c[2] * c[5];
    d[3] = -c[10] * c[4] + c[6] * c[8];
    d[4] = c[10] * c[0] - c[2] * c[8];
    d[5] = -c[6] * c[0] + c[2] * c[4];
    d[6] = c[9] * c[4] - c[5] * c[8];
    d[7] = -c[9] * c[0] + c[1] * c[8];
    d[8] = c[5] * c[0] - c[1] * c[4];
    c = c[0] * d[0] + c[1] * d[3] + c[2] * d[6];
    if (0 === c) {
      if (b)
        throw Error("Matrix3.getInverse(): can't invert matrix, determinant is 0");
      console.warn("Matrix3.getInverse(): can't invert matrix, determinant is 0");
      this.identity();
      return this;
    }
    this.multiplyScalar(1 / c);
    return this;
  }, transpose: function() {
    var a, b = this.elements;
    a = b[1];
    b[1] = b[3];
    b[3] = a;
    a = b[2];
    b[2] = b[6];
    b[6] = a;
    a = b[5];
    b[5] = b[7];
    b[7] = a;
    return this;
  }, transposeIntoArray: function(a) {
    var b = this.elements;
    a[0] = b[0];
    a[1] = b[3];
    a[2] = b[6];
    a[3] = b[1];
    a[4] = b[4];
    a[5] = b[7];
    a[6] = b[2];
    a[7] = b[5];
    a[8] = b[8];
    return this;
  }, clone: function() {
    var a = this.elements;
    return new THREE.Matrix3(a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8]);
  } };
  THREE.Matrix3.__v1 = new THREE.Vector3();
  THREE.Matrix4 = function(a, b, c, d, e, f, g, h, i, k, l, m, p, s, q, n) {
    this.elements = new Float32Array(16);
    this.set(void 0 !== a ? a : 1, b || 0, c || 0, d || 0, e || 0, void 0 !== f ? f : 1, g || 0, h || 0, i || 0, k || 0, void 0 !== l ? l : 1, m || 0, p || 0, s || 0, q || 0, void 0 !== n ? n : 1);
  };
  THREE.Matrix4.prototype = {
    constructor: THREE.Matrix4,
    set: function(a, b, c, d, e, f, g, h, i, k, l, m, p, s, q, n) {
      var r = this.elements;
      r[0] = a;
      r[4] = b;
      r[8] = c;
      r[12] = d;
      r[1] = e;
      r[5] = f;
      r[9] = g;
      r[13] = h;
      r[2] = i;
      r[6] = k;
      r[10] = l;
      r[14] = m;
      r[3] = p;
      r[7] = s;
      r[11] = q;
      r[15] = n;
      return this;
    },
    identity: function() {
      this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      return this;
    },
    copy: function(a) {
      a = a.elements;
      this.set(a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]);
      return this;
    },
    setRotationFromEuler: function(a, b) {
      var c = this.elements, d = a.x, e = a.y, f = a.z, g = Math.cos(d), d = Math.sin(d), h = Math.cos(e), e = Math.sin(e), i = Math.cos(f), f = Math.sin(f);
      if (void 0 === b || "XYZ" === b) {
        var k = g * i, l = g * f, m = d * i, p = d * f;
        c[0] = h * i;
        c[4] = -h * f;
        c[8] = e;
        c[1] = l + m * e;
        c[5] = k - p * e;
        c[9] = -d * h;
        c[2] = p - k * e;
        c[6] = m + l * e;
        c[10] = g * h;
      } else
        "YXZ" === b ? (k = h * i, l = h * f, m = e * i, p = e * f, c[0] = k + p * d, c[4] = m * d - l, c[8] = g * e, c[1] = g * f, c[5] = g * i, c[9] = -d, c[2] = l * d - m, c[6] = p + k * d, c[10] = g * h) : "ZXY" === b ? (k = h * i, l = h * f, m = e * i, p = e * f, c[0] = k - p * d, c[4] = -g * f, c[8] = m + l * d, c[1] = l + m * d, c[5] = g * i, c[9] = p - k * d, c[2] = -g * e, c[6] = d, c[10] = g * h) : "ZYX" === b ? (k = g * i, l = g * f, m = d * i, p = d * f, c[0] = h * i, c[4] = m * e - l, c[8] = k * e + p, c[1] = h * f, c[5] = p * e + k, c[9] = l * e - m, c[2] = -e, c[6] = d * h, c[10] = g * h) : "YZX" === b ? (k = g * h, l = g * e, m = d * h, p = d * e, c[0] = h * i, c[4] = p - k * f, c[8] = m * f + l, c[1] = f, c[5] = g * i, c[9] = -d * i, c[2] = -e * i, c[6] = l * f + m, c[10] = k - p * f) : "XZY" === b && (k = g * h, l = g * e, m = d * h, p = d * e, c[0] = h * i, c[4] = -f, c[8] = e * i, c[1] = k * f + p, c[5] = g * i, c[9] = l * f - m, c[2] = m * f - l, c[6] = d * i, c[10] = p * f + k);
      return this;
    },
    setRotationFromQuaternion: function(a) {
      var b = this.elements, c = a.x, d = a.y, e = a.z, f = a.w, g = c + c, h = d + d, i = e + e, a = c * g, k = c * h, c = c * i, l = d * h, d = d * i, e = e * i, g = f * g, h = f * h, f = f * i;
      b[0] = 1 - (l + e);
      b[4] = k - f;
      b[8] = c + h;
      b[1] = k + f;
      b[5] = 1 - (a + e);
      b[9] = d - g;
      b[2] = c - h;
      b[6] = d + g;
      b[10] = 1 - (a + l);
      return this;
    },
    lookAt: function(a, b, c) {
      var d = this.elements, e = THREE.Matrix4.__v1, f = THREE.Matrix4.__v2, g = THREE.Matrix4.__v3;
      g.sub(a, b).normalize();
      0 === g.length() && (g.z = 1);
      e.cross(c, g).normalize();
      0 === e.length() && (g.x += 1e-4, e.cross(c, g).normalize());
      f.cross(g, e);
      d[0] = e.x;
      d[4] = f.x;
      d[8] = g.x;
      d[1] = e.y;
      d[5] = f.y;
      d[9] = g.y;
      d[2] = e.z;
      d[6] = f.z;
      d[10] = g.z;
      return this;
    },
    multiply: function(a, b) {
      var c = a.elements, d = b.elements, e = this.elements, f = c[0], g = c[4], h = c[8], i = c[12], k = c[1], l = c[5], m = c[9], p = c[13], s = c[2], q = c[6], n = c[10], r = c[14], v = c[3], w = c[7], x = c[11], c = c[15], t = d[0], K = d[4], D = d[8], B = d[12], z = d[1], E = d[5], G = d[9], I = d[13], Y = d[2], C = d[6], P = d[10], A = d[14], J = d[3], M = d[7], T = d[11], d = d[15];
      e[0] = f * t + g * z + h * Y + i * J;
      e[4] = f * K + g * E + h * C + i * M;
      e[8] = f * D + g * G + h * P + i * T;
      e[12] = f * B + g * I + h * A + i * d;
      e[1] = k * t + l * z + m * Y + p * J;
      e[5] = k * K + l * E + m * C + p * M;
      e[9] = k * D + l * G + m * P + p * T;
      e[13] = k * B + l * I + m * A + p * d;
      e[2] = s * t + q * z + n * Y + r * J;
      e[6] = s * K + q * E + n * C + r * M;
      e[10] = s * D + q * G + n * P + r * T;
      e[14] = s * B + q * I + n * A + r * d;
      e[3] = v * t + w * z + x * Y + c * J;
      e[7] = v * K + w * E + x * C + c * M;
      e[11] = v * D + w * G + x * P + c * T;
      e[15] = v * B + w * I + x * A + c * d;
      return this;
    },
    multiplySelf: function(a) {
      return this.multiply(this, a);
    },
    multiplyToArray: function(a, b, c) {
      var d = this.elements;
      this.multiply(a, b);
      c[0] = d[0];
      c[1] = d[1];
      c[2] = d[2];
      c[3] = d[3];
      c[4] = d[4];
      c[5] = d[5];
      c[6] = d[6];
      c[7] = d[7];
      c[8] = d[8];
      c[9] = d[9];
      c[10] = d[10];
      c[11] = d[11];
      c[12] = d[12];
      c[13] = d[13];
      c[14] = d[14];
      c[15] = d[15];
      return this;
    },
    multiplyScalar: function(a) {
      var b = this.elements;
      b[0] *= a;
      b[4] *= a;
      b[8] *= a;
      b[12] *= a;
      b[1] *= a;
      b[5] *= a;
      b[9] *= a;
      b[13] *= a;
      b[2] *= a;
      b[6] *= a;
      b[10] *= a;
      b[14] *= a;
      b[3] *= a;
      b[7] *= a;
      b[11] *= a;
      b[15] *= a;
      return this;
    },
    multiplyVector3: function(a) {
      var b = this.elements, c = a.x, d = a.y, e = a.z, f = 1 / (b[3] * c + b[7] * d + b[11] * e + b[15]);
      a.x = (b[0] * c + b[4] * d + b[8] * e + b[12]) * f;
      a.y = (b[1] * c + b[5] * d + b[9] * e + b[13]) * f;
      a.z = (b[2] * c + b[6] * d + b[10] * e + b[14]) * f;
      return a;
    },
    multiplyVector4: function(a) {
      var b = this.elements, c = a.x, d = a.y, e = a.z, f = a.w;
      a.x = b[0] * c + b[4] * d + b[8] * e + b[12] * f;
      a.y = b[1] * c + b[5] * d + b[9] * e + b[13] * f;
      a.z = b[2] * c + b[6] * d + b[10] * e + b[14] * f;
      a.w = b[3] * c + b[7] * d + b[11] * e + b[15] * f;
      return a;
    },
    multiplyVector3Array: function(a) {
      for (var b = THREE.Matrix4.__v1, c = 0, d = a.length; c < d; c += 3)
        b.x = a[c], b.y = a[c + 1], b.z = a[c + 2], this.multiplyVector3(b), a[c] = b.x, a[c + 1] = b.y, a[c + 2] = b.z;
      return a;
    },
    rotateAxis: function(a) {
      var b = this.elements, c = a.x, d = a.y, e = a.z;
      a.x = c * b[0] + d * b[4] + e * b[8];
      a.y = c * b[1] + d * b[5] + e * b[9];
      a.z = c * b[2] + d * b[6] + e * b[10];
      a.normalize();
      return a;
    },
    crossVector: function(a) {
      var b = this.elements, c = new THREE.Vector4();
      c.x = b[0] * a.x + b[4] * a.y + b[8] * a.z + b[12] * a.w;
      c.y = b[1] * a.x + b[5] * a.y + b[9] * a.z + b[13] * a.w;
      c.z = b[2] * a.x + b[6] * a.y + b[10] * a.z + b[14] * a.w;
      c.w = a.w ? b[3] * a.x + b[7] * a.y + b[11] * a.z + b[15] * a.w : 1;
      return c;
    },
    determinant: function() {
      var a = this.elements, b = a[0], c = a[4], d = a[8], e = a[12], f = a[1], g = a[5], h = a[9], i = a[13], k = a[2], l = a[6], m = a[10], p = a[14];
      return a[3] * (+e * h * l - d * i * l - e * g * m + c * i * m + d * g * p - c * h * p) + a[7] * (+b * h * p - b * i * m + e * f * m - d * f * p + d * i * k - e * h * k) + a[11] * (+b * i * l - b * g * p - e * f * l + c * f * p + e * g * k - c * i * k) + a[15] * (-d * g * k - b * h * l + b * g * m + d * f * l - c * f * m + c * h * k);
    },
    transpose: function() {
      var a = this.elements, b;
      b = a[1];
      a[1] = a[4];
      a[4] = b;
      b = a[2];
      a[2] = a[8];
      a[8] = b;
      b = a[6];
      a[6] = a[9];
      a[9] = b;
      b = a[3];
      a[3] = a[12];
      a[12] = b;
      b = a[7];
      a[7] = a[13];
      a[13] = b;
      b = a[11];
      a[11] = a[14];
      a[14] = b;
      return this;
    },
    flattenToArray: function(a) {
      var b = this.elements;
      a[0] = b[0];
      a[1] = b[1];
      a[2] = b[2];
      a[3] = b[3];
      a[4] = b[4];
      a[5] = b[5];
      a[6] = b[6];
      a[7] = b[7];
      a[8] = b[8];
      a[9] = b[9];
      a[10] = b[10];
      a[11] = b[11];
      a[12] = b[12];
      a[13] = b[13];
      a[14] = b[14];
      a[15] = b[15];
      return a;
    },
    flattenToArrayOffset: function(a, b) {
      var c = this.elements;
      a[b] = c[0];
      a[b + 1] = c[1];
      a[b + 2] = c[2];
      a[b + 3] = c[3];
      a[b + 4] = c[4];
      a[b + 5] = c[5];
      a[b + 6] = c[6];
      a[b + 7] = c[7];
      a[b + 8] = c[8];
      a[b + 9] = c[9];
      a[b + 10] = c[10];
      a[b + 11] = c[11];
      a[b + 12] = c[12];
      a[b + 13] = c[13];
      a[b + 14] = c[14];
      a[b + 15] = c[15];
      return a;
    },
    getPosition: function() {
      var a = this.elements;
      return THREE.Matrix4.__v1.set(a[12], a[13], a[14]);
    },
    setPosition: function(a) {
      var b = this.elements;
      b[12] = a.x;
      b[13] = a.y;
      b[14] = a.z;
      return this;
    },
    getColumnX: function() {
      var a = this.elements;
      return THREE.Matrix4.__v1.set(a[0], a[1], a[2]);
    },
    getColumnY: function() {
      var a = this.elements;
      return THREE.Matrix4.__v1.set(
        a[4],
        a[5],
        a[6]
      );
    },
    getColumnZ: function() {
      var a = this.elements;
      return THREE.Matrix4.__v1.set(a[8], a[9], a[10]);
    },
    getInverse: function(a, b) {
      var c = this.elements, d = a.elements, e = d[0], f = d[4], g = d[8], h = d[12], i = d[1], k = d[5], l = d[9], m = d[13], p = d[2], s = d[6], q = d[10], n = d[14], r = d[3], v = d[7], w = d[11], x = d[15];
      c[0] = l * n * v - m * q * v + m * s * w - k * n * w - l * s * x + k * q * x;
      c[4] = h * q * v - g * n * v - h * s * w + f * n * w + g * s * x - f * q * x;
      c[8] = g * m * v - h * l * v + h * k * w - f * m * w - g * k * x + f * l * x;
      c[12] = h * l * s - g * m * s - h * k * q + f * m * q + g * k * n - f * l * n;
      c[1] = m * q * r - l * n * r - m * p * w + i * n * w + l * p * x - i * q * x;
      c[5] = g * n * r - h * q * r + h * p * w - e * n * w - g * p * x + e * q * x;
      c[9] = h * l * r - g * m * r - h * i * w + e * m * w + g * i * x - e * l * x;
      c[13] = g * m * p - h * l * p + h * i * q - e * m * q - g * i * n + e * l * n;
      c[2] = k * n * r - m * s * r + m * p * v - i * n * v - k * p * x + i * s * x;
      c[6] = h * s * r - f * n * r - h * p * v + e * n * v + f * p * x - e * s * x;
      c[10] = f * m * r - h * k * r + h * i * v - e * m * v - f * i * x + e * k * x;
      c[14] = h * k * p - f * m * p - h * i * s + e * m * s + f * i * n - e * k * n;
      c[3] = l * s * r - k * q * r - l * p * v + i * q * v + k * p * w - i * s * w;
      c[7] = f * q * r - g * s * r + g * p * v - e * q * v - f * p * w + e * s * w;
      c[11] = g * k * r - f * l * r - g * i * v + e * l * v + f * i * w - e * k * w;
      c[15] = f * l * p - g * k * p + g * i * s - e * l * s - f * i * q + e * k * q;
      c = d[0] * c[0] + d[1] * c[4] + d[2] * c[8] + d[3] * c[12];
      if (0 == c) {
        if (b)
          throw Error("Matrix4.getInverse(): can't invert matrix, determinant is 0");
        console.warn("Matrix4.getInverse(): can't invert matrix, determinant is 0");
        this.identity();
        return this;
      }
      this.multiplyScalar(1 / c);
      return this;
    },
    compose: function(a, b, c) {
      var d = this.elements, e = THREE.Matrix4.__m1, f = THREE.Matrix4.__m2;
      e.identity();
      e.setRotationFromQuaternion(b);
      f.makeScale(c);
      this.multiply(e, f);
      d[12] = a.x;
      d[13] = a.y;
      d[14] = a.z;
      return this;
    },
    decompose: function(a, b, c) {
      var d = this.elements, e = THREE.Matrix4.__v1, f = THREE.Matrix4.__v2, g = THREE.Matrix4.__v3;
      e.set(d[0], d[1], d[2]);
      f.set(d[4], d[5], d[6]);
      g.set(d[8], d[9], d[10]);
      a = a instanceof THREE.Vector3 ? a : new THREE.Vector3();
      b = b instanceof THREE.Quaternion ? b : new THREE.Quaternion();
      c = c instanceof THREE.Vector3 ? c : new THREE.Vector3();
      c.x = e.length();
      c.y = f.length();
      c.z = g.length();
      a.x = d[12];
      a.y = d[13];
      a.z = d[14];
      d = THREE.Matrix4.__m1;
      d.copy(this);
      d.elements[0] /= c.x;
      d.elements[1] /= c.x;
      d.elements[2] /= c.x;
      d.elements[4] /= c.y;
      d.elements[5] /= c.y;
      d.elements[6] /= c.y;
      d.elements[8] /= c.z;
      d.elements[9] /= c.z;
      d.elements[10] /= c.z;
      b.setFromRotationMatrix(d);
      return [a, b, c];
    },
    extractPosition: function(a) {
      var b = this.elements, a = a.elements;
      b[12] = a[12];
      b[13] = a[13];
      b[14] = a[14];
      return this;
    },
    extractRotation: function(a) {
      var b = this.elements, a = a.elements, c = THREE.Matrix4.__v1, d = 1 / c.set(a[0], a[1], a[2]).length(), e = 1 / c.set(a[4], a[5], a[6]).length(), c = 1 / c.set(a[8], a[9], a[10]).length();
      b[0] = a[0] * d;
      b[1] = a[1] * d;
      b[2] = a[2] * d;
      b[4] = a[4] * e;
      b[5] = a[5] * e;
      b[6] = a[6] * e;
      b[8] = a[8] * c;
      b[9] = a[9] * c;
      b[10] = a[10] * c;
      return this;
    },
    translate: function(a) {
      var b = this.elements, c = a.x, d = a.y, a = a.z;
      b[12] = b[0] * c + b[4] * d + b[8] * a + b[12];
      b[13] = b[1] * c + b[5] * d + b[9] * a + b[13];
      b[14] = b[2] * c + b[6] * d + b[10] * a + b[14];
      b[15] = b[3] * c + b[7] * d + b[11] * a + b[15];
      return this;
    },
    rotateX: function(a) {
      var b = this.elements, c = b[4], d = b[5], e = b[6], f = b[7], g = b[8], h = b[9], i = b[10], k = b[11], l = Math.cos(a), a = Math.sin(a);
      b[4] = l * c + a * g;
      b[5] = l * d + a * h;
      b[6] = l * e + a * i;
      b[7] = l * f + a * k;
      b[8] = l * g - a * c;
      b[9] = l * h - a * d;
      b[10] = l * i - a * e;
      b[11] = l * k - a * f;
      return this;
    },
    rotateY: function(a) {
      var b = this.elements, c = b[0], d = b[1], e = b[2], f = b[3], g = b[8], h = b[9], i = b[10], k = b[11], l = Math.cos(a), a = Math.sin(a);
      b[0] = l * c - a * g;
      b[1] = l * d - a * h;
      b[2] = l * e - a * i;
      b[3] = l * f - a * k;
      b[8] = l * g + a * c;
      b[9] = l * h + a * d;
      b[10] = l * i + a * e;
      b[11] = l * k + a * f;
      return this;
    },
    rotateZ: function(a) {
      var b = this.elements, c = b[0], d = b[1], e = b[2], f = b[3], g = b[4], h = b[5], i = b[6], k = b[7], l = Math.cos(a), a = Math.sin(a);
      b[0] = l * c + a * g;
      b[1] = l * d + a * h;
      b[2] = l * e + a * i;
      b[3] = l * f + a * k;
      b[4] = l * g - a * c;
      b[5] = l * h - a * d;
      b[6] = l * i - a * e;
      b[7] = l * k - a * f;
      return this;
    },
    rotateByAxis: function(a, b) {
      var c = this.elements;
      if (1 === a.x && 0 === a.y && 0 === a.z)
        return this.rotateX(b);
      if (0 === a.x && 1 === a.y && 0 === a.z)
        return this.rotateY(b);
      if (0 === a.x && 0 === a.y && 1 === a.z)
        return this.rotateZ(b);
      var d = a.x, e = a.y, f = a.z, g = Math.sqrt(d * d + e * e + f * f), d = d / g, e = e / g, f = f / g, g = d * d, h = e * e, i = f * f, k = Math.cos(b), l = Math.sin(b), m = 1 - k, p = d * e * m, s = d * f * m, m = e * f * m, d = d * l, q = e * l, l = f * l, f = g + (1 - g) * k, g = p + l, e = s - q, p = p - l, h = h + (1 - h) * k, l = m + d, s = s + q, m = m - d, i = i + (1 - i) * k, k = c[0], d = c[1], q = c[2], n = c[3], r = c[4], v = c[5], w = c[6], x = c[7], t = c[8], K = c[9], D = c[10], B = c[11];
      c[0] = f * k + g * r + e * t;
      c[1] = f * d + g * v + e * K;
      c[2] = f * q + g * w + e * D;
      c[3] = f * n + g * x + e * B;
      c[4] = p * k + h * r + l * t;
      c[5] = p * d + h * v + l * K;
      c[6] = p * q + h * w + l * D;
      c[7] = p * n + h * x + l * B;
      c[8] = s * k + m * r + i * t;
      c[9] = s * d + m * v + i * K;
      c[10] = s * q + m * w + i * D;
      c[11] = s * n + m * x + i * B;
      return this;
    },
    scale: function(a) {
      var b = this.elements, c = a.x, d = a.y, a = a.z;
      b[0] *= c;
      b[4] *= d;
      b[8] *= a;
      b[1] *= c;
      b[5] *= d;
      b[9] *= a;
      b[2] *= c;
      b[6] *= d;
      b[10] *= a;
      b[3] *= c;
      b[7] *= d;
      b[11] *= a;
      return this;
    },
    getMaxScaleOnAxis: function() {
      var a = this.elements;
      return Math.sqrt(Math.max(a[0] * a[0] + a[1] * a[1] + a[2] * a[2], Math.max(a[4] * a[4] + a[5] * a[5] + a[6] * a[6], a[8] * a[8] + a[9] * a[9] + a[10] * a[10])));
    },
    makeTranslation: function(a) {
      this.set(1, 0, 0, a.x, 0, 1, 0, a.y, 0, 0, 1, a.z, 0, 0, 0, 1);
      return this;
    },
    makeRotationX: function(a) {
      var b = Math.cos(a), a = Math.sin(a);
      this.set(1, 0, 0, 0, 0, b, -a, 0, 0, a, b, 0, 0, 0, 0, 1);
      return this;
    },
    makeRotationY: function(a) {
      var b = Math.cos(a), a = Math.sin(a);
      this.set(b, 0, a, 0, 0, 1, 0, 0, -a, 0, b, 0, 0, 0, 0, 1);
      return this;
    },
    makeRotationZ: function(a) {
      var b = Math.cos(a), a = Math.sin(a);
      this.set(b, -a, 0, 0, a, b, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      return this;
    },
    makeRotationAxis: function(a, b) {
      var c = Math.cos(b), d = Math.sin(b), e = 1 - c, f = a.x, g = a.y, h = a.z, i = e * f, k = e * g;
      this.set(i * f + c, i * g - d * h, i * h + d * g, 0, i * g + d * h, k * g + c, k * h - d * f, 0, i * h - d * g, k * h + d * f, e * h * h + c, 0, 0, 0, 0, 1);
      return this;
    },
    makeScale: function(a) {
      this.set(a.x, 0, 0, 0, 0, a.y, 0, 0, 0, 0, a.z, 0, 0, 0, 0, 1);
      return this;
    },
    makeFrustum: function(a, b, c, d, e, f) {
      var g = this.elements;
      g[0] = 2 * e / (b - a);
      g[4] = 0;
      g[8] = (b + a) / (b - a);
      g[12] = 0;
      g[1] = 0;
      g[5] = 2 * e / (d - c);
      g[9] = (d + c) / (d - c);
      g[13] = 0;
      g[2] = 0;
      g[6] = 0;
      g[10] = -(f + e) / (f - e);
      g[14] = -2 * f * e / (f - e);
      g[3] = 0;
      g[7] = 0;
      g[11] = -1;
      g[15] = 0;
      return this;
    },
    makePerspective: function(a, b, c, d) {
      var a = c * Math.tan(THREE.Math.degToRad(0.5 * a)), e = -a;
      return this.makeFrustum(e * b, a * b, e, a, c, d);
    },
    makeOrthographic: function(a, b, c, d, e, f) {
      var g = this.elements, h = b - a, i = c - d, k = f - e;
      g[0] = 2 / h;
      g[4] = 0;
      g[8] = 0;
      g[12] = -((b + a) / h);
      g[1] = 0;
      g[5] = 2 / i;
      g[9] = 0;
      g[13] = -((c + d) / i);
      g[2] = 0;
      g[6] = 0;
      g[10] = -2 / k;
      g[14] = -((f + e) / k);
      g[3] = 0;
      g[7] = 0;
      g[11] = 0;
      g[15] = 1;
      return this;
    },
    clone: function() {
      var a = this.elements;
      return new THREE.Matrix4(a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]);
    }
  };
  THREE.Matrix4.__v1 = new THREE.Vector3();
  THREE.Matrix4.__v2 = new THREE.Vector3();
  THREE.Matrix4.__v3 = new THREE.Vector3();
  THREE.Matrix4.__m1 = new THREE.Matrix4();
  THREE.Matrix4.__m2 = new THREE.Matrix4();
  THREE.Ray = function(a, b) {
    this.origin = void 0 !== a ? a.clone() : new THREE.Vector3();
    this.direction = void 0 !== b ? b.clone() : new THREE.Vector3();
  };
  THREE.Ray.prototype = { constructor: THREE.Ray, set: function(a, b) {
    this.origin.copy(a);
    this.direction.copy(b);
    return this;
  }, copy: function(a) {
    this.origin.copy(a.origin);
    this.direction.copy(a.direction);
    return this;
  }, at: function(a, b) {
    return (b || new THREE.Vector3()).copy(this.direction).multiplyScalar(a).addSelf(this.origin);
  }, recastSelf: function(a) {
    this.origin.copy(this.at(a, THREE.Ray.__v1));
    return this;
  }, closestPointToPoint: function(a, b) {
    var c = b || new THREE.Vector3();
    c.sub(a, this.origin);
    var d = c.dot(this.direction);
    return c.copy(this.direction).multiplyScalar(d).addSelf(this.origin);
  }, distanceToPoint: function(a) {
    var b = THREE.Ray.__v1.sub(a, this.origin).dot(this.direction);
    THREE.Ray.__v1.copy(this.direction).multiplyScalar(b).addSelf(this.origin);
    return THREE.Ray.__v1.distanceTo(a);
  }, isIntersectionSphere: function(a) {
    return this.distanceToPoint(a.center) <= a.radius;
  }, isIntersectionPlane: function(a) {
    return 0 != a.normal.dot(this.direction) || 0 == a.distanceToPoint(this.origin) ? true : false;
  }, distanceToPlane: function(a) {
    var b = a.normal.dot(this.direction);
    if (0 == b) {
      if (0 == a.distanceToPoint(this.origin))
        return 0;
    } else
      return -(this.origin.dot(a.normal) + a.constant) / b;
  }, intersectPlane: function(a, b) {
    var c = this.distanceToPlane(a);
    return void 0 === c ? void 0 : this.at(c, b);
  }, transform: function(a) {
    this.direction = a.multiplyVector3(this.direction.addSelf(this.origin));
    this.origin = a.multiplyVector3(this.origin);
    this.direction.subSelf(this.origin);
    return this;
  }, equals: function(a) {
    return a.origin.equals(this.origin) && a.direction.equals(this.direction);
  }, clone: function() {
    return new THREE.Ray().copy(this);
  } };
  THREE.Ray.__v1 = new THREE.Vector3();
  THREE.Ray.__v2 = new THREE.Vector3();
  THREE.Frustum = function() {
    this.planes = [new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane(), new THREE.Plane()];
  };
  THREE.Frustum.prototype.setFromMatrix = function(a) {
    var b = this.planes, c = a.elements, a = c[0], d = c[1], e = c[2], f = c[3], g = c[4], h = c[5], i = c[6], k = c[7], l = c[8], m = c[9], p = c[10], s = c[11], q = c[12], n = c[13], r = c[14], c = c[15];
    b[0].setComponents(f - a, k - g, s - l, c - q);
    b[1].setComponents(f + a, k + g, s + l, c + q);
    b[2].setComponents(f + d, k + h, s + m, c + n);
    b[3].setComponents(f - d, k - h, s - m, c - n);
    b[4].setComponents(f - e, k - i, s - p, c - r);
    b[5].setComponents(f + e, k + i, s + p, c + r);
    for (a = 0; 6 > a; a++)
      b[a].normalize();
  };
  THREE.Frustum.prototype.contains = function(a) {
    for (var b = this.planes, c = a.matrixWorld, d = c.getPosition(), a = -a.geometry.boundingSphere.radius * c.getMaxScaleOnAxis(), e = c = 0; 6 > e; e++)
      if (c = b[e].distanceToPoint(d), c <= a)
        return false;
    return true;
  };
  THREE.Frustum.__v1 = new THREE.Vector3();
  THREE.Plane = function(a, b) {
    this.normal = void 0 !== a ? a.clone() : new THREE.Vector3(1, 0, 0);
    this.constant = void 0 !== b ? b : 0;
  };
  THREE.Plane.prototype = { constructor: THREE.Plane, set: function(a, b) {
    this.normal.copy(a);
    this.constant = b;
    return this;
  }, setComponents: function(a, b, c, d) {
    this.normal.set(a, b, c);
    this.constant = d;
    return this;
  }, setFromNormalAndCoplanarPoint: function(a, b) {
    this.normal.copy(a).normalize();
    this.constant = -b.dot(this.normal);
    return this;
  }, setFromCoplanarPoints: function(a, b, c) {
    b = THREE.Plane.__v1.sub(c, b).crossSelf(THREE.Plane.__v2.sub(a, b)).normalize();
    this.setFromNormalAndCoplanarPoint(b, a);
    return this;
  }, copy: function(a) {
    this.normal.copy(a.normal);
    this.constant = a.constant;
    return this;
  }, normalize: function() {
    var a = 1 / this.normal.length();
    this.normal.multiplyScalar(a);
    this.constant *= a;
    return this;
  }, distanceToPoint: function(a) {
    return this.normal.dot(a) + this.constant;
  }, distanceToSphere: function(a) {
    return this.distanceToPoint(a.center) - a.radius;
  }, projectPoint: function(a, b) {
    return this.orthoPoint(a, b).subSelf(a).negate();
  }, orthoPoint: function(a, b) {
    var c = this.distanceToPoint(a);
    return (b || new THREE.Vector3()).copy(this.normal).multiplyScalar(c);
  }, isIntersectionLine: function(a, b) {
    var c = this.distanceToPoint(a), d = this.distanceToPoint(b);
    return 0 > c && 0 < d || 0 > d && 0 < c;
  }, intersectLine: function(a, b, c) {
    var c = c || new THREE.Vector3(), b = THREE.Plane.__v1.sub(b, a), d = this.normal.dot(b);
    if (0 == d) {
      if (0 == this.distanceToPoint(a))
        return c.copy(a);
    } else
      return d = -(a.dot(this.normal) + this.constant) / d, 0 > d || 1 < d ? void 0 : c.copy(b).multiplyScalar(d).addSelf(a);
  }, coplanarPoint: function(a) {
    return (a || new THREE.Vector3()).copy(this.normal).multiplyScalar(-this.constant);
  }, transform: function(a, b) {
    var c = THREE.Plane.__v1, d = THREE.Plane.__v2, b = b || new THREE.Matrix3().getInverse(a).transpose(), c = b.multiplyVector3(c.copy(this.normal)), d = this.coplanarPoint(d), d = a.multiplyVector3(d);
    this.setFromNormalAndCoplanarPoint(c, d);
    return this;
  }, translate: function(a) {
    this.constant -= a.dot(this.normal);
    return this;
  }, equals: function(a) {
    return a.normal.equals(this.normal) && a.constant == this.constant;
  }, clone: function() {
    return new THREE.Plane().copy(this);
  } };
  THREE.Plane.__vZero = new THREE.Vector3(0, 0, 0);
  THREE.Plane.__v1 = new THREE.Vector3();
  THREE.Plane.__v2 = new THREE.Vector3();
  THREE.Sphere = function(a, b) {
    this.center = void 0 === a ? new THREE.Vector3() : a.clone();
    this.radius = void 0 === b ? 0 : b;
  };
  THREE.Sphere.prototype = { constructor: THREE.Sphere, set: function(a, b) {
    this.center.copy(a);
    this.radius = b;
    return this;
  }, setFromCenterAndPoints: function(a, b) {
    for (var c = 0, d = 0, e = b.length; d < e; d++)
      var f = a.distanceToSquared(b[d]), c = Math.max(c, f);
    this.center = a;
    this.radius = Math.sqrt(c);
    return this;
  }, copy: function(a) {
    this.center.copy(a.center);
    this.radius = a.radius;
    return this;
  }, empty: function() {
    return 0 >= this.radius;
  }, containsPoint: function(a) {
    return a.distanceToSquared(this.center) <= this.radius * this.radius;
  }, distanceToPoint: function(a) {
    return a.distanceTo(this.center) - this.radius;
  }, clampPoint: function(a, b) {
    var c = this.center.distanceToSquared(a), d = b || new THREE.Vector3();
    d.copy(a);
    c > this.radius * this.radius && (d.subSelf(this.center).normalize(), d.multiplyScalar(this.radius).addSelf(this.center));
    return d;
  }, getBoundingBox: function(a) {
    a = a || new THREE.Box3();
    a.set(this.center, this.center);
    a.expandByScalar(this.radius);
    return a;
  }, transform: function(a) {
    this.center = a.multiplyVector3(this.center);
    this.radius *= a.getMaxScaleOnAxis();
    return this;
  }, translate: function(a) {
    this.center.addSelf(a);
    return this;
  }, equals: function(a) {
    return a.center.equals(this.center) && a.radius === this.radius;
  }, clone: function() {
    return new THREE.Sphere().copy(this);
  } };
  THREE.Math = { clamp: function(a, b, c) {
    return a < b ? b : a > c ? c : a;
  }, clampBottom: function(a, b) {
    return a < b ? b : a;
  }, mapLinear: function(a, b, c, d, e) {
    return d + (a - b) * (e - d) / (c - b);
  }, random16: function() {
    return (65280 * Math.random() + 255 * Math.random()) / 65535;
  }, randInt: function(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }, randFloat: function(a, b) {
    return a + Math.random() * (b - a);
  }, randFloatSpread: function(a) {
    return a * (0.5 - Math.random());
  }, sign: function(a) {
    return 0 > a ? -1 : 0 < a ? 1 : 0;
  }, degToRad: function(a) {
    return a * THREE.Math.__d2r;
  }, radToDeg: function(a) {
    return a * THREE.Math.__r2d;
  } };
  THREE.Math.__d2r = Math.PI / 180;
  THREE.Math.__r2d = 180 / Math.PI;
  THREE.Quaternion = function(a, b, c, d) {
    this.x = a || 0;
    this.y = b || 0;
    this.z = c || 0;
    this.w = void 0 !== d ? d : 1;
  };
  THREE.Quaternion.prototype = { constructor: THREE.Quaternion, set: function(a, b, c, d) {
    this.x = a;
    this.y = b;
    this.z = c;
    this.w = d;
    return this;
  }, copy: function(a) {
    this.x = a.x;
    this.y = a.y;
    this.z = a.z;
    this.w = a.w;
    return this;
  }, setFromEuler: function(a, b) {
    var c = Math.cos(a.x / 2), d = Math.cos(a.y / 2), e = Math.cos(a.z / 2), f = Math.sin(a.x / 2), g = Math.sin(a.y / 2), h = Math.sin(a.z / 2);
    void 0 === b || "XYZ" === b ? (this.x = f * d * e + c * g * h, this.y = c * g * e - f * d * h, this.z = c * d * h + f * g * e, this.w = c * d * e - f * g * h) : "YXZ" === b ? (this.x = f * d * e + c * g * h, this.y = c * g * e - f * d * h, this.z = c * d * h - f * g * e, this.w = c * d * e + f * g * h) : "ZXY" === b ? (this.x = f * d * e - c * g * h, this.y = c * g * e + f * d * h, this.z = c * d * h + f * g * e, this.w = c * d * e - f * g * h) : "ZYX" === b ? (this.x = f * d * e - c * g * h, this.y = c * g * e + f * d * h, this.z = c * d * h - f * g * e, this.w = c * d * e + f * g * h) : "YZX" === b ? (this.x = f * d * e + c * g * h, this.y = c * g * e + f * d * h, this.z = c * d * h - f * g * e, this.w = c * d * e - f * g * h) : "XZY" === b && (this.x = f * d * e - c * g * h, this.y = c * g * e - f * d * h, this.z = c * d * h + f * g * e, this.w = c * d * e + f * g * h);
    return this;
  }, setFromAxisAngle: function(a, b) {
    var c = b / 2, d = Math.sin(c);
    this.x = a.x * d;
    this.y = a.y * d;
    this.z = a.z * d;
    this.w = Math.cos(c);
    return this;
  }, setFromRotationMatrix: function(a) {
    var b = a.elements, c = b[0], a = b[4], d = b[8], e = b[1], f = b[5], g = b[9], h = b[2], i = b[6], b = b[10], k = c + f + b;
    0 < k ? (c = 0.5 / Math.sqrt(k + 1), this.w = 0.25 / c, this.x = (i - g) * c, this.y = (d - h) * c, this.z = (e - a) * c) : c > f && c > b ? (c = 2 * Math.sqrt(1 + c - f - b), this.w = (i - g) / c, this.x = 0.25 * c, this.y = (a + e) / c, this.z = (d + h) / c) : f > b ? (c = 2 * Math.sqrt(1 + f - c - b), this.w = (d - h) / c, this.x = (a + e) / c, this.y = 0.25 * c, this.z = (g + i) / c) : (c = 2 * Math.sqrt(1 + b - c - f), this.w = (e - a) / c, this.x = (d + h) / c, this.y = (g + i) / c, this.z = 0.25 * c);
    return this;
  }, inverse: function() {
    this.conjugate().normalize();
    return this;
  }, conjugate: function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }, lengthSq: function() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }, length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }, normalize: function() {
    var a = this.length();
    0 === a ? (this.z = this.y = this.x = 0, this.w = 1) : (a = 1 / a, this.x *= a, this.y *= a, this.z *= a, this.w *= a);
    return this;
  }, multiply: function(a, b) {
    this.copy(a);
    return this.multiplySelf(b);
  }, multiplySelf: function(a) {
    var b = this.x, c = this.y, d = this.z, e = this.w, f = a.x, g = a.y, h = a.z, a = a.w;
    this.x = b * a + e * f + c * h - d * g;
    this.y = c * a + e * g + d * f - b * h;
    this.z = d * a + e * h + b * g - c * f;
    this.w = e * a - b * f - c * g - d * h;
    return this;
  }, multiplyVector3: function(a, b) {
    b || (b = a);
    var c = a.x, d = a.y, e = a.z, f = this.x, g = this.y, h = this.z, i = this.w, k = i * c + g * e - h * d, l = i * d + h * c - f * e, m = i * e + f * d - g * c, c = -f * c - g * d - h * e;
    b.x = k * i + c * -f + l * -h - m * -g;
    b.y = l * i + c * -g + m * -f - k * -h;
    b.z = m * i + c * -h + k * -g - l * -f;
    return b;
  }, slerpSelf: function(a, b) {
    var c = this.x, d = this.y, e = this.z, f = this.w, g = f * a.w + c * a.x + d * a.y + e * a.z;
    0 > g ? (this.w = -a.w, this.x = -a.x, this.y = -a.y, this.z = -a.z, g = -g) : this.copy(a);
    if (1 <= g)
      return this.w = f, this.x = c, this.y = d, this.z = e, this;
    var h = Math.acos(g), i = Math.sqrt(1 - g * g);
    if (1e-3 > Math.abs(i))
      return this.w = 0.5 * (f + this.w), this.x = 0.5 * (c + this.x), this.y = 0.5 * (d + this.y), this.z = 0.5 * (e + this.z), this;
    g = Math.sin((1 - b) * h) / i;
    h = Math.sin(b * h) / i;
    this.w = f * g + this.w * h;
    this.x = c * g + this.x * h;
    this.y = d * g + this.y * h;
    this.z = e * g + this.z * h;
    return this;
  }, equals: function(a) {
    return a.x === this.x && a.y === this.y && a.z === this.z && a.w === this.w;
  }, clone: function() {
    return new THREE.Quaternion(
      this.x,
      this.y,
      this.z,
      this.w
    );
  } };
  THREE.Quaternion.slerp = function(a, b, c, d) {
    return c.copy(a).slerpSelf(b, d);
  };
  THREE.Spline = function(a) {
    function b(a2, b2, c2, d2, e2, f2, g2) {
      a2 = 0.5 * (c2 - a2);
      d2 = 0.5 * (d2 - b2);
      return (2 * (b2 - c2) + a2 + d2) * g2 + (-3 * (b2 - c2) - 2 * a2 - d2) * f2 + a2 * e2 + b2;
    }
    this.points = a;
    var c = [], d = { x: 0, y: 0, z: 0 }, e, f, g, h, i, k, l, m, p;
    this.initFromArray = function(a2) {
      this.points = [];
      for (var b2 = 0; b2 < a2.length; b2++)
        this.points[b2] = { x: a2[b2][0], y: a2[b2][1], z: a2[b2][2] };
    };
    this.getPoint = function(a2) {
      e = (this.points.length - 1) * a2;
      f = Math.floor(e);
      g = e - f;
      c[0] = 0 === f ? f : f - 1;
      c[1] = f;
      c[2] = f > this.points.length - 2 ? this.points.length - 1 : f + 1;
      c[3] = f > this.points.length - 3 ? this.points.length - 1 : f + 2;
      k = this.points[c[0]];
      l = this.points[c[1]];
      m = this.points[c[2]];
      p = this.points[c[3]];
      h = g * g;
      i = g * h;
      d.x = b(k.x, l.x, m.x, p.x, g, h, i);
      d.y = b(k.y, l.y, m.y, p.y, g, h, i);
      d.z = b(k.z, l.z, m.z, p.z, g, h, i);
      return d;
    };
    this.getControlPointsArray = function() {
      var a2, b2, c2 = this.points.length, d2 = [];
      for (a2 = 0; a2 < c2; a2++)
        b2 = this.points[a2], d2[a2] = [b2.x, b2.y, b2.z];
      return d2;
    };
    this.getLength = function(a2) {
      var b2, c2, d2, e2 = b2 = b2 = 0, f2 = new THREE.Vector3(), g2 = new THREE.Vector3(), h2 = [], i2 = 0;
      h2[0] = 0;
      a2 || (a2 = 100);
      c2 = this.points.length * a2;
      f2.copy(this.points[0]);
      for (a2 = 1; a2 < c2; a2++)
        b2 = a2 / c2, d2 = this.getPoint(b2), g2.copy(d2), i2 += g2.distanceTo(f2), f2.copy(d2), b2 *= this.points.length - 1, b2 = Math.floor(b2), b2 != e2 && (h2[b2] = i2, e2 = b2);
      h2[h2.length] = i2;
      return { chunks: h2, total: i2 };
    };
    this.reparametrizeByArcLength = function(a2) {
      var b2, c2, d2, e2, f2, g2, h2 = [], i2 = new THREE.Vector3(), k2 = this.getLength();
      h2.push(i2.copy(this.points[0]).clone());
      for (b2 = 1; b2 < this.points.length; b2++) {
        c2 = k2.chunks[b2] - k2.chunks[b2 - 1];
        g2 = Math.ceil(a2 * c2 / k2.total);
        e2 = (b2 - 1) / (this.points.length - 1);
        f2 = b2 / (this.points.length - 1);
        for (c2 = 1; c2 < g2 - 1; c2++)
          d2 = e2 + c2 * (1 / g2) * (f2 - e2), d2 = this.getPoint(d2), h2.push(i2.copy(d2).clone());
        h2.push(i2.copy(this.points[b2]).clone());
      }
      this.points = h2;
    };
  };
  THREE.Triangle = function(a, b, c) {
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    void 0 !== a && (void 0 !== b && void 0 !== c) && (this.a.copy(a), this.b.copy(b), this.c.copy(c));
  };
  THREE.Triangle.normal = function(a, b, c, d) {
    d = d || new THREE.Vector3();
    d.sub(c, b);
    THREE.Triangle.__v0.sub(a, b);
    d.crossSelf(THREE.Triangle.__v0);
    a = d.lengthSq();
    return 0 < a ? d.multiplyScalar(1 / Math.sqrt(a)) : d.set(0, 0, 0);
  };
  THREE.Triangle.barycoordFromPoint = function(a, b, c, d, e) {
    THREE.Triangle.__v0.sub(d, b);
    THREE.Triangle.__v1.sub(c, b);
    THREE.Triangle.__v2.sub(a, b);
    var a = THREE.Triangle.__v0.dot(THREE.Triangle.__v0), b = THREE.Triangle.__v0.dot(THREE.Triangle.__v1), c = THREE.Triangle.__v0.dot(THREE.Triangle.__v2), f = THREE.Triangle.__v1.dot(THREE.Triangle.__v1), d = THREE.Triangle.__v1.dot(THREE.Triangle.__v2), g = a * f - b * b, e = e || new THREE.Vector3();
    if (0 == g)
      return e.set(-2, -1, -1);
    g = 1 / g;
    f = (f * c - b * d) * g;
    a = (a * d - b * c) * g;
    return e.set(1 - f - a, a, f);
  };
  THREE.Triangle.containsPoint = function(a, b, c, d) {
    a = THREE.Triangle.barycoordFromPoint(a, b, c, d, THREE.Triangle.__v3);
    return 0 <= a.x && 0 <= a.y && 1 >= a.x + a.y;
  };
  THREE.Triangle.prototype = {
    constructor: THREE.Triangle,
    set: function(a, b, c) {
      this.a.copy(a);
      this.b.copy(b);
      this.c.copy(c);
      return this;
    },
    setFromPointsAndIndices: function(a, b, c, d) {
      this.a.copy(a[b]);
      this.b.copy(a[c]);
      this.c.copy(a[d]);
      return this;
    },
    copy: function(a) {
      this.a.copy(a.a);
      this.b.copy(a.b);
      this.c.copy(a.c);
      return this;
    },
    area: function() {
      THREE.Triangle.__v0.sub(this.c, this.b);
      THREE.Triangle.__v1.sub(this.a, this.b);
      return 0.5 * THREE.Triangle.__v0.crossSelf(THREE.Triangle.__v1).length();
    },
    midpoint: function(a) {
      return (a || new THREE.Vector3()).add(this.a, this.b).addSelf(this.c).multiplyScalar(1 / 3);
    },
    normal: function(a) {
      return THREE.Triangle.normal(this.a, this.b, this.c, a);
    },
    plane: function(a) {
      return (a || new THREE.Plane()).setFromCoplanarPoints(this.a, this.b, this.c);
    },
    barycoordFromPoint: function(a, b) {
      return THREE.Triangle.barycoordFromPoint(a, this.a, this.b, this.c, b);
    },
    containsPoint: function(a) {
      return THREE.Triangle.containsPoint(a, this.a, this.b, this.c);
    },
    equals: function(a) {
      return a.a.equals(this.a) && a.b.equals(this.b) && a.c.equals(this.c);
    },
    clone: function() {
      return new THREE.Triangle().copy(this);
    }
  };
  THREE.Triangle.__v0 = new THREE.Vector3();
  THREE.Triangle.__v1 = new THREE.Vector3();
  THREE.Triangle.__v2 = new THREE.Vector3();
  THREE.Triangle.__v3 = new THREE.Vector3();
  THREE.Vertex = function(a) {
    console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.");
    return a;
  };
  THREE.UV = function(a, b) {
    console.warn("THREE.UV has been DEPRECATED. Use THREE.Vector2 instead.");
    return new THREE.Vector2(a, b);
  };
  THREE.Clock = function(a) {
    this.autoStart = void 0 !== a ? a : true;
    this.elapsedTime = this.oldTime = this.startTime = 0;
    this.running = false;
  };
  THREE.Clock.prototype.start = function() {
    this.oldTime = this.startTime = Date.now();
    this.running = true;
  };
  THREE.Clock.prototype.stop = function() {
    this.getElapsedTime();
    this.running = false;
  };
  THREE.Clock.prototype.getElapsedTime = function() {
    this.getDelta();
    return this.elapsedTime;
  };
  THREE.Clock.prototype.getDelta = function() {
    var a = 0;
    this.autoStart && !this.running && this.start();
    if (this.running) {
      var b = Date.now(), a = 1e-3 * (b - this.oldTime);
      this.oldTime = b;
      this.elapsedTime += a;
    }
    return a;
  };
  THREE.EventDispatcher = function() {
    var a = {};
    this.addEventListener = function(b, c) {
      void 0 === a[b] && (a[b] = []);
      -1 === a[b].indexOf(c) && a[b].push(c);
    };
    this.removeEventListener = function(b, c) {
      var d = a[b].indexOf(c);
      -1 !== d && a[b].splice(d, 1);
    };
    this.dispatchEvent = function(b) {
      var c = a[b.type];
      if (void 0 !== c) {
        b.target = this;
        for (var d = 0, e = c.length; d < e; d++)
          c[d].call(this, b);
      }
    };
  };
  (function(a) {
    a.Raycaster = function(b2, c2, d2, e2) {
      this.ray = new a.Ray(b2, c2);
      0 < this.ray.direction.length() && this.ray.direction.normalize();
      this.near = d2 || 0;
      this.far = e2 || Infinity;
    };
    var b = new a.Sphere(), c = new a.Ray(), d = new a.Plane(), e = new a.Vector3(), f = new a.Matrix4(), g = function(a2, b2) {
      return a2.distance - b2.distance;
    };
    new a.Vector3();
    new a.Vector3();
    new a.Vector3();
    var h = function(g2, h2, i2) {
      if (g2 instanceof a.Particle) {
        h2 = h2.ray.distanceToPoint(g2.matrixWorld.getPosition());
        if (h2 > g2.scale.x)
          return i2;
        i2.push({
          distance: h2,
          point: g2.position,
          face: null,
          object: g2
        });
      } else if (g2 instanceof a.Mesh) {
        b.set(g2.matrixWorld.getPosition(), g2.geometry.boundingSphere.radius * g2.matrixWorld.getMaxScaleOnAxis());
        if (!h2.ray.isIntersectionSphere(b))
          return i2;
        var p = g2.geometry, s = p.vertices, q = g2.material instanceof a.MeshFaceMaterial, n = true === q ? g2.material.materials : null, r = g2.material.side, v, w, x, t = h2.precision;
        g2.matrixRotationWorld.extractRotation(g2.matrixWorld);
        f.getInverse(g2.matrixWorld);
        c.copy(h2.ray).transform(f);
        for (var K = 0, D = p.faces.length; K < D; K++) {
          var B = p.faces[K], r = true === q ? n[B.materialIndex] : g2.material;
          if (void 0 !== r) {
            d.setFromNormalAndCoplanarPoint(B.normal, s[B.a]);
            var z = c.distanceToPlane(d);
            if (!(Math.abs(z) < t) && !(0 > z)) {
              r = r.side;
              if (r !== a.DoubleSide && (v = c.direction.dot(d.normal), !(r === a.FrontSide ? 0 > v : 0 < v)))
                continue;
              if (!(z < h2.near || z > h2.far)) {
                e = c.at(z, e);
                if (B instanceof a.Face3) {
                  if (r = s[B.a], v = s[B.b], w = s[B.c], !a.Triangle.containsPoint(e, r, v, w))
                    continue;
                } else if (B instanceof a.Face4) {
                  if (r = s[B.a], v = s[B.b], w = s[B.c], x = s[B.d], !a.Triangle.containsPoint(e, r, v, x) && !a.Triangle.containsPoint(
                    e,
                    v,
                    w,
                    x
                  ))
                    continue;
                } else
                  throw Error("face type not supported");
                i2.push({ distance: z, point: h2.ray.at(z), face: B, faceIndex: K, object: g2 });
              }
            }
          }
        }
      }
    }, i = function(a2, b2, c2) {
      for (var a2 = a2.getDescendants(), d2 = 0, e2 = a2.length; d2 < e2; d2++)
        h(a2[d2], b2, c2);
    };
    a.Raycaster.prototype.precision = 1e-4;
    a.Raycaster.prototype.set = function(a2, b2) {
      this.ray.set(a2, b2);
      0 < this.ray.direction.length() && this.ray.direction.normalize();
    };
    a.Raycaster.prototype.intersectObject = function(a2, b2) {
      var c2 = [];
      true === b2 && i(a2, this, c2);
      h(a2, this, c2);
      c2.sort(g);
      return c2;
    };
    a.Raycaster.prototype.intersectObjects = function(a2, b2) {
      for (var c2 = [], d2 = 0, e2 = a2.length; d2 < e2; d2++)
        h(a2[d2], this, c2), true === b2 && i(a2[d2], this, c2);
      c2.sort(g);
      return c2;
    };
  })(THREE);
  THREE.Object3D = function() {
    this.id = THREE.Object3DIdCount++;
    this.name = "";
    this.properties = {};
    this.parent = void 0;
    this.children = [];
    this.up = new THREE.Vector3(0, 1, 0);
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.eulerOrder = THREE.Object3D.defaultEulerOrder;
    this.scale = new THREE.Vector3(1, 1, 1);
    this.renderDepth = null;
    this.rotationAutoUpdate = true;
    this.matrix = new THREE.Matrix4();
    this.matrixWorld = new THREE.Matrix4();
    this.matrixRotationWorld = new THREE.Matrix4();
    this.matrixWorldNeedsUpdate = this.matrixAutoUpdate = true;
    this.quaternion = new THREE.Quaternion();
    this.useQuaternion = false;
    this.visible = true;
    this.receiveShadow = this.castShadow = false;
    this.frustumCulled = true;
    this._vector = new THREE.Vector3();
  };
  THREE.Object3D.prototype = {
    constructor: THREE.Object3D,
    applyMatrix: function(a) {
      this.matrix.multiply(a, this.matrix);
      this.scale.getScaleFromMatrix(this.matrix);
      a = new THREE.Matrix4().extractRotation(this.matrix);
      this.rotation.setEulerFromRotationMatrix(a, this.eulerOrder);
      this.position.getPositionFromMatrix(this.matrix);
    },
    translate: function(a, b) {
      this.matrix.rotateAxis(b);
      this.position.addSelf(b.multiplyScalar(a));
    },
    translateX: function(a) {
      this.translate(a, this._vector.set(1, 0, 0));
    },
    translateY: function(a) {
      this.translate(
        a,
        this._vector.set(0, 1, 0)
      );
    },
    translateZ: function(a) {
      this.translate(a, this._vector.set(0, 0, 1));
    },
    localToWorld: function(a) {
      return this.matrixWorld.multiplyVector3(a);
    },
    worldToLocal: function(a) {
      return THREE.Object3D.__m1.getInverse(this.matrixWorld).multiplyVector3(a);
    },
    lookAt: function(a) {
      this.matrix.lookAt(a, this.position, this.up);
      this.rotationAutoUpdate && (false === this.useQuaternion ? this.rotation.setEulerFromRotationMatrix(this.matrix, this.eulerOrder) : this.quaternion.copy(this.matrix.decompose()[1]));
    },
    add: function(a) {
      if (a === this)
        console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");
      else if (a instanceof THREE.Object3D) {
        void 0 !== a.parent && a.parent.remove(a);
        a.parent = this;
        this.children.push(a);
        for (var b = this; void 0 !== b.parent; )
          b = b.parent;
        void 0 !== b && b instanceof THREE.Scene && b.__addObject(a);
      }
    },
    remove: function(a) {
      var b = this.children.indexOf(a);
      if (-1 !== b) {
        a.parent = void 0;
        this.children.splice(b, 1);
        for (b = this; void 0 !== b.parent; )
          b = b.parent;
        void 0 !== b && b instanceof THREE.Scene && b.__removeObject(a);
      }
    },
    traverse: function(a) {
      a(this);
      for (var b = 0, c = this.children.length; b < c; b++)
        this.children[b].traverse(a);
    },
    getChildByName: function(a, b) {
      for (var c = 0, d = this.children.length; c < d; c++) {
        var e = this.children[c];
        if (e.name === a || true === b && (e = e.getChildByName(a, b), void 0 !== e))
          return e;
      }
    },
    getDescendants: function(a) {
      void 0 === a && (a = []);
      Array.prototype.push.apply(a, this.children);
      for (var b = 0, c = this.children.length; b < c; b++)
        this.children[b].getDescendants(a);
      return a;
    },
    updateMatrix: function() {
      this.matrix.setPosition(this.position);
      false === this.useQuaternion ? this.matrix.setRotationFromEuler(this.rotation, this.eulerOrder) : this.matrix.setRotationFromQuaternion(this.quaternion);
      (1 !== this.scale.x || 1 !== this.scale.y || 1 !== this.scale.z) && this.matrix.scale(this.scale);
      this.matrixWorldNeedsUpdate = true;
    },
    updateMatrixWorld: function(a) {
      true === this.matrixAutoUpdate && this.updateMatrix();
      if (true === this.matrixWorldNeedsUpdate || true === a)
        void 0 === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiply(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = false, a = true;
      for (var b = 0, c = this.children.length; b < c; b++)
        this.children[b].updateMatrixWorld(a);
    },
    clone: function(a) {
      void 0 === a && (a = new THREE.Object3D());
      a.name = this.name;
      a.up.copy(this.up);
      a.position.copy(this.position);
      a.rotation instanceof THREE.Vector3 && a.rotation.copy(this.rotation);
      a.eulerOrder = this.eulerOrder;
      a.scale.copy(this.scale);
      a.renderDepth = this.renderDepth;
      a.rotationAutoUpdate = this.rotationAutoUpdate;
      a.matrix.copy(this.matrix);
      a.matrixWorld.copy(this.matrixWorld);
      a.matrixRotationWorld.copy(this.matrixRotationWorld);
      a.matrixAutoUpdate = this.matrixAutoUpdate;
      a.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;
      a.quaternion.copy(this.quaternion);
      a.useQuaternion = this.useQuaternion;
      a.visible = this.visible;
      a.castShadow = this.castShadow;
      a.receiveShadow = this.receiveShadow;
      a.frustumCulled = this.frustumCulled;
      for (var b = 0; b < this.children.length; b++)
        a.add(this.children[b].clone());
      return a;
    }
  };
  THREE.Object3D.__m1 = new THREE.Matrix4();
  THREE.Object3D.defaultEulerOrder = "XYZ";
  THREE.Object3DIdCount = 0;
  THREE.Projector = function() {
    function a() {
      if (f === h) {
        var a2 = new THREE.RenderableObject();
        g.push(a2);
        h++;
        f++;
        return a2;
      }
      return g[f++];
    }
    function b() {
      if (k === m) {
        var a2 = new THREE.RenderableVertex();
        l.push(a2);
        m++;
        k++;
        return a2;
      }
      return l[k++];
    }
    function c(a2, b2) {
      return b2.z - a2.z;
    }
    function d(a2, b2) {
      var c2 = 0, d2 = 1, e2 = a2.z + a2.w, f2 = b2.z + b2.w, g2 = -a2.z + a2.w, h2 = -b2.z + b2.w;
      if (0 <= e2 && 0 <= f2 && 0 <= g2 && 0 <= h2)
        return true;
      if (0 > e2 && 0 > f2 || 0 > g2 && 0 > h2)
        return false;
      0 > e2 ? c2 = Math.max(c2, e2 / (e2 - f2)) : 0 > f2 && (d2 = Math.min(d2, e2 / (e2 - f2)));
      0 > g2 ? c2 = Math.max(c2, g2 / (g2 - h2)) : 0 > h2 && (d2 = Math.min(d2, g2 / (g2 - h2)));
      if (d2 < c2)
        return false;
      a2.lerpSelf(b2, c2);
      b2.lerpSelf(a2, 1 - d2);
      return true;
    }
    var e, f, g = [], h = 0, i, k, l = [], m = 0, p, s, q = [], n = 0, r, v = [], w = 0, x, t, K = [], D = 0, B, z, E = [], G = 0, I = { objects: [], sprites: [], lights: [], elements: [] }, Y = new THREE.Vector3(), C = new THREE.Vector4(), P = new THREE.Matrix4(), A = new THREE.Matrix4(), J, M = new THREE.Matrix4(), T = new THREE.Matrix3(), N = new THREE.Matrix3(), fa = new THREE.Vector3(), oa = new THREE.Frustum(), L = new THREE.Vector4(), Z = new THREE.Vector4();
    this.projectVector = function(a2, b2) {
      b2.matrixWorldInverse.getInverse(b2.matrixWorld);
      A.multiply(
        b2.projectionMatrix,
        b2.matrixWorldInverse
      );
      A.multiplyVector3(a2);
      return a2;
    };
    this.unprojectVector = function(a2, b2) {
      b2.projectionMatrixInverse.getInverse(b2.projectionMatrix);
      A.multiply(b2.matrixWorld, b2.projectionMatrixInverse);
      A.multiplyVector3(a2);
      return a2;
    };
    this.pickingRay = function(a2, b2) {
      a2.z = -1;
      var c2 = new THREE.Vector3(a2.x, a2.y, 1);
      this.unprojectVector(a2, b2);
      this.unprojectVector(c2, b2);
      c2.subSelf(a2).normalize();
      return new THREE.Raycaster(a2, c2);
    };
    this.projectScene = function(g2, h2, m2, H) {
      var ja = h2.near, ha = h2.far, ia = false, ka, W, ba, qa, Na, ya, ma, sa, Pa, nb, la, fb, ob;
      z = t = r = s = 0;
      I.elements.length = 0;
      g2.updateMatrixWorld();
      void 0 === h2.parent && h2.updateMatrixWorld();
      P.getInverse(h2.matrixWorld);
      A.multiply(h2.projectionMatrix, P);
      N.getInverse(P);
      N.transpose();
      oa.setFromMatrix(A);
      f = 0;
      I.objects.length = 0;
      I.sprites.length = 0;
      I.lights.length = 0;
      var pb = function(b2) {
        for (var c2 = 0, d2 = b2.children.length; c2 < d2; c2++) {
          var f2 = b2.children[c2];
          if (false !== f2.visible) {
            if (f2 instanceof THREE.Light)
              I.lights.push(f2);
            else if (f2 instanceof THREE.Mesh || f2 instanceof THREE.Line) {
              if (false === f2.frustumCulled || true === oa.contains(f2))
                e = a(), e.object = f2, null !== f2.renderDepth ? e.z = f2.renderDepth : (Y.copy(f2.matrixWorld.getPosition()), A.multiplyVector3(Y), e.z = Y.z), I.objects.push(e);
            } else
              f2 instanceof THREE.Sprite || f2 instanceof THREE.Particle ? (e = a(), e.object = f2, null !== f2.renderDepth ? e.z = f2.renderDepth : (Y.copy(f2.matrixWorld.getPosition()), A.multiplyVector3(Y), e.z = Y.z), I.sprites.push(e)) : (e = a(), e.object = f2, null !== f2.renderDepth ? e.z = f2.renderDepth : (Y.copy(f2.matrixWorld.getPosition()), A.multiplyVector3(Y), e.z = Y.z), I.objects.push(e));
            pb(f2);
          }
        }
      };
      pb(g2);
      true === m2 && I.objects.sort(c);
      g2 = 0;
      for (m2 = I.objects.length; g2 < m2; g2++)
        if (sa = I.objects[g2].object, J = sa.matrixWorld, k = 0, sa instanceof THREE.Mesh) {
          Pa = sa.geometry;
          ba = Pa.vertices;
          nb = Pa.faces;
          Pa = Pa.faceVertexUvs;
          T.getInverse(J);
          T.transpose();
          fb = sa.material instanceof THREE.MeshFaceMaterial;
          ob = true === fb ? sa.material : null;
          ka = 0;
          for (W = ba.length; ka < W; ka++)
            i = b(), i.positionWorld.copy(ba[ka]), J.multiplyVector3(i.positionWorld), i.positionScreen.copy(i.positionWorld), A.multiplyVector4(i.positionScreen), i.positionScreen.x /= i.positionScreen.w, i.positionScreen.y /= i.positionScreen.w, i.visible = i.positionScreen.z > ja && i.positionScreen.z < ha;
          ba = 0;
          for (ka = nb.length; ba < ka; ba++) {
            W = nb[ba];
            var zb = true === fb ? ob.materials[W.materialIndex] : sa.material;
            if (void 0 !== zb) {
              ya = zb.side;
              if (W instanceof THREE.Face3)
                if (qa = l[W.a], Na = l[W.b], ma = l[W.c], true === qa.visible && true === Na.visible && true === ma.visible)
                  if (ia = 0 > (ma.positionScreen.x - qa.positionScreen.x) * (Na.positionScreen.y - qa.positionScreen.y) - (ma.positionScreen.y - qa.positionScreen.y) * (Na.positionScreen.x - qa.positionScreen.x), ya === THREE.DoubleSide || ia === (ya === THREE.FrontSide))
                    s === n ? (la = new THREE.RenderableFace3(), q.push(la), n++, s++, p = la) : p = q[s++], p.v1.copy(qa), p.v2.copy(Na), p.v3.copy(ma);
                  else
                    continue;
                else
                  continue;
              else if (W instanceof THREE.Face4)
                if (qa = l[W.a], Na = l[W.b], ma = l[W.c], la = l[W.d], true === qa.visible && true === Na.visible && true === ma.visible && true === la.visible)
                  if (ia = 0 > (la.positionScreen.x - qa.positionScreen.x) * (Na.positionScreen.y - qa.positionScreen.y) - (la.positionScreen.y - qa.positionScreen.y) * (Na.positionScreen.x - qa.positionScreen.x) || 0 > (Na.positionScreen.x - ma.positionScreen.x) * (la.positionScreen.y - ma.positionScreen.y) - (Na.positionScreen.y - ma.positionScreen.y) * (la.positionScreen.x - ma.positionScreen.x), ya === THREE.DoubleSide || ia === (ya === THREE.FrontSide)) {
                    if (r === w) {
                      var gb = new THREE.RenderableFace4();
                      v.push(gb);
                      w++;
                      r++;
                      p = gb;
                    } else
                      p = v[r++];
                    p.v1.copy(qa);
                    p.v2.copy(Na);
                    p.v3.copy(ma);
                    p.v4.copy(la);
                  } else
                    continue;
                else
                  continue;
              p.normalModel.copy(W.normal);
              false === ia && (ya === THREE.BackSide || ya === THREE.DoubleSide) && p.normalModel.negate();
              T.multiplyVector3(p.normalModel);
              p.normalModel.normalize();
              p.normalModelView.copy(p.normalModel);
              N.multiplyVector3(p.normalModelView);
              p.centroidModel.copy(W.centroid);
              J.multiplyVector3(p.centroidModel);
              ma = W.vertexNormals;
              qa = 0;
              for (Na = ma.length; qa < Na; qa++)
                la = p.vertexNormalsModel[qa], la.copy(ma[qa]), false === ia && (ya === THREE.BackSide || ya === THREE.DoubleSide) && la.negate(), T.multiplyVector3(la), la.normalize(), gb = p.vertexNormalsModelView[qa], gb.copy(la), N.multiplyVector3(gb);
              p.vertexNormalsLength = ma.length;
              ya = 0;
              for (qa = Pa.length; ya < qa; ya++)
                if (la = Pa[ya][ba], void 0 !== la) {
                  Na = 0;
                  for (ma = la.length; Na < ma; Na++)
                    p.uvs[ya][Na] = la[Na];
                }
              p.color = W.color;
              p.material = zb;
              fa.copy(p.centroidModel);
              A.multiplyVector3(fa);
              p.z = fa.z;
              I.elements.push(p);
            }
          }
        } else if (sa instanceof THREE.Line) {
          M.multiply(A, J);
          ba = sa.geometry.vertices;
          qa = b();
          qa.positionScreen.copy(ba[0]);
          M.multiplyVector4(qa.positionScreen);
          nb = sa.type === THREE.LinePieces ? 2 : 1;
          ka = 1;
          for (W = ba.length; ka < W; ka++)
            qa = b(), qa.positionScreen.copy(ba[ka]), M.multiplyVector4(qa.positionScreen), 0 < (ka + 1) % nb || (Na = l[k - 2], L.copy(qa.positionScreen), Z.copy(Na.positionScreen), true === d(L, Z) && (L.multiplyScalar(1 / L.w), Z.multiplyScalar(1 / Z.w), t === D ? (Pa = new THREE.RenderableLine(), K.push(Pa), D++, t++, x = Pa) : x = K[t++], x.v1.positionScreen.copy(L), x.v2.positionScreen.copy(Z), x.z = Math.max(L.z, Z.z), x.material = sa.material, I.elements.push(x)));
        }
      g2 = 0;
      for (m2 = I.sprites.length; g2 < m2; g2++)
        sa = I.sprites[g2].object, J = sa.matrixWorld, sa instanceof THREE.Particle && (C.set(J.elements[12], J.elements[13], J.elements[14], 1), A.multiplyVector4(C), C.z /= C.w, 0 < C.z && 1 > C.z && (z === G ? (ja = new THREE.RenderableParticle(), E.push(ja), G++, z++, B = ja) : B = E[z++], B.object = sa, B.x = C.x / C.w, B.y = C.y / C.w, B.z = C.z, B.rotation = sa.rotation.z, B.scale.x = sa.scale.x * Math.abs(B.x - (C.x + h2.projectionMatrix.elements[0]) / (C.w + h2.projectionMatrix.elements[12])), B.scale.y = sa.scale.y * Math.abs(B.y - (C.y + h2.projectionMatrix.elements[5]) / (C.w + h2.projectionMatrix.elements[13])), B.material = sa.material, I.elements.push(B)));
      true === H && I.elements.sort(c);
      return I;
    };
  };
  THREE.Face3 = function(a, b, c, d, e, f) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.normal = d instanceof THREE.Vector3 ? d : new THREE.Vector3();
    this.vertexNormals = d instanceof Array ? d : [];
    this.color = e instanceof THREE.Color ? e : new THREE.Color();
    this.vertexColors = e instanceof Array ? e : [];
    this.vertexTangents = [];
    this.materialIndex = void 0 !== f ? f : 0;
    this.centroid = new THREE.Vector3();
  };
  THREE.Face3.prototype = { constructor: THREE.Face3, clone: function() {
    var a = new THREE.Face3(this.a, this.b, this.c);
    a.normal.copy(this.normal);
    a.color.copy(this.color);
    a.centroid.copy(this.centroid);
    a.materialIndex = this.materialIndex;
    var b, c;
    b = 0;
    for (c = this.vertexNormals.length; b < c; b++)
      a.vertexNormals[b] = this.vertexNormals[b].clone();
    b = 0;
    for (c = this.vertexColors.length; b < c; b++)
      a.vertexColors[b] = this.vertexColors[b].clone();
    b = 0;
    for (c = this.vertexTangents.length; b < c; b++)
      a.vertexTangents[b] = this.vertexTangents[b].clone();
    return a;
  } };
  THREE.Face4 = function(a, b, c, d, e, f, g) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.normal = e instanceof THREE.Vector3 ? e : new THREE.Vector3();
    this.vertexNormals = e instanceof Array ? e : [];
    this.color = f instanceof THREE.Color ? f : new THREE.Color();
    this.vertexColors = f instanceof Array ? f : [];
    this.vertexTangents = [];
    this.materialIndex = void 0 !== g ? g : 0;
    this.centroid = new THREE.Vector3();
  };
  THREE.Face4.prototype = { constructor: THREE.Face4, clone: function() {
    var a = new THREE.Face4(this.a, this.b, this.c, this.d);
    a.normal.copy(this.normal);
    a.color.copy(this.color);
    a.centroid.copy(this.centroid);
    a.materialIndex = this.materialIndex;
    var b, c;
    b = 0;
    for (c = this.vertexNormals.length; b < c; b++)
      a.vertexNormals[b] = this.vertexNormals[b].clone();
    b = 0;
    for (c = this.vertexColors.length; b < c; b++)
      a.vertexColors[b] = this.vertexColors[b].clone();
    b = 0;
    for (c = this.vertexTangents.length; b < c; b++)
      a.vertexTangents[b] = this.vertexTangents[b].clone();
    return a;
  } };
  THREE.Geometry = function() {
    THREE.EventDispatcher.call(this);
    this.id = THREE.GeometryIdCount++;
    this.name = "";
    this.vertices = [];
    this.colors = [];
    this.normals = [];
    this.faces = [];
    this.faceUvs = [[]];
    this.faceVertexUvs = [[]];
    this.morphTargets = [];
    this.morphColors = [];
    this.morphNormals = [];
    this.skinWeights = [];
    this.skinIndices = [];
    this.lineDistances = [];
    this.boundingSphere = this.boundingBox = null;
    this.hasTangents = false;
    this.dynamic = true;
    this.buffersNeedUpdate = this.lineDistancesNeedUpdate = this.colorsNeedUpdate = this.tangentsNeedUpdate = this.normalsNeedUpdate = this.uvsNeedUpdate = this.elementsNeedUpdate = this.verticesNeedUpdate = false;
  };
  THREE.Geometry.prototype = {
    constructor: THREE.Geometry,
    applyMatrix: function(a) {
      var b = new THREE.Matrix3();
      b.getInverse(a).transpose();
      for (var c = 0, d = this.vertices.length; c < d; c++)
        a.multiplyVector3(this.vertices[c]);
      c = 0;
      for (d = this.faces.length; c < d; c++) {
        var e = this.faces[c];
        b.multiplyVector3(e.normal).normalize();
        for (var f = 0, g = e.vertexNormals.length; f < g; f++)
          b.multiplyVector3(e.vertexNormals[f]).normalize();
        a.multiplyVector3(e.centroid);
      }
    },
    computeCentroids: function() {
      var a, b, c;
      a = 0;
      for (b = this.faces.length; a < b; a++)
        c = this.faces[a], c.centroid.set(0, 0, 0), c instanceof THREE.Face3 ? (c.centroid.addSelf(this.vertices[c.a]), c.centroid.addSelf(this.vertices[c.b]), c.centroid.addSelf(this.vertices[c.c]), c.centroid.divideScalar(3)) : c instanceof THREE.Face4 && (c.centroid.addSelf(this.vertices[c.a]), c.centroid.addSelf(this.vertices[c.b]), c.centroid.addSelf(this.vertices[c.c]), c.centroid.addSelf(this.vertices[c.d]), c.centroid.divideScalar(4));
    },
    computeFaceNormals: function() {
      var a, b, c, d, e, f, g = new THREE.Vector3(), h = new THREE.Vector3();
      a = 0;
      for (b = this.faces.length; a < b; a++)
        c = this.faces[a], d = this.vertices[c.a], e = this.vertices[c.b], f = this.vertices[c.c], g.sub(f, e), h.sub(d, e), g.crossSelf(h), g.normalize(), c.normal.copy(g);
    },
    computeVertexNormals: function(a) {
      var b, c, d, e;
      if (void 0 === this.__tmpVertices) {
        e = this.__tmpVertices = Array(this.vertices.length);
        b = 0;
        for (c = this.vertices.length; b < c; b++)
          e[b] = new THREE.Vector3();
        b = 0;
        for (c = this.faces.length; b < c; b++)
          d = this.faces[b], d instanceof THREE.Face3 ? d.vertexNormals = [
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3()
          ] : d instanceof THREE.Face4 && (d.vertexNormals = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
      } else {
        e = this.__tmpVertices;
        b = 0;
        for (c = this.vertices.length; b < c; b++)
          e[b].set(0, 0, 0);
      }
      if (a) {
        var f, g, h, i = new THREE.Vector3(), k = new THREE.Vector3(), l = new THREE.Vector3(), m = new THREE.Vector3(), p = new THREE.Vector3();
        b = 0;
        for (c = this.faces.length; b < c; b++)
          d = this.faces[b], d instanceof THREE.Face3 ? (a = this.vertices[d.a], f = this.vertices[d.b], g = this.vertices[d.c], i.sub(g, f), k.sub(a, f), i.crossSelf(k), e[d.a].addSelf(i), e[d.b].addSelf(i), e[d.c].addSelf(i)) : d instanceof THREE.Face4 && (a = this.vertices[d.a], f = this.vertices[d.b], g = this.vertices[d.c], h = this.vertices[d.d], l.sub(h, f), k.sub(a, f), l.crossSelf(k), e[d.a].addSelf(l), e[d.b].addSelf(l), e[d.d].addSelf(l), m.sub(h, g), p.sub(f, g), m.crossSelf(p), e[d.b].addSelf(m), e[d.c].addSelf(m), e[d.d].addSelf(m));
      } else {
        b = 0;
        for (c = this.faces.length; b < c; b++)
          d = this.faces[b], d instanceof THREE.Face3 ? (e[d.a].addSelf(d.normal), e[d.b].addSelf(d.normal), e[d.c].addSelf(d.normal)) : d instanceof THREE.Face4 && (e[d.a].addSelf(d.normal), e[d.b].addSelf(d.normal), e[d.c].addSelf(d.normal), e[d.d].addSelf(d.normal));
      }
      b = 0;
      for (c = this.vertices.length; b < c; b++)
        e[b].normalize();
      b = 0;
      for (c = this.faces.length; b < c; b++)
        d = this.faces[b], d instanceof THREE.Face3 ? (d.vertexNormals[0].copy(e[d.a]), d.vertexNormals[1].copy(e[d.b]), d.vertexNormals[2].copy(e[d.c])) : d instanceof THREE.Face4 && (d.vertexNormals[0].copy(e[d.a]), d.vertexNormals[1].copy(e[d.b]), d.vertexNormals[2].copy(e[d.c]), d.vertexNormals[3].copy(e[d.d]));
    },
    computeMorphNormals: function() {
      var a, b, c, d, e;
      c = 0;
      for (d = this.faces.length; c < d; c++) {
        e = this.faces[c];
        e.__originalFaceNormal ? e.__originalFaceNormal.copy(e.normal) : e.__originalFaceNormal = e.normal.clone();
        e.__originalVertexNormals || (e.__originalVertexNormals = []);
        a = 0;
        for (b = e.vertexNormals.length; a < b; a++)
          e.__originalVertexNormals[a] ? e.__originalVertexNormals[a].copy(e.vertexNormals[a]) : e.__originalVertexNormals[a] = e.vertexNormals[a].clone();
      }
      var f = new THREE.Geometry();
      f.faces = this.faces;
      a = 0;
      for (b = this.morphTargets.length; a < b; a++) {
        if (!this.morphNormals[a]) {
          this.morphNormals[a] = {};
          this.morphNormals[a].faceNormals = [];
          this.morphNormals[a].vertexNormals = [];
          var g = this.morphNormals[a].faceNormals, h = this.morphNormals[a].vertexNormals, i, k;
          c = 0;
          for (d = this.faces.length; c < d; c++)
            e = this.faces[c], i = new THREE.Vector3(), k = e instanceof THREE.Face3 ? { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() } : { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), d: new THREE.Vector3() }, g.push(i), h.push(k);
        }
        g = this.morphNormals[a];
        f.vertices = this.morphTargets[a].vertices;
        f.computeFaceNormals();
        f.computeVertexNormals();
        c = 0;
        for (d = this.faces.length; c < d; c++)
          e = this.faces[c], i = g.faceNormals[c], k = g.vertexNormals[c], i.copy(e.normal), e instanceof THREE.Face3 ? (k.a.copy(e.vertexNormals[0]), k.b.copy(e.vertexNormals[1]), k.c.copy(e.vertexNormals[2])) : (k.a.copy(e.vertexNormals[0]), k.b.copy(e.vertexNormals[1]), k.c.copy(e.vertexNormals[2]), k.d.copy(e.vertexNormals[3]));
      }
      c = 0;
      for (d = this.faces.length; c < d; c++)
        e = this.faces[c], e.normal = e.__originalFaceNormal, e.vertexNormals = e.__originalVertexNormals;
    },
    computeTangents: function() {
      function a(a2, b2, c2, d2, e2, f2, z2) {
        h = a2.vertices[b2];
        i = a2.vertices[c2];
        k = a2.vertices[d2];
        l = g[e2];
        m = g[f2];
        p = g[z2];
        s = i.x - h.x;
        q = k.x - h.x;
        n = i.y - h.y;
        r = k.y - h.y;
        v = i.z - h.z;
        w = k.z - h.z;
        x = m.x - l.x;
        t = p.x - l.x;
        K = m.y - l.y;
        D = p.y - l.y;
        B = 1 / (x * D - t * K);
        I.set((D * s - K * q) * B, (D * n - K * r) * B, (D * v - K * w) * B);
        Y.set((x * q - t * s) * B, (x * r - t * n) * B, (x * w - t * v) * B);
        E[b2].addSelf(I);
        E[c2].addSelf(I);
        E[d2].addSelf(I);
        G[b2].addSelf(Y);
        G[c2].addSelf(Y);
        G[d2].addSelf(Y);
      }
      var b, c, d, e, f, g, h, i, k, l, m, p, s, q, n, r, v, w, x, t, K, D, B, z, E = [], G = [], I = new THREE.Vector3(), Y = new THREE.Vector3(), C = new THREE.Vector3(), P = new THREE.Vector3(), A = new THREE.Vector3();
      b = 0;
      for (c = this.vertices.length; b < c; b++)
        E[b] = new THREE.Vector3(), G[b] = new THREE.Vector3();
      b = 0;
      for (c = this.faces.length; b < c; b++)
        f = this.faces[b], g = this.faceVertexUvs[0][b], f instanceof THREE.Face3 ? a(this, f.a, f.b, f.c, 0, 1, 2) : f instanceof THREE.Face4 && (a(this, f.a, f.b, f.d, 0, 1, 3), a(this, f.b, f.c, f.d, 1, 2, 3));
      var J = ["a", "b", "c", "d"];
      b = 0;
      for (c = this.faces.length; b < c; b++) {
        f = this.faces[b];
        for (d = 0; d < f.vertexNormals.length; d++)
          A.copy(f.vertexNormals[d]), e = f[J[d]], z = E[e], C.copy(z), C.subSelf(A.multiplyScalar(A.dot(z))).normalize(), P.cross(f.vertexNormals[d], z), e = P.dot(G[e]), e = 0 > e ? -1 : 1, f.vertexTangents[d] = new THREE.Vector4(C.x, C.y, C.z, e);
      }
      this.hasTangents = true;
    },
    computeLineDistances: function() {
      for (var a = 0, b = this.vertices, c = 0, d = b.length; c < d; c++)
        0 < c && (a += b[c].distanceTo(b[c - 1])), this.lineDistances[c] = a;
    },
    computeBoundingBox: function() {
      null === this.boundingBox && (this.boundingBox = new THREE.Box3());
      this.boundingBox.setFromPoints(this.vertices);
    },
    computeBoundingSphere: function() {
      null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere());
      this.boundingSphere.setFromCenterAndPoints(this.boundingSphere.center, this.vertices);
    },
    mergeVertices: function() {
      var a = {}, b = [], c = [], d, e = Math.pow(10, 4), f, g, h, i;
      f = 0;
      for (g = this.vertices.length; f < g; f++)
        d = this.vertices[f], d = [Math.round(d.x * e), Math.round(d.y * e), Math.round(d.z * e)].join("_"), void 0 === a[d] ? (a[d] = f, b.push(this.vertices[f]), c[f] = b.length - 1) : c[f] = c[a[d]];
      f = 0;
      for (g = this.faces.length; f < g; f++)
        if (a = this.faces[f], a instanceof THREE.Face3)
          a.a = c[a.a], a.b = c[a.b], a.c = c[a.c];
        else if (a instanceof THREE.Face4) {
          a.a = c[a.a];
          a.b = c[a.b];
          a.c = c[a.c];
          a.d = c[a.d];
          d = [a.a, a.b, a.c, a.d];
          for (e = 3; 0 < e; e--)
            if (d.indexOf(a["abcd"[e]]) !== e) {
              d.splice(e, 1);
              this.faces[f] = new THREE.Face3(d[0], d[1], d[2], a.normal, a.color, a.materialIndex);
              d = 0;
              for (h = this.faceVertexUvs.length; d < h; d++)
                (i = this.faceVertexUvs[d][f]) && i.splice(e, 1);
              this.faces[f].vertexColors = a.vertexColors;
              break;
            }
        }
      c = this.vertices.length - b.length;
      this.vertices = b;
      return c;
    },
    clone: function() {
      for (var a = new THREE.Geometry(), b = this.vertices, c = 0, d = b.length; c < d; c++)
        a.vertices.push(b[c].clone());
      b = this.faces;
      c = 0;
      for (d = b.length; c < d; c++)
        a.faces.push(b[c].clone());
      b = this.faceVertexUvs[0];
      c = 0;
      for (d = b.length; c < d; c++) {
        for (var e = b[c], f = [], g = 0, h = e.length; g < h; g++)
          f.push(new THREE.Vector2(e[g].x, e[g].y));
        a.faceVertexUvs[0].push(f);
      }
      return a;
    },
    dispose: function() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
  THREE.GeometryIdCount = 0;
  THREE.BufferGeometry = function() {
    THREE.EventDispatcher.call(this);
    this.id = THREE.GeometryIdCount++;
    this.attributes = {};
    this.dynamic = false;
    this.offsets = [];
    this.boundingSphere = this.boundingBox = null;
    this.hasTangents = false;
    this.morphTargets = [];
  };
  THREE.BufferGeometry.prototype = { constructor: THREE.BufferGeometry, applyMatrix: function(a) {
    var b, c;
    this.attributes.position && (b = this.attributes.position.array);
    this.attributes.normal && (c = this.attributes.normal.array);
    void 0 !== b && (a.multiplyVector3Array(b), this.verticesNeedUpdate = true);
    void 0 !== c && (b = new THREE.Matrix3(), b.getInverse(a).transpose(), b.multiplyVector3Array(c), this.normalizeNormals(), this.normalsNeedUpdate = true);
  }, computeBoundingBox: function() {
    null === this.boundingBox && (this.boundingBox = new THREE.Box3());
    var a = this.attributes.position.array;
    if (a) {
      var b = this.boundingBox, c, d, e;
      3 <= a.length && (b.min.x = b.max.x = a[0], b.min.y = b.max.y = a[1], b.min.z = b.max.z = a[2]);
      for (var f = 3, g = a.length; f < g; f += 3)
        c = a[f], d = a[f + 1], e = a[f + 2], c < b.min.x ? b.min.x = c : c > b.max.x && (b.max.x = c), d < b.min.y ? b.min.y = d : d > b.max.y && (b.max.y = d), e < b.min.z ? b.min.z = e : e > b.max.z && (b.max.z = e);
    }
    if (void 0 === a || 0 === a.length)
      this.boundingBox.min.set(0, 0, 0), this.boundingBox.max.set(0, 0, 0);
  }, computeBoundingSphere: function() {
    null === this.boundingSphere && (this.boundingSphere = new THREE.Sphere());
    var a = this.attributes.position.array;
    if (a) {
      for (var b, c = 0, d, e, f = 0, g = a.length; f < g; f += 3)
        b = a[f], d = a[f + 1], e = a[f + 2], b = b * b + d * d + e * e, b > c && (c = b);
      this.boundingSphere.radius = Math.sqrt(c);
    }
  }, computeVertexNormals: function() {
    if (this.attributes.position) {
      var a, b, c, d;
      a = this.attributes.position.array.length;
      if (void 0 === this.attributes.normal)
        this.attributes.normal = { itemSize: 3, array: new Float32Array(a), numItems: a };
      else {
        a = 0;
        for (b = this.attributes.normal.array.length; a < b; a++)
          this.attributes.normal.array[a] = 0;
      }
      var e = this.attributes.position.array, f = this.attributes.normal.array, g, h, i, k, l, m, p = new THREE.Vector3(), s = new THREE.Vector3(), q = new THREE.Vector3(), n = new THREE.Vector3(), r = new THREE.Vector3();
      if (this.attributes.index) {
        var v = this.attributes.index.array, w = this.offsets;
        c = 0;
        for (d = w.length; c < d; ++c) {
          b = w[c].start;
          g = w[c].count;
          var x = w[c].index;
          a = b;
          for (b += g; a < b; a += 3)
            g = x + v[a], h = x + v[a + 1], i = x + v[a + 2], k = e[3 * g], l = e[3 * g + 1], m = e[3 * g + 2], p.set(k, l, m), k = e[3 * h], l = e[3 * h + 1], m = e[3 * h + 2], s.set(k, l, m), k = e[3 * i], l = e[3 * i + 1], m = e[3 * i + 2], q.set(
              k,
              l,
              m
            ), n.sub(q, s), r.sub(p, s), n.crossSelf(r), f[3 * g] += n.x, f[3 * g + 1] += n.y, f[3 * g + 2] += n.z, f[3 * h] += n.x, f[3 * h + 1] += n.y, f[3 * h + 2] += n.z, f[3 * i] += n.x, f[3 * i + 1] += n.y, f[3 * i + 2] += n.z;
        }
      } else {
        a = 0;
        for (b = e.length; a < b; a += 9)
          k = e[a], l = e[a + 1], m = e[a + 2], p.set(k, l, m), k = e[a + 3], l = e[a + 4], m = e[a + 5], s.set(k, l, m), k = e[a + 6], l = e[a + 7], m = e[a + 8], q.set(k, l, m), n.sub(q, s), r.sub(p, s), n.crossSelf(r), f[a] = n.x, f[a + 1] = n.y, f[a + 2] = n.z, f[a + 3] = n.x, f[a + 4] = n.y, f[a + 5] = n.z, f[a + 6] = n.x, f[a + 7] = n.y, f[a + 8] = n.z;
      }
      this.normalizeNormals();
      this.normalsNeedUpdate = true;
    }
  }, normalizeNormals: function() {
    for (var a = this.attributes.normal.array, b, c, d, e = 0, f = a.length; e < f; e += 3)
      b = a[e], c = a[e + 1], d = a[e + 2], b = 1 / Math.sqrt(b * b + c * c + d * d), a[e] *= b, a[e + 1] *= b, a[e + 2] *= b;
  }, computeTangents: function() {
    function a(a2) {
      fa.x = d[3 * a2];
      fa.y = d[3 * a2 + 1];
      fa.z = d[3 * a2 + 2];
      oa.copy(fa);
      Z = i[a2];
      T.copy(Z);
      T.subSelf(fa.multiplyScalar(fa.dot(Z))).normalize();
      N.cross(oa, Z);
      eb = N.dot(k[a2]);
      L = 0 > eb ? -1 : 1;
      h[4 * a2] = T.x;
      h[4 * a2 + 1] = T.y;
      h[4 * a2 + 2] = T.z;
      h[4 * a2 + 3] = L;
    }
    if (void 0 === this.attributes.index || void 0 === this.attributes.position || void 0 === this.attributes.normal || void 0 === this.attributes.uv)
      console.warn("Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");
    else {
      var b = this.attributes.index.array, c = this.attributes.position.array, d = this.attributes.normal.array, e = this.attributes.uv.array, f = c.length / 3;
      if (void 0 === this.attributes.tangent) {
        var g = 4 * f;
        this.attributes.tangent = { itemSize: 4, array: new Float32Array(g), numItems: g };
      }
      for (var h = this.attributes.tangent.array, i = [], k = [], g = 0; g < f; g++)
        i[g] = new THREE.Vector3(), k[g] = new THREE.Vector3();
      var l, m, p, s, q, n, r, v, w, x, t, K, D, B, z, f = new THREE.Vector3(), g = new THREE.Vector3(), E, G, I, Y, C, P, A, J = this.offsets;
      I = 0;
      for (Y = J.length; I < Y; ++I) {
        G = J[I].start;
        C = J[I].count;
        var M = J[I].index;
        E = G;
        for (G += C; E < G; E += 3)
          C = M + b[E], P = M + b[E + 1], A = M + b[E + 2], l = c[3 * C], m = c[3 * C + 1], p = c[3 * C + 2], s = c[3 * P], q = c[3 * P + 1], n = c[3 * P + 2], r = c[3 * A], v = c[3 * A + 1], w = c[3 * A + 2], x = e[2 * C], t = e[2 * C + 1], K = e[2 * P], D = e[2 * P + 1], B = e[2 * A], z = e[2 * A + 1], s -= l, l = r - l, q -= m, m = v - m, n -= p, p = w - p, K -= x, x = B - x, D -= t, t = z - t, z = 1 / (K * t - x * D), f.set((t * s - D * l) * z, (t * q - D * m) * z, (t * n - D * p) * z), g.set((K * l - x * s) * z, (K * m - x * q) * z, (K * p - x * n) * z), i[C].addSelf(f), i[P].addSelf(f), i[A].addSelf(f), k[C].addSelf(g), k[P].addSelf(g), k[A].addSelf(g);
      }
      var T = new THREE.Vector3(), N = new THREE.Vector3(), fa = new THREE.Vector3(), oa = new THREE.Vector3(), L, Z, eb;
      I = 0;
      for (Y = J.length; I < Y; ++I) {
        G = J[I].start;
        C = J[I].count;
        M = J[I].index;
        E = G;
        for (G += C; E < G; E += 3)
          C = M + b[E], P = M + b[E + 1], A = M + b[E + 2], a(C), a(P), a(A);
      }
      this.tangentsNeedUpdate = this.hasTangents = true;
    }
  }, dispose: function() {
    this.dispatchEvent({ type: "dispose" });
  } };
  THREE.Camera = function() {
    THREE.Object3D.call(this);
    this.matrixWorldInverse = new THREE.Matrix4();
    this.projectionMatrix = new THREE.Matrix4();
    this.projectionMatrixInverse = new THREE.Matrix4();
  };
  THREE.Camera.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Camera.prototype.lookAt = function(a) {
    this.matrix.lookAt(this.position, a, this.up);
    true === this.rotationAutoUpdate && (false === this.useQuaternion ? this.rotation.setEulerFromRotationMatrix(this.matrix, this.eulerOrder) : this.quaternion.copy(this.matrix.decompose()[1]));
  };
  THREE.OrthographicCamera = function(a, b, c, d, e, f) {
    THREE.Camera.call(this);
    this.left = a;
    this.right = b;
    this.top = c;
    this.bottom = d;
    this.near = void 0 !== e ? e : 0.1;
    this.far = void 0 !== f ? f : 2e3;
    this.updateProjectionMatrix();
  };
  THREE.OrthographicCamera.prototype = Object.create(THREE.Camera.prototype);
  THREE.OrthographicCamera.prototype.updateProjectionMatrix = function() {
    this.projectionMatrix.makeOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
  };
  THREE.PerspectiveCamera = function(a, b, c, d) {
    THREE.Camera.call(this);
    this.fov = void 0 !== a ? a : 50;
    this.aspect = void 0 !== b ? b : 1;
    this.near = void 0 !== c ? c : 0.1;
    this.far = void 0 !== d ? d : 2e3;
    this.updateProjectionMatrix();
  };
  THREE.PerspectiveCamera.prototype = Object.create(THREE.Camera.prototype);
  THREE.PerspectiveCamera.prototype.setLens = function(a, b) {
    void 0 === b && (b = 24);
    this.fov = 2 * THREE.Math.radToDeg(Math.atan(b / (2 * a)));
    this.updateProjectionMatrix();
  };
  THREE.PerspectiveCamera.prototype.setViewOffset = function(a, b, c, d, e, f) {
    this.fullWidth = a;
    this.fullHeight = b;
    this.x = c;
    this.y = d;
    this.width = e;
    this.height = f;
    this.updateProjectionMatrix();
  };
  THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function() {
    if (this.fullWidth) {
      var a = this.fullWidth / this.fullHeight, b = Math.tan(THREE.Math.degToRad(0.5 * this.fov)) * this.near, c = -b, d = a * c, a = Math.abs(a * b - d), c = Math.abs(b - c);
      this.projectionMatrix.makeFrustum(d + this.x * a / this.fullWidth, d + (this.x + this.width) * a / this.fullWidth, b - (this.y + this.height) * c / this.fullHeight, b - this.y * c / this.fullHeight, this.near, this.far);
    } else
      this.projectionMatrix.makePerspective(this.fov, this.aspect, this.near, this.far);
  };
  THREE.Light = function(a) {
    THREE.Object3D.call(this);
    this.color = new THREE.Color(a);
  };
  THREE.Light.prototype = Object.create(THREE.Object3D.prototype);
  THREE.AmbientLight = function(a) {
    THREE.Light.call(this, a);
  };
  THREE.AmbientLight.prototype = Object.create(THREE.Light.prototype);
  THREE.AreaLight = function(a, b) {
    THREE.Light.call(this, a);
    this.normal = new THREE.Vector3(0, -1, 0);
    this.right = new THREE.Vector3(1, 0, 0);
    this.intensity = void 0 !== b ? b : 1;
    this.height = this.width = 1;
    this.constantAttenuation = 1.5;
    this.linearAttenuation = 0.5;
    this.quadraticAttenuation = 0.1;
  };
  THREE.AreaLight.prototype = Object.create(THREE.Light.prototype);
  THREE.DirectionalLight = function(a, b) {
    THREE.Light.call(this, a);
    this.position = new THREE.Vector3(0, 1, 0);
    this.target = new THREE.Object3D();
    this.intensity = void 0 !== b ? b : 1;
    this.onlyShadow = this.castShadow = false;
    this.shadowCameraNear = 50;
    this.shadowCameraFar = 5e3;
    this.shadowCameraLeft = -500;
    this.shadowCameraTop = this.shadowCameraRight = 500;
    this.shadowCameraBottom = -500;
    this.shadowCameraVisible = false;
    this.shadowBias = 0;
    this.shadowDarkness = 0.5;
    this.shadowMapHeight = this.shadowMapWidth = 512;
    this.shadowCascade = false;
    this.shadowCascadeOffset = new THREE.Vector3(0, 0, -1e3);
    this.shadowCascadeCount = 2;
    this.shadowCascadeBias = [0, 0, 0];
    this.shadowCascadeWidth = [512, 512, 512];
    this.shadowCascadeHeight = [512, 512, 512];
    this.shadowCascadeNearZ = [-1, 0.99, 0.998];
    this.shadowCascadeFarZ = [0.99, 0.998, 1];
    this.shadowCascadeArray = [];
    this.shadowMatrix = this.shadowCamera = this.shadowMapSize = this.shadowMap = null;
  };
  THREE.DirectionalLight.prototype = Object.create(THREE.Light.prototype);
  THREE.HemisphereLight = function(a, b, c) {
    THREE.Light.call(this, a);
    this.groundColor = new THREE.Color(b);
    this.position = new THREE.Vector3(0, 100, 0);
    this.intensity = void 0 !== c ? c : 1;
  };
  THREE.HemisphereLight.prototype = Object.create(THREE.Light.prototype);
  THREE.PointLight = function(a, b, c) {
    THREE.Light.call(this, a);
    this.position = new THREE.Vector3(0, 0, 0);
    this.intensity = void 0 !== b ? b : 1;
    this.distance = void 0 !== c ? c : 0;
    this.onlyShadow = this.castShadow = false;
    this.shadowCameraNear = 50;
    this.shadowCameraFar = 5e3;
    this.shadowCameraVisible = false;
    this.shadowBias = 0;
    this.shadowDarkness = 0.5;
    this.shadowMapHeight = this.shadowMapWidth = 512;
  };
  THREE.PointLight.prototype = Object.create(THREE.Light.prototype);
  THREE.SpotLight = function(a, b, c, d, e) {
    THREE.Light.call(this, a);
    this.position = new THREE.Vector3(0, 1, 0);
    this.target = new THREE.Object3D();
    this.intensity = void 0 !== b ? b : 1;
    this.distance = void 0 !== c ? c : 0;
    this.angle = void 0 !== d ? d : Math.PI / 2;
    this.exponent = void 0 !== e ? e : 10;
    this.onlyShadow = this.castShadow = false;
    this.shadowCameraNear = 50;
    this.shadowCameraFar = 5e3;
    this.shadowCameraFov = 50;
    this.shadowCameraVisible = false;
    this.shadowBias = 0;
    this.shadowDarkness = 0.5;
    this.shadowMapHeight = this.shadowMapWidth = 512;
    this.shadowMatrix = this.shadowCamera = this.shadowMapSize = this.shadowMap = null;
  };
  THREE.SpotLight.prototype = Object.create(THREE.Light.prototype);
  THREE.Loader = function(a) {
    this.statusDomElement = (this.showStatus = a) ? THREE.Loader.prototype.addStatusElement() : null;
    this.onLoadStart = function() {
    };
    this.onLoadProgress = function() {
    };
    this.onLoadComplete = function() {
    };
  };
  THREE.Loader.prototype = { constructor: THREE.Loader, crossOrigin: "anonymous", addStatusElement: function() {
    var a = document.createElement("div");
    a.style.position = "absolute";
    a.style.right = "0px";
    a.style.top = "0px";
    a.style.fontSize = "0.8em";
    a.style.textAlign = "left";
    a.style.background = "rgba(0,0,0,0.25)";
    a.style.color = "#fff";
    a.style.width = "120px";
    a.style.padding = "0.5em 0.5em 0.5em 0.5em";
    a.style.zIndex = 1e3;
    a.innerHTML = "Loading ...";
    return a;
  }, updateProgress: function(a) {
    var b = "Loaded ", b = a.total ? b + ((100 * a.loaded / a.total).toFixed(0) + "%") : b + ((a.loaded / 1e3).toFixed(2) + " KB");
    this.statusDomElement.innerHTML = b;
  }, extractUrlBase: function(a) {
    a = a.split("/");
    a.pop();
    return (1 > a.length ? "." : a.join("/")) + "/";
  }, initMaterials: function(a, b) {
    for (var c = [], d = 0; d < a.length; ++d)
      c[d] = THREE.Loader.prototype.createMaterial(a[d], b);
    return c;
  }, needsTangents: function(a) {
    for (var b = 0, c = a.length; b < c; b++)
      if (a[b] instanceof THREE.ShaderMaterial)
        return true;
    return false;
  }, createMaterial: function(a, b) {
    function c(a2) {
      a2 = Math.log(a2) / Math.LN2;
      return Math.floor(a2) == a2;
    }
    function d(a2) {
      a2 = Math.log(a2) / Math.LN2;
      return Math.pow(2, Math.round(a2));
    }
    function e(a2, e2, f2, h2, i2, k2, r) {
      var v = f2.toLowerCase().endsWith(".dds"), w = b + "/" + f2;
      if (v) {
        var x = THREE.ImageUtils.loadCompressedTexture(w);
        a2[e2] = x;
      } else
        x = document.createElement("canvas"), a2[e2] = new THREE.Texture(x);
      a2[e2].sourceFile = f2;
      h2 && (a2[e2].repeat.set(h2[0], h2[1]), 1 !== h2[0] && (a2[e2].wrapS = THREE.RepeatWrapping), 1 !== h2[1] && (a2[e2].wrapT = THREE.RepeatWrapping));
      i2 && a2[e2].offset.set(i2[0], i2[1]);
      k2 && (f2 = { repeat: THREE.RepeatWrapping, mirror: THREE.MirroredRepeatWrapping }, void 0 !== f2[k2[0]] && (a2[e2].wrapS = f2[k2[0]]), void 0 !== f2[k2[1]] && (a2[e2].wrapT = f2[k2[1]]));
      r && (a2[e2].anisotropy = r);
      if (!v) {
        var t = a2[e2], a2 = new Image();
        a2.onload = function() {
          if (!c(this.width) || !c(this.height)) {
            var a3 = d(this.width), b2 = d(this.height);
            t.image.width = a3;
            t.image.height = b2;
            t.image.getContext("2d").drawImage(this, 0, 0, a3, b2);
          } else
            t.image = this;
          t.needsUpdate = true;
        };
        a2.crossOrigin = g.crossOrigin;
        a2.src = w;
      }
    }
    function f(a2) {
      return (255 * a2[0] << 16) + (255 * a2[1] << 8) + 255 * a2[2];
    }
    var g = this, h = "MeshLambertMaterial", i = {
      color: 15658734,
      opacity: 1,
      map: null,
      lightMap: null,
      normalMap: null,
      bumpMap: null,
      wireframe: false
    };
    if (a.shading) {
      var k = a.shading.toLowerCase();
      "phong" === k ? h = "MeshPhongMaterial" : "basic" === k && (h = "MeshBasicMaterial");
    }
    void 0 !== a.blending && void 0 !== THREE[a.blending] && (i.blending = THREE[a.blending]);
    if (void 0 !== a.transparent || 1 > a.opacity)
      i.transparent = a.transparent;
    void 0 !== a.depthTest && (i.depthTest = a.depthTest);
    void 0 !== a.depthWrite && (i.depthWrite = a.depthWrite);
    void 0 !== a.visible && (i.visible = a.visible);
    void 0 !== a.flipSided && (i.side = THREE.BackSide);
    void 0 !== a.doubleSided && (i.side = THREE.DoubleSide);
    void 0 !== a.wireframe && (i.wireframe = a.wireframe);
    void 0 !== a.vertexColors && ("face" === a.vertexColors ? i.vertexColors = THREE.FaceColors : a.vertexColors && (i.vertexColors = THREE.VertexColors));
    a.colorDiffuse ? i.color = f(a.colorDiffuse) : a.DbgColor && (i.color = a.DbgColor);
    a.colorSpecular && (i.specular = f(a.colorSpecular));
    a.colorAmbient && (i.ambient = f(a.colorAmbient));
    a.transparency && (i.opacity = a.transparency);
    a.specularCoef && (i.shininess = a.specularCoef);
    a.mapDiffuse && b && e(i, "map", a.mapDiffuse, a.mapDiffuseRepeat, a.mapDiffuseOffset, a.mapDiffuseWrap, a.mapDiffuseAnisotropy);
    a.mapLight && b && e(i, "lightMap", a.mapLight, a.mapLightRepeat, a.mapLightOffset, a.mapLightWrap, a.mapLightAnisotropy);
    a.mapBump && b && e(i, "bumpMap", a.mapBump, a.mapBumpRepeat, a.mapBumpOffset, a.mapBumpWrap, a.mapBumpAnisotropy);
    a.mapNormal && b && e(i, "normalMap", a.mapNormal, a.mapNormalRepeat, a.mapNormalOffset, a.mapNormalWrap, a.mapNormalAnisotropy);
    a.mapSpecular && b && e(
      i,
      "specularMap",
      a.mapSpecular,
      a.mapSpecularRepeat,
      a.mapSpecularOffset,
      a.mapSpecularWrap,
      a.mapSpecularAnisotropy
    );
    a.mapBumpScale && (i.bumpScale = a.mapBumpScale);
    a.mapNormal ? (h = THREE.ShaderUtils.lib.normal, k = THREE.UniformsUtils.clone(h.uniforms), k.tNormal.value = i.normalMap, a.mapNormalFactor && k.uNormalScale.value.set(a.mapNormalFactor, a.mapNormalFactor), i.map && (k.tDiffuse.value = i.map, k.enableDiffuse.value = true), i.specularMap && (k.tSpecular.value = i.specularMap, k.enableSpecular.value = true), i.lightMap && (k.tAO.value = i.lightMap, k.enableAO.value = true), k.uDiffuseColor.value.setHex(i.color), k.uSpecularColor.value.setHex(i.specular), k.uAmbientColor.value.setHex(i.ambient), k.uShininess.value = i.shininess, void 0 !== i.opacity && (k.uOpacity.value = i.opacity), h = new THREE.ShaderMaterial({ fragmentShader: h.fragmentShader, vertexShader: h.vertexShader, uniforms: k, lights: true, fog: true }), i.transparent && (h.transparent = true)) : h = new THREE[h](i);
    void 0 !== a.DbgName && (h.name = a.DbgName);
    return h;
  } };
  THREE.BinaryLoader = function(a) {
    THREE.Loader.call(this, a);
  };
  THREE.BinaryLoader.prototype = Object.create(THREE.Loader.prototype);
  THREE.BinaryLoader.prototype.load = function(a, b, c, d) {
    var c = c && "string" === typeof c ? c : this.extractUrlBase(a), d = d && "string" === typeof d ? d : this.extractUrlBase(a), e = this.showProgress ? THREE.Loader.prototype.updateProgress : null;
    this.onLoadStart();
    this.loadAjaxJSON(this, a, b, c, d, e);
  };
  THREE.BinaryLoader.prototype.loadAjaxJSON = function(a, b, c, d, e, f) {
    var g = new XMLHttpRequest();
    g.onreadystatechange = function() {
      if (4 == g.readyState)
        if (200 == g.status || 0 == g.status) {
          var h = JSON.parse(g.responseText);
          a.loadAjaxBuffers(h, c, e, d, f);
        } else
          console.error("THREE.BinaryLoader: Couldn't load [" + b + "] [" + g.status + "]");
    };
    g.open("GET", b, true);
    g.send(null);
  };
  THREE.BinaryLoader.prototype.loadAjaxBuffers = function(a, b, c, d, e) {
    var f = new XMLHttpRequest(), g = c + "/" + a.buffers, h = 0;
    f.onreadystatechange = function() {
      if (4 == f.readyState)
        if (200 == f.status || 0 == f.status) {
          var c2 = f.response;
          void 0 === c2 && (c2 = new Uint8Array(f.responseBody).buffer);
          THREE.BinaryLoader.prototype.createBinModel(c2, b, d, a.materials);
        } else
          console.error("THREE.BinaryLoader: Couldn't load [" + g + "] [" + f.status + "]");
      else
        3 == f.readyState ? e && (0 == h && (h = f.getResponseHeader("Content-Length")), e({ total: h, loaded: f.responseText.length })) : 2 == f.readyState && (h = f.getResponseHeader("Content-Length"));
    };
    f.open("GET", g, true);
    f.responseType = "arraybuffer";
    f.send(null);
  };
  THREE.BinaryLoader.prototype.createBinModel = function(a, b, c, d) {
    var e = function() {
      var b2, c2, d2, e2, k, l, m, p, s, q, n, r, v, w, x, t;
      function K(a2) {
        return a2 % 4 ? 4 - a2 % 4 : 0;
      }
      function D(a2, b3) {
        return new Uint8Array(a2, b3, 1)[0];
      }
      function B(a2, b3) {
        return new Uint32Array(a2, b3, 1)[0];
      }
      function z(b3, c3) {
        var d3, e3, f, g, h, i, k2, l2 = new Uint32Array(a, c3, 3 * b3);
        for (d3 = 0; d3 < b3; d3++)
          e3 = l2[3 * d3], f = l2[3 * d3 + 1], g = l2[3 * d3 + 2], h = M[2 * e3], e3 = M[2 * e3 + 1], i = M[2 * f], k2 = M[2 * f + 1], f = M[2 * g], g = M[2 * g + 1], P.faceVertexUvs[0].push([new THREE.Vector2(h, e3), new THREE.Vector2(i, k2), new THREE.Vector2(
            f,
            g
          )]);
      }
      function E(b3, c3) {
        var d3, e3, f, g, h, i, k2, l2, p2, m2 = new Uint32Array(a, c3, 4 * b3);
        for (d3 = 0; d3 < b3; d3++)
          e3 = m2[4 * d3], f = m2[4 * d3 + 1], g = m2[4 * d3 + 2], h = m2[4 * d3 + 3], i = M[2 * e3], e3 = M[2 * e3 + 1], k2 = M[2 * f], l2 = M[2 * f + 1], f = M[2 * g], p2 = M[2 * g + 1], g = M[2 * h], h = M[2 * h + 1], P.faceVertexUvs[0].push([new THREE.Vector2(i, e3), new THREE.Vector2(k2, l2), new THREE.Vector2(f, p2), new THREE.Vector2(g, h)]);
      }
      function G(b3, c3, d3) {
        for (var e3, f, g, h, c3 = new Uint32Array(a, c3, 3 * b3), i = new Uint16Array(a, d3, b3), d3 = 0; d3 < b3; d3++)
          e3 = c3[3 * d3], f = c3[3 * d3 + 1], g = c3[3 * d3 + 2], h = i[d3], P.faces.push(new THREE.Face3(
            e3,
            f,
            g,
            null,
            null,
            h
          ));
      }
      function I(b3, c3, d3) {
        for (var e3, f, g, h, i, c3 = new Uint32Array(a, c3, 4 * b3), k2 = new Uint16Array(a, d3, b3), d3 = 0; d3 < b3; d3++)
          e3 = c3[4 * d3], f = c3[4 * d3 + 1], g = c3[4 * d3 + 2], h = c3[4 * d3 + 3], i = k2[d3], P.faces.push(new THREE.Face4(e3, f, g, h, null, null, i));
      }
      function Y(b3, c3, d3, e3) {
        for (var f, g, h, i, k2, l2, p2, c3 = new Uint32Array(a, c3, 3 * b3), d3 = new Uint32Array(a, d3, 3 * b3), m2 = new Uint16Array(a, e3, b3), e3 = 0; e3 < b3; e3++) {
          f = c3[3 * e3];
          g = c3[3 * e3 + 1];
          h = c3[3 * e3 + 2];
          k2 = d3[3 * e3];
          l2 = d3[3 * e3 + 1];
          p2 = d3[3 * e3 + 2];
          i = m2[e3];
          var q2 = J[3 * l2], n2 = J[3 * l2 + 1];
          l2 = J[3 * l2 + 2];
          var s2 = J[3 * p2], r2 = J[3 * p2 + 1];
          p2 = J[3 * p2 + 2];
          P.faces.push(new THREE.Face3(
            f,
            g,
            h,
            [new THREE.Vector3(J[3 * k2], J[3 * k2 + 1], J[3 * k2 + 2]), new THREE.Vector3(q2, n2, l2), new THREE.Vector3(s2, r2, p2)],
            null,
            i
          ));
        }
      }
      function C(b3, c3, d3, e3) {
        for (var f, g, h, i, k2, l2, p2, m2, q2, c3 = new Uint32Array(a, c3, 4 * b3), d3 = new Uint32Array(a, d3, 4 * b3), n2 = new Uint16Array(a, e3, b3), e3 = 0; e3 < b3; e3++) {
          f = c3[4 * e3];
          g = c3[4 * e3 + 1];
          h = c3[4 * e3 + 2];
          i = c3[4 * e3 + 3];
          l2 = d3[4 * e3];
          p2 = d3[4 * e3 + 1];
          m2 = d3[4 * e3 + 2];
          q2 = d3[4 * e3 + 3];
          k2 = n2[e3];
          var s2 = J[3 * p2], r2 = J[3 * p2 + 1];
          p2 = J[3 * p2 + 2];
          var t2 = J[3 * m2], v2 = J[3 * m2 + 1];
          m2 = J[3 * m2 + 2];
          var w2 = J[3 * q2], x2 = J[3 * q2 + 1];
          q2 = J[3 * q2 + 2];
          P.faces.push(new THREE.Face4(f, g, h, i, [new THREE.Vector3(J[3 * l2], J[3 * l2 + 1], J[3 * l2 + 2]), new THREE.Vector3(s2, r2, p2), new THREE.Vector3(t2, v2, m2), new THREE.Vector3(w2, x2, q2)], null, k2));
        }
      }
      var P = this, A = 0, J = [], M = [], T, N, fa;
      THREE.Geometry.call(this);
      t = a;
      N = A;
      w = new Uint8Array(t, N, 12);
      q = "";
      for (v = 0; 12 > v; v++)
        q += String.fromCharCode(w[N + v]);
      b2 = D(t, N + 12);
      D(t, N + 13);
      D(t, N + 14);
      D(t, N + 15);
      c2 = D(t, N + 16);
      d2 = D(t, N + 17);
      e2 = D(t, N + 18);
      k = D(t, N + 19);
      l = B(t, N + 20);
      m = B(t, N + 20 + 4);
      p = B(t, N + 20 + 8);
      s = B(t, N + 20 + 12);
      q = B(t, N + 20 + 16);
      n = B(t, N + 20 + 20);
      r = B(t, N + 20 + 24);
      v = B(t, N + 20 + 28);
      w = B(t, N + 20 + 32);
      x = B(t, N + 20 + 36);
      t = B(t, N + 20 + 40);
      A += b2;
      N = 3 * c2 + k;
      fa = 4 * c2 + k;
      T = s * N;
      b2 = q * (N + 3 * d2);
      c2 = n * (N + 3 * e2);
      k = r * (N + 3 * d2 + 3 * e2);
      N = v * fa;
      d2 = w * (fa + 4 * d2);
      e2 = x * (fa + 4 * e2);
      fa = A;
      var A = new Float32Array(a, A, 3 * l), oa, L, Z, eb;
      for (oa = 0; oa < l; oa++)
        L = A[3 * oa], Z = A[3 * oa + 1], eb = A[3 * oa + 2], P.vertices.push(new THREE.Vector3(L, Z, eb));
      l = A = fa + 3 * l * Float32Array.BYTES_PER_ELEMENT;
      if (m) {
        A = new Int8Array(a, A, 3 * m);
        for (fa = 0; fa < m; fa++)
          oa = A[3 * fa], L = A[3 * fa + 1], Z = A[3 * fa + 2], J.push(oa / 127, L / 127, Z / 127);
      }
      A = l + 3 * m * Int8Array.BYTES_PER_ELEMENT;
      m = A += K(3 * m);
      if (p) {
        l = new Float32Array(a, A, 2 * p);
        for (A = 0; A < p; A++)
          fa = l[2 * A], oa = l[2 * A + 1], M.push(fa, oa);
      }
      p = A = m + 2 * p * Float32Array.BYTES_PER_ELEMENT;
      T = p + T + K(2 * s);
      m = T + b2 + K(2 * q);
      b2 = m + c2 + K(2 * n);
      c2 = b2 + k + K(2 * r);
      N = c2 + N + K(2 * v);
      k = N + d2 + K(2 * w);
      d2 = k + e2 + K(2 * x);
      n && (e2 = m + 3 * n * Uint32Array.BYTES_PER_ELEMENT, G(n, m, e2 + 3 * n * Uint32Array.BYTES_PER_ELEMENT), z(n, e2));
      r && (n = b2 + 3 * r * Uint32Array.BYTES_PER_ELEMENT, e2 = n + 3 * r * Uint32Array.BYTES_PER_ELEMENT, Y(r, b2, n, e2 + 3 * r * Uint32Array.BYTES_PER_ELEMENT), z(r, e2));
      x && (r = k + 4 * x * Uint32Array.BYTES_PER_ELEMENT, I(x, k, r + 4 * x * Uint32Array.BYTES_PER_ELEMENT), E(x, r));
      t && (x = d2 + 4 * t * Uint32Array.BYTES_PER_ELEMENT, r = x + 4 * t * Uint32Array.BYTES_PER_ELEMENT, C(t, d2, x, r + 4 * t * Uint32Array.BYTES_PER_ELEMENT), E(t, r));
      s && G(s, p, p + 3 * s * Uint32Array.BYTES_PER_ELEMENT);
      q && (s = T + 3 * q * Uint32Array.BYTES_PER_ELEMENT, Y(q, T, s, s + 3 * q * Uint32Array.BYTES_PER_ELEMENT));
      v && I(v, c2, c2 + 4 * v * Uint32Array.BYTES_PER_ELEMENT);
      w && (q = N + 4 * w * Uint32Array.BYTES_PER_ELEMENT, C(w, N, q, q + 4 * w * Uint32Array.BYTES_PER_ELEMENT));
      this.computeCentroids();
      this.computeFaceNormals();
    };
    e.prototype = Object.create(THREE.Geometry.prototype);
    e = new e(c);
    c = this.initMaterials(d, c);
    this.needsTangents(c) && e.computeTangents();
    b(e, c);
  };
  THREE.ImageLoader = function() {
    THREE.EventDispatcher.call(this);
    this.crossOrigin = null;
  };
  THREE.ImageLoader.prototype = { constructor: THREE.ImageLoader, load: function(a, b) {
    var c = this;
    void 0 === b && (b = new Image());
    b.addEventListener("load", function() {
      c.dispatchEvent({ type: "load", content: b });
    }, false);
    b.addEventListener("error", function() {
      c.dispatchEvent({ type: "error", message: "Couldn't load URL [" + a + "]" });
    }, false);
    c.crossOrigin && (b.crossOrigin = c.crossOrigin);
    b.src = a;
  } };
  THREE.JSONLoader = function(a) {
    THREE.Loader.call(this, a);
    this.withCredentials = false;
  };
  THREE.JSONLoader.prototype = Object.create(THREE.Loader.prototype);
  THREE.JSONLoader.prototype.load = function(a, b, c) {
    c = c && "string" === typeof c ? c : this.extractUrlBase(a);
    this.onLoadStart();
    this.loadAjaxJSON(this, a, b, c);
  };
  THREE.JSONLoader.prototype.loadAjaxJSON = function(a, b, c, d, e) {
    var f = new XMLHttpRequest(), g = 0;
    f.withCredentials = this.withCredentials;
    f.onreadystatechange = function() {
      if (f.readyState === f.DONE)
        if (200 === f.status || 0 === f.status) {
          if (f.responseText) {
            var h = JSON.parse(f.responseText);
            a.createModel(h, c, d);
          } else
            console.warn("THREE.JSONLoader: [" + b + "] seems to be unreachable or file there is empty");
          a.onLoadComplete();
        } else
          console.error("THREE.JSONLoader: Couldn't load [" + b + "] [" + f.status + "]");
      else
        f.readyState === f.LOADING ? e && (0 === g && (g = f.getResponseHeader("Content-Length")), e({ total: g, loaded: f.responseText.length })) : f.readyState === f.HEADERS_RECEIVED && (g = f.getResponseHeader("Content-Length"));
    };
    f.open("GET", b, true);
    f.send(null);
  };
  THREE.JSONLoader.prototype.createModel = function(a, b, c) {
    var d = new THREE.Geometry(), e = void 0 !== a.scale ? 1 / a.scale : 1, f, g, h, i, k, l, m, p, s, q, n, r, v, w, x, t = a.faces;
    q = a.vertices;
    var K = a.normals, D = a.colors, B = 0;
    for (f = 0; f < a.uvs.length; f++)
      a.uvs[f].length && B++;
    for (f = 0; f < B; f++)
      d.faceUvs[f] = [], d.faceVertexUvs[f] = [];
    i = 0;
    for (k = q.length; i < k; )
      l = new THREE.Vector3(), l.x = q[i++] * e, l.y = q[i++] * e, l.z = q[i++] * e, d.vertices.push(l);
    i = 0;
    for (k = t.length; i < k; ) {
      q = t[i++];
      l = q & 1;
      h = q & 2;
      f = q & 4;
      g = q & 8;
      p = q & 16;
      m = q & 32;
      n = q & 64;
      q &= 128;
      l ? (r = new THREE.Face4(), r.a = t[i++], r.b = t[i++], r.c = t[i++], r.d = t[i++], l = 4) : (r = new THREE.Face3(), r.a = t[i++], r.b = t[i++], r.c = t[i++], l = 3);
      h && (h = t[i++], r.materialIndex = h);
      h = d.faces.length;
      if (f)
        for (f = 0; f < B; f++)
          v = a.uvs[f], s = t[i++], x = v[2 * s], s = v[2 * s + 1], d.faceUvs[f][h] = new THREE.Vector2(x, s);
      if (g)
        for (f = 0; f < B; f++) {
          v = a.uvs[f];
          w = [];
          for (g = 0; g < l; g++)
            s = t[i++], x = v[2 * s], s = v[2 * s + 1], w[g] = new THREE.Vector2(x, s);
          d.faceVertexUvs[f][h] = w;
        }
      p && (p = 3 * t[i++], g = new THREE.Vector3(), g.x = K[p++], g.y = K[p++], g.z = K[p], r.normal = g);
      if (m)
        for (f = 0; f < l; f++)
          p = 3 * t[i++], g = new THREE.Vector3(), g.x = K[p++], g.y = K[p++], g.z = K[p], r.vertexNormals.push(g);
      n && (m = t[i++], m = new THREE.Color(D[m]), r.color = m);
      if (q)
        for (f = 0; f < l; f++)
          m = t[i++], m = new THREE.Color(D[m]), r.vertexColors.push(m);
      d.faces.push(r);
    }
    if (a.skinWeights) {
      i = 0;
      for (k = a.skinWeights.length; i < k; i += 2)
        t = a.skinWeights[i], K = a.skinWeights[i + 1], d.skinWeights.push(new THREE.Vector4(t, K, 0, 0));
    }
    if (a.skinIndices) {
      i = 0;
      for (k = a.skinIndices.length; i < k; i += 2)
        t = a.skinIndices[i], K = a.skinIndices[i + 1], d.skinIndices.push(new THREE.Vector4(t, K, 0, 0));
    }
    d.bones = a.bones;
    d.animation = a.animation;
    if (void 0 !== a.morphTargets) {
      i = 0;
      for (k = a.morphTargets.length; i < k; i++) {
        d.morphTargets[i] = {};
        d.morphTargets[i].name = a.morphTargets[i].name;
        d.morphTargets[i].vertices = [];
        D = d.morphTargets[i].vertices;
        B = a.morphTargets[i].vertices;
        t = 0;
        for (K = B.length; t < K; t += 3)
          q = new THREE.Vector3(), q.x = B[t] * e, q.y = B[t + 1] * e, q.z = B[t + 2] * e, D.push(q);
      }
    }
    if (void 0 !== a.morphColors) {
      i = 0;
      for (k = a.morphColors.length; i < k; i++) {
        d.morphColors[i] = {};
        d.morphColors[i].name = a.morphColors[i].name;
        d.morphColors[i].colors = [];
        K = d.morphColors[i].colors;
        D = a.morphColors[i].colors;
        e = 0;
        for (t = D.length; e < t; e += 3)
          B = new THREE.Color(16755200), B.setRGB(D[e], D[e + 1], D[e + 2]), K.push(B);
      }
    }
    d.computeCentroids();
    d.computeFaceNormals();
    a = this.initMaterials(a.materials, c);
    this.needsTangents(a) && d.computeTangents();
    b(d, a);
  };
  THREE.LoadingMonitor = function() {
    THREE.EventDispatcher.call(this);
    var a = this, b = 0, c = 0, d = function() {
      b++;
      a.dispatchEvent({ type: "progress", loaded: b, total: c });
      b === c && a.dispatchEvent({ type: "load" });
    };
    this.add = function(a2) {
      c++;
      a2.addEventListener("load", d, false);
    };
  };
  THREE.SceneLoader = function() {
    this.onLoadStart = function() {
    };
    this.onLoadProgress = function() {
    };
    this.onLoadComplete = function() {
    };
    this.callbackSync = function() {
    };
    this.callbackProgress = function() {
    };
    this.geometryHandlerMap = {};
    this.hierarchyHandlerMap = {};
    this.addGeometryHandler("ascii", THREE.JSONLoader);
    this.addGeometryHandler("binary", THREE.BinaryLoader);
  };
  THREE.SceneLoader.prototype.constructor = THREE.SceneLoader;
  THREE.SceneLoader.prototype.load = function(a, b) {
    var c = this, d = new XMLHttpRequest();
    d.onreadystatechange = function() {
      if (4 === d.readyState)
        if (200 === d.status || 0 === d.status) {
          var e = JSON.parse(d.responseText);
          c.parse(e, b, a);
        } else
          console.error("THREE.SceneLoader: Couldn't load [" + a + "] [" + d.status + "]");
    };
    d.open("GET", a, true);
    d.send(null);
  };
  THREE.SceneLoader.prototype.addGeometryHandler = function(a, b) {
    this.geometryHandlerMap[a] = { loaderClass: b };
  };
  THREE.SceneLoader.prototype.addHierarchyHandler = function(a, b) {
    this.hierarchyHandlerMap[a] = { loaderClass: b };
  };
  THREE.SceneLoader.prototype.parse = function(a, b, c) {
    function d(a2, b2) {
      return "relativeToHTML" == b2 ? a2 : m + "/" + a2;
    }
    function e() {
      f(z.scene, G.objects);
    }
    function f(a2, b2) {
      var c2, e2, g2, i2, k2, m2;
      for (m2 in b2)
        if (void 0 === z.objects[m2]) {
          var n2 = b2[m2], r2 = null;
          if (n2.type && n2.type in l.hierarchyHandlerMap) {
            if (void 0 === n2.loading) {
              c2 = { type: 1, url: 1, material: 1, position: 1, rotation: 1, scale: 1, visible: 1, children: 1, properties: 1, skin: 1, morph: 1, mirroredLoop: 1, duration: 1 };
              e2 = {};
              for (var t2 in n2)
                t2 in c2 || (e2[t2] = n2[t2]);
              s = z.materials[n2.material];
              n2.loading = true;
              c2 = l.hierarchyHandlerMap[n2.type].loaderObject;
              c2.options ? c2.load(d(n2.url, G.urlBaseType), h(m2, a2, s, n2)) : c2.load(d(n2.url, G.urlBaseType), h(m2, a2, s, n2), e2);
            }
          } else if (void 0 !== n2.geometry) {
            if (p = z.geometries[n2.geometry]) {
              r2 = false;
              s = z.materials[n2.material];
              r2 = s instanceof THREE.ShaderMaterial;
              e2 = n2.position;
              g2 = n2.rotation;
              i2 = n2.scale;
              c2 = n2.matrix;
              k2 = n2.quaternion;
              n2.material || (s = new THREE.MeshFaceMaterial(z.face_materials[n2.geometry]));
              s instanceof THREE.MeshFaceMaterial && 0 === s.materials.length && (s = new THREE.MeshFaceMaterial(z.face_materials[n2.geometry]));
              if (s instanceof THREE.MeshFaceMaterial)
                for (var A2 = 0; A2 < s.materials.length; A2++)
                  r2 = r2 || s.materials[A2] instanceof THREE.ShaderMaterial;
              r2 && p.computeTangents();
              n2.skin ? r2 = new THREE.SkinnedMesh(p, s) : n2.morph ? (r2 = new THREE.MorphAnimMesh(p, s), void 0 !== n2.duration && (r2.duration = n2.duration), void 0 !== n2.time && (r2.time = n2.time), void 0 !== n2.mirroredLoop && (r2.mirroredLoop = n2.mirroredLoop), s.morphNormals && p.computeMorphNormals()) : r2 = new THREE.Mesh(p, s);
              r2.name = m2;
              c2 ? (r2.matrixAutoUpdate = false, r2.matrix.set(
                c2[0],
                c2[1],
                c2[2],
                c2[3],
                c2[4],
                c2[5],
                c2[6],
                c2[7],
                c2[8],
                c2[9],
                c2[10],
                c2[11],
                c2[12],
                c2[13],
                c2[14],
                c2[15]
              )) : (r2.position.set(e2[0], e2[1], e2[2]), k2 ? (r2.quaternion.set(k2[0], k2[1], k2[2], k2[3]), r2.useQuaternion = true) : r2.rotation.set(g2[0], g2[1], g2[2]), r2.scale.set(i2[0], i2[1], i2[2]));
              r2.visible = n2.visible;
              r2.castShadow = n2.castShadow;
              r2.receiveShadow = n2.receiveShadow;
              a2.add(r2);
              z.objects[m2] = r2;
            }
          } else
            "DirectionalLight" === n2.type || "PointLight" === n2.type || "AmbientLight" === n2.type ? (w = void 0 !== n2.color ? n2.color : 16777215, x = void 0 !== n2.intensity ? n2.intensity : 1, "DirectionalLight" === n2.type ? (e2 = n2.direction, v = new THREE.DirectionalLight(w, x), v.position.set(e2[0], e2[1], e2[2]), n2.target && (E.push({ object: v, targetName: n2.target }), v.target = null)) : "PointLight" === n2.type ? (e2 = n2.position, c2 = n2.distance, v = new THREE.PointLight(w, x, c2), v.position.set(e2[0], e2[1], e2[2])) : "AmbientLight" === n2.type && (v = new THREE.AmbientLight(w)), a2.add(v), v.name = m2, z.lights[m2] = v, z.objects[m2] = v) : "PerspectiveCamera" === n2.type || "OrthographicCamera" === n2.type ? ("PerspectiveCamera" === n2.type ? q = new THREE.PerspectiveCamera(n2.fov, n2.aspect, n2.near, n2.far) : "OrthographicCamera" === n2.type && (q = new THREE.OrthographicCamera(n2.left, n2.right, n2.top, n2.bottom, n2.near, n2.far)), e2 = n2.position, q.position.set(e2[0], e2[1], e2[2]), a2.add(q), q.name = m2, z.cameras[m2] = q, z.objects[m2] = q) : (e2 = n2.position, g2 = n2.rotation, i2 = n2.scale, k2 = n2.quaternion, r2 = new THREE.Object3D(), r2.name = m2, r2.position.set(e2[0], e2[1], e2[2]), k2 ? (r2.quaternion.set(k2[0], k2[1], k2[2], k2[3]), r2.useQuaternion = true) : r2.rotation.set(g2[0], g2[1], g2[2]), r2.scale.set(i2[0], i2[1], i2[2]), r2.visible = void 0 !== n2.visible ? n2.visible : false, a2.add(r2), z.objects[m2] = r2, z.empties[m2] = r2);
          if (r2) {
            if (void 0 !== n2.properties)
              for (var B2 in n2.properties)
                r2.properties[B2] = n2.properties[B2];
            void 0 !== n2.children && f(r2, n2.children);
          }
        }
    }
    function g(a2) {
      return function(b2, c2) {
        z.geometries[a2] = b2;
        z.face_materials[a2] = c2;
        e();
        t -= 1;
        l.onLoadComplete();
        k();
      };
    }
    function h(a2, b2, c2, d2) {
      return function(f2) {
        var f2 = f2.content ? f2.content : f2.dae ? f2.scene : f2, g2 = d2.position, h2 = d2.rotation, i2 = d2.quaternion, p2 = d2.scale;
        f2.position.set(g2[0], g2[1], g2[2]);
        i2 ? (f2.quaternion.set(i2[0], i2[1], i2[2], i2[3]), f2.useQuaternion = true) : f2.rotation.set(h2[0], h2[1], h2[2]);
        f2.scale.set(p2[0], p2[1], p2[2]);
        c2 && f2.traverse(function(a3) {
          a3.material = c2;
        });
        var m2 = void 0 !== d2.visible ? d2.visible : true;
        f2.traverse(function(a3) {
          a3.visible = m2;
        });
        b2.add(f2);
        f2.name = a2;
        z.objects[a2] = f2;
        e();
        t -= 1;
        l.onLoadComplete();
        k();
      };
    }
    function i(a2) {
      return function(b2, c2) {
        z.geometries[a2] = b2;
        z.face_materials[a2] = c2;
      };
    }
    function k() {
      l.callbackProgress({ totalModels: D, totalTextures: B, loadedModels: D - t, loadedTextures: B - K }, z);
      l.onLoadProgress();
      if (0 === t && 0 === K) {
        for (var a2 = 0; a2 < E.length; a2++) {
          var c2 = E[a2], d2 = z.objects[c2.targetName];
          d2 ? c2.object.target = d2 : (c2.object.target = new THREE.Object3D(), z.scene.add(c2.object.target));
          c2.object.target.properties.targetInverse = c2.object;
        }
        b(z);
      }
    }
    var l = this, m = THREE.Loader.prototype.extractUrlBase(c), p, s, q, n, r, v, w, x, t, K, D, B, z, E = [], G = a, I;
    for (I in this.geometryHandlerMap)
      a = this.geometryHandlerMap[I].loaderClass, this.geometryHandlerMap[I].loaderObject = new a();
    for (I in this.hierarchyHandlerMap)
      a = this.hierarchyHandlerMap[I].loaderClass, this.hierarchyHandlerMap[I].loaderObject = new a();
    K = t = 0;
    z = {
      scene: new THREE.Scene(),
      geometries: {},
      face_materials: {},
      materials: {},
      textures: {},
      objects: {},
      cameras: {},
      lights: {},
      fogs: {},
      empties: {}
    };
    if (G.transform && (I = G.transform.position, a = G.transform.rotation, c = G.transform.scale, I && z.scene.position.set(I[0], I[1], I[2]), a && z.scene.rotation.set(a[0], a[1], a[2]), c && z.scene.scale.set(c[0], c[1], c[2]), I || a || c))
      z.scene.updateMatrix(), z.scene.updateMatrixWorld();
    I = function(a2) {
      return function() {
        K -= a2;
        k();
        l.onLoadComplete();
      };
    };
    for (var Y in G.fogs)
      a = G.fogs[Y], "linear" === a.type ? n = new THREE.Fog(0, a.near, a.far) : "exp2" === a.type && (n = new THREE.FogExp2(0, a.density)), a = a.color, n.color.setRGB(a[0], a[1], a[2]), z.fogs[Y] = n;
    for (var C in G.geometries)
      n = G.geometries[C], n.type in this.geometryHandlerMap && (t += 1, l.onLoadStart());
    for (var P in G.objects)
      n = G.objects[P], n.type && n.type in this.hierarchyHandlerMap && (t += 1, l.onLoadStart());
    D = t;
    for (C in G.geometries)
      if (n = G.geometries[C], "cube" === n.type)
        p = new THREE.CubeGeometry(n.width, n.height, n.depth, n.widthSegments, n.heightSegments, n.depthSegments), z.geometries[C] = p;
      else if ("plane" === n.type)
        p = new THREE.PlaneGeometry(
          n.width,
          n.height,
          n.widthSegments,
          n.heightSegments
        ), z.geometries[C] = p;
      else if ("sphere" === n.type)
        p = new THREE.SphereGeometry(n.radius, n.widthSegments, n.heightSegments), z.geometries[C] = p;
      else if ("cylinder" === n.type)
        p = new THREE.CylinderGeometry(n.topRad, n.botRad, n.height, n.radSegs, n.heightSegs), z.geometries[C] = p;
      else if ("torus" === n.type)
        p = new THREE.TorusGeometry(n.radius, n.tube, n.segmentsR, n.segmentsT), z.geometries[C] = p;
      else if ("icosahedron" === n.type)
        p = new THREE.IcosahedronGeometry(n.radius, n.subdivisions), z.geometries[C] = p;
      else if (n.type in this.geometryHandlerMap) {
        P = {};
        for (r in n)
          "type" !== r && "url" !== r && (P[r] = n[r]);
        this.geometryHandlerMap[n.type].loaderObject.load(d(n.url, G.urlBaseType), g(C), P);
      } else
        "embedded" === n.type && (P = G.embeds[n.id], P.metadata = G.metadata, P && this.geometryHandlerMap.ascii.loaderObject.createModel(P, i(C), ""));
    for (var A in G.textures)
      if (C = G.textures[A], C.url instanceof Array) {
        K += C.url.length;
        for (r = 0; r < C.url.length; r++)
          l.onLoadStart();
      } else
        K += 1, l.onLoadStart();
    B = K;
    for (A in G.textures) {
      C = G.textures[A];
      void 0 !== C.mapping && void 0 !== THREE[C.mapping] && (C.mapping = new THREE[C.mapping]());
      if (C.url instanceof Array) {
        P = C.url.length;
        n = [];
        for (r = 0; r < P; r++)
          n[r] = d(C.url[r], G.urlBaseType);
        r = (r = n[0].endsWith(".dds")) ? THREE.ImageUtils.loadCompressedTextureCube(n, C.mapping, I(P)) : THREE.ImageUtils.loadTextureCube(n, C.mapping, I(P));
      } else
        r = C.url.toLowerCase().endsWith(".dds"), P = d(C.url, G.urlBaseType), n = I(1), r = r ? THREE.ImageUtils.loadCompressedTexture(P, C.mapping, n) : THREE.ImageUtils.loadTexture(P, C.mapping, n), void 0 !== THREE[C.minFilter] && (r.minFilter = THREE[C.minFilter]), void 0 !== THREE[C.magFilter] && (r.magFilter = THREE[C.magFilter]), C.anisotropy && (r.anisotropy = C.anisotropy), C.repeat && (r.repeat.set(C.repeat[0], C.repeat[1]), 1 !== C.repeat[0] && (r.wrapS = THREE.RepeatWrapping), 1 !== C.repeat[1] && (r.wrapT = THREE.RepeatWrapping)), C.offset && r.offset.set(C.offset[0], C.offset[1]), C.wrap && (P = { repeat: THREE.RepeatWrapping, mirror: THREE.MirroredRepeatWrapping }, void 0 !== P[C.wrap[0]] && (r.wrapS = P[C.wrap[0]]), void 0 !== P[C.wrap[1]] && (r.wrapT = P[C.wrap[1]]));
      z.textures[A] = r;
    }
    var J, M;
    for (J in G.materials) {
      A = G.materials[J];
      for (M in A.parameters)
        "envMap" === M || "map" === M || "lightMap" === M || "bumpMap" === M ? A.parameters[M] = z.textures[A.parameters[M]] : "shading" === M ? A.parameters[M] = "flat" === A.parameters[M] ? THREE.FlatShading : THREE.SmoothShading : "side" === M ? A.parameters[M] = "double" == A.parameters[M] ? THREE.DoubleSide : "back" == A.parameters[M] ? THREE.BackSide : THREE.FrontSide : "blending" === M ? A.parameters[M] = A.parameters[M] in THREE ? THREE[A.parameters[M]] : THREE.NormalBlending : "combine" === M ? A.parameters[M] = A.parameters[M] in THREE ? THREE[A.parameters[M]] : THREE.MultiplyOperation : "vertexColors" === M ? "face" == A.parameters[M] ? A.parameters[M] = THREE.FaceColors : A.parameters[M] && (A.parameters[M] = THREE.VertexColors) : "wrapRGB" === M && (I = A.parameters[M], A.parameters[M] = new THREE.Vector3(I[0], I[1], I[2]));
      void 0 !== A.parameters.opacity && 1 > A.parameters.opacity && (A.parameters.transparent = true);
      A.parameters.normalMap ? (I = THREE.ShaderUtils.lib.normal, C = THREE.UniformsUtils.clone(I.uniforms), r = A.parameters.color, P = A.parameters.specular, n = A.parameters.ambient, Y = A.parameters.shininess, C.tNormal.value = z.textures[A.parameters.normalMap], A.parameters.normalScale && C.uNormalScale.value.set(A.parameters.normalScale[0], A.parameters.normalScale[1]), A.parameters.map && (C.tDiffuse.value = A.parameters.map, C.enableDiffuse.value = true), A.parameters.envMap && (C.tCube.value = A.parameters.envMap, C.enableReflection.value = true, C.uReflectivity.value = A.parameters.reflectivity), A.parameters.lightMap && (C.tAO.value = A.parameters.lightMap, C.enableAO.value = true), A.parameters.specularMap && (C.tSpecular.value = z.textures[A.parameters.specularMap], C.enableSpecular.value = true), A.parameters.displacementMap && (C.tDisplacement.value = z.textures[A.parameters.displacementMap], C.enableDisplacement.value = true, C.uDisplacementBias.value = A.parameters.displacementBias, C.uDisplacementScale.value = A.parameters.displacementScale), C.uDiffuseColor.value.setHex(r), C.uSpecularColor.value.setHex(P), C.uAmbientColor.value.setHex(n), C.uShininess.value = Y, A.parameters.opacity && (C.uOpacity.value = A.parameters.opacity), s = new THREE.ShaderMaterial({ fragmentShader: I.fragmentShader, vertexShader: I.vertexShader, uniforms: C, lights: true, fog: true })) : s = new THREE[A.type](A.parameters);
      z.materials[J] = s;
    }
    for (J in G.materials)
      if (A = G.materials[J], A.parameters.materials) {
        M = [];
        for (r = 0; r < A.parameters.materials.length; r++)
          M.push(z.materials[A.parameters.materials[r]]);
        z.materials[J].materials = M;
      }
    e();
    z.cameras && G.defaults.camera && (z.currentCamera = z.cameras[G.defaults.camera]);
    z.fogs && G.defaults.fog && (z.scene.fog = z.fogs[G.defaults.fog]);
    a = G.defaults.bgcolor;
    z.bgColor = new THREE.Color();
    z.bgColor.setRGB(a[0], a[1], a[2]);
    z.bgColorAlpha = G.defaults.bgalpha;
    l.callbackSync(z);
    k();
  };
  THREE.TextureLoader = function() {
    THREE.EventDispatcher.call(this);
    this.crossOrigin = null;
  };
  THREE.TextureLoader.prototype = { constructor: THREE.TextureLoader, load: function(a) {
    var b = this, c = new Image();
    c.addEventListener("load", function() {
      var a2 = new THREE.Texture(c);
      a2.needsUpdate = true;
      b.dispatchEvent({ type: "load", content: a2 });
    }, false);
    c.addEventListener("error", function() {
      b.dispatchEvent({ type: "error", message: "Couldn't load URL [" + a + "]" });
    }, false);
    b.crossOrigin && (c.crossOrigin = b.crossOrigin);
    c.src = a;
  } };
  THREE.Material = function() {
    THREE.EventDispatcher.call(this);
    this.id = THREE.MaterialIdCount++;
    this.name = "";
    this.side = THREE.FrontSide;
    this.opacity = 1;
    this.transparent = false;
    this.blending = THREE.NormalBlending;
    this.blendSrc = THREE.SrcAlphaFactor;
    this.blendDst = THREE.OneMinusSrcAlphaFactor;
    this.blendEquation = THREE.AddEquation;
    this.depthWrite = this.depthTest = true;
    this.polygonOffset = false;
    this.alphaTest = this.polygonOffsetUnits = this.polygonOffsetFactor = 0;
    this.overdraw = false;
    this.needsUpdate = this.visible = true;
  };
  THREE.Material.prototype.setValues = function(a) {
    if (void 0 !== a)
      for (var b in a) {
        var c = a[b];
        if (void 0 === c)
          console.warn("THREE.Material: '" + b + "' parameter is undefined.");
        else if (b in this) {
          var d = this[b];
          d instanceof THREE.Color && c instanceof THREE.Color ? d.copy(c) : d instanceof THREE.Color ? d.set(c) : d instanceof THREE.Vector3 && c instanceof THREE.Vector3 ? d.copy(c) : this[b] = c;
        }
      }
  };
  THREE.Material.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Material());
    a.name = this.name;
    a.side = this.side;
    a.opacity = this.opacity;
    a.transparent = this.transparent;
    a.blending = this.blending;
    a.blendSrc = this.blendSrc;
    a.blendDst = this.blendDst;
    a.blendEquation = this.blendEquation;
    a.depthTest = this.depthTest;
    a.depthWrite = this.depthWrite;
    a.polygonOffset = this.polygonOffset;
    a.polygonOffsetFactor = this.polygonOffsetFactor;
    a.polygonOffsetUnits = this.polygonOffsetUnits;
    a.alphaTest = this.alphaTest;
    a.overdraw = this.overdraw;
    a.visible = this.visible;
    return a;
  };
  THREE.Material.prototype.dispose = function() {
    this.dispatchEvent({ type: "dispose" });
  };
  THREE.MaterialIdCount = 0;
  THREE.LineBasicMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.linewidth = 1;
    this.linejoin = this.linecap = "round";
    this.vertexColors = false;
    this.fog = true;
    this.setValues(a);
  };
  THREE.LineBasicMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.LineBasicMaterial.prototype.clone = function() {
    var a = new THREE.LineBasicMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.linewidth = this.linewidth;
    a.linecap = this.linecap;
    a.linejoin = this.linejoin;
    a.vertexColors = this.vertexColors;
    a.fog = this.fog;
    return a;
  };
  THREE.LineDashedMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.scale = this.linewidth = 1;
    this.dashSize = 3;
    this.gapSize = 1;
    this.vertexColors = false;
    this.fog = true;
    this.setValues(a);
  };
  THREE.LineDashedMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.LineDashedMaterial.prototype.clone = function() {
    var a = new THREE.LineDashedMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.linewidth = this.linewidth;
    a.scale = this.scale;
    a.dashSize = this.dashSize;
    a.gapSize = this.gapSize;
    a.vertexColors = this.vertexColors;
    a.fog = this.fog;
    return a;
  };
  THREE.MeshBasicMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.envMap = this.specularMap = this.lightMap = this.map = null;
    this.combine = THREE.MultiplyOperation;
    this.reflectivity = 1;
    this.refractionRatio = 0.98;
    this.fog = true;
    this.shading = THREE.SmoothShading;
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.wireframeLinejoin = this.wireframeLinecap = "round";
    this.vertexColors = THREE.NoColors;
    this.morphTargets = this.skinning = false;
    this.setValues(a);
  };
  THREE.MeshBasicMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.MeshBasicMaterial.prototype.clone = function() {
    var a = new THREE.MeshBasicMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.map = this.map;
    a.lightMap = this.lightMap;
    a.specularMap = this.specularMap;
    a.envMap = this.envMap;
    a.combine = this.combine;
    a.reflectivity = this.reflectivity;
    a.refractionRatio = this.refractionRatio;
    a.fog = this.fog;
    a.shading = this.shading;
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    a.wireframeLinecap = this.wireframeLinecap;
    a.wireframeLinejoin = this.wireframeLinejoin;
    a.vertexColors = this.vertexColors;
    a.skinning = this.skinning;
    a.morphTargets = this.morphTargets;
    return a;
  };
  THREE.MeshLambertMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.ambient = new THREE.Color(16777215);
    this.emissive = new THREE.Color(0);
    this.wrapAround = false;
    this.wrapRGB = new THREE.Vector3(1, 1, 1);
    this.envMap = this.specularMap = this.lightMap = this.map = null;
    this.combine = THREE.MultiplyOperation;
    this.reflectivity = 1;
    this.refractionRatio = 0.98;
    this.fog = true;
    this.shading = THREE.SmoothShading;
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.wireframeLinejoin = this.wireframeLinecap = "round";
    this.vertexColors = THREE.NoColors;
    this.morphNormals = this.morphTargets = this.skinning = false;
    this.setValues(a);
  };
  THREE.MeshLambertMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.MeshLambertMaterial.prototype.clone = function() {
    var a = new THREE.MeshLambertMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.ambient.copy(this.ambient);
    a.emissive.copy(this.emissive);
    a.wrapAround = this.wrapAround;
    a.wrapRGB.copy(this.wrapRGB);
    a.map = this.map;
    a.lightMap = this.lightMap;
    a.specularMap = this.specularMap;
    a.envMap = this.envMap;
    a.combine = this.combine;
    a.reflectivity = this.reflectivity;
    a.refractionRatio = this.refractionRatio;
    a.fog = this.fog;
    a.shading = this.shading;
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    a.wireframeLinecap = this.wireframeLinecap;
    a.wireframeLinejoin = this.wireframeLinejoin;
    a.vertexColors = this.vertexColors;
    a.skinning = this.skinning;
    a.morphTargets = this.morphTargets;
    a.morphNormals = this.morphNormals;
    return a;
  };
  THREE.MeshPhongMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.ambient = new THREE.Color(16777215);
    this.emissive = new THREE.Color(0);
    this.specular = new THREE.Color(1118481);
    this.shininess = 30;
    this.metal = false;
    this.perPixel = true;
    this.wrapAround = false;
    this.wrapRGB = new THREE.Vector3(1, 1, 1);
    this.bumpMap = this.lightMap = this.map = null;
    this.bumpScale = 1;
    this.normalMap = null;
    this.normalScale = new THREE.Vector2(1, 1);
    this.envMap = this.specularMap = null;
    this.combine = THREE.MultiplyOperation;
    this.reflectivity = 1;
    this.refractionRatio = 0.98;
    this.fog = true;
    this.shading = THREE.SmoothShading;
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.wireframeLinejoin = this.wireframeLinecap = "round";
    this.vertexColors = THREE.NoColors;
    this.morphNormals = this.morphTargets = this.skinning = false;
    this.setValues(a);
  };
  THREE.MeshPhongMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.MeshPhongMaterial.prototype.clone = function() {
    var a = new THREE.MeshPhongMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.ambient.copy(this.ambient);
    a.emissive.copy(this.emissive);
    a.specular.copy(this.specular);
    a.shininess = this.shininess;
    a.metal = this.metal;
    a.perPixel = this.perPixel;
    a.wrapAround = this.wrapAround;
    a.wrapRGB.copy(this.wrapRGB);
    a.map = this.map;
    a.lightMap = this.lightMap;
    a.bumpMap = this.bumpMap;
    a.bumpScale = this.bumpScale;
    a.normalMap = this.normalMap;
    a.normalScale.copy(this.normalScale);
    a.specularMap = this.specularMap;
    a.envMap = this.envMap;
    a.combine = this.combine;
    a.reflectivity = this.reflectivity;
    a.refractionRatio = this.refractionRatio;
    a.fog = this.fog;
    a.shading = this.shading;
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    a.wireframeLinecap = this.wireframeLinecap;
    a.wireframeLinejoin = this.wireframeLinejoin;
    a.vertexColors = this.vertexColors;
    a.skinning = this.skinning;
    a.morphTargets = this.morphTargets;
    a.morphNormals = this.morphNormals;
    return a;
  };
  THREE.MeshDepthMaterial = function(a) {
    THREE.Material.call(this);
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.setValues(a);
  };
  THREE.MeshDepthMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.MeshDepthMaterial.prototype.clone = function() {
    var a = new THREE.LineBasicMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    return a;
  };
  THREE.MeshNormalMaterial = function(a) {
    THREE.Material.call(this, a);
    this.shading = THREE.FlatShading;
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.setValues(a);
  };
  THREE.MeshNormalMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.MeshNormalMaterial.prototype.clone = function() {
    var a = new THREE.MeshNormalMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.shading = this.shading;
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    return a;
  };
  THREE.MeshFaceMaterial = function(a) {
    this.materials = a instanceof Array ? a : [];
  };
  THREE.MeshFaceMaterial.prototype.clone = function() {
    return new THREE.MeshFaceMaterial(this.materials.slice(0));
  };
  THREE.ParticleBasicMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.map = null;
    this.size = 1;
    this.sizeAttenuation = true;
    this.vertexColors = false;
    this.fog = true;
    this.setValues(a);
  };
  THREE.ParticleBasicMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.ParticleBasicMaterial.prototype.clone = function() {
    var a = new THREE.ParticleBasicMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.map = this.map;
    a.size = this.size;
    a.sizeAttenuation = this.sizeAttenuation;
    a.vertexColors = this.vertexColors;
    a.fog = this.fog;
    return a;
  };
  THREE.ParticleCanvasMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.program = function() {
    };
    this.setValues(a);
  };
  THREE.ParticleCanvasMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.ParticleCanvasMaterial.prototype.clone = function() {
    var a = new THREE.ParticleCanvasMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.program = this.program;
    return a;
  };
  THREE.ParticleDOMMaterial = function(a) {
    this.element = a;
  };
  THREE.ParticleDOMMaterial.prototype.clone = function() {
    return new THREE.ParticleDOMMaterial(this.element);
  };
  THREE.ShaderMaterial = function(a) {
    THREE.Material.call(this);
    this.vertexShader = this.fragmentShader = "void main() {}";
    this.uniforms = {};
    this.defines = {};
    this.attributes = null;
    this.shading = THREE.SmoothShading;
    this.wireframe = false;
    this.wireframeLinewidth = 1;
    this.lights = this.fog = false;
    this.vertexColors = THREE.NoColors;
    this.morphNormals = this.morphTargets = this.skinning = false;
    this.setValues(a);
  };
  THREE.ShaderMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.ShaderMaterial.prototype.clone = function() {
    var a = new THREE.ShaderMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.fragmentShader = this.fragmentShader;
    a.vertexShader = this.vertexShader;
    a.uniforms = THREE.UniformsUtils.clone(this.uniforms);
    a.attributes = this.attributes;
    a.defines = this.defines;
    a.shading = this.shading;
    a.wireframe = this.wireframe;
    a.wireframeLinewidth = this.wireframeLinewidth;
    a.fog = this.fog;
    a.lights = this.lights;
    a.vertexColors = this.vertexColors;
    a.skinning = this.skinning;
    a.morphTargets = this.morphTargets;
    a.morphNormals = this.morphNormals;
    return a;
  };
  THREE.SpriteMaterial = function(a) {
    THREE.Material.call(this);
    this.color = new THREE.Color(16777215);
    this.map = new THREE.Texture();
    this.useScreenCoordinates = true;
    this.depthTest = !this.useScreenCoordinates;
    this.sizeAttenuation = !this.useScreenCoordinates;
    this.scaleByViewport = !this.sizeAttenuation;
    this.alignment = THREE.SpriteAlignment.center.clone();
    this.fog = false;
    this.uvOffset = new THREE.Vector2(0, 0);
    this.uvScale = new THREE.Vector2(1, 1);
    this.setValues(a);
    a = a || {};
    void 0 === a.depthTest && (this.depthTest = !this.useScreenCoordinates);
    void 0 === a.sizeAttenuation && (this.sizeAttenuation = !this.useScreenCoordinates);
    void 0 === a.scaleByViewport && (this.scaleByViewport = !this.sizeAttenuation);
  };
  THREE.SpriteMaterial.prototype = Object.create(THREE.Material.prototype);
  THREE.SpriteMaterial.prototype.clone = function() {
    var a = new THREE.SpriteMaterial();
    THREE.Material.prototype.clone.call(this, a);
    a.color.copy(this.color);
    a.map = this.map;
    a.useScreenCoordinates = this.useScreenCoordinates;
    a.sizeAttenuation = this.sizeAttenuation;
    a.scaleByViewport = this.scaleByViewport;
    a.alignment.copy(this.alignment);
    a.uvOffset.copy(this.uvOffset);
    a.uvScale.copy(this.uvScale);
    a.fog = this.fog;
    return a;
  };
  THREE.SpriteAlignment = {};
  THREE.SpriteAlignment.topLeft = new THREE.Vector2(1, -1);
  THREE.SpriteAlignment.topCenter = new THREE.Vector2(0, -1);
  THREE.SpriteAlignment.topRight = new THREE.Vector2(-1, -1);
  THREE.SpriteAlignment.centerLeft = new THREE.Vector2(1, 0);
  THREE.SpriteAlignment.center = new THREE.Vector2(0, 0);
  THREE.SpriteAlignment.centerRight = new THREE.Vector2(-1, 0);
  THREE.SpriteAlignment.bottomLeft = new THREE.Vector2(1, 1);
  THREE.SpriteAlignment.bottomCenter = new THREE.Vector2(0, 1);
  THREE.SpriteAlignment.bottomRight = new THREE.Vector2(-1, 1);
  THREE.Texture = function(a, b, c, d, e, f, g, h, i) {
    THREE.EventDispatcher.call(this);
    this.id = THREE.TextureIdCount++;
    this.name = "";
    this.image = a;
    this.mipmaps = [];
    this.mapping = void 0 !== b ? b : new THREE.UVMapping();
    this.wrapS = void 0 !== c ? c : THREE.ClampToEdgeWrapping;
    this.wrapT = void 0 !== d ? d : THREE.ClampToEdgeWrapping;
    this.magFilter = void 0 !== e ? e : THREE.LinearFilter;
    this.minFilter = void 0 !== f ? f : THREE.LinearMipMapLinearFilter;
    this.anisotropy = void 0 !== i ? i : 1;
    this.format = void 0 !== g ? g : THREE.RGBAFormat;
    this.type = void 0 !== h ? h : THREE.UnsignedByteType;
    this.offset = new THREE.Vector2(0, 0);
    this.repeat = new THREE.Vector2(1, 1);
    this.generateMipmaps = true;
    this.premultiplyAlpha = false;
    this.flipY = true;
    this.unpackAlignment = 4;
    this.needsUpdate = false;
    this.onUpdate = null;
  };
  THREE.Texture.prototype = { constructor: THREE.Texture, clone: function(a) {
    void 0 === a && (a = new THREE.Texture());
    a.image = this.image;
    a.mipmaps = this.mipmaps.slice(0);
    a.mapping = this.mapping;
    a.wrapS = this.wrapS;
    a.wrapT = this.wrapT;
    a.magFilter = this.magFilter;
    a.minFilter = this.minFilter;
    a.anisotropy = this.anisotropy;
    a.format = this.format;
    a.type = this.type;
    a.offset.copy(this.offset);
    a.repeat.copy(this.repeat);
    a.generateMipmaps = this.generateMipmaps;
    a.premultiplyAlpha = this.premultiplyAlpha;
    a.flipY = this.flipY;
    a.unpackAlignment = this.unpackAlignment;
    return a;
  }, dispose: function() {
    this.dispatchEvent({ type: "dispose" });
  } };
  THREE.TextureIdCount = 0;
  THREE.CompressedTexture = function(a, b, c, d, e, f, g, h, i, k, l) {
    THREE.Texture.call(this, null, f, g, h, i, k, d, e, l);
    this.image = { width: b, height: c };
    this.mipmaps = a;
    this.generateMipmaps = false;
  };
  THREE.CompressedTexture.prototype = Object.create(THREE.Texture.prototype);
  THREE.CompressedTexture.prototype.clone = function() {
    var a = new THREE.CompressedTexture();
    THREE.Texture.prototype.clone.call(this, a);
    return a;
  };
  THREE.DataTexture = function(a, b, c, d, e, f, g, h, i, k, l) {
    THREE.Texture.call(this, null, f, g, h, i, k, d, e, l);
    this.image = { data: a, width: b, height: c };
  };
  THREE.DataTexture.prototype = Object.create(THREE.Texture.prototype);
  THREE.DataTexture.prototype.clone = function() {
    var a = new THREE.DataTexture();
    THREE.Texture.prototype.clone.call(this, a);
    return a;
  };
  THREE.Particle = function(a) {
    THREE.Object3D.call(this);
    this.material = a;
  };
  THREE.Particle.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Particle.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Particle(this.material));
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.ParticleSystem = function(a, b) {
    THREE.Object3D.call(this);
    this.geometry = a;
    this.material = void 0 !== b ? b : new THREE.ParticleBasicMaterial({ color: 16777215 * Math.random() });
    this.sortParticles = false;
    this.geometry && null === this.geometry.boundingSphere && this.geometry.computeBoundingSphere();
    this.frustumCulled = false;
  };
  THREE.ParticleSystem.prototype = Object.create(THREE.Object3D.prototype);
  THREE.ParticleSystem.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.ParticleSystem(this.geometry, this.material));
    a.sortParticles = this.sortParticles;
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.Line = function(a, b, c) {
    THREE.Object3D.call(this);
    this.geometry = a;
    this.material = void 0 !== b ? b : new THREE.LineBasicMaterial({ color: 16777215 * Math.random() });
    this.type = void 0 !== c ? c : THREE.LineStrip;
    this.geometry && (this.geometry.boundingSphere || this.geometry.computeBoundingSphere());
  };
  THREE.LineStrip = 0;
  THREE.LinePieces = 1;
  THREE.Line.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Line.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Line(this.geometry, this.material, this.type));
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.Mesh = function(a, b) {
    THREE.Object3D.call(this);
    this.geometry = a;
    this.material = void 0 !== b ? b : new THREE.MeshBasicMaterial({ color: 16777215 * Math.random(), wireframe: true });
    if (this.geometry && (null === this.geometry.boundingSphere && this.geometry.computeBoundingSphere(), this.geometry.morphTargets.length)) {
      this.morphTargetBase = -1;
      this.morphTargetForcedOrder = [];
      this.morphTargetInfluences = [];
      this.morphTargetDictionary = {};
      for (var c = 0; c < this.geometry.morphTargets.length; c++)
        this.morphTargetInfluences.push(0), this.morphTargetDictionary[this.geometry.morphTargets[c].name] = c;
    }
  };
  THREE.Mesh.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Mesh.prototype.getMorphTargetIndexByName = function(a) {
    if (void 0 !== this.morphTargetDictionary[a])
      return this.morphTargetDictionary[a];
    console.log("THREE.Mesh.getMorphTargetIndexByName: morph target " + a + " does not exist. Returning 0.");
    return 0;
  };
  THREE.Mesh.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Mesh(this.geometry, this.material));
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.Bone = function(a) {
    THREE.Object3D.call(this);
    this.skin = a;
    this.skinMatrix = new THREE.Matrix4();
  };
  THREE.Bone.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Bone.prototype.update = function(a, b) {
    this.matrixAutoUpdate && (b |= this.updateMatrix());
    if (b || this.matrixWorldNeedsUpdate)
      a ? this.skinMatrix.multiply(a, this.matrix) : this.skinMatrix.copy(this.matrix), this.matrixWorldNeedsUpdate = false, b = true;
    var c, d = this.children.length;
    for (c = 0; c < d; c++)
      this.children[c].update(this.skinMatrix, b);
  };
  THREE.SkinnedMesh = function(a, b, c) {
    THREE.Mesh.call(this, a, b);
    this.useVertexTexture = void 0 !== c ? c : true;
    this.identityMatrix = new THREE.Matrix4();
    this.bones = [];
    this.boneMatrices = [];
    var d, e, f;
    if (this.geometry && void 0 !== this.geometry.bones) {
      for (a = 0; a < this.geometry.bones.length; a++)
        c = this.geometry.bones[a], d = c.pos, e = c.rotq, f = c.scl, b = this.addBone(), b.name = c.name, b.position.set(d[0], d[1], d[2]), b.quaternion.set(e[0], e[1], e[2], e[3]), b.useQuaternion = true, void 0 !== f ? b.scale.set(f[0], f[1], f[2]) : b.scale.set(1, 1, 1);
      for (a = 0; a < this.bones.length; a++)
        c = this.geometry.bones[a], b = this.bones[a], -1 === c.parent ? this.add(b) : this.bones[c.parent].add(b);
      a = this.bones.length;
      this.useVertexTexture ? (this.boneTextureHeight = this.boneTextureWidth = a = 256 < a ? 64 : 64 < a ? 32 : 16 < a ? 16 : 8, this.boneMatrices = new Float32Array(4 * this.boneTextureWidth * this.boneTextureHeight), this.boneTexture = new THREE.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType), this.boneTexture.minFilter = THREE.NearestFilter, this.boneTexture.magFilter = THREE.NearestFilter, this.boneTexture.generateMipmaps = false, this.boneTexture.flipY = false) : this.boneMatrices = new Float32Array(16 * a);
      this.pose();
    }
  };
  THREE.SkinnedMesh.prototype = Object.create(THREE.Mesh.prototype);
  THREE.SkinnedMesh.prototype.addBone = function(a) {
    void 0 === a && (a = new THREE.Bone(this));
    this.bones.push(a);
    return a;
  };
  THREE.SkinnedMesh.prototype.updateMatrixWorld = function(a) {
    this.matrixAutoUpdate && this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || a)
      this.parent ? this.matrixWorld.multiply(this.parent.matrixWorld, this.matrix) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = false;
    for (var a = 0, b = this.children.length; a < b; a++) {
      var c = this.children[a];
      c instanceof THREE.Bone ? c.update(this.identityMatrix, false) : c.updateMatrixWorld(true);
    }
    if (void 0 == this.boneInverses) {
      this.boneInverses = [];
      a = 0;
      for (b = this.bones.length; a < b; a++)
        c = new THREE.Matrix4(), c.getInverse(this.bones[a].skinMatrix), this.boneInverses.push(c);
    }
    a = 0;
    for (b = this.bones.length; a < b; a++)
      THREE.SkinnedMesh.offsetMatrix.multiply(this.bones[a].skinMatrix, this.boneInverses[a]), THREE.SkinnedMesh.offsetMatrix.flattenToArrayOffset(this.boneMatrices, 16 * a);
    this.useVertexTexture && (this.boneTexture.needsUpdate = true);
  };
  THREE.SkinnedMesh.prototype.pose = function() {
    this.updateMatrixWorld(true);
    for (var a = 0; a < this.geometry.skinIndices.length; a++) {
      var b = this.geometry.skinWeights[a], c = 1 / b.lengthManhattan();
      Infinity !== c ? b.multiplyScalar(c) : b.set(1);
    }
  };
  THREE.SkinnedMesh.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.SkinnedMesh(this.geometry, this.material, this.useVertexTexture));
    THREE.Mesh.prototype.clone.call(this, a);
    return a;
  };
  THREE.SkinnedMesh.offsetMatrix = new THREE.Matrix4();
  THREE.MorphAnimMesh = function(a, b) {
    THREE.Mesh.call(this, a, b);
    this.duration = 1e3;
    this.mirroredLoop = false;
    this.currentKeyframe = this.lastKeyframe = this.time = 0;
    this.direction = 1;
    this.directionBackwards = false;
    this.setFrameRange(0, this.geometry.morphTargets.length - 1);
  };
  THREE.MorphAnimMesh.prototype = Object.create(THREE.Mesh.prototype);
  THREE.MorphAnimMesh.prototype.setFrameRange = function(a, b) {
    this.startKeyframe = a;
    this.endKeyframe = b;
    this.length = this.endKeyframe - this.startKeyframe + 1;
  };
  THREE.MorphAnimMesh.prototype.setDirectionForward = function() {
    this.direction = 1;
    this.directionBackwards = false;
  };
  THREE.MorphAnimMesh.prototype.setDirectionBackward = function() {
    this.direction = -1;
    this.directionBackwards = true;
  };
  THREE.MorphAnimMesh.prototype.parseAnimations = function() {
    var a = this.geometry;
    a.animations || (a.animations = {});
    for (var b, c = a.animations, d = /([a-z]+)(\d+)/, e = 0, f = a.morphTargets.length; e < f; e++) {
      var g = a.morphTargets[e].name.match(d);
      if (g && 1 < g.length) {
        g = g[1];
        c[g] || (c[g] = { start: Infinity, end: -Infinity });
        var h = c[g];
        e < h.start && (h.start = e);
        e > h.end && (h.end = e);
        b || (b = g);
      }
    }
    a.firstAnimation = b;
  };
  THREE.MorphAnimMesh.prototype.setAnimationLabel = function(a, b, c) {
    this.geometry.animations || (this.geometry.animations = {});
    this.geometry.animations[a] = { start: b, end: c };
  };
  THREE.MorphAnimMesh.prototype.playAnimation = function(a, b) {
    var c = this.geometry.animations[a];
    c ? (this.setFrameRange(c.start, c.end), this.duration = 1e3 * ((c.end - c.start) / b), this.time = 0) : console.warn("animation[" + a + "] undefined");
  };
  THREE.MorphAnimMesh.prototype.updateAnimation = function(a) {
    var b = this.duration / this.length;
    this.time += this.direction * a;
    if (this.mirroredLoop) {
      if (this.time > this.duration || 0 > this.time)
        this.direction *= -1, this.time > this.duration && (this.time = this.duration, this.directionBackwards = true), 0 > this.time && (this.time = 0, this.directionBackwards = false);
    } else
      this.time %= this.duration, 0 > this.time && (this.time += this.duration);
    a = this.startKeyframe + THREE.Math.clamp(Math.floor(this.time / b), 0, this.length - 1);
    a !== this.currentKeyframe && (this.morphTargetInfluences[this.lastKeyframe] = 0, this.morphTargetInfluences[this.currentKeyframe] = 1, this.morphTargetInfluences[a] = 0, this.lastKeyframe = this.currentKeyframe, this.currentKeyframe = a);
    b = this.time % b / b;
    this.directionBackwards && (b = 1 - b);
    this.morphTargetInfluences[this.currentKeyframe] = b;
    this.morphTargetInfluences[this.lastKeyframe] = 1 - b;
  };
  THREE.MorphAnimMesh.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.MorphAnimMesh(this.geometry, this.material));
    a.duration = this.duration;
    a.mirroredLoop = this.mirroredLoop;
    a.time = this.time;
    a.lastKeyframe = this.lastKeyframe;
    a.currentKeyframe = this.currentKeyframe;
    a.direction = this.direction;
    a.directionBackwards = this.directionBackwards;
    THREE.Mesh.prototype.clone.call(this, a);
    return a;
  };
  THREE.Ribbon = function(a, b) {
    THREE.Object3D.call(this);
    this.geometry = a;
    this.material = b;
  };
  THREE.Ribbon.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Ribbon.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Ribbon(this.geometry, this.material));
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.LOD = function() {
    THREE.Object3D.call(this);
    this.LODs = [];
  };
  THREE.LOD.prototype = Object.create(THREE.Object3D.prototype);
  THREE.LOD.prototype.addLevel = function(a, b) {
    void 0 === b && (b = 0);
    for (var b = Math.abs(b), c = 0; c < this.LODs.length && !(b < this.LODs[c].visibleAtDistance); c++)
      ;
    this.LODs.splice(c, 0, { visibleAtDistance: b, object3D: a });
    this.add(a);
  };
  THREE.LOD.prototype.update = function(a) {
    if (1 < this.LODs.length) {
      a.matrixWorldInverse.getInverse(a.matrixWorld);
      a = a.matrixWorldInverse;
      a = -(a.elements[2] * this.matrixWorld.elements[12] + a.elements[6] * this.matrixWorld.elements[13] + a.elements[10] * this.matrixWorld.elements[14] + a.elements[14]);
      this.LODs[0].object3D.visible = true;
      for (var b = 1; b < this.LODs.length; b++)
        if (a >= this.LODs[b].visibleAtDistance)
          this.LODs[b - 1].object3D.visible = false, this.LODs[b].object3D.visible = true;
        else
          break;
      for (; b < this.LODs.length; b++)
        this.LODs[b].object3D.visible = false;
    }
  };
  THREE.LOD.prototype.clone = function() {
  };
  THREE.Sprite = function(a) {
    THREE.Object3D.call(this);
    this.material = void 0 !== a ? a : new THREE.SpriteMaterial();
    this.rotation3d = this.rotation;
    this.rotation = 0;
  };
  THREE.Sprite.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Sprite.prototype.updateMatrix = function() {
    this.matrix.setPosition(this.position);
    this.rotation3d.set(0, 0, this.rotation);
    this.matrix.setRotationFromEuler(this.rotation3d);
    (1 !== this.scale.x || 1 !== this.scale.y) && this.matrix.scale(this.scale);
    this.matrixWorldNeedsUpdate = true;
  };
  THREE.Sprite.prototype.clone = function(a) {
    void 0 === a && (a = new THREE.Sprite(this.material));
    THREE.Object3D.prototype.clone.call(this, a);
    return a;
  };
  THREE.Scene = function() {
    THREE.Object3D.call(this);
    this.overrideMaterial = this.fog = null;
    this.matrixAutoUpdate = false;
    this.__objects = [];
    this.__lights = [];
    this.__objectsAdded = [];
    this.__objectsRemoved = [];
  };
  THREE.Scene.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Scene.prototype.__addObject = function(a) {
    if (a instanceof THREE.Light)
      -1 === this.__lights.indexOf(a) && this.__lights.push(a), a.target && void 0 === a.target.parent && this.add(a.target);
    else if (!(a instanceof THREE.Camera || a instanceof THREE.Bone) && -1 === this.__objects.indexOf(a)) {
      this.__objects.push(a);
      this.__objectsAdded.push(a);
      var b = this.__objectsRemoved.indexOf(a);
      -1 !== b && this.__objectsRemoved.splice(b, 1);
    }
    for (b = 0; b < a.children.length; b++)
      this.__addObject(a.children[b]);
  };
  THREE.Scene.prototype.__removeObject = function(a) {
    if (a instanceof THREE.Light) {
      var b = this.__lights.indexOf(a);
      -1 !== b && this.__lights.splice(b, 1);
    } else
      a instanceof THREE.Camera || (b = this.__objects.indexOf(a), -1 !== b && (this.__objects.splice(b, 1), this.__objectsRemoved.push(a), b = this.__objectsAdded.indexOf(a), -1 !== b && this.__objectsAdded.splice(b, 1)));
    for (b = 0; b < a.children.length; b++)
      this.__removeObject(a.children[b]);
  };
  THREE.Fog = function(a, b, c) {
    this.name = "";
    this.color = new THREE.Color(a);
    this.near = void 0 !== b ? b : 1;
    this.far = void 0 !== c ? c : 1e3;
  };
  THREE.Fog.prototype.clone = function() {
    return new THREE.Fog(this.color.getHex(), this.near, this.far);
  };
  THREE.FogExp2 = function(a, b) {
    this.name = "";
    this.color = new THREE.Color(a);
    this.density = void 0 !== b ? b : 25e-5;
  };
  THREE.FogExp2.prototype.clone = function() {
    return new THREE.FogExp2(this.color.getHex(), this.density);
  };
  THREE.CanvasRenderer = function(a) {
    function b(a2) {
      w !== a2 && (w = n.globalAlpha = a2);
    }
    function c(a2) {
      x !== a2 && (a2 === THREE.NormalBlending ? n.globalCompositeOperation = "source-over" : a2 === THREE.AdditiveBlending ? n.globalCompositeOperation = "lighter" : a2 === THREE.SubtractiveBlending && (n.globalCompositeOperation = "darker"), x = a2);
    }
    function d(a2) {
      t !== a2 && (t = n.strokeStyle = a2);
    }
    function e(a2) {
      K !== a2 && (K = n.fillStyle = a2);
    }
    console.log("THREE.CanvasRenderer", THREE.REVISION);
    var a = a || {}, f = this, g, h, i, k = new THREE.Projector(), l = void 0 !== a.canvas ? a.canvas : document.createElement("canvas"), m, p, s, q, n = l.getContext("2d"), r = new THREE.Color(0), v = 0, w = 1, x = 0, t = null, K = null, D = null, B = null, z = null, E, G, I, Y, C = new THREE.RenderableVertex(), P = new THREE.RenderableVertex(), A, J, M, T, N, fa, oa, L, Z, eb, Ea, jb, H = new THREE.Color(), ja = new THREE.Color(), ha = new THREE.Color(), ia = new THREE.Color(), ka = new THREE.Color(), W = new THREE.Color(), ba = new THREE.Color(), qa = {}, Na = {}, ya, ma, sa, Pa, nb, la, fb, ob, pb, zb, gb = new THREE.Box2(), Ma = new THREE.Box2(), va = new THREE.Box2(), Bb = false, Sa = new THREE.Color(), Ya = new THREE.Color(), Za = new THREE.Color(), qb = new THREE.Vector3(), Cb, $a, Db, rb, fc, Nb, ta = 16;
    Cb = document.createElement("canvas");
    Cb.width = Cb.height = 2;
    $a = Cb.getContext("2d");
    $a.fillStyle = "rgba(0,0,0,1)";
    $a.fillRect(0, 0, 2, 2);
    Db = $a.getImageData(0, 0, 2, 2);
    rb = Db.data;
    fc = document.createElement("canvas");
    fc.width = fc.height = ta;
    Nb = fc.getContext("2d");
    Nb.translate(-ta / 2, -ta / 2);
    Nb.scale(ta, ta);
    ta--;
    this.domElement = l;
    this.devicePixelRatio = void 0 !== a.devicePixelRatio ? a.devicePixelRatio : void 0 !== window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.sortElements = this.sortObjects = this.autoClear = true;
    this.info = { render: { vertices: 0, faces: 0 } };
    this.setSize = function(a2, b2) {
      m = a2 * this.devicePixelRatio;
      p = b2 * this.devicePixelRatio;
      s = Math.floor(m / 2);
      q = Math.floor(p / 2);
      l.width = m;
      l.height = p;
      l.style.width = a2 + "px";
      l.style.height = b2 + "px";
      gb.min.set(-s, -q);
      gb.max.set(s, q);
      Ma.min.set(-s, -q);
      Ma.max.set(s, q);
      w = 1;
      x = 0;
      z = B = D = K = t = null;
    };
    this.setClearColor = function(a2, b2) {
      r.copy(a2);
      v = void 0 !== b2 ? b2 : 1;
      Ma.min.set(-s, -q);
      Ma.max.set(s, q);
    };
    this.setClearColorHex = function(a2, b2) {
      r.setHex(a2);
      v = void 0 !== b2 ? b2 : 1;
      Ma.min.set(-s, -q);
      Ma.max.set(s, q);
    };
    this.getMaxAnisotropy = function() {
      return 0;
    };
    this.clear = function() {
      n.setTransform(1, 0, 0, -1, s, q);
      false === Ma.empty() && (Ma.intersect(gb), Ma.expandByScalar(2), 1 > v && n.clearRect(Ma.min.x | 0, Ma.min.y | 0, Ma.max.x - Ma.min.x | 0, Ma.max.y - Ma.min.y | 0), 0 < v && (c(THREE.NormalBlending), b(1), e("rgba(" + Math.floor(255 * r.r) + "," + Math.floor(255 * r.g) + "," + Math.floor(255 * r.b) + "," + v + ")"), n.fillRect(Ma.min.x | 0, Ma.min.y | 0, Ma.max.x - Ma.min.x | 0, Ma.max.y - Ma.min.y | 0)), Ma.makeEmpty());
    };
    this.render = function(a2, l2) {
      function j(a3, b2, c2) {
        for (var d2 = 0, e2 = i.length; d2 < e2; d2++) {
          var f2 = i[d2], g2 = f2.color;
          if (f2 instanceof THREE.DirectionalLight) {
            var j2 = f2.matrixWorld.getPosition().normalize(), h2 = b2.dot(j2);
            0 >= h2 || (h2 *= f2.intensity, c2.r += g2.r * h2, c2.g += g2.g * h2, c2.b += g2.b * h2);
          } else
            f2 instanceof THREE.PointLight && (j2 = f2.matrixWorld.getPosition(), h2 = b2.dot(qb.sub(j2, a3).normalize()), 0 >= h2 || (h2 *= 0 == f2.distance ? 1 : 1 - Math.min(a3.distanceTo(j2) / f2.distance, 1), 0 != h2 && (h2 *= f2.intensity, c2.r += g2.r * h2, c2.g += g2.g * h2, c2.b += g2.b * h2)));
        }
      }
      function p2(a3, d2, e2, g2, h2, i2, k2, n2) {
        f.info.render.vertices += 3;
        f.info.render.faces++;
        b(n2.opacity);
        c(n2.blending);
        A = a3.positionScreen.x;
        J = a3.positionScreen.y;
        M = d2.positionScreen.x;
        T = d2.positionScreen.y;
        N = e2.positionScreen.x;
        fa = e2.positionScreen.y;
        m2(A, J, M, T, N, fa);
        (n2 instanceof THREE.MeshLambertMaterial || n2 instanceof THREE.MeshPhongMaterial) && null === n2.map && null === n2.map ? (W.copy(n2.color), ba.copy(n2.emissive), n2.vertexColors === THREE.FaceColors && (W.r *= k2.color.r, W.g *= k2.color.g, W.b *= k2.color.b), true === Bb ? false === n2.wireframe && n2.shading == THREE.SmoothShading && 3 == k2.vertexNormalsLength ? (ja.r = ha.r = ia.r = Sa.r, ja.g = ha.g = ia.g = Sa.g, ja.b = ha.b = ia.b = Sa.b, j(k2.v1.positionWorld, k2.vertexNormalsModel[0], ja), j(k2.v2.positionWorld, k2.vertexNormalsModel[1], ha), j(k2.v3.positionWorld, k2.vertexNormalsModel[2], ia), ja.r = ja.r * W.r + ba.r, ja.g = ja.g * W.g + ba.g, ja.b = ja.b * W.b + ba.b, ha.r = ha.r * W.r + ba.r, ha.g = ha.g * W.g + ba.g, ha.b = ha.b * W.b + ba.b, ia.r = ia.r * W.r + ba.r, ia.g = ia.g * W.g + ba.g, ia.b = ia.b * W.b + ba.b, ka.r = 0.5 * (ha.r + ia.r), ka.g = 0.5 * (ha.g + ia.g), ka.b = 0.5 * (ha.b + ia.b), sa = K2(ja, ha, ia, ka), x2(A, J, M, T, N, fa, 0, 0, 1, 0, 0, 1, sa)) : (H.r = Sa.r, H.g = Sa.g, H.b = Sa.b, j(k2.centroidModel, k2.normalModel, H), H.r = H.r * W.r + ba.r, H.g = H.g * W.g + ba.g, H.b = H.b * W.b + ba.b, true === n2.wireframe ? t2(H, n2.wireframeLinewidth, n2.wireframeLinecap, n2.wireframeLinejoin) : v2(H)) : true === n2.wireframe ? t2(n2.color, n2.wireframeLinewidth, n2.wireframeLinecap, n2.wireframeLinejoin) : v2(n2.color)) : n2 instanceof THREE.MeshBasicMaterial || n2 instanceof THREE.MeshLambertMaterial || n2 instanceof THREE.MeshPhongMaterial ? null !== n2.map ? n2.map.mapping instanceof THREE.UVMapping && (Pa = k2.uvs[0], w2(
          A,
          J,
          M,
          T,
          N,
          fa,
          Pa[g2].x,
          Pa[g2].y,
          Pa[h2].x,
          Pa[h2].y,
          Pa[i2].x,
          Pa[i2].y,
          n2.map
        )) : null !== n2.envMap ? n2.envMap.mapping instanceof THREE.SphericalReflectionMapping && (qb.copy(k2.vertexNormalsModelView[g2]), nb = 0.5 * qb.x + 0.5, la = 0.5 * qb.y + 0.5, qb.copy(k2.vertexNormalsModelView[h2]), fb = 0.5 * qb.x + 0.5, ob = 0.5 * qb.y + 0.5, qb.copy(k2.vertexNormalsModelView[i2]), pb = 0.5 * qb.x + 0.5, zb = 0.5 * qb.y + 0.5, w2(A, J, M, T, N, fa, nb, la, fb, ob, pb, zb, n2.envMap)) : (H.copy(n2.color), n2.vertexColors === THREE.FaceColors && (H.r *= k2.color.r, H.g *= k2.color.g, H.b *= k2.color.b), true === n2.wireframe ? t2(
          H,
          n2.wireframeLinewidth,
          n2.wireframeLinecap,
          n2.wireframeLinejoin
        ) : v2(H)) : n2 instanceof THREE.MeshDepthMaterial ? (ya = l2.near, ma = l2.far, ja.r = ja.g = ja.b = 1 - ta2(a3.positionScreen.z, ya, ma), ha.r = ha.g = ha.b = 1 - ta2(d2.positionScreen.z, ya, ma), ia.r = ia.g = ia.b = 1 - ta2(e2.positionScreen.z, ya, ma), ka.r = 0.5 * (ha.r + ia.r), ka.g = 0.5 * (ha.g + ia.g), ka.b = 0.5 * (ha.b + ia.b), sa = K2(ja, ha, ia, ka), x2(A, J, M, T, N, fa, 0, 0, 1, 0, 0, 1, sa)) : n2 instanceof THREE.MeshNormalMaterial && (H.r = 0.5 * k2.normalModelView.x + 0.5, H.g = 0.5 * k2.normalModelView.y + 0.5, H.b = 0.5 * k2.normalModelView.z + 0.5, true === n2.wireframe ? t2(H, n2.wireframeLinewidth, n2.wireframeLinecap, n2.wireframeLinejoin) : v2(H));
      }
      function m2(a3, b2, c2, d2, e2, f2) {
        n.beginPath();
        n.moveTo(a3, b2);
        n.lineTo(c2, d2);
        n.lineTo(e2, f2);
        n.closePath();
      }
      function r2(a3, b2, c2, d2, e2, f2, g2, j2) {
        n.beginPath();
        n.moveTo(a3, b2);
        n.lineTo(c2, d2);
        n.lineTo(e2, f2);
        n.lineTo(g2, j2);
        n.closePath();
      }
      function t2(a3, b2, c2, e2) {
        D !== b2 && (D = n.lineWidth = b2);
        B !== c2 && (B = n.lineCap = c2);
        z !== e2 && (z = n.lineJoin = e2);
        d(a3.getStyle());
        n.stroke();
        va.expandByScalar(2 * b2);
      }
      function v2(a3) {
        e(a3.getStyle());
        n.fill();
      }
      function w2(a3, b2, c2, d2, f2, g2, j2, h2, i2, k2, l3, p3, m3) {
        if (!(m3 instanceof THREE.DataTexture || void 0 === m3.image || 0 == m3.image.width)) {
          if (true === m3.needsUpdate) {
            var q2 = m3.wrapS == THREE.RepeatWrapping, s2 = m3.wrapT == THREE.RepeatWrapping;
            qa[m3.id] = n.createPattern(m3.image, true === q2 && true === s2 ? "repeat" : true === q2 && false === s2 ? "repeat-x" : false === q2 && true === s2 ? "repeat-y" : "no-repeat");
            m3.needsUpdate = false;
          }
          void 0 === qa[m3.id] ? e("rgba(0,0,0,1)") : e(qa[m3.id]);
          var q2 = m3.offset.x / m3.repeat.x, s2 = m3.offset.y / m3.repeat.y, r3 = m3.image.width * m3.repeat.x, t3 = m3.image.height * m3.repeat.y, j2 = (j2 + q2) * r3, h2 = (1 - h2 + s2) * t3, c2 = c2 - a3, d2 = d2 - b2, f2 = f2 - a3, g2 = g2 - b2, i2 = (i2 + q2) * r3 - j2, k2 = (1 - k2 + s2) * t3 - h2, l3 = (l3 + q2) * r3 - j2, p3 = (1 - p3 + s2) * t3 - h2, q2 = i2 * p3 - l3 * k2;
          0 === q2 ? (void 0 === Na[m3.id] && (b2 = document.createElement("canvas"), b2.width = m3.image.width, b2.height = m3.image.height, b2 = b2.getContext("2d"), b2.drawImage(m3.image, 0, 0), Na[m3.id] = b2.getImageData(0, 0, m3.image.width, m3.image.height).data), b2 = Na[m3.id], j2 = 4 * (Math.floor(j2) + Math.floor(h2) * m3.image.width), H.setRGB(b2[j2] / 255, b2[j2 + 1] / 255, b2[j2 + 2] / 255), v2(H)) : (q2 = 1 / q2, m3 = (p3 * c2 - k2 * f2) * q2, k2 = (p3 * d2 - k2 * g2) * q2, c2 = (i2 * f2 - l3 * c2) * q2, d2 = (i2 * g2 - l3 * d2) * q2, a3 = a3 - m3 * j2 - c2 * h2, j2 = b2 - k2 * j2 - d2 * h2, n.save(), n.transform(m3, k2, c2, d2, a3, j2), n.fill(), n.restore());
        }
      }
      function x2(a3, b2, c2, d2, e2, f2, g2, j2, h2, i2, k2, l3, m3) {
        var p3, q2;
        p3 = m3.width - 1;
        q2 = m3.height - 1;
        g2 *= p3;
        j2 *= q2;
        c2 -= a3;
        d2 -= b2;
        e2 -= a3;
        f2 -= b2;
        h2 = h2 * p3 - g2;
        i2 = i2 * q2 - j2;
        k2 = k2 * p3 - g2;
        l3 = l3 * q2 - j2;
        q2 = 1 / (h2 * l3 - k2 * i2);
        p3 = (l3 * c2 - i2 * e2) * q2;
        i2 = (l3 * d2 - i2 * f2) * q2;
        c2 = (h2 * e2 - k2 * c2) * q2;
        d2 = (h2 * f2 - k2 * d2) * q2;
        a3 = a3 - p3 * g2 - c2 * j2;
        b2 = b2 - i2 * g2 - d2 * j2;
        n.save();
        n.transform(p3, i2, c2, d2, a3, b2);
        n.clip();
        n.drawImage(m3, 0, 0);
        n.restore();
      }
      function K2(a3, b2, c2, d2) {
        rb[0] = 255 * a3.r | 0;
        rb[1] = 255 * a3.g | 0;
        rb[2] = 255 * a3.b | 0;
        rb[4] = 255 * b2.r | 0;
        rb[5] = 255 * b2.g | 0;
        rb[6] = 255 * b2.b | 0;
        rb[8] = 255 * c2.r | 0;
        rb[9] = 255 * c2.g | 0;
        rb[10] = 255 * c2.b | 0;
        rb[12] = 255 * d2.r | 0;
        rb[13] = 255 * d2.g | 0;
        rb[14] = 255 * d2.b | 0;
        $a.putImageData(Db, 0, 0);
        Nb.drawImage(Cb, 0, 0);
        return fc;
      }
      function ta2(a3, b2, c2) {
        a3 = (a3 - b2) / (c2 - b2);
        return a3 * a3 * (3 - 2 * a3);
      }
      function ab(a3, b2) {
        var c2 = b2.x - a3.x, d2 = b2.y - a3.y, e2 = c2 * c2 + d2 * d2;
        0 !== e2 && (e2 = 1 / Math.sqrt(e2), c2 *= e2, d2 *= e2, b2.x += c2, b2.y += d2, a3.x -= c2, a3.y -= d2);
      }
      if (false === l2 instanceof THREE.Camera)
        console.error("THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.");
      else {
        true === this.autoClear && this.clear();
        n.setTransform(1, 0, 0, -1, s, q);
        f.info.render.vertices = 0;
        f.info.render.faces = 0;
        g = k.projectScene(
          a2,
          l2,
          this.sortObjects,
          this.sortElements
        );
        h = g.elements;
        i = g.lights;
        Bb = 0 < i.length;
        if (true === Bb) {
          Sa.setRGB(0, 0, 0);
          Ya.setRGB(0, 0, 0);
          Za.setRGB(0, 0, 0);
          for (var tb = 0, Pb = i.length; tb < Pb; tb++) {
            var V = i[tb], $ = V.color;
            V instanceof THREE.AmbientLight ? (Sa.r += $.r, Sa.g += $.g, Sa.b += $.b) : V instanceof THREE.DirectionalLight ? (Ya.r += $.r, Ya.g += $.g, Ya.b += $.b) : V instanceof THREE.PointLight && (Za.r += $.r, Za.g += $.g, Za.b += $.b);
          }
        }
        tb = 0;
        for (Pb = h.length; tb < Pb; tb++) {
          var ga = h[tb], V = ga.material;
          if (!(void 0 === V || false === V.visible)) {
            va.makeEmpty();
            if (ga instanceof THREE.RenderableParticle) {
              E = ga;
              E.x *= s;
              E.y *= q;
              var $ = E, Ha = ga;
              b(V.opacity);
              c(V.blending);
              var Va = void 0, Qa = void 0, kb = void 0, Ua = void 0, ub = ga = void 0, Kb = void 0;
              V instanceof THREE.ParticleBasicMaterial ? null === V.map ? (kb = Ha.object.scale.x, Ua = Ha.object.scale.y, kb *= Ha.scale.x * s, Ua *= Ha.scale.y * q, va.min.set($.x - kb, $.y - Ua), va.max.set($.x + kb, $.y + Ua), false !== gb.isIntersectionBox(va) && (e(V.color.getStyle()), n.save(), n.translate($.x, $.y), n.rotate(-Ha.rotation), n.scale(kb, Ua), n.fillRect(-1, -1, 2, 2), n.restore())) : (ga = V.map.image, ub = ga.width >> 1, Kb = ga.height >> 1, kb = Ha.scale.x * s, Ua = Ha.scale.y * q, Va = kb * ub, Qa = Ua * Kb, va.min.set($.x - Va, $.y - Qa), va.max.set($.x + Va, $.y + Qa), false !== gb.isIntersectionBox(va) && (n.save(), n.translate($.x, $.y), n.rotate(-Ha.rotation), n.scale(kb, -Ua), n.translate(-ub, -Kb), n.drawImage(ga, 0, 0), n.restore())) : V instanceof THREE.ParticleCanvasMaterial && (Va = Ha.scale.x * s, Qa = Ha.scale.y * q, va.min.set($.x - Va, $.y - Qa), va.max.set($.x + Va, $.y + Qa), false !== gb.isIntersectionBox(va) && (d(V.color.getStyle()), e(V.color.getStyle()), n.save(), n.translate($.x, $.y), n.rotate(-Ha.rotation), n.scale(Va, Qa), V.program(n), n.restore()));
            } else
              ga instanceof THREE.RenderableLine ? (E = ga.v1, G = ga.v2, E.positionScreen.x *= s, E.positionScreen.y *= q, G.positionScreen.x *= s, G.positionScreen.y *= q, va.setFromPoints([E.positionScreen, G.positionScreen]), true === gb.isIntersectionBox(va) && ($ = E, Ha = G, b(V.opacity), c(V.blending), n.beginPath(), n.moveTo($.positionScreen.x, $.positionScreen.y), n.lineTo(Ha.positionScreen.x, Ha.positionScreen.y), V instanceof THREE.LineBasicMaterial && ($ = V.linewidth, D !== $ && (D = n.lineWidth = $), $ = V.linecap, B !== $ && (B = n.lineCap = $), $ = V.linejoin, z !== $ && (z = n.lineJoin = $), d(V.color.getStyle()), n.stroke(), va.expandByScalar(2 * V.linewidth)))) : ga instanceof THREE.RenderableFace3 ? (E = ga.v1, G = ga.v2, I = ga.v3, E.positionScreen.x *= s, E.positionScreen.y *= q, G.positionScreen.x *= s, G.positionScreen.y *= q, I.positionScreen.x *= s, I.positionScreen.y *= q, true === V.overdraw && (ab(E.positionScreen, G.positionScreen), ab(G.positionScreen, I.positionScreen), ab(I.positionScreen, E.positionScreen)), va.setFromPoints([E.positionScreen, G.positionScreen, I.positionScreen]), true === gb.isIntersectionBox(va) && p2(E, G, I, 0, 1, 2, ga, V, a2)) : ga instanceof THREE.RenderableFace4 && (E = ga.v1, G = ga.v2, I = ga.v3, Y = ga.v4, E.positionScreen.x *= s, E.positionScreen.y *= q, G.positionScreen.x *= s, G.positionScreen.y *= q, I.positionScreen.x *= s, I.positionScreen.y *= q, Y.positionScreen.x *= s, Y.positionScreen.y *= q, C.positionScreen.copy(G.positionScreen), P.positionScreen.copy(Y.positionScreen), true === V.overdraw && (ab(E.positionScreen, G.positionScreen), ab(G.positionScreen, Y.positionScreen), ab(Y.positionScreen, E.positionScreen), ab(I.positionScreen, C.positionScreen), ab(I.positionScreen, P.positionScreen)), va.setFromPoints([E.positionScreen, G.positionScreen, I.positionScreen, Y.positionScreen]), true === gb.isIntersectionBox(va) && ($ = E, Ha = G, Va = I, Qa = Y, kb = C, Ua = P, ub = a2, f.info.render.vertices += 4, f.info.render.faces++, b(V.opacity), c(V.blending), void 0 !== V.map && null !== V.map || void 0 !== V.envMap && null !== V.envMap ? (p2($, Ha, Qa, 0, 1, 3, ga, V, ub), p2(kb, Va, Ua, 1, 2, 3, ga, V, ub)) : (A = $.positionScreen.x, J = $.positionScreen.y, M = Ha.positionScreen.x, T = Ha.positionScreen.y, N = Va.positionScreen.x, fa = Va.positionScreen.y, oa = Qa.positionScreen.x, L = Qa.positionScreen.y, Z = kb.positionScreen.x, eb = kb.positionScreen.y, Ea = Ua.positionScreen.x, jb = Ua.positionScreen.y, V instanceof THREE.MeshLambertMaterial || V instanceof THREE.MeshPhongMaterial ? (W.copy(V.color), ba.copy(V.emissive), V.vertexColors === THREE.FaceColors && (W.r *= ga.color.r, W.g *= ga.color.g, W.b *= ga.color.b), true === Bb ? false === V.wireframe && V.shading == THREE.SmoothShading && 4 == ga.vertexNormalsLength ? (ja.r = ha.r = ia.r = ka.r = Sa.r, ja.g = ha.g = ia.g = ka.g = Sa.g, ja.b = ha.b = ia.b = ka.b = Sa.b, j(ga.v1.positionWorld, ga.vertexNormalsModel[0], ja), j(ga.v2.positionWorld, ga.vertexNormalsModel[1], ha), j(ga.v4.positionWorld, ga.vertexNormalsModel[3], ia), j(ga.v3.positionWorld, ga.vertexNormalsModel[2], ka), ja.r = ja.r * W.r + ba.r, ja.g = ja.g * W.g + ba.g, ja.b = ja.b * W.b + ba.b, ha.r = ha.r * W.r + ba.r, ha.g = ha.g * W.g + ba.g, ha.b = ha.b * W.b + ba.b, ia.r = ia.r * W.r + ba.r, ia.g = ia.g * W.g + ba.g, ia.b = ia.b * W.b + ba.b, ka.r = ka.r * W.r + ba.r, ka.g = ka.g * W.g + ba.g, ka.b = ka.b * W.b + ba.b, sa = K2(ja, ha, ia, ka), m2(A, J, M, T, oa, L), x2(A, J, M, T, oa, L, 0, 0, 1, 0, 0, 1, sa), m2(Z, eb, N, fa, Ea, jb), x2(Z, eb, N, fa, Ea, jb, 1, 0, 1, 1, 0, 1, sa)) : (H.r = Sa.r, H.g = Sa.g, H.b = Sa.b, j(ga.centroidModel, ga.normalModel, H), H.r = H.r * W.r + ba.r, H.g = H.g * W.g + ba.g, H.b = H.b * W.b + ba.b, r2(A, J, M, T, N, fa, oa, L), true === V.wireframe ? t2(H, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : v2(H)) : (H.r = W.r + ba.r, H.g = W.g + ba.g, H.b = W.b + ba.b, r2(A, J, M, T, N, fa, oa, L), true === V.wireframe ? t2(
                H,
                V.wireframeLinewidth,
                V.wireframeLinecap,
                V.wireframeLinejoin
              ) : v2(H))) : V instanceof THREE.MeshBasicMaterial ? (H.copy(V.color), V.vertexColors === THREE.FaceColors && (H.r *= ga.color.r, H.g *= ga.color.g, H.b *= ga.color.b), r2(A, J, M, T, N, fa, oa, L), true === V.wireframe ? t2(H, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : v2(H)) : V instanceof THREE.MeshNormalMaterial ? (H.r = 0.5 * ga.normalModelView.x + 0.5, H.g = 0.5 * ga.normalModelView.y + 0.5, H.b = 0.5 * ga.normalModelView.z + 0.5, r2(A, J, M, T, N, fa, oa, L), true === V.wireframe ? t2(H, V.wireframeLinewidth, V.wireframeLinecap, V.wireframeLinejoin) : v2(H)) : V instanceof THREE.MeshDepthMaterial && (ya = l2.near, ma = l2.far, ja.r = ja.g = ja.b = 1 - ta2($.positionScreen.z, ya, ma), ha.r = ha.g = ha.b = 1 - ta2(Ha.positionScreen.z, ya, ma), ia.r = ia.g = ia.b = 1 - ta2(Qa.positionScreen.z, ya, ma), ka.r = ka.g = ka.b = 1 - ta2(Va.positionScreen.z, ya, ma), sa = K2(ja, ha, ia, ka), m2(A, J, M, T, oa, L), x2(A, J, M, T, oa, L, 0, 0, 1, 0, 0, 1, sa), m2(Z, eb, N, fa, Ea, jb), x2(Z, eb, N, fa, Ea, jb, 1, 0, 1, 1, 0, 1, sa)))));
            Ma.union(va);
          }
        }
        n.setTransform(1, 0, 0, 1, 0, 0);
      }
    };
  };
  THREE.ShaderChunk = {
    fog_pars_fragment: "#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",
    fog_fragment: "#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
    envmap_pars_fragment: "#ifdef USE_ENVMAP\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nuniform bool useRefract;\nuniform float refractionRatio;\n#else\nvarying vec3 vReflect;\n#endif\n#endif",
    envmap_fragment: "#ifdef USE_ENVMAP\nvec3 reflectVec;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nreflectVec = refract( cameraToVertex, normal, refractionRatio );\n} else { \nreflectVec = reflect( cameraToVertex, normal );\n}\n#else\nreflectVec = vReflect;\n#endif\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n} else if ( combine == 2 ) {\ngl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n} else {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n}\n#endif",
    envmap_pars_vertex: "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",
    worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n#ifdef USE_SKINNING\nvec4 worldPosition = modelMatrix * skinned;\n#endif\n#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\nvec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n#endif\n#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\nvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n#endif\n#endif",
    envmap_vertex: "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\nworldNormal = normalize( worldNormal );\nvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\nif ( useRefract ) {\nvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n} else {\nvReflect = reflect( cameraToVertex, worldNormal );\n}\n#endif",
    map_particle_pars_fragment: "#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
    map_particle_fragment: "#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n#endif",
    map_pars_vertex: "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",
    map_pars_fragment: "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\nuniform sampler2D map;\n#endif",
    map_vertex: "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",
    map_fragment: "#ifdef USE_MAP\nvec4 texelColor = texture2D( map, vUv );\n#ifdef GAMMA_INPUT\ntexelColor.xyz *= texelColor.xyz;\n#endif\ngl_FragColor = gl_FragColor * texelColor;\n#endif",
    lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",
    lightmap_pars_vertex: "#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",
    lightmap_fragment: "#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",
    lightmap_vertex: "#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",
    bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\nuniform sampler2D bumpMap;\nuniform float bumpScale;\nvec2 dHdxy_fwd() {\nvec2 dSTdx = dFdx( vUv );\nvec2 dSTdy = dFdy( vUv );\nfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\nfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\nfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\nreturn vec2( dBx, dBy );\n}\nvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\nvec3 vSigmaX = dFdx( surf_pos );\nvec3 vSigmaY = dFdy( surf_pos );\nvec3 vN = surf_norm;\nvec3 R1 = cross( vSigmaY, vN );\nvec3 R2 = cross( vN, vSigmaX );\nfloat fDet = dot( vSigmaX, R1 );\nvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\nreturn normalize( abs( fDet ) * surf_norm - vGrad );\n}\n#endif",
    normalmap_pars_fragment: "#ifdef USE_NORMALMAP\nuniform sampler2D normalMap;\nuniform vec2 normalScale;\nvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\nvec3 q0 = dFdx( eye_pos.xyz );\nvec3 q1 = dFdy( eye_pos.xyz );\nvec2 st0 = dFdx( vUv.st );\nvec2 st1 = dFdy( vUv.st );\nvec3 S = normalize(  q0 * st1.t - q1 * st0.t );\nvec3 T = normalize( -q0 * st1.s + q1 * st0.s );\nvec3 N = normalize( surf_norm );\nvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\nmapN.xy = normalScale * mapN.xy;\nmat3 tsn = mat3( S, T, N );\nreturn normalize( tsn * mapN );\n}\n#endif",
    specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\nuniform sampler2D specularMap;\n#endif",
    specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );\nspecularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif",
    lights_lambert_pars_vertex: "uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",
    lights_lambert_vertex: "vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nfloat hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\nvLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n#ifdef DOUBLE_SIDED\nvLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n#endif\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
    lights_phong_pars_vertex: "#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif",
    lights_phong_vertex: "#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvWorldPosition = worldPosition.xyz;\n#endif",
    lights_phong_pars_fragment: "uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP )\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
    lights_phong_fragment: "vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -viewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nvec3 hemiDiffuse  = vec3( 0.0 );\nvec3 hemiSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\nhemiDiffuse += diffuse * hemiColor;\nvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\nfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\nfloat hemiSpecularWeightSky = specularStrength * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );\nvec3 lVectorGround = -lVector;\nvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\nfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\nfloat hemiSpecularWeightGround = specularStrength * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );\nvec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );\nhemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\nhemiSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_HEMI_LIGHTS > 0\ntotalDiffuse += hemiDiffuse;\ntotalSpecular += hemiSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
    color_pars_fragment: "#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",
    color_fragment: "#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",
    color_pars_vertex: "#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",
    color_vertex: "#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",
    skinning_pars_vertex: "#ifdef USE_SKINNING\n#ifdef BONE_TEXTURE\nuniform sampler2D boneTexture;\nmat4 getBoneMatrix( const in float i ) {\nfloat j = i * 4.0;\nfloat x = mod( j, N_BONE_PIXEL_X );\nfloat y = floor( j / N_BONE_PIXEL_X );\nconst float dx = 1.0 / N_BONE_PIXEL_X;\nconst float dy = 1.0 / N_BONE_PIXEL_Y;\ny = dy * ( y + 0.5 );\nvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\nvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\nvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\nvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\nmat4 bone = mat4( v1, v2, v3, v4 );\nreturn bone;\n}\n#else\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\nmat4 getBoneMatrix( const in float i ) {\nmat4 bone = boneGlobalMatrices[ int(i) ];\nreturn bone;\n}\n#endif\n#endif",
    skinbase_vertex: "#ifdef USE_SKINNING\nmat4 boneMatX = getBoneMatrix( skinIndex.x );\nmat4 boneMatY = getBoneMatrix( skinIndex.y );\n#endif",
    skinning_vertex: "#ifdef USE_SKINNING\n#ifdef USE_MORPHTARGETS\nvec4 skinVertex = vec4( morphed, 1.0 );\n#else\nvec4 skinVertex = vec4( position, 1.0 );\n#endif\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned 	  += boneMatY * skinVertex * skinWeight.y;\n#endif",
    morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",
    morphtarget_vertex: "#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\n#endif",
    default_vertex: "vec4 mvPosition;\n#ifdef USE_SKINNING\nmvPosition = modelViewMatrix * skinned;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\nmvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\nmvPosition = modelViewMatrix * vec4( position, 1.0 );\n#endif\ngl_Position = projectionMatrix * mvPosition;",
    morphnormal_vertex: "#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\n#endif",
    skinnormal_vertex: "#ifdef USE_SKINNING\nmat4 skinMatrix = skinWeight.x * boneMatX;\nskinMatrix 	+= skinWeight.y * boneMatY;\n#ifdef USE_MORPHNORMALS\nvec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n#else\nvec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n#endif\n#endif",
    defaultnormal_vertex: "vec3 objectNormal;\n#ifdef USE_SKINNING\nobjectNormal = skinnedNormal.xyz;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\nobjectNormal = morphedNormal;\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\nobjectNormal = normal;\n#endif\n#ifdef FLIP_SIDED\nobjectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;",
    shadowmap_pars_fragment: "#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",
    shadowmap_fragment: "#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#if defined( SHADOWMAP_TYPE_PCF )\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\nfloat shadow = 0.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.0 * xPixelOffset;\nfloat dy0 = -1.0 * yPixelOffset;\nfloat dx1 = 1.0 * xPixelOffset;\nfloat dy1 = 1.0 * yPixelOffset;\nmat3 shadowKernel;\nmat3 depthKernel;\ndepthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( depthKernel[0][0] < shadowCoord.z ) shadowKernel[0][0] = 0.25;\nelse shadowKernel[0][0] = 0.0;\ndepthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( depthKernel[0][1] < shadowCoord.z ) shadowKernel[0][1] = 0.25;\nelse shadowKernel[0][1] = 0.0;\ndepthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( depthKernel[0][2] < shadowCoord.z ) shadowKernel[0][2] = 0.25;\nelse shadowKernel[0][2] = 0.0;\ndepthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( depthKernel[1][0] < shadowCoord.z ) shadowKernel[1][0] = 0.25;\nelse shadowKernel[1][0] = 0.0;\ndepthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( depthKernel[1][1] < shadowCoord.z ) shadowKernel[1][1] = 0.25;\nelse shadowKernel[1][1] = 0.0;\ndepthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( depthKernel[1][2] < shadowCoord.z ) shadowKernel[1][2] = 0.25;\nelse shadowKernel[1][2] = 0.0;\ndepthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( depthKernel[2][0] < shadowCoord.z ) shadowKernel[2][0] = 0.25;\nelse shadowKernel[2][0] = 0.0;\ndepthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( depthKernel[2][1] < shadowCoord.z ) shadowKernel[2][1] = 0.25;\nelse shadowKernel[2][1] = 0.0;\ndepthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( depthKernel[2][2] < shadowCoord.z ) shadowKernel[2][2] = 0.25;\nelse shadowKernel[2][2] = 0.0;\nvec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\nshadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\nshadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\nvec4 shadowValues;\nshadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\nshadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\nshadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\nshadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\nshadow = dot( shadowValues, vec4( 1.0 ) );\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
    shadowmap_pars_vertex: "#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",
    shadowmap_vertex: "#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n}\n#endif",
    alphatest_fragment: "#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",
    linear_to_gamma_fragment: "#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"
  };
  THREE.UniformsUtils = { merge: function(a) {
    var b, c, d, e = {};
    for (b = 0; b < a.length; b++)
      for (c in d = this.clone(a[b]), d)
        e[c] = d[c];
    return e;
  }, clone: function(a) {
    var b, c, d, e = {};
    for (b in a)
      for (c in e[b] = {}, a[b])
        d = a[b][c], e[b][c] = d instanceof THREE.Color || d instanceof THREE.Vector2 || d instanceof THREE.Vector3 || d instanceof THREE.Vector4 || d instanceof THREE.Matrix4 || d instanceof THREE.Texture ? d.clone() : d instanceof Array ? d.slice() : d;
    return e;
  } };
  THREE.UniformsLib = { common: { diffuse: { type: "c", value: new THREE.Color(15658734) }, opacity: { type: "f", value: 1 }, map: { type: "t", value: null }, offsetRepeat: { type: "v4", value: new THREE.Vector4(0, 0, 1, 1) }, lightMap: { type: "t", value: null }, specularMap: { type: "t", value: null }, envMap: { type: "t", value: null }, flipEnvMap: { type: "f", value: -1 }, useRefract: { type: "i", value: 0 }, reflectivity: { type: "f", value: 1 }, refractionRatio: { type: "f", value: 0.98 }, combine: { type: "i", value: 0 }, morphTargetInfluences: { type: "f", value: 0 } }, bump: { bumpMap: {
    type: "t",
    value: null
  }, bumpScale: { type: "f", value: 1 } }, normalmap: { normalMap: { type: "t", value: null }, normalScale: { type: "v2", value: new THREE.Vector2(1, 1) } }, fog: { fogDensity: { type: "f", value: 25e-5 }, fogNear: { type: "f", value: 1 }, fogFar: { type: "f", value: 2e3 }, fogColor: { type: "c", value: new THREE.Color(16777215) } }, lights: { ambientLightColor: { type: "fv", value: [] }, directionalLightDirection: { type: "fv", value: [] }, directionalLightColor: { type: "fv", value: [] }, hemisphereLightDirection: { type: "fv", value: [] }, hemisphereLightSkyColor: {
    type: "fv",
    value: []
  }, hemisphereLightGroundColor: { type: "fv", value: [] }, pointLightColor: { type: "fv", value: [] }, pointLightPosition: { type: "fv", value: [] }, pointLightDistance: { type: "fv1", value: [] }, spotLightColor: { type: "fv", value: [] }, spotLightPosition: { type: "fv", value: [] }, spotLightDirection: { type: "fv", value: [] }, spotLightDistance: { type: "fv1", value: [] }, spotLightAngleCos: { type: "fv1", value: [] }, spotLightExponent: { type: "fv1", value: [] } }, particle: { psColor: { type: "c", value: new THREE.Color(15658734) }, opacity: { type: "f", value: 1 }, size: {
    type: "f",
    value: 1
  }, scale: { type: "f", value: 1 }, map: { type: "t", value: null }, fogDensity: { type: "f", value: 25e-5 }, fogNear: { type: "f", value: 1 }, fogFar: { type: "f", value: 2e3 }, fogColor: { type: "c", value: new THREE.Color(16777215) } }, shadowmap: { shadowMap: { type: "tv", value: [] }, shadowMapSize: { type: "v2v", value: [] }, shadowBias: { type: "fv1", value: [] }, shadowDarkness: { type: "fv1", value: [] }, shadowMatrix: { type: "m4v", value: [] } } };
  THREE.ShaderLib = { depth: { uniforms: { mNear: { type: "f", value: 1 }, mFar: { type: "f", value: 2e3 }, opacity: { type: "f", value: 1 } }, vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", fragmentShader: "uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}" }, normal: { uniforms: { opacity: {
    type: "f",
    value: 1
  } }, vertexShader: "varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalize( normalMatrix * normal );\ngl_Position = projectionMatrix * mvPosition;\n}", fragmentShader: "uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}" }, basic: { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.fog, THREE.UniformsLib.shadowmap]), vertexShader: [
    THREE.ShaderChunk.map_pars_vertex,
    THREE.ShaderChunk.lightmap_pars_vertex,
    THREE.ShaderChunk.envmap_pars_vertex,
    THREE.ShaderChunk.color_pars_vertex,
    THREE.ShaderChunk.morphtarget_pars_vertex,
    THREE.ShaderChunk.skinning_pars_vertex,
    THREE.ShaderChunk.shadowmap_pars_vertex,
    "void main() {",
    THREE.ShaderChunk.map_vertex,
    THREE.ShaderChunk.lightmap_vertex,
    THREE.ShaderChunk.color_vertex,
    THREE.ShaderChunk.skinbase_vertex,
    "#ifdef USE_ENVMAP",
    THREE.ShaderChunk.morphnormal_vertex,
    THREE.ShaderChunk.skinnormal_vertex,
    THREE.ShaderChunk.defaultnormal_vertex,
    "#endif",
    THREE.ShaderChunk.morphtarget_vertex,
    THREE.ShaderChunk.skinning_vertex,
    THREE.ShaderChunk.default_vertex,
    THREE.ShaderChunk.worldpos_vertex,
    THREE.ShaderChunk.envmap_vertex,
    THREE.ShaderChunk.shadowmap_vertex,
    "}"
  ].join("\n"), fragmentShader: [
    "uniform vec3 diffuse;\nuniform float opacity;",
    THREE.ShaderChunk.color_pars_fragment,
    THREE.ShaderChunk.map_pars_fragment,
    THREE.ShaderChunk.lightmap_pars_fragment,
    THREE.ShaderChunk.envmap_pars_fragment,
    THREE.ShaderChunk.fog_pars_fragment,
    THREE.ShaderChunk.shadowmap_pars_fragment,
    THREE.ShaderChunk.specularmap_pars_fragment,
    "void main() {\ngl_FragColor = vec4( diffuse, opacity );",
    THREE.ShaderChunk.map_fragment,
    THREE.ShaderChunk.alphatest_fragment,
    THREE.ShaderChunk.specularmap_fragment,
    THREE.ShaderChunk.lightmap_fragment,
    THREE.ShaderChunk.color_fragment,
    THREE.ShaderChunk.envmap_fragment,
    THREE.ShaderChunk.shadowmap_fragment,
    THREE.ShaderChunk.linear_to_gamma_fragment,
    THREE.ShaderChunk.fog_fragment,
    "}"
  ].join("\n") }, lambert: { uniforms: THREE.UniformsUtils.merge([
    THREE.UniformsLib.common,
    THREE.UniformsLib.fog,
    THREE.UniformsLib.lights,
    THREE.UniformsLib.shadowmap,
    { ambient: { type: "c", value: new THREE.Color(16777215) }, emissive: { type: "c", value: new THREE.Color(0) }, wrapRGB: { type: "v3", value: new THREE.Vector3(1, 1, 1) } }
  ]), vertexShader: [
    "#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",
    THREE.ShaderChunk.map_pars_vertex,
    THREE.ShaderChunk.lightmap_pars_vertex,
    THREE.ShaderChunk.envmap_pars_vertex,
    THREE.ShaderChunk.lights_lambert_pars_vertex,
    THREE.ShaderChunk.color_pars_vertex,
    THREE.ShaderChunk.morphtarget_pars_vertex,
    THREE.ShaderChunk.skinning_pars_vertex,
    THREE.ShaderChunk.shadowmap_pars_vertex,
    "void main() {",
    THREE.ShaderChunk.map_vertex,
    THREE.ShaderChunk.lightmap_vertex,
    THREE.ShaderChunk.color_vertex,
    THREE.ShaderChunk.morphnormal_vertex,
    THREE.ShaderChunk.skinbase_vertex,
    THREE.ShaderChunk.skinnormal_vertex,
    THREE.ShaderChunk.defaultnormal_vertex,
    THREE.ShaderChunk.morphtarget_vertex,
    THREE.ShaderChunk.skinning_vertex,
    THREE.ShaderChunk.default_vertex,
    THREE.ShaderChunk.worldpos_vertex,
    THREE.ShaderChunk.envmap_vertex,
    THREE.ShaderChunk.lights_lambert_vertex,
    THREE.ShaderChunk.shadowmap_vertex,
    "}"
  ].join("\n"), fragmentShader: [
    "uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",
    THREE.ShaderChunk.color_pars_fragment,
    THREE.ShaderChunk.map_pars_fragment,
    THREE.ShaderChunk.lightmap_pars_fragment,
    THREE.ShaderChunk.envmap_pars_fragment,
    THREE.ShaderChunk.fog_pars_fragment,
    THREE.ShaderChunk.shadowmap_pars_fragment,
    THREE.ShaderChunk.specularmap_pars_fragment,
    "void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
    THREE.ShaderChunk.map_fragment,
    THREE.ShaderChunk.alphatest_fragment,
    THREE.ShaderChunk.specularmap_fragment,
    "#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",
    THREE.ShaderChunk.lightmap_fragment,
    THREE.ShaderChunk.color_fragment,
    THREE.ShaderChunk.envmap_fragment,
    THREE.ShaderChunk.shadowmap_fragment,
    THREE.ShaderChunk.linear_to_gamma_fragment,
    THREE.ShaderChunk.fog_fragment,
    "}"
  ].join("\n") }, phong: { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.bump, THREE.UniformsLib.normalmap, THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, { ambient: { type: "c", value: new THREE.Color(16777215) }, emissive: { type: "c", value: new THREE.Color(0) }, specular: { type: "c", value: new THREE.Color(1118481) }, shininess: { type: "f", value: 30 }, wrapRGB: { type: "v3", value: new THREE.Vector3(1, 1, 1) } }]), vertexShader: [
    "#define PHONG\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
    THREE.ShaderChunk.map_pars_vertex,
    THREE.ShaderChunk.lightmap_pars_vertex,
    THREE.ShaderChunk.envmap_pars_vertex,
    THREE.ShaderChunk.lights_phong_pars_vertex,
    THREE.ShaderChunk.color_pars_vertex,
    THREE.ShaderChunk.morphtarget_pars_vertex,
    THREE.ShaderChunk.skinning_pars_vertex,
    THREE.ShaderChunk.shadowmap_pars_vertex,
    "void main() {",
    THREE.ShaderChunk.map_vertex,
    THREE.ShaderChunk.lightmap_vertex,
    THREE.ShaderChunk.color_vertex,
    THREE.ShaderChunk.morphnormal_vertex,
    THREE.ShaderChunk.skinbase_vertex,
    THREE.ShaderChunk.skinnormal_vertex,
    THREE.ShaderChunk.defaultnormal_vertex,
    "vNormal = normalize( transformedNormal );",
    THREE.ShaderChunk.morphtarget_vertex,
    THREE.ShaderChunk.skinning_vertex,
    THREE.ShaderChunk.default_vertex,
    "vViewPosition = -mvPosition.xyz;",
    THREE.ShaderChunk.worldpos_vertex,
    THREE.ShaderChunk.envmap_vertex,
    THREE.ShaderChunk.lights_phong_vertex,
    THREE.ShaderChunk.shadowmap_vertex,
    "}"
  ].join("\n"), fragmentShader: [
    "uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",
    THREE.ShaderChunk.color_pars_fragment,
    THREE.ShaderChunk.map_pars_fragment,
    THREE.ShaderChunk.lightmap_pars_fragment,
    THREE.ShaderChunk.envmap_pars_fragment,
    THREE.ShaderChunk.fog_pars_fragment,
    THREE.ShaderChunk.lights_phong_pars_fragment,
    THREE.ShaderChunk.shadowmap_pars_fragment,
    THREE.ShaderChunk.bumpmap_pars_fragment,
    THREE.ShaderChunk.normalmap_pars_fragment,
    THREE.ShaderChunk.specularmap_pars_fragment,
    "void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
    THREE.ShaderChunk.map_fragment,
    THREE.ShaderChunk.alphatest_fragment,
    THREE.ShaderChunk.specularmap_fragment,
    THREE.ShaderChunk.lights_phong_fragment,
    THREE.ShaderChunk.lightmap_fragment,
    THREE.ShaderChunk.color_fragment,
    THREE.ShaderChunk.envmap_fragment,
    THREE.ShaderChunk.shadowmap_fragment,
    THREE.ShaderChunk.linear_to_gamma_fragment,
    THREE.ShaderChunk.fog_fragment,
    "}"
  ].join("\n") }, particle_basic: { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.particle, THREE.UniformsLib.shadowmap]), vertexShader: [
    "uniform float size;\nuniform float scale;",
    THREE.ShaderChunk.color_pars_vertex,
    THREE.ShaderChunk.shadowmap_pars_vertex,
    "void main() {",
    THREE.ShaderChunk.color_vertex,
    "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",
    THREE.ShaderChunk.worldpos_vertex,
    THREE.ShaderChunk.shadowmap_vertex,
    "}"
  ].join("\n"), fragmentShader: [
    "uniform vec3 psColor;\nuniform float opacity;",
    THREE.ShaderChunk.color_pars_fragment,
    THREE.ShaderChunk.map_particle_pars_fragment,
    THREE.ShaderChunk.fog_pars_fragment,
    THREE.ShaderChunk.shadowmap_pars_fragment,
    "void main() {\ngl_FragColor = vec4( psColor, opacity );",
    THREE.ShaderChunk.map_particle_fragment,
    THREE.ShaderChunk.alphatest_fragment,
    THREE.ShaderChunk.color_fragment,
    THREE.ShaderChunk.shadowmap_fragment,
    THREE.ShaderChunk.fog_fragment,
    "}"
  ].join("\n") }, dashed: { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.fog, { scale: { type: "f", value: 1 }, dashSize: {
    type: "f",
    value: 1
  }, totalSize: { type: "f", value: 2 } }]), vertexShader: ["uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;", THREE.ShaderChunk.color_pars_vertex, "void main() {", THREE.ShaderChunk.color_vertex, "vLineDistance = scale * lineDistance;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\n}"].join("\n"), fragmentShader: [
    "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;",
    THREE.ShaderChunk.color_pars_fragment,
    THREE.ShaderChunk.fog_pars_fragment,
    "void main() {\nif ( mod( vLineDistance, totalSize ) > dashSize ) {\ndiscard;\n}\ngl_FragColor = vec4( diffuse, opacity );",
    THREE.ShaderChunk.color_fragment,
    THREE.ShaderChunk.fog_fragment,
    "}"
  ].join("\n") }, depthRGBA: { uniforms: {}, vertexShader: [
    THREE.ShaderChunk.morphtarget_pars_vertex,
    THREE.ShaderChunk.skinning_pars_vertex,
    "void main() {",
    THREE.ShaderChunk.skinbase_vertex,
    THREE.ShaderChunk.morphtarget_vertex,
    THREE.ShaderChunk.skinning_vertex,
    THREE.ShaderChunk.default_vertex,
    "}"
  ].join("\n"), fragmentShader: "vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}" } };
  THREE.WebGLRenderer = function(a) {
    function b(a2) {
      if (a2.__webglCustomAttributesList)
        for (var b2 in a2.__webglCustomAttributesList)
          j.deleteBuffer(a2.__webglCustomAttributesList[b2].buffer);
    }
    function c(a2, b2) {
      var c2 = a2.vertices.length, d2 = b2.material;
      if (d2.attributes) {
        void 0 === a2.__webglCustomAttributesList && (a2.__webglCustomAttributesList = []);
        for (var e2 in d2.attributes) {
          var f2 = d2.attributes[e2];
          if (!f2.__webglInitialized || f2.createUniqueBuffers) {
            f2.__webglInitialized = true;
            var g2 = 1;
            "v2" === f2.type ? g2 = 2 : "v3" === f2.type ? g2 = 3 : "v4" === f2.type ? g2 = 4 : "c" === f2.type && (g2 = 3);
            f2.size = g2;
            f2.array = new Float32Array(c2 * g2);
            f2.buffer = j.createBuffer();
            f2.buffer.belongsToAttribute = e2;
            f2.needsUpdate = true;
          }
          a2.__webglCustomAttributesList.push(f2);
        }
      }
    }
    function d(a2, b2) {
      var c2 = b2.geometry, d2 = a2.faces3, h2 = a2.faces4, i2 = 3 * d2.length + 4 * h2.length, k2 = 1 * d2.length + 2 * h2.length, h2 = 3 * d2.length + 4 * h2.length, d2 = e(b2, a2), l2 = g(d2), m2 = f(d2), n2 = d2.vertexColors ? d2.vertexColors : false;
      a2.__vertexArray = new Float32Array(3 * i2);
      m2 && (a2.__normalArray = new Float32Array(3 * i2));
      c2.hasTangents && (a2.__tangentArray = new Float32Array(4 * i2));
      n2 && (a2.__colorArray = new Float32Array(3 * i2));
      if (l2) {
        if (0 < c2.faceUvs.length || 0 < c2.faceVertexUvs.length)
          a2.__uvArray = new Float32Array(2 * i2);
        if (1 < c2.faceUvs.length || 1 < c2.faceVertexUvs.length)
          a2.__uv2Array = new Float32Array(2 * i2);
      }
      b2.geometry.skinWeights.length && b2.geometry.skinIndices.length && (a2.__skinIndexArray = new Float32Array(4 * i2), a2.__skinWeightArray = new Float32Array(4 * i2));
      a2.__faceArray = new Uint16Array(3 * k2);
      a2.__lineArray = new Uint16Array(2 * h2);
      if (a2.numMorphTargets) {
        a2.__morphTargetsArrays = [];
        c2 = 0;
        for (l2 = a2.numMorphTargets; c2 < l2; c2++)
          a2.__morphTargetsArrays.push(new Float32Array(3 * i2));
      }
      if (a2.numMorphNormals) {
        a2.__morphNormalsArrays = [];
        c2 = 0;
        for (l2 = a2.numMorphNormals; c2 < l2; c2++)
          a2.__morphNormalsArrays.push(new Float32Array(3 * i2));
      }
      a2.__webglFaceCount = 3 * k2;
      a2.__webglLineCount = 2 * h2;
      if (d2.attributes) {
        void 0 === a2.__webglCustomAttributesList && (a2.__webglCustomAttributesList = []);
        for (var p2 in d2.attributes) {
          var k2 = d2.attributes[p2], c2 = {}, q2;
          for (q2 in k2)
            c2[q2] = k2[q2];
          if (!c2.__webglInitialized || c2.createUniqueBuffers)
            c2.__webglInitialized = true, h2 = 1, "v2" === c2.type ? h2 = 2 : "v3" === c2.type ? h2 = 3 : "v4" === c2.type ? h2 = 4 : "c" === c2.type && (h2 = 3), c2.size = h2, c2.array = new Float32Array(i2 * h2), c2.buffer = j.createBuffer(), c2.buffer.belongsToAttribute = p2, k2.needsUpdate = true, c2.__original = k2;
          a2.__webglCustomAttributesList.push(c2);
        }
      }
      a2.__inittedArrays = true;
    }
    function e(a2, b2) {
      return a2.material instanceof THREE.MeshFaceMaterial ? a2.material.materials[b2.materialIndex] : a2.material;
    }
    function f(a2) {
      return a2 instanceof THREE.MeshBasicMaterial && !a2.envMap || a2 instanceof THREE.MeshDepthMaterial ? false : a2 && void 0 !== a2.shading && a2.shading === THREE.SmoothShading ? THREE.SmoothShading : THREE.FlatShading;
    }
    function g(a2) {
      return a2.map || a2.lightMap || a2.bumpMap || a2.normalMap || a2.specularMap || a2 instanceof THREE.ShaderMaterial ? true : false;
    }
    function h(a2) {
      var b2, c2, d2;
      for (b2 in a2.attributes)
        d2 = "index" === b2 ? j.ELEMENT_ARRAY_BUFFER : j.ARRAY_BUFFER, c2 = a2.attributes[b2], c2.buffer = j.createBuffer(), j.bindBuffer(d2, c2.buffer), j.bufferData(d2, c2.array, j.STATIC_DRAW);
    }
    function i(a2, b2, c2) {
      var d2 = a2.attributes, e2 = d2.index, f2 = d2.position, g2 = d2.normal, h2 = d2.uv, i2 = d2.color, d2 = d2.tangent;
      a2.elementsNeedUpdate && void 0 !== e2 && (j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, e2.buffer), j.bufferData(j.ELEMENT_ARRAY_BUFFER, e2.array, b2));
      a2.verticesNeedUpdate && void 0 !== f2 && (j.bindBuffer(j.ARRAY_BUFFER, f2.buffer), j.bufferData(j.ARRAY_BUFFER, f2.array, b2));
      a2.normalsNeedUpdate && void 0 !== g2 && (j.bindBuffer(j.ARRAY_BUFFER, g2.buffer), j.bufferData(j.ARRAY_BUFFER, g2.array, b2));
      a2.uvsNeedUpdate && void 0 !== h2 && (j.bindBuffer(j.ARRAY_BUFFER, h2.buffer), j.bufferData(j.ARRAY_BUFFER, h2.array, b2));
      a2.colorsNeedUpdate && void 0 !== i2 && (j.bindBuffer(
        j.ARRAY_BUFFER,
        i2.buffer
      ), j.bufferData(j.ARRAY_BUFFER, i2.array, b2));
      a2.tangentsNeedUpdate && void 0 !== d2 && (j.bindBuffer(j.ARRAY_BUFFER, d2.buffer), j.bufferData(j.ARRAY_BUFFER, d2.array, b2));
      if (c2)
        for (var k2 in a2.attributes)
          delete a2.attributes[k2].array;
    }
    function k(a2) {
      $a[a2] || (j.enableVertexAttribArray(a2), $a[a2] = true);
    }
    function l() {
      for (var a2 in $a)
        $a[a2] && (j.disableVertexAttribArray(a2), $a[a2] = false);
    }
    function m(a2, b2) {
      return a2.z !== b2.z ? b2.z - a2.z : b2.id - a2.id;
    }
    function p(a2, b2) {
      return b2[0] - a2[0];
    }
    function s(a2, b2, c2) {
      if (a2.length)
        for (var d2 = 0, e2 = a2.length; d2 < e2; d2++)
          qa = ia = null, W = ba = sa = ma = pb = ob = Pa = -1, Fb = true, a2[d2].render(b2, c2, qb, Cb), qa = ia = null, W = ba = sa = ma = pb = ob = Pa = -1, Fb = true;
    }
    function q(a2, b2, c2, d2, e2, f2, g2, h2) {
      var j2, i2, k2, l2;
      b2 ? (i2 = a2.length - 1, l2 = b2 = -1) : (i2 = 0, b2 = a2.length, l2 = 1);
      for (var m2 = i2; m2 !== b2; m2 += l2)
        if (j2 = a2[m2], j2.render) {
          i2 = j2.object;
          k2 = j2.buffer;
          if (h2)
            j2 = h2;
          else {
            j2 = j2[c2];
            if (!j2)
              continue;
            g2 && H.setBlending(j2.blending, j2.blendEquation, j2.blendSrc, j2.blendDst);
            H.setDepthTest(j2.depthTest);
            H.setDepthWrite(j2.depthWrite);
            G(j2.polygonOffset, j2.polygonOffsetFactor, j2.polygonOffsetUnits);
          }
          H.setMaterialFaces(j2);
          k2 instanceof THREE.BufferGeometry ? H.renderBufferDirect(d2, e2, f2, j2, k2, i2) : H.renderBuffer(d2, e2, f2, j2, k2, i2);
        }
    }
    function n(a2, b2, c2, d2, e2, f2, g2) {
      for (var j2, h2, i2 = 0, k2 = a2.length; i2 < k2; i2++)
        if (j2 = a2[i2], h2 = j2.object, h2.visible) {
          if (g2)
            j2 = g2;
          else {
            j2 = j2[b2];
            if (!j2)
              continue;
            f2 && H.setBlending(j2.blending, j2.blendEquation, j2.blendSrc, j2.blendDst);
            H.setDepthTest(j2.depthTest);
            H.setDepthWrite(j2.depthWrite);
            G(j2.polygonOffset, j2.polygonOffsetFactor, j2.polygonOffsetUnits);
          }
          H.renderImmediateObject(c2, d2, e2, j2, h2);
        }
    }
    function r(a2, b2, c2) {
      a2.push({ buffer: b2, object: c2, opaque: null, transparent: null });
    }
    function v(a2) {
      for (var b2 in a2.attributes)
        if (a2.attributes[b2].needsUpdate)
          return true;
      return false;
    }
    function w(a2) {
      for (var b2 in a2.attributes)
        a2.attributes[b2].needsUpdate = false;
    }
    function x(a2, b2) {
      for (var c2 = a2.length - 1; 0 <= c2; c2--)
        a2[c2].object === b2 && a2.splice(c2, 1);
    }
    function t(a2, b2) {
      for (var c2 = a2.length - 1; 0 <= c2; c2--)
        a2[c2] === b2 && a2.splice(c2, 1);
    }
    function K(a2, b2, c2, d2, e2) {
      ya = 0;
      d2.needsUpdate && (d2.program && Kc(d2), H.initMaterial(d2, b2, c2, e2), d2.needsUpdate = false);
      d2.morphTargets && !e2.__webglMorphTargetInfluences && (e2.__webglMorphTargetInfluences = new Float32Array(H.maxMorphTargets));
      var f2 = false, g2 = d2.program, h2 = g2.uniforms, i2 = d2.uniforms;
      g2 !== ia && (j.useProgram(g2), ia = g2, f2 = true);
      d2.id !== W && (W = d2.id, f2 = true);
      if (f2 || a2 !== qa)
        j.uniformMatrix4fv(h2.projectionMatrix, false, a2.projectionMatrix.elements), a2 !== qa && (qa = a2);
      if (d2.skinning)
        if (tb && e2.useVertexTexture) {
          if (null !== h2.boneTexture) {
            var k2 = D();
            j.uniform1i(h2.boneTexture, k2);
            H.setTexture(e2.boneTexture, k2);
          }
        } else
          null !== h2.boneGlobalMatrices && j.uniformMatrix4fv(h2.boneGlobalMatrices, false, e2.boneMatrices);
      if (f2) {
        c2 && d2.fog && (i2.fogColor.value = c2.color, c2 instanceof THREE.Fog ? (i2.fogNear.value = c2.near, i2.fogFar.value = c2.far) : c2 instanceof THREE.FogExp2 && (i2.fogDensity.value = c2.density));
        if (d2 instanceof THREE.MeshPhongMaterial || d2 instanceof THREE.MeshLambertMaterial || d2.lights) {
          if (Fb) {
            for (var l2, m2 = k2 = 0, n2 = 0, p2, q2, s2, r2 = Hc, t2 = r2.directional.colors, v2 = r2.directional.positions, w2 = r2.point.colors, x2 = r2.point.positions, A2 = r2.point.distances, B2 = r2.spot.colors, G2 = r2.spot.positions, I2 = r2.spot.distances, K2 = r2.spot.directions, M2 = r2.spot.anglesCos, L2 = r2.spot.exponents, N2 = r2.hemi.skyColors, ba2 = r2.hemi.groundColors, P2 = r2.hemi.positions, ja2 = 0, ha2 = 0, V2 = 0, Y2 = 0, ka2 = 0, fa2 = 0, $2 = 0, ga2 = 0, U = l2 = 0, c2 = s2 = U = 0, f2 = b2.length; c2 < f2; c2++)
              l2 = b2[c2], l2.onlyShadow || (p2 = l2.color, q2 = l2.intensity, s2 = l2.distance, l2 instanceof THREE.AmbientLight ? l2.visible && (H.gammaInput ? (k2 += p2.r * p2.r, m2 += p2.g * p2.g, n2 += p2.b * p2.b) : (k2 += p2.r, m2 += p2.g, n2 += p2.b)) : l2 instanceof THREE.DirectionalLight ? (ka2 += 1, l2.visible && (ta.copy(l2.matrixWorld.getPosition()), ta.subSelf(l2.target.matrixWorld.getPosition()), ta.normalize(), 0 === ta.x && 0 === ta.y && 0 === ta.z || (l2 = 3 * ja2, v2[l2] = ta.x, v2[l2 + 1] = ta.y, v2[l2 + 2] = ta.z, H.gammaInput ? z(t2, l2, p2, q2 * q2) : E(t2, l2, p2, q2), ja2 += 1))) : l2 instanceof THREE.PointLight ? (fa2 += 1, l2.visible && (U = 3 * ha2, H.gammaInput ? z(w2, U, p2, q2 * q2) : E(w2, U, p2, q2), q2 = l2.matrixWorld.getPosition(), x2[U] = q2.x, x2[U + 1] = q2.y, x2[U + 2] = q2.z, A2[ha2] = s2, ha2 += 1)) : l2 instanceof THREE.SpotLight ? ($2 += 1, l2.visible && (U = 3 * V2, H.gammaInput ? z(B2, U, p2, q2 * q2) : E(B2, U, p2, q2), q2 = l2.matrixWorld.getPosition(), G2[U] = q2.x, G2[U + 1] = q2.y, G2[U + 2] = q2.z, I2[V2] = s2, ta.copy(q2), ta.subSelf(l2.target.matrixWorld.getPosition()), ta.normalize(), K2[U] = ta.x, K2[U + 1] = ta.y, K2[U + 2] = ta.z, M2[V2] = Math.cos(l2.angle), L2[V2] = l2.exponent, V2 += 1)) : l2 instanceof THREE.HemisphereLight && (ga2 += 1, l2.visible && (ta.copy(l2.matrixWorld.getPosition()), ta.normalize(), 0 === ta.x && 0 === ta.y && 0 === ta.z || (s2 = 3 * Y2, P2[s2] = ta.x, P2[s2 + 1] = ta.y, P2[s2 + 2] = ta.z, p2 = l2.color, l2 = l2.groundColor, H.gammaInput ? (q2 *= q2, z(N2, s2, p2, q2), z(ba2, s2, l2, q2)) : (E(N2, s2, p2, q2), E(ba2, s2, l2, q2)), Y2 += 1))));
            c2 = 3 * ja2;
            for (f2 = Math.max(t2.length, 3 * ka2); c2 < f2; c2++)
              t2[c2] = 0;
            c2 = 3 * ha2;
            for (f2 = Math.max(w2.length, 3 * fa2); c2 < f2; c2++)
              w2[c2] = 0;
            c2 = 3 * V2;
            for (f2 = Math.max(B2.length, 3 * $2); c2 < f2; c2++)
              B2[c2] = 0;
            c2 = 3 * Y2;
            for (f2 = Math.max(N2.length, 3 * ga2); c2 < f2; c2++)
              N2[c2] = 0;
            c2 = 3 * Y2;
            for (f2 = Math.max(
              ba2.length,
              3 * ga2
            ); c2 < f2; c2++)
              ba2[c2] = 0;
            r2.directional.length = ja2;
            r2.point.length = ha2;
            r2.spot.length = V2;
            r2.hemi.length = Y2;
            r2.ambient[0] = k2;
            r2.ambient[1] = m2;
            r2.ambient[2] = n2;
            Fb = false;
          }
          c2 = Hc;
          i2.ambientLightColor.value = c2.ambient;
          i2.directionalLightColor.value = c2.directional.colors;
          i2.directionalLightDirection.value = c2.directional.positions;
          i2.pointLightColor.value = c2.point.colors;
          i2.pointLightPosition.value = c2.point.positions;
          i2.pointLightDistance.value = c2.point.distances;
          i2.spotLightColor.value = c2.spot.colors;
          i2.spotLightPosition.value = c2.spot.positions;
          i2.spotLightDistance.value = c2.spot.distances;
          i2.spotLightDirection.value = c2.spot.directions;
          i2.spotLightAngleCos.value = c2.spot.anglesCos;
          i2.spotLightExponent.value = c2.spot.exponents;
          i2.hemisphereLightSkyColor.value = c2.hemi.skyColors;
          i2.hemisphereLightGroundColor.value = c2.hemi.groundColors;
          i2.hemisphereLightDirection.value = c2.hemi.positions;
        }
        if (d2 instanceof THREE.MeshBasicMaterial || d2 instanceof THREE.MeshLambertMaterial || d2 instanceof THREE.MeshPhongMaterial) {
          i2.opacity.value = d2.opacity;
          H.gammaInput ? i2.diffuse.value.copyGammaToLinear(d2.color) : i2.diffuse.value = d2.color;
          i2.map.value = d2.map;
          i2.lightMap.value = d2.lightMap;
          i2.specularMap.value = d2.specularMap;
          d2.bumpMap && (i2.bumpMap.value = d2.bumpMap, i2.bumpScale.value = d2.bumpScale);
          d2.normalMap && (i2.normalMap.value = d2.normalMap, i2.normalScale.value.copy(d2.normalScale));
          var Z2;
          d2.map ? Z2 = d2.map : d2.specularMap ? Z2 = d2.specularMap : d2.normalMap ? Z2 = d2.normalMap : d2.bumpMap && (Z2 = d2.bumpMap);
          void 0 !== Z2 && (c2 = Z2.offset, Z2 = Z2.repeat, i2.offsetRepeat.value.set(c2.x, c2.y, Z2.x, Z2.y));
          i2.envMap.value = d2.envMap;
          i2.flipEnvMap.value = d2.envMap instanceof THREE.WebGLRenderTargetCube ? 1 : -1;
          i2.reflectivity.value = d2.reflectivity;
          i2.refractionRatio.value = d2.refractionRatio;
          i2.combine.value = d2.combine;
          i2.useRefract.value = d2.envMap && d2.envMap.mapping instanceof THREE.CubeRefractionMapping;
        }
        d2 instanceof THREE.LineBasicMaterial ? (i2.diffuse.value = d2.color, i2.opacity.value = d2.opacity) : d2 instanceof THREE.LineDashedMaterial ? (i2.diffuse.value = d2.color, i2.opacity.value = d2.opacity, i2.dashSize.value = d2.dashSize, i2.totalSize.value = d2.dashSize + d2.gapSize, i2.scale.value = d2.scale) : d2 instanceof THREE.ParticleBasicMaterial ? (i2.psColor.value = d2.color, i2.opacity.value = d2.opacity, i2.size.value = d2.size, i2.scale.value = T.height / 2, i2.map.value = d2.map) : d2 instanceof THREE.MeshPhongMaterial ? (i2.shininess.value = d2.shininess, H.gammaInput ? (i2.ambient.value.copyGammaToLinear(d2.ambient), i2.emissive.value.copyGammaToLinear(d2.emissive), i2.specular.value.copyGammaToLinear(d2.specular)) : (i2.ambient.value = d2.ambient, i2.emissive.value = d2.emissive, i2.specular.value = d2.specular), d2.wrapAround && i2.wrapRGB.value.copy(d2.wrapRGB)) : d2 instanceof THREE.MeshLambertMaterial ? (H.gammaInput ? (i2.ambient.value.copyGammaToLinear(d2.ambient), i2.emissive.value.copyGammaToLinear(d2.emissive)) : (i2.ambient.value = d2.ambient, i2.emissive.value = d2.emissive), d2.wrapAround && i2.wrapRGB.value.copy(d2.wrapRGB)) : d2 instanceof THREE.MeshDepthMaterial ? (i2.mNear.value = a2.near, i2.mFar.value = a2.far, i2.opacity.value = d2.opacity) : d2 instanceof THREE.MeshNormalMaterial && (i2.opacity.value = d2.opacity);
        if (e2.receiveShadow && !d2._shadowPass && i2.shadowMatrix) {
          c2 = Z2 = 0;
          for (f2 = b2.length; c2 < f2; c2++)
            if (k2 = b2[c2], k2.castShadow && (k2 instanceof THREE.SpotLight || k2 instanceof THREE.DirectionalLight && !k2.shadowCascade))
              i2.shadowMap.value[Z2] = k2.shadowMap, i2.shadowMapSize.value[Z2] = k2.shadowMapSize, i2.shadowMatrix.value[Z2] = k2.shadowMatrix, i2.shadowDarkness.value[Z2] = k2.shadowDarkness, i2.shadowBias.value[Z2] = k2.shadowBias, Z2++;
        }
        b2 = d2.uniformsList;
        i2 = 0;
        for (Z2 = b2.length; i2 < Z2; i2++)
          if (f2 = g2.uniforms[b2[i2][1]]) {
            if (c2 = b2[i2][0], m2 = c2.type, k2 = c2.value, "i" === m2)
              j.uniform1i(f2, k2);
            else if ("f" === m2)
              j.uniform1f(f2, k2);
            else if ("v2" === m2)
              j.uniform2f(f2, k2.x, k2.y);
            else if ("v3" === m2)
              j.uniform3f(
                f2,
                k2.x,
                k2.y,
                k2.z
              );
            else if ("v4" === m2)
              j.uniform4f(f2, k2.x, k2.y, k2.z, k2.w);
            else if ("c" === m2)
              j.uniform3f(f2, k2.r, k2.g, k2.b);
            else if ("iv1" === m2)
              j.uniform1iv(f2, k2);
            else if ("iv" === m2)
              j.uniform3iv(f2, k2);
            else if ("fv1" === m2)
              j.uniform1fv(f2, k2);
            else if ("fv" === m2)
              j.uniform3fv(f2, k2);
            else if ("v2v" === m2) {
              void 0 === c2._array && (c2._array = new Float32Array(2 * k2.length));
              m2 = 0;
              for (n2 = k2.length; m2 < n2; m2++)
                r2 = 2 * m2, c2._array[r2] = k2[m2].x, c2._array[r2 + 1] = k2[m2].y;
              j.uniform2fv(f2, c2._array);
            } else if ("v3v" === m2) {
              void 0 === c2._array && (c2._array = new Float32Array(3 * k2.length));
              m2 = 0;
              for (n2 = k2.length; m2 < n2; m2++)
                r2 = 3 * m2, c2._array[r2] = k2[m2].x, c2._array[r2 + 1] = k2[m2].y, c2._array[r2 + 2] = k2[m2].z;
              j.uniform3fv(f2, c2._array);
            } else if ("v4v" === m2) {
              void 0 === c2._array && (c2._array = new Float32Array(4 * k2.length));
              m2 = 0;
              for (n2 = k2.length; m2 < n2; m2++)
                r2 = 4 * m2, c2._array[r2] = k2[m2].x, c2._array[r2 + 1] = k2[m2].y, c2._array[r2 + 2] = k2[m2].z, c2._array[r2 + 3] = k2[m2].w;
              j.uniform4fv(f2, c2._array);
            } else if ("m4" === m2)
              void 0 === c2._array && (c2._array = new Float32Array(16)), k2.flattenToArray(c2._array), j.uniformMatrix4fv(f2, false, c2._array);
            else if ("m4v" === m2) {
              void 0 === c2._array && (c2._array = new Float32Array(16 * k2.length));
              m2 = 0;
              for (n2 = k2.length; m2 < n2; m2++)
                k2[m2].flattenToArrayOffset(c2._array, 16 * m2);
              j.uniformMatrix4fv(f2, false, c2._array);
            } else if ("t" === m2) {
              if (r2 = k2, k2 = D(), j.uniform1i(f2, k2), r2)
                if (r2.image instanceof Array && 6 === r2.image.length) {
                  if (c2 = r2, f2 = k2, 6 === c2.image.length)
                    if (c2.needsUpdate) {
                      c2.image.__webglTextureCube || (c2.image.__webglTextureCube = j.createTexture(), H.info.memory.textures++);
                      j.activeTexture(j.TEXTURE0 + f2);
                      j.bindTexture(j.TEXTURE_CUBE_MAP, c2.image.__webglTextureCube);
                      j.pixelStorei(
                        j.UNPACK_FLIP_Y_WEBGL,
                        c2.flipY
                      );
                      f2 = c2 instanceof THREE.CompressedTexture;
                      k2 = [];
                      for (m2 = 0; 6 > m2; m2++)
                        H.autoScaleCubemaps && !f2 ? (n2 = k2, r2 = m2, t2 = c2.image[m2], w2 = bd, t2.width <= w2 && t2.height <= w2 || (x2 = Math.max(t2.width, t2.height), v2 = Math.floor(t2.width * w2 / x2), w2 = Math.floor(t2.height * w2 / x2), x2 = document.createElement("canvas"), x2.width = v2, x2.height = w2, x2.getContext("2d").drawImage(t2, 0, 0, t2.width, t2.height, 0, 0, v2, w2), t2 = x2), n2[r2] = t2) : k2[m2] = c2.image[m2];
                      m2 = k2[0];
                      n2 = 0 === (m2.width & m2.width - 1) && 0 === (m2.height & m2.height - 1);
                      r2 = J(c2.format);
                      t2 = J(c2.type);
                      C(j.TEXTURE_CUBE_MAP, c2, n2);
                      for (m2 = 0; 6 > m2; m2++)
                        if (f2) {
                          w2 = k2[m2].mipmaps;
                          x2 = 0;
                          for (A2 = w2.length; x2 < A2; x2++)
                            v2 = w2[x2], j.compressedTexImage2D(j.TEXTURE_CUBE_MAP_POSITIVE_X + m2, x2, r2, v2.width, v2.height, 0, v2.data);
                        } else
                          j.texImage2D(j.TEXTURE_CUBE_MAP_POSITIVE_X + m2, 0, r2, r2, t2, k2[m2]);
                      c2.generateMipmaps && n2 && j.generateMipmap(j.TEXTURE_CUBE_MAP);
                      c2.needsUpdate = false;
                      if (c2.onUpdate)
                        c2.onUpdate();
                    } else
                      j.activeTexture(j.TEXTURE0 + f2), j.bindTexture(j.TEXTURE_CUBE_MAP, c2.image.__webglTextureCube);
                } else
                  r2 instanceof THREE.WebGLRenderTargetCube ? (c2 = r2, j.activeTexture(j.TEXTURE0 + k2), j.bindTexture(
                    j.TEXTURE_CUBE_MAP,
                    c2.__webglTexture
                  )) : H.setTexture(r2, k2);
            } else if ("tv" === m2) {
              void 0 === c2._array && (c2._array = []);
              m2 = 0;
              for (n2 = c2.value.length; m2 < n2; m2++)
                c2._array[m2] = D();
              j.uniform1iv(f2, c2._array);
              m2 = 0;
              for (n2 = c2.value.length; m2 < n2; m2++)
                r2 = c2.value[m2], k2 = c2._array[m2], r2 && H.setTexture(r2, k2);
            }
          }
        if ((d2 instanceof THREE.ShaderMaterial || d2 instanceof THREE.MeshPhongMaterial || d2.envMap) && null !== h2.cameraPosition)
          b2 = a2.matrixWorld.getPosition(), j.uniform3f(h2.cameraPosition, b2.x, b2.y, b2.z);
        (d2 instanceof THREE.MeshPhongMaterial || d2 instanceof THREE.MeshLambertMaterial || d2 instanceof THREE.ShaderMaterial || d2.skinning) && null !== h2.viewMatrix && j.uniformMatrix4fv(h2.viewMatrix, false, a2.matrixWorldInverse.elements);
      }
      j.uniformMatrix4fv(h2.modelViewMatrix, false, e2._modelViewMatrix.elements);
      h2.normalMatrix && j.uniformMatrix3fv(h2.normalMatrix, false, e2._normalMatrix.elements);
      null !== h2.modelMatrix && j.uniformMatrix4fv(h2.modelMatrix, false, e2.matrixWorld.elements);
      return g2;
    }
    function D() {
      var a2 = ya;
      a2 >= yc && console.warn("WebGLRenderer: trying to use " + a2 + " texture units while this GPU supports only " + yc);
      ya += 1;
      return a2;
    }
    function B(a2, b2) {
      a2._modelViewMatrix.multiply(b2.matrixWorldInverse, a2.matrixWorld);
      a2._normalMatrix.getInverse(a2._modelViewMatrix);
      a2._normalMatrix.transpose();
    }
    function z(a2, b2, c2, d2) {
      a2[b2] = c2.r * c2.r * d2;
      a2[b2 + 1] = c2.g * c2.g * d2;
      a2[b2 + 2] = c2.b * c2.b * d2;
    }
    function E(a2, b2, c2, d2) {
      a2[b2] = c2.r * d2;
      a2[b2 + 1] = c2.g * d2;
      a2[b2 + 2] = c2.b * d2;
    }
    function G(a2, b2, c2) {
      zb !== a2 && (a2 ? j.enable(j.POLYGON_OFFSET_FILL) : j.disable(j.POLYGON_OFFSET_FILL), zb = a2);
      if (a2 && (gb !== b2 || Ma !== c2))
        j.polygonOffset(b2, c2), gb = b2, Ma = c2;
    }
    function I(a2) {
      for (var a2 = a2.split("\n"), b2 = 0, c2 = a2.length; b2 < c2; b2++)
        a2[b2] = b2 + 1 + ": " + a2[b2];
      return a2.join("\n");
    }
    function Y(a2, b2) {
      var c2;
      "fragment" === a2 ? c2 = j.createShader(j.FRAGMENT_SHADER) : "vertex" === a2 && (c2 = j.createShader(j.VERTEX_SHADER));
      j.shaderSource(c2, b2);
      j.compileShader(c2);
      return !j.getShaderParameter(c2, j.COMPILE_STATUS) ? (console.error(j.getShaderInfoLog(c2)), console.error(I(b2)), null) : c2;
    }
    function C(a2, b2, c2) {
      c2 ? (j.texParameteri(a2, j.TEXTURE_WRAP_S, J(b2.wrapS)), j.texParameteri(a2, j.TEXTURE_WRAP_T, J(b2.wrapT)), j.texParameteri(a2, j.TEXTURE_MAG_FILTER, J(b2.magFilter)), j.texParameteri(
        a2,
        j.TEXTURE_MIN_FILTER,
        J(b2.minFilter)
      )) : (j.texParameteri(a2, j.TEXTURE_WRAP_S, j.CLAMP_TO_EDGE), j.texParameteri(a2, j.TEXTURE_WRAP_T, j.CLAMP_TO_EDGE), j.texParameteri(a2, j.TEXTURE_MAG_FILTER, A(b2.magFilter)), j.texParameteri(a2, j.TEXTURE_MIN_FILTER, A(b2.minFilter)));
      if (gc && b2.type !== THREE.FloatType && (1 < b2.anisotropy || b2.__oldAnisotropy))
        j.texParameterf(a2, gc.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(b2.anisotropy, zc)), b2.__oldAnisotropy = b2.anisotropy;
    }
    function P(a2, b2) {
      j.bindRenderbuffer(j.RENDERBUFFER, a2);
      b2.depthBuffer && !b2.stencilBuffer ? (j.renderbufferStorage(j.RENDERBUFFER, j.DEPTH_COMPONENT16, b2.width, b2.height), j.framebufferRenderbuffer(j.FRAMEBUFFER, j.DEPTH_ATTACHMENT, j.RENDERBUFFER, a2)) : b2.depthBuffer && b2.stencilBuffer ? (j.renderbufferStorage(j.RENDERBUFFER, j.DEPTH_STENCIL, b2.width, b2.height), j.framebufferRenderbuffer(j.FRAMEBUFFER, j.DEPTH_STENCIL_ATTACHMENT, j.RENDERBUFFER, a2)) : j.renderbufferStorage(j.RENDERBUFFER, j.RGBA4, b2.width, b2.height);
    }
    function A(a2) {
      return a2 === THREE.NearestFilter || a2 === THREE.NearestMipMapNearestFilter || a2 === THREE.NearestMipMapLinearFilter ? j.NEAREST : j.LINEAR;
    }
    function J(a2) {
      if (a2 === THREE.RepeatWrapping)
        return j.REPEAT;
      if (a2 === THREE.ClampToEdgeWrapping)
        return j.CLAMP_TO_EDGE;
      if (a2 === THREE.MirroredRepeatWrapping)
        return j.MIRRORED_REPEAT;
      if (a2 === THREE.NearestFilter)
        return j.NEAREST;
      if (a2 === THREE.NearestMipMapNearestFilter)
        return j.NEAREST_MIPMAP_NEAREST;
      if (a2 === THREE.NearestMipMapLinearFilter)
        return j.NEAREST_MIPMAP_LINEAR;
      if (a2 === THREE.LinearFilter)
        return j.LINEAR;
      if (a2 === THREE.LinearMipMapNearestFilter)
        return j.LINEAR_MIPMAP_NEAREST;
      if (a2 === THREE.LinearMipMapLinearFilter)
        return j.LINEAR_MIPMAP_LINEAR;
      if (a2 === THREE.UnsignedByteType)
        return j.UNSIGNED_BYTE;
      if (a2 === THREE.UnsignedShort4444Type)
        return j.UNSIGNED_SHORT_4_4_4_4;
      if (a2 === THREE.UnsignedShort5551Type)
        return j.UNSIGNED_SHORT_5_5_5_1;
      if (a2 === THREE.UnsignedShort565Type)
        return j.UNSIGNED_SHORT_5_6_5;
      if (a2 === THREE.ByteType)
        return j.BYTE;
      if (a2 === THREE.ShortType)
        return j.SHORT;
      if (a2 === THREE.UnsignedShortType)
        return j.UNSIGNED_SHORT;
      if (a2 === THREE.IntType)
        return j.INT;
      if (a2 === THREE.UnsignedIntType)
        return j.UNSIGNED_INT;
      if (a2 === THREE.FloatType)
        return j.FLOAT;
      if (a2 === THREE.AlphaFormat)
        return j.ALPHA;
      if (a2 === THREE.RGBFormat)
        return j.RGB;
      if (a2 === THREE.RGBAFormat)
        return j.RGBA;
      if (a2 === THREE.LuminanceFormat)
        return j.LUMINANCE;
      if (a2 === THREE.LuminanceAlphaFormat)
        return j.LUMINANCE_ALPHA;
      if (a2 === THREE.AddEquation)
        return j.FUNC_ADD;
      if (a2 === THREE.SubtractEquation)
        return j.FUNC_SUBTRACT;
      if (a2 === THREE.ReverseSubtractEquation)
        return j.FUNC_REVERSE_SUBTRACT;
      if (a2 === THREE.ZeroFactor)
        return j.ZERO;
      if (a2 === THREE.OneFactor)
        return j.ONE;
      if (a2 === THREE.SrcColorFactor)
        return j.SRC_COLOR;
      if (a2 === THREE.OneMinusSrcColorFactor)
        return j.ONE_MINUS_SRC_COLOR;
      if (a2 === THREE.SrcAlphaFactor)
        return j.SRC_ALPHA;
      if (a2 === THREE.OneMinusSrcAlphaFactor)
        return j.ONE_MINUS_SRC_ALPHA;
      if (a2 === THREE.DstAlphaFactor)
        return j.DST_ALPHA;
      if (a2 === THREE.OneMinusDstAlphaFactor)
        return j.ONE_MINUS_DST_ALPHA;
      if (a2 === THREE.DstColorFactor)
        return j.DST_COLOR;
      if (a2 === THREE.OneMinusDstColorFactor)
        return j.ONE_MINUS_DST_COLOR;
      if (a2 === THREE.SrcAlphaSaturateFactor)
        return j.SRC_ALPHA_SATURATE;
      if (void 0 !== Ob) {
        if (a2 === THREE.RGB_S3TC_DXT1_Format)
          return Ob.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (a2 === THREE.RGBA_S3TC_DXT1_Format)
          return Ob.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (a2 === THREE.RGBA_S3TC_DXT3_Format)
          return Ob.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (a2 === THREE.RGBA_S3TC_DXT5_Format)
          return Ob.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      }
      return 0;
    }
    function M(a2, b2) {
      var c2 = j.createFramebuffer(), d2 = j.createTexture();
      j.bindTexture(j.TEXTURE_2D, d2);
      j.texImage2D(j.TEXTURE_2D, 0, a2, 2, 2, 0, a2, b2, null);
      j.bindFramebuffer(j.FRAMEBUFFER, c2);
      j.framebufferTexture2D(j.FRAMEBUFFER, j.COLOR_ATTACHMENT0, j.TEXTURE_2D, d2, 0);
      c2 = j.checkFramebufferStatus(j.FRAMEBUFFER);
      j.bindFramebuffer(j.FRAMEBUFFER, null);
      j.bindTexture(j.TEXTURE_2D, null);
      return c2 === j.FRAMEBUFFER_COMPLETE;
    }
    console.log("THREE.WebGLRenderer", THREE.REVISION);
    var a = a || {}, T = void 0 !== a.canvas ? a.canvas : document.createElement("canvas"), N = void 0 !== a.precision ? a.precision : "highp", fa = void 0 !== a.alpha ? a.alpha : true, oa = void 0 !== a.premultipliedAlpha ? a.premultipliedAlpha : true, L = void 0 !== a.antialias ? a.antialias : false, Z = void 0 !== a.stencil ? a.stencil : true, eb = void 0 !== a.preserveDrawingBuffer ? a.preserveDrawingBuffer : false, Ea = void 0 !== a.clearColor ? new THREE.Color(a.clearColor) : new THREE.Color(0), jb = void 0 !== a.clearAlpha ? a.clearAlpha : 0;
    this.domElement = T;
    this.context = null;
    this.devicePixelRatio = void 0 !== a.devicePixelRatio ? a.devicePixelRatio : void 0 !== window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.autoUpdateScene = this.autoUpdateObjects = this.sortObjects = this.autoClearStencil = this.autoClearDepth = this.autoClearColor = this.autoClear = true;
    this.shadowMapEnabled = this.physicallyBasedShading = this.gammaOutput = this.gammaInput = false;
    this.shadowMapAutoUpdate = true;
    this.shadowMapType = THREE.PCFShadowMap;
    this.shadowMapCullFace = THREE.CullFaceFront;
    this.shadowMapCascade = this.shadowMapDebug = false;
    this.maxMorphTargets = 8;
    this.maxMorphNormals = 4;
    this.autoScaleCubemaps = true;
    this.renderPluginsPre = [];
    this.renderPluginsPost = [];
    this.info = { memory: { programs: 0, geometries: 0, textures: 0 }, render: { calls: 0, vertices: 0, faces: 0, points: 0 } };
    var H = this, ja = [], ha = 0, ia = null, ka = null, W = -1, ba = null, qa = null, Na = 0, ya = 0, ma = -1, sa = -1, Pa = -1, nb = -1, la = -1, fb = -1, ob = -1, pb = -1, zb = null, gb = null, Ma = null, va = null, Bb = 0, Sa = 0, Ya = 0, Za = 0, qb = 0, Cb = 0, $a = {}, Db = new THREE.Frustum(), rb = new THREE.Matrix4(), fc = new THREE.Matrix4(), Nb = new THREE.Vector3(), ta = new THREE.Vector3(), Fb = true, Hc = { ambient: [0, 0, 0], directional: { length: 0, colors: [], positions: [] }, point: { length: 0, colors: [], positions: [], distances: [] }, spot: { length: 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [] }, hemi: { length: 0, skyColors: [], groundColors: [], positions: [] } }, j, Eb, Lc, gc, Ob;
    try {
      if (!(j = T.getContext("experimental-webgl", {
        alpha: fa,
        premultipliedAlpha: oa,
        antialias: L,
        stencil: Z,
        preserveDrawingBuffer: eb
      })))
        throw "Error creating WebGL context.";
    } catch (dd) {
      console.error(dd);
    }
    Eb = j.getExtension("OES_texture_float");
    Lc = j.getExtension("OES_standard_derivatives");
    gc = j.getExtension("EXT_texture_filter_anisotropic") || j.getExtension("MOZ_EXT_texture_filter_anisotropic") || j.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    Ob = j.getExtension("WEBGL_compressed_texture_s3tc") || j.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || j.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
    Eb || console.log("THREE.WebGLRenderer: Float textures not supported.");
    Lc || console.log("THREE.WebGLRenderer: Standard derivatives not supported.");
    gc || console.log("THREE.WebGLRenderer: Anisotropic texture filtering not supported.");
    Ob || console.log("THREE.WebGLRenderer: S3TC compressed textures not supported.");
    j.clearColor(0, 0, 0, 1);
    j.clearDepth(1);
    j.clearStencil(0);
    j.enable(j.DEPTH_TEST);
    j.depthFunc(j.LEQUAL);
    j.frontFace(j.CCW);
    j.cullFace(j.BACK);
    j.enable(j.CULL_FACE);
    j.enable(j.BLEND);
    j.blendEquation(j.FUNC_ADD);
    j.blendFunc(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA);
    j.clearColor(Ea.r, Ea.g, Ea.b, jb);
    this.context = j;
    var yc = j.getParameter(j.MAX_TEXTURE_IMAGE_UNITS), cd = j.getParameter(j.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    j.getParameter(j.MAX_TEXTURE_SIZE);
    var bd = j.getParameter(j.MAX_CUBE_MAP_TEXTURE_SIZE), zc = gc ? j.getParameter(gc.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0, ab = 0 < cd, tb = ab && Eb;
    Ob && j.getParameter(j.COMPRESSED_TEXTURE_FORMATS);
    var Pb = j.getShaderPrecisionFormat(j.VERTEX_SHADER, j.HIGH_FLOAT), V = j.getShaderPrecisionFormat(
      j.VERTEX_SHADER,
      j.MEDIUM_FLOAT
    );
    j.getShaderPrecisionFormat(j.VERTEX_SHADER, j.LOW_FLOAT);
    var $ = j.getShaderPrecisionFormat(j.FRAGMENT_SHADER, j.HIGH_FLOAT), ga = j.getShaderPrecisionFormat(j.FRAGMENT_SHADER, j.MEDIUM_FLOAT);
    j.getShaderPrecisionFormat(j.FRAGMENT_SHADER, j.LOW_FLOAT);
    j.getShaderPrecisionFormat(j.VERTEX_SHADER, j.HIGH_INT);
    j.getShaderPrecisionFormat(j.VERTEX_SHADER, j.MEDIUM_INT);
    j.getShaderPrecisionFormat(j.VERTEX_SHADER, j.LOW_INT);
    j.getShaderPrecisionFormat(j.FRAGMENT_SHADER, j.HIGH_INT);
    j.getShaderPrecisionFormat(
      j.FRAGMENT_SHADER,
      j.MEDIUM_INT
    );
    j.getShaderPrecisionFormat(j.FRAGMENT_SHADER, j.LOW_INT);
    var Ha = Eb && M(j.RGB, j.FLOAT), Va = Eb && M(j.RGBA, j.FLOAT), Qa = Eb && M(j.LUMINANCE, j.FLOAT), kb = Eb && M(j.ALPHA, j.FLOAT), Ua = Eb && M(j.LUMINANCE_ALPHA, j.FLOAT), ub = 0 < Pb.precision && 0 < $.precision, Kb = 0 < V.precision && 0 < ga.precision;
    "highp" === N && !ub && (Kb ? (N = "mediump", console.warn("WebGLRenderer: highp not supported, using mediump")) : (N = "lowp", console.warn("WebGLRenderer: highp and mediump not supported, using lowp")));
    "mediump" === N && !Kb && (N = "lowp", console.warn("WebGLRenderer: mediump not supported, using lowp"));
    this.getContext = function() {
      return j;
    };
    this.supportsVertexTextures = function() {
      return ab;
    };
    this.supportsLuminanceFloatRenderTarget = function() {
      return Qa;
    };
    this.supportsAlphaFloatRenderTarget = function() {
      return kb;
    };
    this.supportsLuminanceAlphaFloatRenderTarget = function() {
      return Ua;
    };
    this.supportsRGBFloatRenderTarget = function() {
      return Ha;
    };
    this.supportsRGBAFloatRenderTarget = function() {
      return Va;
    };
    this.getMaxAnisotropy = function() {
      return zc;
    };
    this.getPrecision = function() {
      return N;
    };
    this.setSize = function(a2, b2) {
      T.width = a2 * this.devicePixelRatio;
      T.height = b2 * this.devicePixelRatio;
      T.style.width = a2 + "px";
      T.style.height = b2 + "px";
      this.setViewport(0, 0, T.width, T.height);
    };
    this.setViewport = function(a2, b2, c2, d2) {
      Bb = void 0 !== a2 ? a2 : 0;
      Sa = void 0 !== b2 ? b2 : 0;
      Ya = void 0 !== c2 ? c2 : T.width;
      Za = void 0 !== d2 ? d2 : T.height;
      j.viewport(Bb, Sa, Ya, Za);
    };
    this.setScissor = function(a2, b2, c2, d2) {
      j.scissor(a2, b2, c2, d2);
    };
    this.enableScissorTest = function(a2) {
      a2 ? j.enable(j.SCISSOR_TEST) : j.disable(j.SCISSOR_TEST);
    };
    this.setClearColorHex = function(a2, b2) {
      Ea.setHex(a2);
      jb = b2;
      j.clearColor(
        Ea.r,
        Ea.g,
        Ea.b,
        jb
      );
    };
    this.setClearColor = function(a2, b2) {
      Ea.copy(a2);
      jb = b2;
      j.clearColor(Ea.r, Ea.g, Ea.b, jb);
    };
    this.getClearColor = function() {
      return Ea;
    };
    this.getClearAlpha = function() {
      return jb;
    };
    this.clear = function(a2, b2, c2) {
      var d2 = 0;
      if (void 0 === a2 || a2)
        d2 |= j.COLOR_BUFFER_BIT;
      if (void 0 === b2 || b2)
        d2 |= j.DEPTH_BUFFER_BIT;
      if (void 0 === c2 || c2)
        d2 |= j.STENCIL_BUFFER_BIT;
      j.clear(d2);
    };
    this.clearTarget = function(a2, b2, c2, d2) {
      this.setRenderTarget(a2);
      this.clear(b2, c2, d2);
    };
    this.addPostPlugin = function(a2) {
      a2.init(this);
      this.renderPluginsPost.push(a2);
    };
    this.addPrePlugin = function(a2) {
      a2.init(this);
      this.renderPluginsPre.push(a2);
    };
    this.updateShadowMap = function(a2, b2) {
      ia = null;
      W = ba = pb = ob = Pa = -1;
      Fb = true;
      sa = ma = -1;
      this.shadowMapPlugin.update(a2, b2);
    };
    var od = function(a2) {
      a2 = a2.target;
      a2.removeEventListener("dispose", od);
      a2.__webglInit = void 0;
      void 0 !== a2.__webglVertexBuffer && j.deleteBuffer(a2.__webglVertexBuffer);
      void 0 !== a2.__webglNormalBuffer && j.deleteBuffer(a2.__webglNormalBuffer);
      void 0 !== a2.__webglTangentBuffer && j.deleteBuffer(a2.__webglTangentBuffer);
      void 0 !== a2.__webglColorBuffer && j.deleteBuffer(a2.__webglColorBuffer);
      void 0 !== a2.__webglUVBuffer && j.deleteBuffer(a2.__webglUVBuffer);
      void 0 !== a2.__webglUV2Buffer && j.deleteBuffer(a2.__webglUV2Buffer);
      void 0 !== a2.__webglSkinIndicesBuffer && j.deleteBuffer(a2.__webglSkinIndicesBuffer);
      void 0 !== a2.__webglSkinWeightsBuffer && j.deleteBuffer(a2.__webglSkinWeightsBuffer);
      void 0 !== a2.__webglFaceBuffer && j.deleteBuffer(a2.__webglFaceBuffer);
      void 0 !== a2.__webglLineBuffer && j.deleteBuffer(a2.__webglLineBuffer);
      void 0 !== a2.__webglLineDistanceBuffer && j.deleteBuffer(a2.__webglLineDistanceBuffer);
      if (void 0 !== a2.geometryGroups)
        for (var c2 in a2.geometryGroups) {
          var d2 = a2.geometryGroups[c2];
          if (void 0 !== d2.numMorphTargets)
            for (var e2 = 0, f2 = d2.numMorphTargets; e2 < f2; e2++)
              j.deleteBuffer(d2.__webglMorphTargetsBuffers[e2]);
          if (void 0 !== d2.numMorphNormals) {
            e2 = 0;
            for (f2 = d2.numMorphNormals; e2 < f2; e2++)
              j.deleteBuffer(d2.__webglMorphNormalsBuffers[e2]);
          }
          b(d2);
        }
      b(a2);
      H.info.memory.geometries--;
    }, xc = function(a2) {
      a2 = a2.target;
      a2.removeEventListener("dispose", xc);
      a2.image && a2.image.__webglTextureCube ? j.deleteTexture(a2.image.__webglTextureCube) : a2.__webglInit && (a2.__webglInit = false, j.deleteTexture(a2.__webglTexture));
      H.info.memory.textures--;
    }, Ic = function(a2) {
      a2 = a2.target;
      a2.removeEventListener("dispose", Ic);
      if (a2 && a2.__webglTexture)
        if (j.deleteTexture(a2.__webglTexture), a2 instanceof THREE.WebGLRenderTargetCube)
          for (var b2 = 0; 6 > b2; b2++)
            j.deleteFramebuffer(a2.__webglFramebuffer[b2]), j.deleteRenderbuffer(a2.__webglRenderbuffer[b2]);
        else
          j.deleteFramebuffer(a2.__webglFramebuffer), j.deleteRenderbuffer(a2.__webglRenderbuffer);
      H.info.memory.textures--;
    }, Jc = function(a2) {
      a2 = a2.target;
      a2.removeEventListener(
        "dispose",
        Jc
      );
      Kc(a2);
    }, Kc = function(a2) {
      var b2 = a2.program;
      if (void 0 !== b2) {
        a2.program = void 0;
        var c2, d2, e2 = false, a2 = 0;
        for (c2 = ja.length; a2 < c2; a2++)
          if (d2 = ja[a2], d2.program === b2) {
            d2.usedTimes--;
            0 === d2.usedTimes && (e2 = true);
            break;
          }
        if (true === e2) {
          e2 = [];
          a2 = 0;
          for (c2 = ja.length; a2 < c2; a2++)
            d2 = ja[a2], d2.program !== b2 && e2.push(d2);
          ja = e2;
          j.deleteProgram(b2);
          H.info.memory.programs--;
        }
      }
    };
    this.renderBufferImmediate = function(a2, b2, c2) {
      a2.hasPositions && !a2.__webglVertexBuffer && (a2.__webglVertexBuffer = j.createBuffer());
      a2.hasNormals && !a2.__webglNormalBuffer && (a2.__webglNormalBuffer = j.createBuffer());
      a2.hasUvs && !a2.__webglUvBuffer && (a2.__webglUvBuffer = j.createBuffer());
      a2.hasColors && !a2.__webglColorBuffer && (a2.__webglColorBuffer = j.createBuffer());
      a2.hasPositions && (j.bindBuffer(j.ARRAY_BUFFER, a2.__webglVertexBuffer), j.bufferData(j.ARRAY_BUFFER, a2.positionArray, j.DYNAMIC_DRAW), j.enableVertexAttribArray(b2.attributes.position), j.vertexAttribPointer(b2.attributes.position, 3, j.FLOAT, false, 0, 0));
      if (a2.hasNormals) {
        j.bindBuffer(j.ARRAY_BUFFER, a2.__webglNormalBuffer);
        if (c2.shading === THREE.FlatShading) {
          var d2, e2, f2, g2, h2, i2, k2, m2, l2, n2, p2, q2 = 3 * a2.count;
          for (p2 = 0; p2 < q2; p2 += 9)
            n2 = a2.normalArray, d2 = n2[p2], e2 = n2[p2 + 1], f2 = n2[p2 + 2], g2 = n2[p2 + 3], i2 = n2[p2 + 4], m2 = n2[p2 + 5], h2 = n2[p2 + 6], k2 = n2[p2 + 7], l2 = n2[p2 + 8], d2 = (d2 + g2 + h2) / 3, e2 = (e2 + i2 + k2) / 3, f2 = (f2 + m2 + l2) / 3, n2[p2] = d2, n2[p2 + 1] = e2, n2[p2 + 2] = f2, n2[p2 + 3] = d2, n2[p2 + 4] = e2, n2[p2 + 5] = f2, n2[p2 + 6] = d2, n2[p2 + 7] = e2, n2[p2 + 8] = f2;
        }
        j.bufferData(j.ARRAY_BUFFER, a2.normalArray, j.DYNAMIC_DRAW);
        j.enableVertexAttribArray(b2.attributes.normal);
        j.vertexAttribPointer(b2.attributes.normal, 3, j.FLOAT, false, 0, 0);
      }
      a2.hasUvs && c2.map && (j.bindBuffer(j.ARRAY_BUFFER, a2.__webglUvBuffer), j.bufferData(
        j.ARRAY_BUFFER,
        a2.uvArray,
        j.DYNAMIC_DRAW
      ), j.enableVertexAttribArray(b2.attributes.uv), j.vertexAttribPointer(b2.attributes.uv, 2, j.FLOAT, false, 0, 0));
      a2.hasColors && c2.vertexColors !== THREE.NoColors && (j.bindBuffer(j.ARRAY_BUFFER, a2.__webglColorBuffer), j.bufferData(j.ARRAY_BUFFER, a2.colorArray, j.DYNAMIC_DRAW), j.enableVertexAttribArray(b2.attributes.color), j.vertexAttribPointer(b2.attributes.color, 3, j.FLOAT, false, 0, 0));
      j.drawArrays(j.TRIANGLES, 0, a2.count);
      a2.count = 0;
    };
    this.renderBufferDirect = function(a2, b2, c2, d2, e2, f2) {
      if (false !== d2.visible)
        if (c2 = K(a2, b2, c2, d2, f2), a2 = c2.attributes, b2 = false, d2 = 16777215 * e2.id + 2 * c2.id + (d2.wireframe ? 1 : 0), d2 !== ba && (ba = d2, b2 = true), b2 && l(), f2 instanceof THREE.Mesh)
          if (f2 = e2.attributes.index) {
            d2 = e2.offsets;
            1 < d2.length && (b2 = true);
            for (var c2 = 0, g2 = d2.length; c2 < g2; c2++) {
              var h2 = d2[c2].index;
              if (b2) {
                var i2 = e2.attributes.position, m2 = i2.itemSize;
                j.bindBuffer(j.ARRAY_BUFFER, i2.buffer);
                k(a2.position);
                j.vertexAttribPointer(a2.position, m2, j.FLOAT, false, 0, 4 * h2 * m2);
                m2 = e2.attributes.normal;
                if (0 <= a2.normal && m2) {
                  var n2 = m2.itemSize;
                  j.bindBuffer(j.ARRAY_BUFFER, m2.buffer);
                  k(a2.normal);
                  j.vertexAttribPointer(
                    a2.normal,
                    n2,
                    j.FLOAT,
                    false,
                    0,
                    4 * h2 * n2
                  );
                }
                m2 = e2.attributes.uv;
                0 <= a2.uv && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.uv), j.vertexAttribPointer(a2.uv, n2, j.FLOAT, false, 0, 4 * h2 * n2));
                m2 = e2.attributes.color;
                0 <= a2.color && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.color), j.vertexAttribPointer(a2.color, n2, j.FLOAT, false, 0, 4 * h2 * n2));
                m2 = e2.attributes.tangent;
                0 <= a2.tangent && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.tangent), j.vertexAttribPointer(a2.tangent, n2, j.FLOAT, false, 0, 4 * h2 * n2));
                j.bindBuffer(
                  j.ELEMENT_ARRAY_BUFFER,
                  f2.buffer
                );
              }
              j.drawElements(j.TRIANGLES, d2[c2].count, j.UNSIGNED_SHORT, 2 * d2[c2].start);
              H.info.render.calls++;
              H.info.render.vertices += d2[c2].count;
              H.info.render.faces += d2[c2].count / 3;
            }
          } else
            b2 && (i2 = e2.attributes.position, m2 = i2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, i2.buffer), k(a2.position), j.vertexAttribPointer(a2.position, m2, j.FLOAT, false, 0, 0), m2 = e2.attributes.normal, 0 <= a2.normal && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.normal), j.vertexAttribPointer(a2.normal, n2, j.FLOAT, false, 0, 0)), m2 = e2.attributes.uv, 0 <= a2.uv && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.uv), j.vertexAttribPointer(a2.uv, n2, j.FLOAT, false, 0, 0)), m2 = e2.attributes.color, 0 <= a2.color && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.color), j.vertexAttribPointer(a2.color, n2, j.FLOAT, false, 0, 0)), m2 = e2.attributes.tangent, 0 <= a2.tangent && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.tangent), j.vertexAttribPointer(a2.tangent, n2, j.FLOAT, false, 0, 0))), j.drawArrays(j.TRIANGLES, 0, i2.numItems / 3), H.info.render.calls++, H.info.render.vertices += i2.numItems / 3, H.info.render.faces += i2.numItems / 3 / 3;
        else
          f2 instanceof THREE.ParticleSystem && b2 && (i2 = e2.attributes.position, m2 = i2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, i2.buffer), k(a2.position), j.vertexAttribPointer(a2.position, m2, j.FLOAT, false, 0, 0), m2 = e2.attributes.color, 0 <= a2.color && m2 && (n2 = m2.itemSize, j.bindBuffer(j.ARRAY_BUFFER, m2.buffer), k(a2.color), j.vertexAttribPointer(a2.color, n2, j.FLOAT, false, 0, 0)), j.drawArrays(j.POINTS, 0, i2.numItems / 3), H.info.render.calls++, H.info.render.points += i2.numItems / 3);
    };
    this.renderBuffer = function(a2, b2, c2, d2, e2, f2) {
      if (false !== d2.visible) {
        var g2, h2, c2 = K(a2, b2, c2, d2, f2), b2 = c2.attributes, a2 = false, c2 = 16777215 * e2.id + 2 * c2.id + (d2.wireframe ? 1 : 0);
        c2 !== ba && (ba = c2, a2 = true);
        a2 && l();
        if (!d2.morphTargets && 0 <= b2.position)
          a2 && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglVertexBuffer), k(b2.position), j.vertexAttribPointer(b2.position, 3, j.FLOAT, false, 0, 0));
        else if (f2.morphTargetBase) {
          c2 = d2.program.attributes;
          -1 !== f2.morphTargetBase && 0 <= c2.position ? (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglMorphTargetsBuffers[f2.morphTargetBase]), k(c2.position), j.vertexAttribPointer(
            c2.position,
            3,
            j.FLOAT,
            false,
            0,
            0
          )) : 0 <= c2.position && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglVertexBuffer), k(c2.position), j.vertexAttribPointer(c2.position, 3, j.FLOAT, false, 0, 0));
          if (f2.morphTargetForcedOrder.length) {
            var i2 = 0;
            h2 = f2.morphTargetForcedOrder;
            for (g2 = f2.morphTargetInfluences; i2 < d2.numSupportedMorphTargets && i2 < h2.length; )
              0 <= c2["morphTarget" + i2] && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglMorphTargetsBuffers[h2[i2]]), k(c2["morphTarget" + i2]), j.vertexAttribPointer(c2["morphTarget" + i2], 3, j.FLOAT, false, 0, 0)), 0 <= c2["morphNormal" + i2] && d2.morphNormals && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglMorphNormalsBuffers[h2[i2]]), k(c2["morphNormal" + i2]), j.vertexAttribPointer(c2["morphNormal" + i2], 3, j.FLOAT, false, 0, 0)), f2.__webglMorphTargetInfluences[i2] = g2[h2[i2]], i2++;
          } else {
            h2 = [];
            g2 = f2.morphTargetInfluences;
            var m2, n2 = g2.length;
            for (m2 = 0; m2 < n2; m2++)
              i2 = g2[m2], 0 < i2 && h2.push([i2, m2]);
            h2.length > d2.numSupportedMorphTargets ? (h2.sort(p), h2.length = d2.numSupportedMorphTargets) : h2.length > d2.numSupportedMorphNormals ? h2.sort(p) : 0 === h2.length && h2.push([0, 0]);
            for (i2 = 0; i2 < d2.numSupportedMorphTargets; )
              h2[i2] ? (m2 = h2[i2][1], 0 <= c2["morphTarget" + i2] && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglMorphTargetsBuffers[m2]), k(c2["morphTarget" + i2]), j.vertexAttribPointer(c2["morphTarget" + i2], 3, j.FLOAT, false, 0, 0)), 0 <= c2["morphNormal" + i2] && d2.morphNormals && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglMorphNormalsBuffers[m2]), k(c2["morphNormal" + i2]), j.vertexAttribPointer(c2["morphNormal" + i2], 3, j.FLOAT, false, 0, 0)), f2.__webglMorphTargetInfluences[i2] = g2[m2]) : f2.__webglMorphTargetInfluences[i2] = 0, i2++;
          }
          null !== d2.program.uniforms.morphTargetInfluences && j.uniform1fv(
            d2.program.uniforms.morphTargetInfluences,
            f2.__webglMorphTargetInfluences
          );
        }
        if (a2) {
          if (e2.__webglCustomAttributesList) {
            g2 = 0;
            for (h2 = e2.__webglCustomAttributesList.length; g2 < h2; g2++)
              c2 = e2.__webglCustomAttributesList[g2], 0 <= b2[c2.buffer.belongsToAttribute] && (j.bindBuffer(j.ARRAY_BUFFER, c2.buffer), k(b2[c2.buffer.belongsToAttribute]), j.vertexAttribPointer(b2[c2.buffer.belongsToAttribute], c2.size, j.FLOAT, false, 0, 0));
          }
          0 <= b2.color && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglColorBuffer), k(b2.color), j.vertexAttribPointer(b2.color, 3, j.FLOAT, false, 0, 0));
          0 <= b2.normal && (j.bindBuffer(
            j.ARRAY_BUFFER,
            e2.__webglNormalBuffer
          ), k(b2.normal), j.vertexAttribPointer(b2.normal, 3, j.FLOAT, false, 0, 0));
          0 <= b2.tangent && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglTangentBuffer), k(b2.tangent), j.vertexAttribPointer(b2.tangent, 4, j.FLOAT, false, 0, 0));
          0 <= b2.uv && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglUVBuffer), k(b2.uv), j.vertexAttribPointer(b2.uv, 2, j.FLOAT, false, 0, 0));
          0 <= b2.uv2 && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglUV2Buffer), k(b2.uv2), j.vertexAttribPointer(b2.uv2, 2, j.FLOAT, false, 0, 0));
          d2.skinning && (0 <= b2.skinIndex && 0 <= b2.skinWeight) && (j.bindBuffer(
            j.ARRAY_BUFFER,
            e2.__webglSkinIndicesBuffer
          ), k(b2.skinIndex), j.vertexAttribPointer(b2.skinIndex, 4, j.FLOAT, false, 0, 0), j.bindBuffer(j.ARRAY_BUFFER, e2.__webglSkinWeightsBuffer), k(b2.skinWeight), j.vertexAttribPointer(b2.skinWeight, 4, j.FLOAT, false, 0, 0));
          0 <= b2.lineDistance && (j.bindBuffer(j.ARRAY_BUFFER, e2.__webglLineDistanceBuffer), k(b2.lineDistance), j.vertexAttribPointer(b2.lineDistance, 1, j.FLOAT, false, 0, 0));
        }
        f2 instanceof THREE.Mesh ? (d2.wireframe ? (d2 = d2.wireframeLinewidth, d2 !== va && (j.lineWidth(d2), va = d2), a2 && j.bindBuffer(
          j.ELEMENT_ARRAY_BUFFER,
          e2.__webglLineBuffer
        ), j.drawElements(j.LINES, e2.__webglLineCount, j.UNSIGNED_SHORT, 0)) : (a2 && j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, e2.__webglFaceBuffer), j.drawElements(j.TRIANGLES, e2.__webglFaceCount, j.UNSIGNED_SHORT, 0)), H.info.render.calls++, H.info.render.vertices += e2.__webglFaceCount, H.info.render.faces += e2.__webglFaceCount / 3) : f2 instanceof THREE.Line ? (f2 = f2.type === THREE.LineStrip ? j.LINE_STRIP : j.LINES, d2 = d2.linewidth, d2 !== va && (j.lineWidth(d2), va = d2), j.drawArrays(f2, 0, e2.__webglLineCount), H.info.render.calls++) : f2 instanceof THREE.ParticleSystem ? (j.drawArrays(j.POINTS, 0, e2.__webglParticleCount), H.info.render.calls++, H.info.render.points += e2.__webglParticleCount) : f2 instanceof THREE.Ribbon && (j.drawArrays(j.TRIANGLE_STRIP, 0, e2.__webglVertexCount), H.info.render.calls++);
      }
    };
    this.render = function(a2, b2, c2, d2) {
      if (false === b2 instanceof THREE.Camera)
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
      else {
        var e2, f2, g2, h2, i2 = a2.__lights, k2 = a2.fog;
        W = -1;
        Fb = true;
        this.autoUpdateScene && a2.updateMatrixWorld();
        void 0 === b2.parent && b2.updateMatrixWorld();
        b2.matrixWorldInverse.getInverse(b2.matrixWorld);
        rb.multiply(b2.projectionMatrix, b2.matrixWorldInverse);
        Db.setFromMatrix(rb);
        this.autoUpdateObjects && this.initWebGLObjects(a2);
        s(this.renderPluginsPre, a2, b2);
        H.info.render.calls = 0;
        H.info.render.vertices = 0;
        H.info.render.faces = 0;
        H.info.render.points = 0;
        this.setRenderTarget(c2);
        (this.autoClear || d2) && this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
        h2 = a2.__webglObjects;
        d2 = 0;
        for (e2 = h2.length; d2 < e2; d2++)
          if (f2 = h2[d2], g2 = f2.object, f2.render = false, g2.visible && (!(g2 instanceof THREE.Mesh || g2 instanceof THREE.ParticleSystem) || !g2.frustumCulled || Db.contains(g2))) {
            B(g2, b2);
            var l2 = f2, p2 = l2.buffer, r2 = void 0, t2 = r2 = void 0, t2 = l2.object.material;
            if (t2 instanceof THREE.MeshFaceMaterial)
              r2 = p2.materialIndex, r2 = t2.materials[r2], r2.transparent ? (l2.transparent = r2, l2.opaque = null) : (l2.opaque = r2, l2.transparent = null);
            else if (r2 = t2)
              r2.transparent ? (l2.transparent = r2, l2.opaque = null) : (l2.opaque = r2, l2.transparent = null);
            f2.render = true;
            true === this.sortObjects && (null !== g2.renderDepth ? f2.z = g2.renderDepth : (Nb.copy(g2.matrixWorld.getPosition()), rb.multiplyVector3(Nb), f2.z = Nb.z), f2.id = g2.id);
          }
        this.sortObjects && h2.sort(m);
        h2 = a2.__webglObjectsImmediate;
        d2 = 0;
        for (e2 = h2.length; d2 < e2; d2++)
          f2 = h2[d2], g2 = f2.object, g2.visible && (B(g2, b2), g2 = f2.object.material, g2.transparent ? (f2.transparent = g2, f2.opaque = null) : (f2.opaque = g2, f2.transparent = null));
        a2.overrideMaterial ? (d2 = a2.overrideMaterial, this.setBlending(d2.blending, d2.blendEquation, d2.blendSrc, d2.blendDst), this.setDepthTest(d2.depthTest), this.setDepthWrite(d2.depthWrite), G(d2.polygonOffset, d2.polygonOffsetFactor, d2.polygonOffsetUnits), q(
          a2.__webglObjects,
          false,
          "",
          b2,
          i2,
          k2,
          true,
          d2
        ), n(a2.__webglObjectsImmediate, "", b2, i2, k2, false, d2)) : (d2 = null, this.setBlending(THREE.NoBlending), q(a2.__webglObjects, true, "opaque", b2, i2, k2, false, d2), n(a2.__webglObjectsImmediate, "opaque", b2, i2, k2, false, d2), q(a2.__webglObjects, false, "transparent", b2, i2, k2, true, d2), n(a2.__webglObjectsImmediate, "transparent", b2, i2, k2, true, d2));
        s(this.renderPluginsPost, a2, b2);
        c2 && (c2.generateMipmaps && c2.minFilter !== THREE.NearestFilter && c2.minFilter !== THREE.LinearFilter) && (c2 instanceof THREE.WebGLRenderTargetCube ? (j.bindTexture(j.TEXTURE_CUBE_MAP, c2.__webglTexture), j.generateMipmap(j.TEXTURE_CUBE_MAP), j.bindTexture(j.TEXTURE_CUBE_MAP, null)) : (j.bindTexture(j.TEXTURE_2D, c2.__webglTexture), j.generateMipmap(j.TEXTURE_2D), j.bindTexture(j.TEXTURE_2D, null)));
        this.setDepthTest(true);
        this.setDepthWrite(true);
      }
    };
    this.renderImmediateObject = function(a2, b2, c2, d2, e2) {
      var f2 = K(a2, b2, c2, d2, e2);
      ba = -1;
      H.setMaterialFaces(d2);
      e2.immediateRenderCallback ? e2.immediateRenderCallback(f2, j, Db) : e2.render(function(a3) {
        H.renderBufferImmediate(a3, f2, d2);
      });
    };
    this.initWebGLObjects = function(a2) {
      a2.__webglObjects || (a2.__webglObjects = [], a2.__webglObjectsImmediate = [], a2.__webglSprites = [], a2.__webglFlares = []);
      for (; a2.__objectsAdded.length; ) {
        var b2 = a2.__objectsAdded[0], k2 = a2, m2 = void 0, l2 = void 0, n2 = void 0, q2 = void 0;
        if (!b2.__webglInit) {
          if (b2.__webglInit = true, b2._modelViewMatrix = new THREE.Matrix4(), b2._normalMatrix = new THREE.Matrix3(), void 0 !== b2.geometry && void 0 === b2.geometry.__webglInit && (b2.geometry.__webglInit = true, b2.geometry.addEventListener("dispose", od)), b2 instanceof THREE.Mesh)
            if (l2 = b2.geometry, n2 = b2.material, l2 instanceof THREE.Geometry) {
              if (void 0 === l2.geometryGroups) {
                var s2 = l2, z2 = void 0, A2 = void 0, B2 = void 0, C2 = void 0, E2 = void 0, D2 = void 0, G2 = {}, I2 = s2.morphTargets.length, J2 = s2.morphNormals.length, K2 = n2 instanceof THREE.MeshFaceMaterial;
                s2.geometryGroups = {};
                z2 = 0;
                for (A2 = s2.faces.length; z2 < A2; z2++)
                  B2 = s2.faces[z2], C2 = K2 ? B2.materialIndex : 0, void 0 === G2[C2] && (G2[C2] = { hash: C2, counter: 0 }), D2 = G2[C2].hash + "_" + G2[C2].counter, void 0 === s2.geometryGroups[D2] && (s2.geometryGroups[D2] = { faces3: [], faces4: [], materialIndex: C2, vertices: 0, numMorphTargets: I2, numMorphNormals: J2 }), E2 = B2 instanceof THREE.Face3 ? 3 : 4, 65535 < s2.geometryGroups[D2].vertices + E2 && (G2[C2].counter += 1, D2 = G2[C2].hash + "_" + G2[C2].counter, void 0 === s2.geometryGroups[D2] && (s2.geometryGroups[D2] = { faces3: [], faces4: [], materialIndex: C2, vertices: 0, numMorphTargets: I2, numMorphNormals: J2 })), B2 instanceof THREE.Face3 ? s2.geometryGroups[D2].faces3.push(z2) : s2.geometryGroups[D2].faces4.push(z2), s2.geometryGroups[D2].vertices += E2;
                s2.geometryGroupsList = [];
                var M2 = void 0;
                for (M2 in s2.geometryGroups)
                  s2.geometryGroups[M2].id = Na++, s2.geometryGroupsList.push(s2.geometryGroups[M2]);
              }
              for (m2 in l2.geometryGroups)
                if (q2 = l2.geometryGroups[m2], !q2.__webglVertexBuffer) {
                  var L2 = q2;
                  L2.__webglVertexBuffer = j.createBuffer();
                  L2.__webglNormalBuffer = j.createBuffer();
                  L2.__webglTangentBuffer = j.createBuffer();
                  L2.__webglColorBuffer = j.createBuffer();
                  L2.__webglUVBuffer = j.createBuffer();
                  L2.__webglUV2Buffer = j.createBuffer();
                  L2.__webglSkinIndicesBuffer = j.createBuffer();
                  L2.__webglSkinWeightsBuffer = j.createBuffer();
                  L2.__webglFaceBuffer = j.createBuffer();
                  L2.__webglLineBuffer = j.createBuffer();
                  var N2 = void 0, W2 = void 0;
                  if (L2.numMorphTargets) {
                    L2.__webglMorphTargetsBuffers = [];
                    N2 = 0;
                    for (W2 = L2.numMorphTargets; N2 < W2; N2++)
                      L2.__webglMorphTargetsBuffers.push(j.createBuffer());
                  }
                  if (L2.numMorphNormals) {
                    L2.__webglMorphNormalsBuffers = [];
                    N2 = 0;
                    for (W2 = L2.numMorphNormals; N2 < W2; N2++)
                      L2.__webglMorphNormalsBuffers.push(j.createBuffer());
                  }
                  H.info.memory.geometries++;
                  d(q2, b2);
                  l2.verticesNeedUpdate = true;
                  l2.morphTargetsNeedUpdate = true;
                  l2.elementsNeedUpdate = true;
                  l2.uvsNeedUpdate = true;
                  l2.normalsNeedUpdate = true;
                  l2.tangentsNeedUpdate = true;
                  l2.colorsNeedUpdate = true;
                }
            } else
              l2 instanceof THREE.BufferGeometry && h(l2);
          else if (b2 instanceof THREE.Ribbon) {
            if (l2 = b2.geometry, !l2.__webglVertexBuffer) {
              var ba2 = l2;
              ba2.__webglVertexBuffer = j.createBuffer();
              ba2.__webglColorBuffer = j.createBuffer();
              ba2.__webglNormalBuffer = j.createBuffer();
              H.info.memory.geometries++;
              var P2 = l2, ja2 = b2, T2 = P2.vertices.length;
              P2.__vertexArray = new Float32Array(3 * T2);
              P2.__colorArray = new Float32Array(3 * T2);
              P2.__normalArray = new Float32Array(3 * T2);
              P2.__webglVertexCount = T2;
              c(P2, ja2);
              l2.verticesNeedUpdate = true;
              l2.colorsNeedUpdate = true;
              l2.normalsNeedUpdate = true;
            }
          } else if (b2 instanceof THREE.Line) {
            if (l2 = b2.geometry, !l2.__webglVertexBuffer) {
              var V2 = l2;
              V2.__webglVertexBuffer = j.createBuffer();
              V2.__webglColorBuffer = j.createBuffer();
              V2.__webglLineDistanceBuffer = j.createBuffer();
              H.info.memory.geometries++;
              var ha2 = l2, Y2 = b2, ia2 = ha2.vertices.length;
              ha2.__vertexArray = new Float32Array(3 * ia2);
              ha2.__colorArray = new Float32Array(3 * ia2);
              ha2.__lineDistanceArray = new Float32Array(1 * ia2);
              ha2.__webglLineCount = ia2;
              c(ha2, Y2);
              l2.verticesNeedUpdate = true;
              l2.colorsNeedUpdate = true;
              l2.lineDistancesNeedUpdate = true;
            }
          } else if (b2 instanceof THREE.ParticleSystem && (l2 = b2.geometry, !l2.__webglVertexBuffer))
            if (l2 instanceof THREE.Geometry) {
              var Z2 = l2;
              Z2.__webglVertexBuffer = j.createBuffer();
              Z2.__webglColorBuffer = j.createBuffer();
              H.info.memory.geometries++;
              var ka2 = l2, qa2 = b2, fa2 = ka2.vertices.length;
              ka2.__vertexArray = new Float32Array(3 * fa2);
              ka2.__colorArray = new Float32Array(3 * fa2);
              ka2.__sortArray = [];
              ka2.__webglParticleCount = fa2;
              c(ka2, qa2);
              l2.verticesNeedUpdate = true;
              l2.colorsNeedUpdate = true;
            } else
              l2 instanceof THREE.BufferGeometry && h(l2);
        }
        if (!b2.__webglActive) {
          if (b2 instanceof THREE.Mesh)
            if (l2 = b2.geometry, l2 instanceof THREE.BufferGeometry)
              r(
                k2.__webglObjects,
                l2,
                b2
              );
            else
              for (m2 in l2.geometryGroups)
                q2 = l2.geometryGroups[m2], r(k2.__webglObjects, q2, b2);
          else
            b2 instanceof THREE.Ribbon || b2 instanceof THREE.Line || b2 instanceof THREE.ParticleSystem ? (l2 = b2.geometry, r(k2.__webglObjects, l2, b2)) : b2 instanceof THREE.ImmediateRenderObject || b2.immediateRenderCallback ? k2.__webglObjectsImmediate.push({ object: b2, opaque: null, transparent: null }) : b2 instanceof THREE.Sprite ? k2.__webglSprites.push(b2) : b2 instanceof THREE.LensFlare && k2.__webglFlares.push(b2);
          b2.__webglActive = true;
        }
        a2.__objectsAdded.splice(
          0,
          1
        );
      }
      for (; a2.__objectsRemoved.length; ) {
        var $2 = a2.__objectsRemoved[0], ga2 = a2;
        $2 instanceof THREE.Mesh || $2 instanceof THREE.ParticleSystem || $2 instanceof THREE.Ribbon || $2 instanceof THREE.Line ? x(ga2.__webglObjects, $2) : $2 instanceof THREE.Sprite ? t(ga2.__webglSprites, $2) : $2 instanceof THREE.LensFlare ? t(ga2.__webglFlares, $2) : ($2 instanceof THREE.ImmediateRenderObject || $2.immediateRenderCallback) && x(ga2.__webglObjectsImmediate, $2);
        $2.__webglActive = false;
        a2.__objectsRemoved.splice(0, 1);
      }
      for (var sa2 = 0, ta2 = a2.__webglObjects.length; sa2 < ta2; sa2++) {
        var ma2 = a2.__webglObjects[sa2].object, U = ma2.geometry, ya2 = void 0, oa2 = void 0, la2 = void 0;
        if (ma2 instanceof THREE.Mesh)
          if (U instanceof THREE.BufferGeometry)
            (U.verticesNeedUpdate || U.elementsNeedUpdate || U.uvsNeedUpdate || U.normalsNeedUpdate || U.colorsNeedUpdate || U.tangentsNeedUpdate) && i(U, j.DYNAMIC_DRAW, !U.dynamic), U.verticesNeedUpdate = false, U.elementsNeedUpdate = false, U.uvsNeedUpdate = false, U.normalsNeedUpdate = false, U.colorsNeedUpdate = false, U.tangentsNeedUpdate = false;
          else {
            for (var Ea2 = 0, Pa2 = U.geometryGroupsList.length; Ea2 < Pa2; Ea2++)
              if (ya2 = U.geometryGroupsList[Ea2], la2 = e(ma2, ya2), U.buffersNeedUpdate && d(ya2, ma2), oa2 = la2.attributes && v(la2), U.verticesNeedUpdate || U.morphTargetsNeedUpdate || U.elementsNeedUpdate || U.uvsNeedUpdate || U.normalsNeedUpdate || U.colorsNeedUpdate || U.tangentsNeedUpdate || oa2) {
                var ua = ya2, Ma2 = ma2, va2 = j.DYNAMIC_DRAW, Sa2 = !U.dynamic, Ha2 = la2;
                if (ua.__inittedArrays) {
                  var gb2 = f(Ha2), eb2 = Ha2.vertexColors ? Ha2.vertexColors : false, jb2 = g(Ha2), kb2 = gb2 === THREE.SmoothShading, F = void 0, X = void 0, Ua2 = void 0, O = void 0, nb2 = void 0, Va2 = void 0, Qa2 = void 0, qb2 = void 0, ab2 = void 0, ob2 = void 0, pb2 = void 0, Q = void 0, R = void 0, S = void 0, ra = void 0, Ya2 = void 0, Za2 = void 0, $a2 = void 0, tb2 = void 0, fb2 = void 0, Qb = void 0, Rb = void 0, zb2 = void 0, Sb = void 0, Tb = void 0, Ub = void 0, Bb2 = void 0, Vb = void 0, Wb = void 0, Xb = void 0, Cb2 = void 0, Yb = void 0, Zb = void 0, $b = void 0, Eb2 = void 0, za = void 0, Ob2 = void 0, ub2 = void 0, Db2 = void 0, Fb2 = void 0, bb = void 0, gc2 = void 0, Wa = void 0, Xa = void 0, mc = void 0, hc = void 0, Oa = 0, Ta = 0, ic = 0, jc = 0, Gb = 0, lb = 0, Ca = 0, sb = 0, Ra = 0, ca = 0, na = 0, y = 0, Aa = void 0, cb = ua.__vertexArray, Kb2 = ua.__uvArray, Pb2 = ua.__uv2Array, Hb = ua.__normalArray, Ia = ua.__tangentArray, db = ua.__colorArray, Ja = ua.__skinIndexArray, Ka = ua.__skinWeightArray, ed = ua.__morphTargetsArrays, fd = ua.__morphNormalsArrays, gd = ua.__webglCustomAttributesList, u = void 0, ac = ua.__faceArray, Ab = ua.__lineArray, vb = Ma2.geometry, Hc2 = vb.elementsNeedUpdate, xc2 = vb.uvsNeedUpdate, Ic2 = vb.normalsNeedUpdate, Jc2 = vb.tangentsNeedUpdate, Kc2 = vb.colorsNeedUpdate, Lc2 = vb.morphTargetsNeedUpdate, qc = vb.vertices, wa = ua.faces3, xa = ua.faces4, mb = vb.faces, hd = vb.faceVertexUvs[0], id = vb.faceVertexUvs[1], rc = vb.skinIndices, nc = vb.skinWeights, oc = vb.morphTargets, Mc = vb.morphNormals;
                  if (vb.verticesNeedUpdate) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      O = mb[wa[F]], Q = qc[O.a], R = qc[O.b], S = qc[O.c], cb[Ta] = Q.x, cb[Ta + 1] = Q.y, cb[Ta + 2] = Q.z, cb[Ta + 3] = R.x, cb[Ta + 4] = R.y, cb[Ta + 5] = R.z, cb[Ta + 6] = S.x, cb[Ta + 7] = S.y, cb[Ta + 8] = S.z, Ta += 9;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      O = mb[xa[F]], Q = qc[O.a], R = qc[O.b], S = qc[O.c], ra = qc[O.d], cb[Ta] = Q.x, cb[Ta + 1] = Q.y, cb[Ta + 2] = Q.z, cb[Ta + 3] = R.x, cb[Ta + 4] = R.y, cb[Ta + 5] = R.z, cb[Ta + 6] = S.x, cb[Ta + 7] = S.y, cb[Ta + 8] = S.z, cb[Ta + 9] = ra.x, cb[Ta + 10] = ra.y, cb[Ta + 11] = ra.z, Ta += 12;
                    j.bindBuffer(
                      j.ARRAY_BUFFER,
                      ua.__webglVertexBuffer
                    );
                    j.bufferData(j.ARRAY_BUFFER, cb, va2);
                  }
                  if (Lc2) {
                    bb = 0;
                    for (gc2 = oc.length; bb < gc2; bb++) {
                      F = na = 0;
                      for (X = wa.length; F < X; F++)
                        mc = wa[F], O = mb[mc], Q = oc[bb].vertices[O.a], R = oc[bb].vertices[O.b], S = oc[bb].vertices[O.c], Wa = ed[bb], Wa[na] = Q.x, Wa[na + 1] = Q.y, Wa[na + 2] = Q.z, Wa[na + 3] = R.x, Wa[na + 4] = R.y, Wa[na + 5] = R.z, Wa[na + 6] = S.x, Wa[na + 7] = S.y, Wa[na + 8] = S.z, Ha2.morphNormals && (kb2 ? (hc = Mc[bb].vertexNormals[mc], fb2 = hc.a, Qb = hc.b, Rb = hc.c) : Rb = Qb = fb2 = Mc[bb].faceNormals[mc], Xa = fd[bb], Xa[na] = fb2.x, Xa[na + 1] = fb2.y, Xa[na + 2] = fb2.z, Xa[na + 3] = Qb.x, Xa[na + 4] = Qb.y, Xa[na + 5] = Qb.z, Xa[na + 6] = Rb.x, Xa[na + 7] = Rb.y, Xa[na + 8] = Rb.z), na += 9;
                      F = 0;
                      for (X = xa.length; F < X; F++)
                        mc = xa[F], O = mb[mc], Q = oc[bb].vertices[O.a], R = oc[bb].vertices[O.b], S = oc[bb].vertices[O.c], ra = oc[bb].vertices[O.d], Wa = ed[bb], Wa[na] = Q.x, Wa[na + 1] = Q.y, Wa[na + 2] = Q.z, Wa[na + 3] = R.x, Wa[na + 4] = R.y, Wa[na + 5] = R.z, Wa[na + 6] = S.x, Wa[na + 7] = S.y, Wa[na + 8] = S.z, Wa[na + 9] = ra.x, Wa[na + 10] = ra.y, Wa[na + 11] = ra.z, Ha2.morphNormals && (kb2 ? (hc = Mc[bb].vertexNormals[mc], fb2 = hc.a, Qb = hc.b, Rb = hc.c, zb2 = hc.d) : zb2 = Rb = Qb = fb2 = Mc[bb].faceNormals[mc], Xa = fd[bb], Xa[na] = fb2.x, Xa[na + 1] = fb2.y, Xa[na + 2] = fb2.z, Xa[na + 3] = Qb.x, Xa[na + 4] = Qb.y, Xa[na + 5] = Qb.z, Xa[na + 6] = Rb.x, Xa[na + 7] = Rb.y, Xa[na + 8] = Rb.z, Xa[na + 9] = zb2.x, Xa[na + 10] = zb2.y, Xa[na + 11] = zb2.z), na += 12;
                      j.bindBuffer(j.ARRAY_BUFFER, ua.__webglMorphTargetsBuffers[bb]);
                      j.bufferData(j.ARRAY_BUFFER, ed[bb], va2);
                      Ha2.morphNormals && (j.bindBuffer(j.ARRAY_BUFFER, ua.__webglMorphNormalsBuffers[bb]), j.bufferData(j.ARRAY_BUFFER, fd[bb], va2));
                    }
                  }
                  if (nc.length) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      O = mb[wa[F]], Vb = nc[O.a], Wb = nc[O.b], Xb = nc[O.c], Ka[ca] = Vb.x, Ka[ca + 1] = Vb.y, Ka[ca + 2] = Vb.z, Ka[ca + 3] = Vb.w, Ka[ca + 4] = Wb.x, Ka[ca + 5] = Wb.y, Ka[ca + 6] = Wb.z, Ka[ca + 7] = Wb.w, Ka[ca + 8] = Xb.x, Ka[ca + 9] = Xb.y, Ka[ca + 10] = Xb.z, Ka[ca + 11] = Xb.w, Yb = rc[O.a], Zb = rc[O.b], $b = rc[O.c], Ja[ca] = Yb.x, Ja[ca + 1] = Yb.y, Ja[ca + 2] = Yb.z, Ja[ca + 3] = Yb.w, Ja[ca + 4] = Zb.x, Ja[ca + 5] = Zb.y, Ja[ca + 6] = Zb.z, Ja[ca + 7] = Zb.w, Ja[ca + 8] = $b.x, Ja[ca + 9] = $b.y, Ja[ca + 10] = $b.z, Ja[ca + 11] = $b.w, ca += 12;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      O = mb[xa[F]], Vb = nc[O.a], Wb = nc[O.b], Xb = nc[O.c], Cb2 = nc[O.d], Ka[ca] = Vb.x, Ka[ca + 1] = Vb.y, Ka[ca + 2] = Vb.z, Ka[ca + 3] = Vb.w, Ka[ca + 4] = Wb.x, Ka[ca + 5] = Wb.y, Ka[ca + 6] = Wb.z, Ka[ca + 7] = Wb.w, Ka[ca + 8] = Xb.x, Ka[ca + 9] = Xb.y, Ka[ca + 10] = Xb.z, Ka[ca + 11] = Xb.w, Ka[ca + 12] = Cb2.x, Ka[ca + 13] = Cb2.y, Ka[ca + 14] = Cb2.z, Ka[ca + 15] = Cb2.w, Yb = rc[O.a], Zb = rc[O.b], $b = rc[O.c], Eb2 = rc[O.d], Ja[ca] = Yb.x, Ja[ca + 1] = Yb.y, Ja[ca + 2] = Yb.z, Ja[ca + 3] = Yb.w, Ja[ca + 4] = Zb.x, Ja[ca + 5] = Zb.y, Ja[ca + 6] = Zb.z, Ja[ca + 7] = Zb.w, Ja[ca + 8] = $b.x, Ja[ca + 9] = $b.y, Ja[ca + 10] = $b.z, Ja[ca + 11] = $b.w, Ja[ca + 12] = Eb2.x, Ja[ca + 13] = Eb2.y, Ja[ca + 14] = Eb2.z, Ja[ca + 15] = Eb2.w, ca += 16;
                    0 < ca && (j.bindBuffer(j.ARRAY_BUFFER, ua.__webglSkinIndicesBuffer), j.bufferData(j.ARRAY_BUFFER, Ja, va2), j.bindBuffer(j.ARRAY_BUFFER, ua.__webglSkinWeightsBuffer), j.bufferData(j.ARRAY_BUFFER, Ka, va2));
                  }
                  if (Kc2 && eb2) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      O = mb[wa[F]], Qa2 = O.vertexColors, qb2 = O.color, 3 === Qa2.length && eb2 === THREE.VertexColors ? (Sb = Qa2[0], Tb = Qa2[1], Ub = Qa2[2]) : Ub = Tb = Sb = qb2, db[Ra] = Sb.r, db[Ra + 1] = Sb.g, db[Ra + 2] = Sb.b, db[Ra + 3] = Tb.r, db[Ra + 4] = Tb.g, db[Ra + 5] = Tb.b, db[Ra + 6] = Ub.r, db[Ra + 7] = Ub.g, db[Ra + 8] = Ub.b, Ra += 9;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      O = mb[xa[F]], Qa2 = O.vertexColors, qb2 = O.color, 4 === Qa2.length && eb2 === THREE.VertexColors ? (Sb = Qa2[0], Tb = Qa2[1], Ub = Qa2[2], Bb2 = Qa2[3]) : Bb2 = Ub = Tb = Sb = qb2, db[Ra] = Sb.r, db[Ra + 1] = Sb.g, db[Ra + 2] = Sb.b, db[Ra + 3] = Tb.r, db[Ra + 4] = Tb.g, db[Ra + 5] = Tb.b, db[Ra + 6] = Ub.r, db[Ra + 7] = Ub.g, db[Ra + 8] = Ub.b, db[Ra + 9] = Bb2.r, db[Ra + 10] = Bb2.g, db[Ra + 11] = Bb2.b, Ra += 12;
                    0 < Ra && (j.bindBuffer(j.ARRAY_BUFFER, ua.__webglColorBuffer), j.bufferData(j.ARRAY_BUFFER, db, va2));
                  }
                  if (Jc2 && vb.hasTangents) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      O = mb[wa[F]], ab2 = O.vertexTangents, Ya2 = ab2[0], Za2 = ab2[1], $a2 = ab2[2], Ia[Ca] = Ya2.x, Ia[Ca + 1] = Ya2.y, Ia[Ca + 2] = Ya2.z, Ia[Ca + 3] = Ya2.w, Ia[Ca + 4] = Za2.x, Ia[Ca + 5] = Za2.y, Ia[Ca + 6] = Za2.z, Ia[Ca + 7] = Za2.w, Ia[Ca + 8] = $a2.x, Ia[Ca + 9] = $a2.y, Ia[Ca + 10] = $a2.z, Ia[Ca + 11] = $a2.w, Ca += 12;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      O = mb[xa[F]], ab2 = O.vertexTangents, Ya2 = ab2[0], Za2 = ab2[1], $a2 = ab2[2], tb2 = ab2[3], Ia[Ca] = Ya2.x, Ia[Ca + 1] = Ya2.y, Ia[Ca + 2] = Ya2.z, Ia[Ca + 3] = Ya2.w, Ia[Ca + 4] = Za2.x, Ia[Ca + 5] = Za2.y, Ia[Ca + 6] = Za2.z, Ia[Ca + 7] = Za2.w, Ia[Ca + 8] = $a2.x, Ia[Ca + 9] = $a2.y, Ia[Ca + 10] = $a2.z, Ia[Ca + 11] = $a2.w, Ia[Ca + 12] = tb2.x, Ia[Ca + 13] = tb2.y, Ia[Ca + 14] = tb2.z, Ia[Ca + 15] = tb2.w, Ca += 16;
                    j.bindBuffer(j.ARRAY_BUFFER, ua.__webglTangentBuffer);
                    j.bufferData(j.ARRAY_BUFFER, Ia, va2);
                  }
                  if (Ic2 && gb2) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      if (O = mb[wa[F]], nb2 = O.vertexNormals, Va2 = O.normal, 3 === nb2.length && kb2)
                        for (za = 0; 3 > za; za++)
                          ub2 = nb2[za], Hb[lb] = ub2.x, Hb[lb + 1] = ub2.y, Hb[lb + 2] = ub2.z, lb += 3;
                      else
                        for (za = 0; 3 > za; za++)
                          Hb[lb] = Va2.x, Hb[lb + 1] = Va2.y, Hb[lb + 2] = Va2.z, lb += 3;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      if (O = mb[xa[F]], nb2 = O.vertexNormals, Va2 = O.normal, 4 === nb2.length && kb2)
                        for (za = 0; 4 > za; za++)
                          ub2 = nb2[za], Hb[lb] = ub2.x, Hb[lb + 1] = ub2.y, Hb[lb + 2] = ub2.z, lb += 3;
                      else
                        for (za = 0; 4 > za; za++)
                          Hb[lb] = Va2.x, Hb[lb + 1] = Va2.y, Hb[lb + 2] = Va2.z, lb += 3;
                    j.bindBuffer(j.ARRAY_BUFFER, ua.__webglNormalBuffer);
                    j.bufferData(j.ARRAY_BUFFER, Hb, va2);
                  }
                  if (xc2 && hd && jb2) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      if (Ua2 = wa[F], ob2 = hd[Ua2], void 0 !== ob2)
                        for (za = 0; 3 > za; za++)
                          Db2 = ob2[za], Kb2[ic] = Db2.x, Kb2[ic + 1] = Db2.y, ic += 2;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      if (Ua2 = xa[F], ob2 = hd[Ua2], void 0 !== ob2)
                        for (za = 0; 4 > za; za++)
                          Db2 = ob2[za], Kb2[ic] = Db2.x, Kb2[ic + 1] = Db2.y, ic += 2;
                    0 < ic && (j.bindBuffer(j.ARRAY_BUFFER, ua.__webglUVBuffer), j.bufferData(j.ARRAY_BUFFER, Kb2, va2));
                  }
                  if (xc2 && id && jb2) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      if (Ua2 = wa[F], pb2 = id[Ua2], void 0 !== pb2)
                        for (za = 0; 3 > za; za++)
                          Fb2 = pb2[za], Pb2[jc] = Fb2.x, Pb2[jc + 1] = Fb2.y, jc += 2;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      if (Ua2 = xa[F], pb2 = id[Ua2], void 0 !== pb2)
                        for (za = 0; 4 > za; za++)
                          Fb2 = pb2[za], Pb2[jc] = Fb2.x, Pb2[jc + 1] = Fb2.y, jc += 2;
                    0 < jc && (j.bindBuffer(j.ARRAY_BUFFER, ua.__webglUV2Buffer), j.bufferData(j.ARRAY_BUFFER, Pb2, va2));
                  }
                  if (Hc2) {
                    F = 0;
                    for (X = wa.length; F < X; F++)
                      ac[Gb] = Oa, ac[Gb + 1] = Oa + 1, ac[Gb + 2] = Oa + 2, Gb += 3, Ab[sb] = Oa, Ab[sb + 1] = Oa + 1, Ab[sb + 2] = Oa, Ab[sb + 3] = Oa + 2, Ab[sb + 4] = Oa + 1, Ab[sb + 5] = Oa + 2, sb += 6, Oa += 3;
                    F = 0;
                    for (X = xa.length; F < X; F++)
                      ac[Gb] = Oa, ac[Gb + 1] = Oa + 1, ac[Gb + 2] = Oa + 3, ac[Gb + 3] = Oa + 1, ac[Gb + 4] = Oa + 2, ac[Gb + 5] = Oa + 3, Gb += 6, Ab[sb] = Oa, Ab[sb + 1] = Oa + 1, Ab[sb + 2] = Oa, Ab[sb + 3] = Oa + 3, Ab[sb + 4] = Oa + 1, Ab[sb + 5] = Oa + 2, Ab[sb + 6] = Oa + 2, Ab[sb + 7] = Oa + 3, sb += 8, Oa += 4;
                    j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, ua.__webglFaceBuffer);
                    j.bufferData(j.ELEMENT_ARRAY_BUFFER, ac, va2);
                    j.bindBuffer(j.ELEMENT_ARRAY_BUFFER, ua.__webglLineBuffer);
                    j.bufferData(j.ELEMENT_ARRAY_BUFFER, Ab, va2);
                  }
                  if (gd) {
                    za = 0;
                    for (Ob2 = gd.length; za < Ob2; za++)
                      if (u = gd[za], u.__original.needsUpdate) {
                        y = 0;
                        if (1 === u.size)
                          if (void 0 === u.boundTo || "vertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              O = mb[wa[F]], u.array[y] = u.value[O.a], u.array[y + 1] = u.value[O.b], u.array[y + 2] = u.value[O.c], y += 3;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              O = mb[xa[F]], u.array[y] = u.value[O.a], u.array[y + 1] = u.value[O.b], u.array[y + 2] = u.value[O.c], u.array[y + 3] = u.value[O.d], y += 4;
                          } else {
                            if ("faces" === u.boundTo) {
                              F = 0;
                              for (X = wa.length; F < X; F++)
                                Aa = u.value[wa[F]], u.array[y] = Aa, u.array[y + 1] = Aa, u.array[y + 2] = Aa, y += 3;
                              F = 0;
                              for (X = xa.length; F < X; F++)
                                Aa = u.value[xa[F]], u.array[y] = Aa, u.array[y + 1] = Aa, u.array[y + 2] = Aa, u.array[y + 3] = Aa, y += 4;
                            }
                          }
                        else if (2 === u.size)
                          if (void 0 === u.boundTo || "vertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              O = mb[wa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = R.x, u.array[y + 3] = R.y, u.array[y + 4] = S.x, u.array[y + 5] = S.y, y += 6;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              O = mb[xa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], ra = u.value[O.d], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = R.x, u.array[y + 3] = R.y, u.array[y + 4] = S.x, u.array[y + 5] = S.y, u.array[y + 6] = ra.x, u.array[y + 7] = ra.y, y += 8;
                          } else {
                            if ("faces" === u.boundTo) {
                              F = 0;
                              for (X = wa.length; F < X; F++)
                                S = R = Q = Aa = u.value[wa[F]], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = R.x, u.array[y + 3] = R.y, u.array[y + 4] = S.x, u.array[y + 5] = S.y, y += 6;
                              F = 0;
                              for (X = xa.length; F < X; F++)
                                ra = S = R = Q = Aa = u.value[xa[F]], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = R.x, u.array[y + 3] = R.y, u.array[y + 4] = S.x, u.array[y + 5] = S.y, u.array[y + 6] = ra.x, u.array[y + 7] = ra.y, y += 8;
                            }
                          }
                        else if (3 === u.size) {
                          var aa;
                          aa = "c" === u.type ? ["r", "g", "b"] : ["x", "y", "z"];
                          if (void 0 === u.boundTo || "vertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              O = mb[wa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], y += 9;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              O = mb[xa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], ra = u.value[O.d], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], u.array[y + 9] = ra[aa[0]], u.array[y + 10] = ra[aa[1]], u.array[y + 11] = ra[aa[2]], y += 12;
                          } else if ("faces" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              S = R = Q = Aa = u.value[wa[F]], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], y += 9;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              ra = S = R = Q = Aa = u.value[xa[F]], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], u.array[y + 9] = ra[aa[0]], u.array[y + 10] = ra[aa[1]], u.array[y + 11] = ra[aa[2]], y += 12;
                          } else if ("faceVertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              Aa = u.value[wa[F]], Q = Aa[0], R = Aa[1], S = Aa[2], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], y += 9;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              Aa = u.value[xa[F]], Q = Aa[0], R = Aa[1], S = Aa[2], ra = Aa[3], u.array[y] = Q[aa[0]], u.array[y + 1] = Q[aa[1]], u.array[y + 2] = Q[aa[2]], u.array[y + 3] = R[aa[0]], u.array[y + 4] = R[aa[1]], u.array[y + 5] = R[aa[2]], u.array[y + 6] = S[aa[0]], u.array[y + 7] = S[aa[1]], u.array[y + 8] = S[aa[2]], u.array[y + 9] = ra[aa[0]], u.array[y + 10] = ra[aa[1]], u.array[y + 11] = ra[aa[2]], y += 12;
                          }
                        } else if (4 === u.size) {
                          if (void 0 === u.boundTo || "vertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              O = mb[wa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, y += 12;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              O = mb[xa[F]], Q = u.value[O.a], R = u.value[O.b], S = u.value[O.c], ra = u.value[O.d], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, u.array[y + 12] = ra.x, u.array[y + 13] = ra.y, u.array[y + 14] = ra.z, u.array[y + 15] = ra.w, y += 16;
                          } else if ("faces" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              S = R = Q = Aa = u.value[wa[F]], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, y += 12;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              ra = S = R = Q = Aa = u.value[xa[F]], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, u.array[y + 12] = ra.x, u.array[y + 13] = ra.y, u.array[y + 14] = ra.z, u.array[y + 15] = ra.w, y += 16;
                          } else if ("faceVertices" === u.boundTo) {
                            F = 0;
                            for (X = wa.length; F < X; F++)
                              Aa = u.value[wa[F]], Q = Aa[0], R = Aa[1], S = Aa[2], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, y += 12;
                            F = 0;
                            for (X = xa.length; F < X; F++)
                              Aa = u.value[xa[F]], Q = Aa[0], R = Aa[1], S = Aa[2], ra = Aa[3], u.array[y] = Q.x, u.array[y + 1] = Q.y, u.array[y + 2] = Q.z, u.array[y + 3] = Q.w, u.array[y + 4] = R.x, u.array[y + 5] = R.y, u.array[y + 6] = R.z, u.array[y + 7] = R.w, u.array[y + 8] = S.x, u.array[y + 9] = S.y, u.array[y + 10] = S.z, u.array[y + 11] = S.w, u.array[y + 12] = ra.x, u.array[y + 13] = ra.y, u.array[y + 14] = ra.z, u.array[y + 15] = ra.w, y += 16;
                          }
                        }
                        j.bindBuffer(j.ARRAY_BUFFER, u.buffer);
                        j.bufferData(j.ARRAY_BUFFER, u.array, va2);
                      }
                  }
                  Sa2 && (delete ua.__inittedArrays, delete ua.__colorArray, delete ua.__normalArray, delete ua.__tangentArray, delete ua.__uvArray, delete ua.__uv2Array, delete ua.__faceArray, delete ua.__vertexArray, delete ua.__lineArray, delete ua.__skinIndexArray, delete ua.__skinWeightArray);
                }
              }
            U.verticesNeedUpdate = false;
            U.morphTargetsNeedUpdate = false;
            U.elementsNeedUpdate = false;
            U.uvsNeedUpdate = false;
            U.normalsNeedUpdate = false;
            U.colorsNeedUpdate = false;
            U.tangentsNeedUpdate = false;
            U.buffersNeedUpdate = false;
            la2.attributes && w(la2);
          }
        else if (ma2 instanceof THREE.Ribbon) {
          la2 = e(ma2, U);
          oa2 = la2.attributes && v(la2);
          if (U.verticesNeedUpdate || U.colorsNeedUpdate || U.normalsNeedUpdate || oa2) {
            var Ib = U, Nc = j.DYNAMIC_DRAW, Ac = void 0, Bc = void 0, Cc = void 0, Oc = void 0, Ba = void 0, Pc = void 0, Qc = void 0, Rc = void 0, yc2 = void 0, hb = void 0, uc = void 0, Fa = void 0, wb = void 0, zc2 = Ib.vertices, pd = Ib.colors, qd = Ib.normals, bd2 = zc2.length, cd2 = pd.length, dd = qd.length, Sc = Ib.__vertexArray, Tc = Ib.__colorArray, Uc = Ib.__normalArray, zd = Ib.colorsNeedUpdate, Ad = Ib.normalsNeedUpdate, jd = Ib.__webglCustomAttributesList;
            if (Ib.verticesNeedUpdate) {
              for (Ac = 0; Ac < bd2; Ac++)
                Oc = zc2[Ac], Ba = 3 * Ac, Sc[Ba] = Oc.x, Sc[Ba + 1] = Oc.y, Sc[Ba + 2] = Oc.z;
              j.bindBuffer(j.ARRAY_BUFFER, Ib.__webglVertexBuffer);
              j.bufferData(j.ARRAY_BUFFER, Sc, Nc);
            }
            if (zd) {
              for (Bc = 0; Bc < cd2; Bc++)
                Pc = pd[Bc], Ba = 3 * Bc, Tc[Ba] = Pc.r, Tc[Ba + 1] = Pc.g, Tc[Ba + 2] = Pc.b;
              j.bindBuffer(j.ARRAY_BUFFER, Ib.__webglColorBuffer);
              j.bufferData(j.ARRAY_BUFFER, Tc, Nc);
            }
            if (Ad) {
              for (Cc = 0; Cc < dd; Cc++)
                Qc = qd[Cc], Ba = 3 * Cc, Uc[Ba] = Qc.x, Uc[Ba + 1] = Qc.y, Uc[Ba + 2] = Qc.z;
              j.bindBuffer(j.ARRAY_BUFFER, Ib.__webglNormalBuffer);
              j.bufferData(
                j.ARRAY_BUFFER,
                Uc,
                Nc
              );
            }
            if (jd) {
              Rc = 0;
              for (yc2 = jd.length; Rc < yc2; Rc++)
                if (Fa = jd[Rc], Fa.needsUpdate && (void 0 === Fa.boundTo || "vertices" === Fa.boundTo)) {
                  Ba = 0;
                  uc = Fa.value.length;
                  if (1 === Fa.size)
                    for (hb = 0; hb < uc; hb++)
                      Fa.array[hb] = Fa.value[hb];
                  else if (2 === Fa.size)
                    for (hb = 0; hb < uc; hb++)
                      wb = Fa.value[hb], Fa.array[Ba] = wb.x, Fa.array[Ba + 1] = wb.y, Ba += 2;
                  else if (3 === Fa.size)
                    if ("c" === Fa.type)
                      for (hb = 0; hb < uc; hb++)
                        wb = Fa.value[hb], Fa.array[Ba] = wb.r, Fa.array[Ba + 1] = wb.g, Fa.array[Ba + 2] = wb.b, Ba += 3;
                    else
                      for (hb = 0; hb < uc; hb++)
                        wb = Fa.value[hb], Fa.array[Ba] = wb.x, Fa.array[Ba + 1] = wb.y, Fa.array[Ba + 2] = wb.z, Ba += 3;
                  else if (4 === Fa.size)
                    for (hb = 0; hb < uc; hb++)
                      wb = Fa.value[hb], Fa.array[Ba] = wb.x, Fa.array[Ba + 1] = wb.y, Fa.array[Ba + 2] = wb.z, Fa.array[Ba + 3] = wb.w, Ba += 4;
                  j.bindBuffer(j.ARRAY_BUFFER, Fa.buffer);
                  j.bufferData(j.ARRAY_BUFFER, Fa.array, Nc);
                }
            }
          }
          U.verticesNeedUpdate = false;
          U.colorsNeedUpdate = false;
          U.normalsNeedUpdate = false;
          la2.attributes && w(la2);
        } else if (ma2 instanceof THREE.Line) {
          la2 = e(ma2, U);
          oa2 = la2.attributes && v(la2);
          if (U.verticesNeedUpdate || U.colorsNeedUpdate || U.lineDistancesNeedUpdate || oa2) {
            var Jb = U, Vc = j.DYNAMIC_DRAW, Dc = void 0, Ec = void 0, Fc = void 0, Wc = void 0, La = void 0, Xc = void 0, rd = Jb.vertices, sd = Jb.colors, td = Jb.lineDistances, Bd = rd.length, Cd = sd.length, Dd = td.length, Yc = Jb.__vertexArray, Zc = Jb.__colorArray, ud = Jb.__lineDistanceArray, Ed = Jb.colorsNeedUpdate, Fd = Jb.lineDistancesNeedUpdate, kd = Jb.__webglCustomAttributesList, $c = void 0, vd = void 0, ib = void 0, vc = void 0, xb = void 0, Ga = void 0;
            if (Jb.verticesNeedUpdate) {
              for (Dc = 0; Dc < Bd; Dc++)
                Wc = rd[Dc], La = 3 * Dc, Yc[La] = Wc.x, Yc[La + 1] = Wc.y, Yc[La + 2] = Wc.z;
              j.bindBuffer(
                j.ARRAY_BUFFER,
                Jb.__webglVertexBuffer
              );
              j.bufferData(j.ARRAY_BUFFER, Yc, Vc);
            }
            if (Ed) {
              for (Ec = 0; Ec < Cd; Ec++)
                Xc = sd[Ec], La = 3 * Ec, Zc[La] = Xc.r, Zc[La + 1] = Xc.g, Zc[La + 2] = Xc.b;
              j.bindBuffer(j.ARRAY_BUFFER, Jb.__webglColorBuffer);
              j.bufferData(j.ARRAY_BUFFER, Zc, Vc);
            }
            if (Fd) {
              for (Fc = 0; Fc < Dd; Fc++)
                ud[Fc] = td[Fc];
              j.bindBuffer(j.ARRAY_BUFFER, Jb.__webglLineDistanceBuffer);
              j.bufferData(j.ARRAY_BUFFER, ud, Vc);
            }
            if (kd) {
              $c = 0;
              for (vd = kd.length; $c < vd; $c++)
                if (Ga = kd[$c], Ga.needsUpdate && (void 0 === Ga.boundTo || "vertices" === Ga.boundTo)) {
                  La = 0;
                  vc = Ga.value.length;
                  if (1 === Ga.size)
                    for (ib = 0; ib < vc; ib++)
                      Ga.array[ib] = Ga.value[ib];
                  else if (2 === Ga.size)
                    for (ib = 0; ib < vc; ib++)
                      xb = Ga.value[ib], Ga.array[La] = xb.x, Ga.array[La + 1] = xb.y, La += 2;
                  else if (3 === Ga.size)
                    if ("c" === Ga.type)
                      for (ib = 0; ib < vc; ib++)
                        xb = Ga.value[ib], Ga.array[La] = xb.r, Ga.array[La + 1] = xb.g, Ga.array[La + 2] = xb.b, La += 3;
                    else
                      for (ib = 0; ib < vc; ib++)
                        xb = Ga.value[ib], Ga.array[La] = xb.x, Ga.array[La + 1] = xb.y, Ga.array[La + 2] = xb.z, La += 3;
                  else if (4 === Ga.size)
                    for (ib = 0; ib < vc; ib++)
                      xb = Ga.value[ib], Ga.array[La] = xb.x, Ga.array[La + 1] = xb.y, Ga.array[La + 2] = xb.z, Ga.array[La + 3] = xb.w, La += 4;
                  j.bindBuffer(j.ARRAY_BUFFER, Ga.buffer);
                  j.bufferData(j.ARRAY_BUFFER, Ga.array, Vc);
                }
            }
          }
          U.verticesNeedUpdate = false;
          U.colorsNeedUpdate = false;
          U.lineDistancesNeedUpdate = false;
          la2.attributes && w(la2);
        } else if (ma2 instanceof THREE.ParticleSystem)
          if (U instanceof THREE.BufferGeometry)
            (U.verticesNeedUpdate || U.colorsNeedUpdate) && i(U, j.DYNAMIC_DRAW, !U.dynamic), U.verticesNeedUpdate = false, U.colorsNeedUpdate = false;
          else {
            la2 = e(ma2, U);
            oa2 = la2.attributes && v(la2);
            if (U.verticesNeedUpdate || U.colorsNeedUpdate || ma2.sortParticles || oa2) {
              var bc = U, ld = j.DYNAMIC_DRAW, Gc = ma2, yb = void 0, cc = void 0, dc = void 0, ea = void 0, ec = void 0, pc = void 0, ad = bc.vertices, md = ad.length, nd = bc.colors, wd = nd.length, sc = bc.__vertexArray, tc = bc.__colorArray, kc = bc.__sortArray, xd = bc.verticesNeedUpdate, yd = bc.colorsNeedUpdate, lc = bc.__webglCustomAttributesList, Lb = void 0, wc = void 0, pa = void 0, Mb = void 0, Da = void 0, da = void 0;
              if (Gc.sortParticles) {
                fc.copy(rb);
                fc.multiplySelf(Gc.matrixWorld);
                for (yb = 0; yb < md; yb++)
                  dc = ad[yb], Nb.copy(dc), fc.multiplyVector3(Nb), kc[yb] = [Nb.z, yb];
                kc.sort(p);
                for (yb = 0; yb < md; yb++)
                  dc = ad[kc[yb][1]], ea = 3 * yb, sc[ea] = dc.x, sc[ea + 1] = dc.y, sc[ea + 2] = dc.z;
                for (cc = 0; cc < wd; cc++)
                  ea = 3 * cc, pc = nd[kc[cc][1]], tc[ea] = pc.r, tc[ea + 1] = pc.g, tc[ea + 2] = pc.b;
                if (lc) {
                  Lb = 0;
                  for (wc = lc.length; Lb < wc; Lb++)
                    if (da = lc[Lb], void 0 === da.boundTo || "vertices" === da.boundTo) {
                      if (ea = 0, Mb = da.value.length, 1 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          ec = kc[pa][1], da.array[pa] = da.value[ec];
                      else if (2 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          ec = kc[pa][1], Da = da.value[ec], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, ea += 2;
                      else if (3 === da.size)
                        if ("c" === da.type)
                          for (pa = 0; pa < Mb; pa++)
                            ec = kc[pa][1], Da = da.value[ec], da.array[ea] = Da.r, da.array[ea + 1] = Da.g, da.array[ea + 2] = Da.b, ea += 3;
                        else
                          for (pa = 0; pa < Mb; pa++)
                            ec = kc[pa][1], Da = da.value[ec], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, da.array[ea + 2] = Da.z, ea += 3;
                      else if (4 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          ec = kc[pa][1], Da = da.value[ec], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, da.array[ea + 2] = Da.z, da.array[ea + 3] = Da.w, ea += 4;
                    }
                }
              } else {
                if (xd)
                  for (yb = 0; yb < md; yb++)
                    dc = ad[yb], ea = 3 * yb, sc[ea] = dc.x, sc[ea + 1] = dc.y, sc[ea + 2] = dc.z;
                if (yd)
                  for (cc = 0; cc < wd; cc++)
                    pc = nd[cc], ea = 3 * cc, tc[ea] = pc.r, tc[ea + 1] = pc.g, tc[ea + 2] = pc.b;
                if (lc) {
                  Lb = 0;
                  for (wc = lc.length; Lb < wc; Lb++)
                    if (da = lc[Lb], da.needsUpdate && (void 0 === da.boundTo || "vertices" === da.boundTo)) {
                      if (Mb = da.value.length, ea = 0, 1 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          da.array[pa] = da.value[pa];
                      else if (2 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          Da = da.value[pa], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, ea += 2;
                      else if (3 === da.size)
                        if ("c" === da.type)
                          for (pa = 0; pa < Mb; pa++)
                            Da = da.value[pa], da.array[ea] = Da.r, da.array[ea + 1] = Da.g, da.array[ea + 2] = Da.b, ea += 3;
                        else
                          for (pa = 0; pa < Mb; pa++)
                            Da = da.value[pa], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, da.array[ea + 2] = Da.z, ea += 3;
                      else if (4 === da.size)
                        for (pa = 0; pa < Mb; pa++)
                          Da = da.value[pa], da.array[ea] = Da.x, da.array[ea + 1] = Da.y, da.array[ea + 2] = Da.z, da.array[ea + 3] = Da.w, ea += 4;
                    }
                }
              }
              if (xd || Gc.sortParticles)
                j.bindBuffer(j.ARRAY_BUFFER, bc.__webglVertexBuffer), j.bufferData(j.ARRAY_BUFFER, sc, ld);
              if (yd || Gc.sortParticles)
                j.bindBuffer(j.ARRAY_BUFFER, bc.__webglColorBuffer), j.bufferData(j.ARRAY_BUFFER, tc, ld);
              if (lc) {
                Lb = 0;
                for (wc = lc.length; Lb < wc; Lb++)
                  if (da = lc[Lb], da.needsUpdate || Gc.sortParticles)
                    j.bindBuffer(j.ARRAY_BUFFER, da.buffer), j.bufferData(j.ARRAY_BUFFER, da.array, ld);
              }
            }
            U.verticesNeedUpdate = false;
            U.colorsNeedUpdate = false;
            la2.attributes && w(la2);
          }
      }
    };
    this.initMaterial = function(a2, b2, c2, d2) {
      var e2, f2, g2, h2;
      a2.addEventListener("dispose", Jc);
      var i2, k2, m2, l2, n2;
      a2 instanceof THREE.MeshDepthMaterial ? n2 = "depth" : a2 instanceof THREE.MeshNormalMaterial ? n2 = "normal" : a2 instanceof THREE.MeshBasicMaterial ? n2 = "basic" : a2 instanceof THREE.MeshLambertMaterial ? n2 = "lambert" : a2 instanceof THREE.MeshPhongMaterial ? n2 = "phong" : a2 instanceof THREE.LineBasicMaterial ? n2 = "basic" : a2 instanceof THREE.LineDashedMaterial ? n2 = "dashed" : a2 instanceof THREE.ParticleBasicMaterial && (n2 = "particle_basic");
      if (n2) {
        var p2 = THREE.ShaderLib[n2];
        a2.uniforms = THREE.UniformsUtils.clone(p2.uniforms);
        a2.vertexShader = p2.vertexShader;
        a2.fragmentShader = p2.fragmentShader;
      }
      var q2, s2, r2;
      e2 = g2 = s2 = r2 = p2 = 0;
      for (f2 = b2.length; e2 < f2; e2++)
        q2 = b2[e2], q2.onlyShadow || (q2 instanceof THREE.DirectionalLight && g2++, q2 instanceof THREE.PointLight && s2++, q2 instanceof THREE.SpotLight && r2++, q2 instanceof THREE.HemisphereLight && p2++);
      e2 = g2;
      f2 = s2;
      g2 = r2;
      h2 = p2;
      p2 = q2 = 0;
      for (r2 = b2.length; p2 < r2; p2++)
        s2 = b2[p2], s2.castShadow && (s2 instanceof THREE.SpotLight && q2++, s2 instanceof THREE.DirectionalLight && !s2.shadowCascade && q2++);
      l2 = q2;
      tb && d2 && d2.useVertexTexture ? m2 = 1024 : (b2 = j.getParameter(j.MAX_VERTEX_UNIFORM_VECTORS), b2 = Math.floor((b2 - 20) / 4), void 0 !== d2 && d2 instanceof THREE.SkinnedMesh && (b2 = Math.min(d2.bones.length, b2), b2 < d2.bones.length && console.warn("WebGLRenderer: too many bones - " + d2.bones.length + ", this GPU supports just " + b2 + " (try OpenGL instead of ANGLE)")), m2 = b2);
      a: {
        s2 = a2.fragmentShader;
        r2 = a2.vertexShader;
        p2 = a2.uniforms;
        b2 = a2.attributes;
        q2 = a2.defines;
        var c2 = {
          map: !!a2.map,
          envMap: !!a2.envMap,
          lightMap: !!a2.lightMap,
          bumpMap: !!a2.bumpMap,
          normalMap: !!a2.normalMap,
          specularMap: !!a2.specularMap,
          vertexColors: a2.vertexColors,
          fog: c2,
          useFog: a2.fog,
          fogExp: c2 instanceof THREE.FogExp2,
          sizeAttenuation: a2.sizeAttenuation,
          skinning: a2.skinning,
          maxBones: m2,
          useVertexTexture: tb && d2 && d2.useVertexTexture,
          boneTextureWidth: d2 && d2.boneTextureWidth,
          boneTextureHeight: d2 && d2.boneTextureHeight,
          morphTargets: a2.morphTargets,
          morphNormals: a2.morphNormals,
          maxMorphTargets: this.maxMorphTargets,
          maxMorphNormals: this.maxMorphNormals,
          maxDirLights: e2,
          maxPointLights: f2,
          maxSpotLights: g2,
          maxHemiLights: h2,
          maxShadows: l2,
          shadowMapEnabled: this.shadowMapEnabled && d2.receiveShadow,
          shadowMapType: this.shadowMapType,
          shadowMapDebug: this.shadowMapDebug,
          shadowMapCascade: this.shadowMapCascade,
          alphaTest: a2.alphaTest,
          metal: a2.metal,
          perPixel: a2.perPixel,
          wrapAround: a2.wrapAround,
          doubleSided: a2.side === THREE.DoubleSide,
          flipSided: a2.side === THREE.BackSide
        }, t2, v2, x2, d2 = [];
        n2 ? d2.push(n2) : (d2.push(s2), d2.push(r2));
        for (v2 in q2)
          d2.push(v2), d2.push(q2[v2]);
        for (t2 in c2)
          d2.push(t2), d2.push(c2[t2]);
        n2 = d2.join();
        t2 = 0;
        for (v2 = ja.length; t2 < v2; t2++)
          if (d2 = ja[t2], d2.code === n2) {
            d2.usedTimes++;
            k2 = d2.program;
            break a;
          }
        t2 = "SHADOWMAP_TYPE_BASIC";
        c2.shadowMapType === THREE.PCFShadowMap ? t2 = "SHADOWMAP_TYPE_PCF" : c2.shadowMapType === THREE.PCFSoftShadowMap && (t2 = "SHADOWMAP_TYPE_PCF_SOFT");
        v2 = [];
        for (x2 in q2)
          d2 = q2[x2], false !== d2 && (d2 = "#define " + x2 + " " + d2, v2.push(d2));
        d2 = v2.join("\n");
        x2 = j.createProgram();
        v2 = ["precision " + N + " float;", d2, ab ? "#define VERTEX_TEXTURES" : "", H.gammaInput ? "#define GAMMA_INPUT" : "", H.gammaOutput ? "#define GAMMA_OUTPUT" : "", H.physicallyBasedShading ? "#define PHYSICALLY_BASED_SHADING" : "", "#define MAX_DIR_LIGHTS " + c2.maxDirLights, "#define MAX_POINT_LIGHTS " + c2.maxPointLights, "#define MAX_SPOT_LIGHTS " + c2.maxSpotLights, "#define MAX_HEMI_LIGHTS " + c2.maxHemiLights, "#define MAX_SHADOWS " + c2.maxShadows, "#define MAX_BONES " + c2.maxBones, c2.map ? "#define USE_MAP" : "", c2.envMap ? "#define USE_ENVMAP" : "", c2.lightMap ? "#define USE_LIGHTMAP" : "", c2.bumpMap ? "#define USE_BUMPMAP" : "", c2.normalMap ? "#define USE_NORMALMAP" : "", c2.specularMap ? "#define USE_SPECULARMAP" : "", c2.vertexColors ? "#define USE_COLOR" : "", c2.skinning ? "#define USE_SKINNING" : "", c2.useVertexTexture ? "#define BONE_TEXTURE" : "", c2.boneTextureWidth ? "#define N_BONE_PIXEL_X " + c2.boneTextureWidth.toFixed(1) : "", c2.boneTextureHeight ? "#define N_BONE_PIXEL_Y " + c2.boneTextureHeight.toFixed(1) : "", c2.morphTargets ? "#define USE_MORPHTARGETS" : "", c2.morphNormals ? "#define USE_MORPHNORMALS" : "", c2.perPixel ? "#define PHONG_PER_PIXEL" : "", c2.wrapAround ? "#define WRAP_AROUND" : "", c2.doubleSided ? "#define DOUBLE_SIDED" : "", c2.flipSided ? "#define FLIP_SIDED" : "", c2.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", c2.shadowMapEnabled ? "#define " + t2 : "", c2.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "", c2.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "", c2.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", "uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
        t2 = [
          "precision " + N + " float;",
          c2.bumpMap || c2.normalMap ? "#extension GL_OES_standard_derivatives : enable" : "",
          d2,
          "#define MAX_DIR_LIGHTS " + c2.maxDirLights,
          "#define MAX_POINT_LIGHTS " + c2.maxPointLights,
          "#define MAX_SPOT_LIGHTS " + c2.maxSpotLights,
          "#define MAX_HEMI_LIGHTS " + c2.maxHemiLights,
          "#define MAX_SHADOWS " + c2.maxShadows,
          c2.alphaTest ? "#define ALPHATEST " + c2.alphaTest : "",
          H.gammaInput ? "#define GAMMA_INPUT" : "",
          H.gammaOutput ? "#define GAMMA_OUTPUT" : "",
          H.physicallyBasedShading ? "#define PHYSICALLY_BASED_SHADING" : "",
          c2.useFog && c2.fog ? "#define USE_FOG" : "",
          c2.useFog && c2.fogExp ? "#define FOG_EXP2" : "",
          c2.map ? "#define USE_MAP" : "",
          c2.envMap ? "#define USE_ENVMAP" : "",
          c2.lightMap ? "#define USE_LIGHTMAP" : "",
          c2.bumpMap ? "#define USE_BUMPMAP" : "",
          c2.normalMap ? "#define USE_NORMALMAP" : "",
          c2.specularMap ? "#define USE_SPECULARMAP" : "",
          c2.vertexColors ? "#define USE_COLOR" : "",
          c2.metal ? "#define METAL" : "",
          c2.perPixel ? "#define PHONG_PER_PIXEL" : "",
          c2.wrapAround ? "#define WRAP_AROUND" : "",
          c2.doubleSided ? "#define DOUBLE_SIDED" : "",
          c2.flipSided ? "#define FLIP_SIDED" : "",
          c2.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
          c2.shadowMapEnabled ? "#define " + t2 : "",
          c2.shadowMapDebug ? "#define SHADOWMAP_DEBUG" : "",
          c2.shadowMapCascade ? "#define SHADOWMAP_CASCADE" : "",
          "uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"
        ].join("\n");
        t2 = Y("fragment", t2 + s2);
        v2 = Y("vertex", v2 + r2);
        j.attachShader(x2, v2);
        j.attachShader(x2, t2);
        j.linkProgram(x2);
        j.getProgramParameter(x2, j.LINK_STATUS) || console.error("Could not initialise shader\nVALIDATE_STATUS: " + j.getProgramParameter(x2, j.VALIDATE_STATUS) + ", gl error [" + j.getError() + "]");
        j.deleteShader(t2);
        j.deleteShader(v2);
        x2.uniforms = {};
        x2.attributes = {};
        var w2;
        t2 = "viewMatrix modelViewMatrix projectionMatrix normalMatrix modelMatrix cameraPosition morphTargetInfluences".split(" ");
        c2.useVertexTexture ? t2.push("boneTexture") : t2.push("boneGlobalMatrices");
        for (w2 in p2)
          t2.push(w2);
        w2 = t2;
        t2 = 0;
        for (v2 = w2.length; t2 < v2; t2++)
          p2 = w2[t2], x2.uniforms[p2] = j.getUniformLocation(x2, p2);
        t2 = "position normal uv uv2 tangent color skinIndex skinWeight lineDistance".split(" ");
        for (w2 = 0; w2 < c2.maxMorphTargets; w2++)
          t2.push("morphTarget" + w2);
        for (w2 = 0; w2 < c2.maxMorphNormals; w2++)
          t2.push("morphNormal" + w2);
        for (k2 in b2)
          t2.push(k2);
        k2 = t2;
        w2 = 0;
        for (b2 = k2.length; w2 < b2; w2++)
          t2 = k2[w2], x2.attributes[t2] = j.getAttribLocation(x2, t2);
        x2.id = ha++;
        ja.push({ program: x2, code: n2, usedTimes: 1 });
        H.info.memory.programs = ja.length;
        k2 = x2;
      }
      a2.program = k2;
      w2 = a2.program.attributes;
      if (a2.morphTargets) {
        a2.numSupportedMorphTargets = 0;
        b2 = "morphTarget";
        for (k2 = 0; k2 < this.maxMorphTargets; k2++)
          x2 = b2 + k2, 0 <= w2[x2] && a2.numSupportedMorphTargets++;
      }
      if (a2.morphNormals) {
        a2.numSupportedMorphNormals = 0;
        b2 = "morphNormal";
        for (k2 = 0; k2 < this.maxMorphNormals; k2++)
          x2 = b2 + k2, 0 <= w2[x2] && a2.numSupportedMorphNormals++;
      }
      a2.uniformsList = [];
      for (i2 in a2.uniforms)
        a2.uniformsList.push([a2.uniforms[i2], i2]);
    };
    this.setFaceCulling = function(a2, b2) {
      a2 === THREE.CullFaceNone ? j.disable(j.CULL_FACE) : (b2 === THREE.FrontFaceDirectionCW ? j.frontFace(j.CW) : j.frontFace(j.CCW), a2 === THREE.CullFaceBack ? j.cullFace(j.BACK) : a2 === THREE.CullFaceFront ? j.cullFace(j.FRONT) : j.cullFace(j.FRONT_AND_BACK), j.enable(j.CULL_FACE));
    };
    this.setMaterialFaces = function(a2) {
      var b2 = a2.side === THREE.DoubleSide, a2 = a2.side === THREE.BackSide;
      ma !== b2 && (b2 ? j.disable(j.CULL_FACE) : j.enable(j.CULL_FACE), ma = b2);
      sa !== a2 && (a2 ? j.frontFace(j.CW) : j.frontFace(j.CCW), sa = a2);
    };
    this.setDepthTest = function(a2) {
      ob !== a2 && (a2 ? j.enable(j.DEPTH_TEST) : j.disable(j.DEPTH_TEST), ob = a2);
    };
    this.setDepthWrite = function(a2) {
      pb !== a2 && (j.depthMask(a2), pb = a2);
    };
    this.setBlending = function(a2, b2, c2, d2) {
      a2 !== Pa && (a2 === THREE.NoBlending ? j.disable(j.BLEND) : a2 === THREE.AdditiveBlending ? (j.enable(j.BLEND), j.blendEquation(j.FUNC_ADD), j.blendFunc(j.SRC_ALPHA, j.ONE)) : a2 === THREE.SubtractiveBlending ? (j.enable(j.BLEND), j.blendEquation(j.FUNC_ADD), j.blendFunc(j.ZERO, j.ONE_MINUS_SRC_COLOR)) : a2 === THREE.MultiplyBlending ? (j.enable(j.BLEND), j.blendEquation(j.FUNC_ADD), j.blendFunc(j.ZERO, j.SRC_COLOR)) : a2 === THREE.CustomBlending ? j.enable(j.BLEND) : (j.enable(j.BLEND), j.blendEquationSeparate(j.FUNC_ADD, j.FUNC_ADD), j.blendFuncSeparate(j.SRC_ALPHA, j.ONE_MINUS_SRC_ALPHA, j.ONE, j.ONE_MINUS_SRC_ALPHA)), Pa = a2);
      if (a2 === THREE.CustomBlending) {
        if (b2 !== nb && (j.blendEquation(J(b2)), nb = b2), c2 !== la || d2 !== fb)
          j.blendFunc(J(c2), J(d2)), la = c2, fb = d2;
      } else
        fb = la = nb = null;
    };
    this.setTexture = function(a2, b2) {
      if (a2.needsUpdate) {
        a2.__webglInit || (a2.__webglInit = true, a2.addEventListener("dispose", xc), a2.__webglTexture = j.createTexture(), H.info.memory.textures++);
        j.activeTexture(j.TEXTURE0 + b2);
        j.bindTexture(j.TEXTURE_2D, a2.__webglTexture);
        j.pixelStorei(j.UNPACK_FLIP_Y_WEBGL, a2.flipY);
        j.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a2.premultiplyAlpha);
        j.pixelStorei(j.UNPACK_ALIGNMENT, a2.unpackAlignment);
        var c2 = a2.image, d2 = 0 === (c2.width & c2.width - 1) && 0 === (c2.height & c2.height - 1), e2 = J(a2.format), f2 = J(a2.type);
        C(j.TEXTURE_2D, a2, d2);
        var g2 = a2.mipmaps;
        if (a2 instanceof THREE.DataTexture)
          if (0 < g2.length && d2) {
            for (var h2 = 0, i2 = g2.length; h2 < i2; h2++)
              c2 = g2[h2], j.texImage2D(j.TEXTURE_2D, h2, e2, c2.width, c2.height, 0, e2, f2, c2.data);
            a2.generateMipmaps = false;
          } else
            j.texImage2D(j.TEXTURE_2D, 0, e2, c2.width, c2.height, 0, e2, f2, c2.data);
        else if (a2 instanceof THREE.CompressedTexture) {
          h2 = 0;
          for (i2 = g2.length; h2 < i2; h2++)
            c2 = g2[h2], j.compressedTexImage2D(j.TEXTURE_2D, h2, e2, c2.width, c2.height, 0, c2.data);
        } else if (0 < g2.length && d2) {
          h2 = 0;
          for (i2 = g2.length; h2 < i2; h2++)
            c2 = g2[h2], j.texImage2D(
              j.TEXTURE_2D,
              h2,
              e2,
              e2,
              f2,
              c2
            );
          a2.generateMipmaps = false;
        } else
          j.texImage2D(j.TEXTURE_2D, 0, e2, e2, f2, a2.image);
        a2.generateMipmaps && d2 && j.generateMipmap(j.TEXTURE_2D);
        a2.needsUpdate = false;
        if (a2.onUpdate)
          a2.onUpdate();
      } else
        j.activeTexture(j.TEXTURE0 + b2), j.bindTexture(j.TEXTURE_2D, a2.__webglTexture);
    };
    this.setRenderTarget = function(a2) {
      var b2 = a2 instanceof THREE.WebGLRenderTargetCube;
      if (a2 && !a2.__webglFramebuffer) {
        void 0 === a2.depthBuffer && (a2.depthBuffer = true);
        void 0 === a2.stencilBuffer && (a2.stencilBuffer = true);
        a2.addEventListener("dispose", Ic);
        a2.__webglTexture = j.createTexture();
        H.info.memory.textures++;
        var c2 = 0 === (a2.width & a2.width - 1) && 0 === (a2.height & a2.height - 1), d2 = J(a2.format), e2 = J(a2.type);
        if (b2) {
          a2.__webglFramebuffer = [];
          a2.__webglRenderbuffer = [];
          j.bindTexture(j.TEXTURE_CUBE_MAP, a2.__webglTexture);
          C(j.TEXTURE_CUBE_MAP, a2, c2);
          for (var f2 = 0; 6 > f2; f2++) {
            a2.__webglFramebuffer[f2] = j.createFramebuffer();
            a2.__webglRenderbuffer[f2] = j.createRenderbuffer();
            j.texImage2D(j.TEXTURE_CUBE_MAP_POSITIVE_X + f2, 0, d2, a2.width, a2.height, 0, d2, e2, null);
            var g2 = a2, h2 = j.TEXTURE_CUBE_MAP_POSITIVE_X + f2;
            j.bindFramebuffer(
              j.FRAMEBUFFER,
              a2.__webglFramebuffer[f2]
            );
            j.framebufferTexture2D(j.FRAMEBUFFER, j.COLOR_ATTACHMENT0, h2, g2.__webglTexture, 0);
            P(a2.__webglRenderbuffer[f2], a2);
          }
          c2 && j.generateMipmap(j.TEXTURE_CUBE_MAP);
        } else
          a2.__webglFramebuffer = j.createFramebuffer(), a2.__webglRenderbuffer = a2.shareDepthFrom ? a2.shareDepthFrom.__webglRenderbuffer : j.createRenderbuffer(), j.bindTexture(j.TEXTURE_2D, a2.__webglTexture), C(j.TEXTURE_2D, a2, c2), j.texImage2D(j.TEXTURE_2D, 0, d2, a2.width, a2.height, 0, d2, e2, null), d2 = j.TEXTURE_2D, j.bindFramebuffer(j.FRAMEBUFFER, a2.__webglFramebuffer), j.framebufferTexture2D(j.FRAMEBUFFER, j.COLOR_ATTACHMENT0, d2, a2.__webglTexture, 0), a2.shareDepthFrom ? a2.depthBuffer && !a2.stencilBuffer ? j.framebufferRenderbuffer(j.FRAMEBUFFER, j.DEPTH_ATTACHMENT, j.RENDERBUFFER, a2.__webglRenderbuffer) : a2.depthBuffer && a2.stencilBuffer && j.framebufferRenderbuffer(j.FRAMEBUFFER, j.DEPTH_STENCIL_ATTACHMENT, j.RENDERBUFFER, a2.__webglRenderbuffer) : P(a2.__webglRenderbuffer, a2), c2 && j.generateMipmap(j.TEXTURE_2D);
        b2 ? j.bindTexture(j.TEXTURE_CUBE_MAP, null) : j.bindTexture(j.TEXTURE_2D, null);
        j.bindRenderbuffer(
          j.RENDERBUFFER,
          null
        );
        j.bindFramebuffer(j.FRAMEBUFFER, null);
      }
      a2 ? (b2 = b2 ? a2.__webglFramebuffer[a2.activeCubeFace] : a2.__webglFramebuffer, c2 = a2.width, a2 = a2.height, e2 = d2 = 0) : (b2 = null, c2 = Ya, a2 = Za, d2 = Bb, e2 = Sa);
      b2 !== ka && (j.bindFramebuffer(j.FRAMEBUFFER, b2), j.viewport(d2, e2, c2, a2), ka = b2);
      qb = c2;
      Cb = a2;
    };
    this.shadowMapPlugin = new THREE.ShadowMapPlugin();
    this.addPrePlugin(this.shadowMapPlugin);
    this.addPostPlugin(new THREE.SpritePlugin());
    this.addPostPlugin(new THREE.LensFlarePlugin());
  };
  THREE.WebGLRenderTarget = function(a, b, c) {
    THREE.EventDispatcher.call(this);
    this.width = a;
    this.height = b;
    c = c || {};
    this.wrapS = void 0 !== c.wrapS ? c.wrapS : THREE.ClampToEdgeWrapping;
    this.wrapT = void 0 !== c.wrapT ? c.wrapT : THREE.ClampToEdgeWrapping;
    this.magFilter = void 0 !== c.magFilter ? c.magFilter : THREE.LinearFilter;
    this.minFilter = void 0 !== c.minFilter ? c.minFilter : THREE.LinearMipMapLinearFilter;
    this.anisotropy = void 0 !== c.anisotropy ? c.anisotropy : 1;
    this.offset = new THREE.Vector2(0, 0);
    this.repeat = new THREE.Vector2(1, 1);
    this.format = void 0 !== c.format ? c.format : THREE.RGBAFormat;
    this.type = void 0 !== c.type ? c.type : THREE.UnsignedByteType;
    this.depthBuffer = void 0 !== c.depthBuffer ? c.depthBuffer : true;
    this.stencilBuffer = void 0 !== c.stencilBuffer ? c.stencilBuffer : true;
    this.generateMipmaps = true;
    this.shareDepthFrom = null;
  };
  THREE.WebGLRenderTarget.prototype.clone = function() {
    var a = new THREE.WebGLRenderTarget(this.width, this.height);
    a.wrapS = this.wrapS;
    a.wrapT = this.wrapT;
    a.magFilter = this.magFilter;
    a.minFilter = this.minFilter;
    a.anisotropy = this.anisotropy;
    a.offset.copy(this.offset);
    a.repeat.copy(this.repeat);
    a.format = this.format;
    a.type = this.type;
    a.depthBuffer = this.depthBuffer;
    a.stencilBuffer = this.stencilBuffer;
    a.generateMipmaps = this.generateMipmaps;
    a.shareDepthFrom = this.shareDepthFrom;
    return a;
  };
  THREE.WebGLRenderTarget.prototype.dispose = function() {
    this.dispatchEvent({ type: "dispose" });
  };
  THREE.WebGLRenderTargetCube = function(a, b, c) {
    THREE.WebGLRenderTarget.call(this, a, b, c);
    this.activeCubeFace = 0;
  };
  THREE.WebGLRenderTargetCube.prototype = Object.create(THREE.WebGLRenderTarget.prototype);
  THREE.RenderableVertex = function() {
    this.positionWorld = new THREE.Vector3();
    this.positionScreen = new THREE.Vector4();
    this.visible = true;
  };
  THREE.RenderableVertex.prototype.copy = function(a) {
    this.positionWorld.copy(a.positionWorld);
    this.positionScreen.copy(a.positionScreen);
  };
  THREE.RenderableFace3 = function() {
    this.v1 = new THREE.RenderableVertex();
    this.v2 = new THREE.RenderableVertex();
    this.v3 = new THREE.RenderableVertex();
    this.centroidModel = new THREE.Vector3();
    this.normalModel = new THREE.Vector3();
    this.normalModelView = new THREE.Vector3();
    this.vertexNormalsLength = 0;
    this.vertexNormalsModel = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.vertexNormalsModelView = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.material = this.color = null;
    this.uvs = [[]];
    this.z = null;
  };
  THREE.RenderableFace4 = function() {
    this.v1 = new THREE.RenderableVertex();
    this.v2 = new THREE.RenderableVertex();
    this.v3 = new THREE.RenderableVertex();
    this.v4 = new THREE.RenderableVertex();
    this.centroidModel = new THREE.Vector3();
    this.normalModel = new THREE.Vector3();
    this.normalModelView = new THREE.Vector3();
    this.vertexNormalsLength = 0;
    this.vertexNormalsModel = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.vertexNormalsModelView = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.material = this.color = null;
    this.uvs = [[]];
    this.z = null;
  };
  THREE.RenderableObject = function() {
    this.z = this.object = null;
  };
  THREE.RenderableParticle = function() {
    this.rotation = this.z = this.y = this.x = this.object = null;
    this.scale = new THREE.Vector2();
    this.material = null;
  };
  THREE.RenderableLine = function() {
    this.z = null;
    this.v1 = new THREE.RenderableVertex();
    this.v2 = new THREE.RenderableVertex();
    this.material = null;
  };
  THREE.ColorUtils = { adjustHSV: function(a, b, c, d) {
    var e = THREE.ColorUtils.__hsv;
    a.getHSV(e);
    e.h = THREE.Math.clamp(e.h + b, 0, 1);
    e.s = THREE.Math.clamp(e.s + c, 0, 1);
    e.v = THREE.Math.clamp(e.v + d, 0, 1);
    a.setHSV(e.h, e.s, e.v);
  } };
  THREE.ColorUtils.__hsv = { h: 0, s: 0, v: 0 };
  THREE.GeometryUtils = { merge: function(a, b) {
    var c, d, e = a.vertices.length, f = b instanceof THREE.Mesh ? b.geometry : b, g = a.vertices, h = f.vertices, i = a.faces, k = f.faces, l = a.faceVertexUvs[0], f = f.faceVertexUvs[0];
    b instanceof THREE.Mesh && (b.matrixAutoUpdate && b.updateMatrix(), c = b.matrix, d = new THREE.Matrix4(), d.extractRotation(c, b.scale));
    for (var m = 0, p = h.length; m < p; m++) {
      var s = h[m].clone();
      c && c.multiplyVector3(s);
      g.push(s);
    }
    m = 0;
    for (p = k.length; m < p; m++) {
      var s = k[m], q, n, r = s.vertexNormals, v = s.vertexColors;
      s instanceof THREE.Face3 ? q = new THREE.Face3(s.a + e, s.b + e, s.c + e) : s instanceof THREE.Face4 && (q = new THREE.Face4(s.a + e, s.b + e, s.c + e, s.d + e));
      q.normal.copy(s.normal);
      d && d.multiplyVector3(q.normal);
      g = 0;
      for (h = r.length; g < h; g++)
        n = r[g].clone(), d && d.multiplyVector3(n), q.vertexNormals.push(n);
      q.color.copy(s.color);
      g = 0;
      for (h = v.length; g < h; g++)
        n = v[g], q.vertexColors.push(n.clone());
      q.materialIndex = s.materialIndex;
      q.centroid.copy(s.centroid);
      c && c.multiplyVector3(q.centroid);
      i.push(q);
    }
    m = 0;
    for (p = f.length; m < p; m++) {
      c = f[m];
      d = [];
      g = 0;
      for (h = c.length; g < h; g++)
        d.push(new THREE.Vector2(c[g].x, c[g].y));
      l.push(d);
    }
  }, removeMaterials: function(a, b) {
    for (var c = {}, d = 0, e = b.length; d < e; d++)
      c[b[d]] = true;
    for (var f, g = [], d = 0, e = a.faces.length; d < e; d++)
      f = a.faces[d], f.materialIndex in c || g.push(f);
    a.faces = g;
  }, randomPointInTriangle: function(a, b, c) {
    var d, e, f, g = new THREE.Vector3(), h = THREE.GeometryUtils.__v1;
    d = THREE.GeometryUtils.random();
    e = THREE.GeometryUtils.random();
    1 < d + e && (d = 1 - d, e = 1 - e);
    f = 1 - d - e;
    g.copy(a);
    g.multiplyScalar(d);
    h.copy(b);
    h.multiplyScalar(e);
    g.addSelf(h);
    h.copy(c);
    h.multiplyScalar(f);
    g.addSelf(h);
    return g;
  }, randomPointInFace: function(a, b, c) {
    var d, e, f;
    if (a instanceof THREE.Face3)
      return d = b.vertices[a.a], e = b.vertices[a.b], f = b.vertices[a.c], THREE.GeometryUtils.randomPointInTriangle(d, e, f);
    if (a instanceof THREE.Face4) {
      d = b.vertices[a.a];
      e = b.vertices[a.b];
      f = b.vertices[a.c];
      var b = b.vertices[a.d], g;
      c ? a._area1 && a._area2 ? (c = a._area1, g = a._area2) : (c = THREE.GeometryUtils.triangleArea(d, e, b), g = THREE.GeometryUtils.triangleArea(e, f, b), a._area1 = c, a._area2 = g) : (c = THREE.GeometryUtils.triangleArea(
        d,
        e,
        b
      ), g = THREE.GeometryUtils.triangleArea(e, f, b));
      return THREE.GeometryUtils.random() * (c + g) < c ? THREE.GeometryUtils.randomPointInTriangle(d, e, b) : THREE.GeometryUtils.randomPointInTriangle(e, f, b);
    }
  }, randomPointsInGeometry: function(a, b) {
    function c(a2) {
      function b2(c2, d2) {
        if (d2 < c2)
          return c2;
        var e2 = c2 + Math.floor((d2 - c2) / 2);
        return k[e2] > a2 ? b2(c2, e2 - 1) : k[e2] < a2 ? b2(e2 + 1, d2) : e2;
      }
      return b2(0, k.length - 1);
    }
    var d, e, f = a.faces, g = a.vertices, h = f.length, i = 0, k = [], l, m, p, s;
    for (e = 0; e < h; e++)
      d = f[e], d instanceof THREE.Face3 ? (l = g[d.a], m = g[d.b], p = g[d.c], d._area = THREE.GeometryUtils.triangleArea(l, m, p)) : d instanceof THREE.Face4 && (l = g[d.a], m = g[d.b], p = g[d.c], s = g[d.d], d._area1 = THREE.GeometryUtils.triangleArea(l, m, s), d._area2 = THREE.GeometryUtils.triangleArea(m, p, s), d._area = d._area1 + d._area2), i += d._area, k[e] = i;
    d = [];
    for (e = 0; e < b; e++)
      g = THREE.GeometryUtils.random() * i, g = c(g), d[e] = THREE.GeometryUtils.randomPointInFace(f[g], a, true);
    return d;
  }, triangleArea: function(a, b, c) {
    var d = THREE.GeometryUtils.__v1, e = THREE.GeometryUtils.__v2;
    d.sub(b, a);
    e.sub(c, a);
    d.crossSelf(e);
    return 0.5 * d.length();
  }, center: function(a) {
    a.computeBoundingBox();
    var b = a.boundingBox, c = new THREE.Vector3();
    c.add(b.min, b.max);
    c.multiplyScalar(-0.5);
    a.applyMatrix(new THREE.Matrix4().makeTranslation(c));
    a.computeBoundingBox();
    return c;
  }, normalizeUVs: function(a) {
    for (var a = a.faceVertexUvs[0], b = 0, c = a.length; b < c; b++)
      for (var d = a[b], e = 0, f = d.length; e < f; e++)
        1 !== d[e].x && (d[e].x -= Math.floor(d[e].x)), 1 !== d[e].y && (d[e].y -= Math.floor(d[e].y));
  }, triangulateQuads: function(a) {
    var b, c, d, e, f = [], g = [], h = [];
    b = 0;
    for (c = a.faceUvs.length; b < c; b++)
      g[b] = [];
    b = 0;
    for (c = a.faceVertexUvs.length; b < c; b++)
      h[b] = [];
    b = 0;
    for (c = a.faces.length; b < c; b++)
      if (d = a.faces[b], d instanceof THREE.Face4) {
        e = d.a;
        var i = d.b, k = d.c, l = d.d, m = new THREE.Face3(), p = new THREE.Face3();
        m.color.copy(d.color);
        p.color.copy(d.color);
        m.materialIndex = d.materialIndex;
        p.materialIndex = d.materialIndex;
        m.a = e;
        m.b = i;
        m.c = l;
        p.a = i;
        p.b = k;
        p.c = l;
        4 === d.vertexColors.length && (m.vertexColors[0] = d.vertexColors[0].clone(), m.vertexColors[1] = d.vertexColors[1].clone(), m.vertexColors[2] = d.vertexColors[3].clone(), p.vertexColors[0] = d.vertexColors[1].clone(), p.vertexColors[1] = d.vertexColors[2].clone(), p.vertexColors[2] = d.vertexColors[3].clone());
        f.push(m, p);
        d = 0;
        for (e = a.faceVertexUvs.length; d < e; d++)
          a.faceVertexUvs[d].length && (m = a.faceVertexUvs[d][b], i = m[1], k = m[2], l = m[3], m = [m[0].clone(), i.clone(), l.clone()], i = [i.clone(), k.clone(), l.clone()], h[d].push(m, i));
        d = 0;
        for (e = a.faceUvs.length; d < e; d++)
          a.faceUvs[d].length && (i = a.faceUvs[d][b], g[d].push(i, i));
      } else {
        f.push(d);
        d = 0;
        for (e = a.faceUvs.length; d < e; d++)
          g[d].push(a.faceUvs[d][b]);
        d = 0;
        for (e = a.faceVertexUvs.length; d < e; d++)
          h[d].push(a.faceVertexUvs[d][b]);
      }
    a.faces = f;
    a.faceUvs = g;
    a.faceVertexUvs = h;
    a.computeCentroids();
    a.computeFaceNormals();
    a.computeVertexNormals();
    a.hasTangents && a.computeTangents();
  }, explode: function(a) {
    for (var b = [], c = 0, d = a.faces.length; c < d; c++) {
      var e = b.length, f = a.faces[c];
      if (f instanceof THREE.Face4) {
        var g = f.a, h = f.b, i = f.c, g = a.vertices[g], h = a.vertices[h], i = a.vertices[i], k = a.vertices[f.d];
        b.push(g.clone());
        b.push(h.clone());
        b.push(i.clone());
        b.push(k.clone());
        f.a = e;
        f.b = e + 1;
        f.c = e + 2;
        f.d = e + 3;
      } else
        g = f.a, h = f.b, i = f.c, g = a.vertices[g], h = a.vertices[h], i = a.vertices[i], b.push(g.clone()), b.push(h.clone()), b.push(i.clone()), f.a = e, f.b = e + 1, f.c = e + 2;
    }
    a.vertices = b;
    delete a.__tmpVertices;
  }, tessellate: function(a, b) {
    var c, d, e, f, g, h, i, k, l, m, p, s, q, n, r, v, w, x, t, K = [], D = [];
    c = 0;
    for (d = a.faceVertexUvs.length; c < d; c++)
      D[c] = [];
    c = 0;
    for (d = a.faces.length; c < d; c++)
      if (e = a.faces[c], e instanceof THREE.Face3)
        if (f = e.a, g = e.b, h = e.c, k = a.vertices[f], l = a.vertices[g], m = a.vertices[h], s = k.distanceTo(l), q = l.distanceTo(m), p = k.distanceTo(m), s > b || q > b || p > b) {
          i = a.vertices.length;
          x = e.clone();
          t = e.clone();
          s >= q && s >= p ? (k = k.clone(), k.lerpSelf(l, 0.5), x.a = f, x.b = i, x.c = h, t.a = i, t.b = g, t.c = h, 3 === e.vertexNormals.length && (f = e.vertexNormals[0].clone(), f.lerpSelf(e.vertexNormals[1], 0.5), x.vertexNormals[1].copy(f), t.vertexNormals[0].copy(f)), 3 === e.vertexColors.length && (f = e.vertexColors[0].clone(), f.lerpSelf(e.vertexColors[1], 0.5), x.vertexColors[1].copy(f), t.vertexColors[0].copy(f)), e = 0) : q >= s && q >= p ? (k = l.clone(), k.lerpSelf(m, 0.5), x.a = f, x.b = g, x.c = i, t.a = i, t.b = h, t.c = f, 3 === e.vertexNormals.length && (f = e.vertexNormals[1].clone(), f.lerpSelf(e.vertexNormals[2], 0.5), x.vertexNormals[2].copy(f), t.vertexNormals[0].copy(f), t.vertexNormals[1].copy(e.vertexNormals[2]), t.vertexNormals[2].copy(e.vertexNormals[0])), 3 === e.vertexColors.length && (f = e.vertexColors[1].clone(), f.lerpSelf(e.vertexColors[2], 0.5), x.vertexColors[2].copy(f), t.vertexColors[0].copy(f), t.vertexColors[1].copy(e.vertexColors[2]), t.vertexColors[2].copy(e.vertexColors[0])), e = 1) : (k = k.clone(), k.lerpSelf(m, 0.5), x.a = f, x.b = g, x.c = i, t.a = i, t.b = g, t.c = h, 3 === e.vertexNormals.length && (f = e.vertexNormals[0].clone(), f.lerpSelf(e.vertexNormals[2], 0.5), x.vertexNormals[2].copy(f), t.vertexNormals[0].copy(f)), 3 === e.vertexColors.length && (f = e.vertexColors[0].clone(), f.lerpSelf(e.vertexColors[2], 0.5), x.vertexColors[2].copy(f), t.vertexColors[0].copy(f)), e = 2);
          K.push(x, t);
          a.vertices.push(k);
          f = 0;
          for (g = a.faceVertexUvs.length; f < g; f++)
            a.faceVertexUvs[f].length && (k = a.faceVertexUvs[f][c], t = k[0], h = k[1], x = k[2], 0 === e ? (l = t.clone(), l.lerpSelf(h, 0.5), k = [t.clone(), l.clone(), x.clone()], h = [l.clone(), h.clone(), x.clone()]) : 1 === e ? (l = h.clone(), l.lerpSelf(x, 0.5), k = [t.clone(), h.clone(), l.clone()], h = [l.clone(), x.clone(), t.clone()]) : (l = t.clone(), l.lerpSelf(x, 0.5), k = [t.clone(), h.clone(), l.clone()], h = [l.clone(), h.clone(), x.clone()]), D[f].push(k, h));
        } else {
          K.push(e);
          f = 0;
          for (g = a.faceVertexUvs.length; f < g; f++)
            D[f].push(a.faceVertexUvs[f][c]);
        }
      else if (f = e.a, g = e.b, h = e.c, i = e.d, k = a.vertices[f], l = a.vertices[g], m = a.vertices[h], p = a.vertices[i], s = k.distanceTo(l), q = l.distanceTo(m), n = m.distanceTo(p), r = k.distanceTo(p), s > b || q > b || n > b || r > b) {
        v = a.vertices.length;
        w = a.vertices.length + 1;
        x = e.clone();
        t = e.clone();
        s >= q && s >= n && s >= r || n >= q && n >= s && n >= r ? (s = k.clone(), s.lerpSelf(l, 0.5), l = m.clone(), l.lerpSelf(p, 0.5), x.a = f, x.b = v, x.c = w, x.d = i, t.a = v, t.b = g, t.c = h, t.d = w, 4 === e.vertexNormals.length && (f = e.vertexNormals[0].clone(), f.lerpSelf(e.vertexNormals[1], 0.5), g = e.vertexNormals[2].clone(), g.lerpSelf(e.vertexNormals[3], 0.5), x.vertexNormals[1].copy(f), x.vertexNormals[2].copy(g), t.vertexNormals[0].copy(f), t.vertexNormals[3].copy(g)), 4 === e.vertexColors.length && (f = e.vertexColors[0].clone(), f.lerpSelf(e.vertexColors[1], 0.5), g = e.vertexColors[2].clone(), g.lerpSelf(e.vertexColors[3], 0.5), x.vertexColors[1].copy(f), x.vertexColors[2].copy(g), t.vertexColors[0].copy(f), t.vertexColors[3].copy(g)), e = 0) : (s = l.clone(), s.lerpSelf(m, 0.5), l = p.clone(), l.lerpSelf(k, 0.5), x.a = f, x.b = g, x.c = v, x.d = w, t.a = w, t.b = v, t.c = h, t.d = i, 4 === e.vertexNormals.length && (f = e.vertexNormals[1].clone(), f.lerpSelf(
          e.vertexNormals[2],
          0.5
        ), g = e.vertexNormals[3].clone(), g.lerpSelf(e.vertexNormals[0], 0.5), x.vertexNormals[2].copy(f), x.vertexNormals[3].copy(g), t.vertexNormals[0].copy(g), t.vertexNormals[1].copy(f)), 4 === e.vertexColors.length && (f = e.vertexColors[1].clone(), f.lerpSelf(e.vertexColors[2], 0.5), g = e.vertexColors[3].clone(), g.lerpSelf(e.vertexColors[0], 0.5), x.vertexColors[2].copy(f), x.vertexColors[3].copy(g), t.vertexColors[0].copy(g), t.vertexColors[1].copy(f)), e = 1);
        K.push(x, t);
        a.vertices.push(s, l);
        f = 0;
        for (g = a.faceVertexUvs.length; f < g; f++)
          a.faceVertexUvs[f].length && (k = a.faceVertexUvs[f][c], t = k[0], h = k[1], x = k[2], k = k[3], 0 === e ? (l = t.clone(), l.lerpSelf(h, 0.5), m = x.clone(), m.lerpSelf(k, 0.5), t = [t.clone(), l.clone(), m.clone(), k.clone()], h = [l.clone(), h.clone(), x.clone(), m.clone()]) : (l = h.clone(), l.lerpSelf(x, 0.5), m = k.clone(), m.lerpSelf(t, 0.5), t = [t.clone(), h.clone(), l.clone(), m.clone()], h = [m.clone(), l.clone(), x.clone(), k.clone()]), D[f].push(t, h));
      } else {
        K.push(e);
        f = 0;
        for (g = a.faceVertexUvs.length; f < g; f++)
          D[f].push(a.faceVertexUvs[f][c]);
      }
    a.faces = K;
    a.faceVertexUvs = D;
  }, setMaterialIndex: function(a, b, c, d) {
    a = a.faces;
    d = d || a.length - 1;
    for (c = c || 0; c <= d; c++)
      a[c].materialIndex = b;
  } };
  THREE.GeometryUtils.random = THREE.Math.random16;
  THREE.GeometryUtils.__v1 = new THREE.Vector3();
  THREE.GeometryUtils.__v2 = new THREE.Vector3();
  THREE.ImageUtils = { crossOrigin: "anonymous", loadTexture: function(a, b, c, d) {
    var e = new Image(), f = new THREE.Texture(e, b), b = new THREE.ImageLoader();
    b.addEventListener("load", function(a2) {
      f.image = a2.content;
      f.needsUpdate = true;
      c && c(f);
    });
    b.addEventListener("error", function(a2) {
      d && d(a2.message);
    });
    b.crossOrigin = this.crossOrigin;
    b.load(a, e);
    f.sourceFile = a;
    return f;
  }, loadCompressedTexture: function(a, b, c, d) {
    var e = new THREE.CompressedTexture();
    e.mapping = b;
    var f = new XMLHttpRequest();
    f.onload = function() {
      var a2 = THREE.ImageUtils.parseDDS(
        f.response,
        true
      );
      e.format = a2.format;
      e.mipmaps = a2.mipmaps;
      e.image.width = a2.width;
      e.image.height = a2.height;
      e.generateMipmaps = false;
      e.needsUpdate = true;
      c && c(e);
    };
    f.onerror = d;
    f.open("GET", a, true);
    f.responseType = "arraybuffer";
    f.send(null);
    return e;
  }, loadTextureCube: function(a, b, c, d) {
    var e = [];
    e.loadCount = 0;
    var f = new THREE.Texture();
    f.image = e;
    void 0 !== b && (f.mapping = b);
    f.flipY = false;
    for (var b = 0, g = a.length; b < g; ++b) {
      var h = new Image();
      e[b] = h;
      h.onload = function() {
        e.loadCount += 1;
        6 === e.loadCount && (f.needsUpdate = true, c && c(f));
      };
      h.onerror = d;
      h.crossOrigin = this.crossOrigin;
      h.src = a[b];
    }
    return f;
  }, loadCompressedTextureCube: function(a, b, c, d) {
    var e = [];
    e.loadCount = 0;
    var f = new THREE.CompressedTexture();
    f.image = e;
    void 0 !== b && (f.mapping = b);
    f.flipY = false;
    f.generateMipmaps = false;
    b = function(a2, b2) {
      return function() {
        var d2 = THREE.ImageUtils.parseDDS(a2.response, true);
        b2.format = d2.format;
        b2.mipmaps = d2.mipmaps;
        b2.width = d2.width;
        b2.height = d2.height;
        e.loadCount += 1;
        6 === e.loadCount && (f.format = d2.format, f.needsUpdate = true, c && c(f));
      };
    };
    if (a instanceof Array)
      for (var g = 0, h = a.length; g < h; ++g) {
        var i = {};
        e[g] = i;
        var k = new XMLHttpRequest();
        k.onload = b(k, i);
        k.onerror = d;
        i = a[g];
        k.open("GET", i, true);
        k.responseType = "arraybuffer";
        k.send(null);
      }
    else
      k = new XMLHttpRequest(), k.onload = function() {
        var a2 = THREE.ImageUtils.parseDDS(k.response, true);
        if (a2.isCubemap) {
          for (var b2 = a2.mipmaps.length / a2.mipmapCount, d2 = 0; d2 < b2; d2++) {
            e[d2] = { mipmaps: [] };
            for (var g2 = 0; g2 < a2.mipmapCount; g2++)
              e[d2].mipmaps.push(a2.mipmaps[d2 * a2.mipmapCount + g2]), e[d2].format = a2.format, e[d2].width = a2.width, e[d2].height = a2.height;
          }
          f.format = a2.format;
          f.needsUpdate = true;
          c && c(f);
        }
      }, k.onerror = d, k.open("GET", a, true), k.responseType = "arraybuffer", k.send(null);
    return f;
  }, parseDDS: function(a, b) {
    function c(a2) {
      return a2.charCodeAt(0) + (a2.charCodeAt(1) << 8) + (a2.charCodeAt(2) << 16) + (a2.charCodeAt(3) << 24);
    }
    var d = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 }, e = c("DXT1"), f = c("DXT3"), g = c("DXT5"), h = new Int32Array(a, 0, 31);
    if (542327876 !== h[0])
      return console.error("ImageUtils.parseDDS(): Invalid magic number in DDS header"), d;
    if (!h[20] & 4)
      return console.error("ImageUtils.parseDDS(): Unsupported format, must contain a FourCC code"), d;
    var i = h[21];
    switch (i) {
      case e:
        e = 8;
        d.format = THREE.RGB_S3TC_DXT1_Format;
        break;
      case f:
        e = 16;
        d.format = THREE.RGBA_S3TC_DXT3_Format;
        break;
      case g:
        e = 16;
        d.format = THREE.RGBA_S3TC_DXT5_Format;
        break;
      default:
        return console.error("ImageUtils.parseDDS(): Unsupported FourCC code: ", String.fromCharCode(i & 255, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255)), d;
    }
    d.mipmapCount = 1;
    h[2] & 131072 && false !== b && (d.mipmapCount = Math.max(1, h[7]));
    d.isCubemap = h[28] & 512 ? true : false;
    d.width = h[4];
    d.height = h[3];
    for (var h = h[1] + 4, f = d.width, g = d.height, i = d.isCubemap ? 6 : 1, k = 0; k < i; k++) {
      for (var l = 0; l < d.mipmapCount; l++) {
        var m = Math.max(4, f) / 4 * Math.max(4, g) / 4 * e, p = { data: new Uint8Array(a, h, m), width: f, height: g };
        d.mipmaps.push(p);
        h += m;
        f = Math.max(0.5 * f, 1);
        g = Math.max(0.5 * g, 1);
      }
      f = d.width;
      g = d.height;
    }
    return d;
  }, getNormalMap: function(a, b) {
    var c = function(a2) {
      var b2 = Math.sqrt(a2[0] * a2[0] + a2[1] * a2[1] + a2[2] * a2[2]);
      return [a2[0] / b2, a2[1] / b2, a2[2] / b2];
    }, b = b | 1, d = a.width, e = a.height, f = document.createElement("canvas");
    f.width = d;
    f.height = e;
    var g = f.getContext("2d");
    g.drawImage(a, 0, 0);
    for (var h = g.getImageData(
      0,
      0,
      d,
      e
    ).data, i = g.createImageData(d, e), k = i.data, l = 0; l < d; l++)
      for (var m = 0; m < e; m++) {
        var p = 0 > m - 1 ? 0 : m - 1, s = m + 1 > e - 1 ? e - 1 : m + 1, q = 0 > l - 1 ? 0 : l - 1, n = l + 1 > d - 1 ? d - 1 : l + 1, r = [], v = [0, 0, h[4 * (m * d + l)] / 255 * b];
        r.push([-1, 0, h[4 * (m * d + q)] / 255 * b]);
        r.push([-1, -1, h[4 * (p * d + q)] / 255 * b]);
        r.push([0, -1, h[4 * (p * d + l)] / 255 * b]);
        r.push([1, -1, h[4 * (p * d + n)] / 255 * b]);
        r.push([1, 0, h[4 * (m * d + n)] / 255 * b]);
        r.push([1, 1, h[4 * (s * d + n)] / 255 * b]);
        r.push([0, 1, h[4 * (s * d + l)] / 255 * b]);
        r.push([-1, 1, h[4 * (s * d + q)] / 255 * b]);
        p = [];
        q = r.length;
        for (s = 0; s < q; s++) {
          var n = r[s], w = r[(s + 1) % q], n = [n[0] - v[0], n[1] - v[1], n[2] - v[2]], w = [w[0] - v[0], w[1] - v[1], w[2] - v[2]];
          p.push(c([n[1] * w[2] - n[2] * w[1], n[2] * w[0] - n[0] * w[2], n[0] * w[1] - n[1] * w[0]]));
        }
        r = [0, 0, 0];
        for (s = 0; s < p.length; s++)
          r[0] += p[s][0], r[1] += p[s][1], r[2] += p[s][2];
        r[0] /= p.length;
        r[1] /= p.length;
        r[2] /= p.length;
        v = 4 * (m * d + l);
        k[v] = 255 * ((r[0] + 1) / 2) | 0;
        k[v + 1] = 255 * ((r[1] + 1) / 2) | 0;
        k[v + 2] = 255 * r[2] | 0;
        k[v + 3] = 255;
      }
    g.putImageData(i, 0, 0);
    return f;
  }, generateDataTexture: function(a, b, c) {
    for (var d = a * b, e = new Uint8Array(3 * d), f = Math.floor(255 * c.r), g = Math.floor(255 * c.g), c = Math.floor(255 * c.b), h = 0; h < d; h++)
      e[3 * h] = f, e[3 * h + 1] = g, e[3 * h + 2] = c;
    a = new THREE.DataTexture(e, a, b, THREE.RGBFormat);
    a.needsUpdate = true;
    return a;
  } };
  THREE.SceneUtils = { createMultiMaterialObject: function(a, b) {
    for (var c = new THREE.Object3D(), d = 0, e = b.length; d < e; d++)
      c.add(new THREE.Mesh(a, b[d]));
    return c;
  }, detach: function(a, b, c) {
    a.applyMatrix(b.matrixWorld);
    b.remove(a);
    c.add(a);
  }, attach: function(a, b, c) {
    var d = new THREE.Matrix4();
    d.getInverse(c.matrixWorld);
    a.applyMatrix(d);
    b.remove(a);
    c.add(a);
  } };
  THREE.ShaderUtils = { lib: {
    fresnel: {
      uniforms: { mRefractionRatio: { type: "f", value: 1.02 }, mFresnelBias: { type: "f", value: 0.1 }, mFresnelPower: { type: "f", value: 2 }, mFresnelScale: { type: "f", value: 1 }, tCube: { type: "t", value: null } },
      fragmentShader: "uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",
      vertexShader: "uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\nvec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );\nvec3 I = worldPosition.xyz - cameraPosition;\nvReflect = reflect( I, worldNormal );\nvRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"
    },
    normal: { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, THREE.UniformsLib.lights, THREE.UniformsLib.shadowmap, { enableAO: { type: "i", value: 0 }, enableDiffuse: { type: "i", value: 0 }, enableSpecular: { type: "i", value: 0 }, enableReflection: { type: "i", value: 0 }, enableDisplacement: { type: "i", value: 0 }, tDisplacement: { type: "t", value: null }, tDiffuse: { type: "t", value: null }, tCube: { type: "t", value: null }, tNormal: { type: "t", value: null }, tSpecular: { type: "t", value: null }, tAO: { type: "t", value: null }, uNormalScale: { type: "v2", value: new THREE.Vector2(
      1,
      1
    ) }, uDisplacementBias: { type: "f", value: 0 }, uDisplacementScale: { type: "f", value: 1 }, uDiffuseColor: { type: "c", value: new THREE.Color(16777215) }, uSpecularColor: { type: "c", value: new THREE.Color(1118481) }, uAmbientColor: { type: "c", value: new THREE.Color(16777215) }, uShininess: { type: "f", value: 30 }, uOpacity: { type: "f", value: 1 }, useRefract: { type: "i", value: 0 }, uRefractionRatio: { type: "f", value: 0.98 }, uReflectivity: { type: "f", value: 0.5 }, uOffset: { type: "v2", value: new THREE.Vector2(0, 0) }, uRepeat: { type: "v2", value: new THREE.Vector2(
      1,
      1
    ) }, wrapRGB: { type: "v3", value: new THREE.Vector3(1, 1, 1) } }]), fragmentShader: [
      "uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform vec2 uNormalScale;\nuniform bool useRefract;\nuniform float uRefractionRatio;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\nuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
      THREE.ShaderChunk.shadowmap_pars_fragment,
      THREE.ShaderChunk.fog_pars_fragment,
      "void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\n#ifdef FLIP_SIDED\nfinalNormal = -finalNormal;\n#endif\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 pointVector = lPosition.xyz + vViewPosition.xyz;\nfloat pointDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\npointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );\npointVector = normalize( pointVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 spotVector = lPosition.xyz + vViewPosition.xyz;\nfloat spotDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nspotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );\nspotVector = normalize( spotVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngleCos[ i ] ) {\nspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );\n#endif\nspotDiffuse += spotDistance * spotLightColor[ i ] * uDiffuseColor * spotDiffuseWeight * spotEffect;\nvec3 spotHalfVector = normalize( spotVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( spotVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += spotDistance * spotLightColor[ i ] * uSpecularColor * spotSpecularWeight * spotDiffuseWeight * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nvec3 hemiDiffuse  = vec3( 0.0 );\nvec3 hemiSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\nvec3 lVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, lVector );\nfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\nhemiDiffuse += uDiffuseColor * hemiColor;\nvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\nfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\nfloat hemiSpecularWeightSky = specularTex.r * max( pow( hemiDotNormalHalfSky, uShininess ), 0.0 );\nvec3 lVectorGround = -lVector;\nvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\nfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\nfloat hemiSpecularWeightGround = specularTex.r * max( pow( hemiDotNormalHalfGround, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlickSky = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );\nvec3 schlickGround = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );\nhemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\nhemiSpecular += uSpecularColor * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_HEMI_LIGHTS > 0\ntotalDiffuse += hemiDiffuse;\ntotalSpecular += hemiSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor ) + totalSpecular;\n#endif\nif ( enableReflection ) {\nvec3 vReflect;\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\nif ( useRefract ) {\nvReflect = refract( cameraToVertex, normal, uRefractionRatio );\n} else {\nvReflect = reflect( cameraToVertex, normal );\n}\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",
      THREE.ShaderChunk.shadowmap_fragment,
      THREE.ShaderChunk.linear_to_gamma_fragment,
      THREE.ShaderChunk.fog_fragment,
      "}"
    ].join("\n"), vertexShader: [
      "attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\nuniform bool enableDisplacement;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
      THREE.ShaderChunk.skinning_pars_vertex,
      THREE.ShaderChunk.shadowmap_pars_vertex,
      "void main() {",
      THREE.ShaderChunk.skinbase_vertex,
      THREE.ShaderChunk.skinnormal_vertex,
      "#ifdef USE_SKINNING\nvNormal = normalize( normalMatrix * skinnedNormal.xyz );\nvec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );\nvTangent = normalize( normalMatrix * skinnedTangent.xyz );\n#else\nvNormal = normalize( normalMatrix * normal );\nvTangent = normalize( normalMatrix * tangent.xyz );\n#endif\nvBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );\nvUv = uv * uRepeat + uOffset;\nvec3 displacedPosition;\n#ifdef VERTEX_TEXTURES\nif ( enableDisplacement ) {\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\ndisplacedPosition = position + normalize( normal ) * df;\n} else {\n#ifdef USE_SKINNING\nvec4 skinVertex = vec4( position, 1.0 );\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned 	  += boneMatY * skinVertex * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n}\n#else\n#ifdef USE_SKINNING\nvec4 skinVertex = vec4( position, 1.0 );\nvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\nskinned 	  += boneMatY * skinVertex * skinWeight.y;\ndisplacedPosition  = skinned.xyz;\n#else\ndisplacedPosition = position;\n#endif\n#endif\nvec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );\nvec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\nvWorldPosition = worldPosition.xyz;\nvViewPosition = -mvPosition.xyz;\n#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n}\n#endif\n}"
    ].join("\n") },
    cube: { uniforms: { tCube: { type: "t", value: null }, tFlip: { type: "f", value: -1 } }, vertexShader: "varying vec3 vWorldPosition;\nvoid main() {\nvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\nvWorldPosition = worldPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", fragmentShader: "uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;\nvoid main() {\ngl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n}" }
  } };
  THREE.FontUtils = { faces: {}, face: "helvetiker", weight: "normal", style: "normal", size: 150, divisions: 10, getFace: function() {
    return this.faces[this.face][this.weight][this.style];
  }, loadFace: function(a) {
    var b = a.familyName.toLowerCase();
    this.faces[b] = this.faces[b] || {};
    this.faces[b][a.cssFontWeight] = this.faces[b][a.cssFontWeight] || {};
    this.faces[b][a.cssFontWeight][a.cssFontStyle] = a;
    return this.faces[b][a.cssFontWeight][a.cssFontStyle] = a;
  }, drawText: function(a) {
    for (var b = this.getFace(), c = this.size / b.resolution, d = 0, e = String(a).split(""), f = e.length, g = [], a = 0; a < f; a++) {
      var h = new THREE.Path(), h = this.extractGlyphPoints(e[a], b, c, d, h), d = d + h.offset;
      g.push(h.path);
    }
    return { paths: g, offset: d / 2 };
  }, extractGlyphPoints: function(a, b, c, d, e) {
    var f = [], g, h, i, k, l, m, p, s, q, n, r, v = b.glyphs[a] || b.glyphs["?"];
    if (v) {
      if (v.o) {
        b = v._cachedOutline || (v._cachedOutline = v.o.split(" "));
        k = b.length;
        for (a = 0; a < k; )
          switch (i = b[a++], i) {
            case "m":
              i = b[a++] * c + d;
              l = b[a++] * c;
              e.moveTo(i, l);
              break;
            case "l":
              i = b[a++] * c + d;
              l = b[a++] * c;
              e.lineTo(i, l);
              break;
            case "q":
              i = b[a++] * c + d;
              l = b[a++] * c;
              s = b[a++] * c + d;
              q = b[a++] * c;
              e.quadraticCurveTo(s, q, i, l);
              if (g = f[f.length - 1]) {
                m = g.x;
                p = g.y;
                g = 1;
                for (h = this.divisions; g <= h; g++) {
                  var w = g / h;
                  THREE.Shape.Utils.b2(w, m, s, i);
                  THREE.Shape.Utils.b2(w, p, q, l);
                }
              }
              break;
            case "b":
              if (i = b[a++] * c + d, l = b[a++] * c, s = b[a++] * c + d, q = b[a++] * -c, n = b[a++] * c + d, r = b[a++] * -c, e.bezierCurveTo(i, l, s, q, n, r), g = f[f.length - 1]) {
                m = g.x;
                p = g.y;
                g = 1;
                for (h = this.divisions; g <= h; g++)
                  w = g / h, THREE.Shape.Utils.b3(w, m, s, n, i), THREE.Shape.Utils.b3(w, p, q, r, l);
              }
          }
      }
      return { offset: v.ha * c, path: e };
    }
  } };
  THREE.FontUtils.generateShapes = function(a, b) {
    var b = b || {}, c = void 0 !== b.curveSegments ? b.curveSegments : 4, d = void 0 !== b.font ? b.font : "helvetiker", e = void 0 !== b.weight ? b.weight : "normal", f = void 0 !== b.style ? b.style : "normal";
    THREE.FontUtils.size = void 0 !== b.size ? b.size : 100;
    THREE.FontUtils.divisions = c;
    THREE.FontUtils.face = d;
    THREE.FontUtils.weight = e;
    THREE.FontUtils.style = f;
    c = THREE.FontUtils.drawText(a).paths;
    d = [];
    e = 0;
    for (f = c.length; e < f; e++)
      Array.prototype.push.apply(d, c[e].toShapes());
    return d;
  };
  (function(a) {
    var b = function(a2) {
      for (var b2 = a2.length, e = 0, f = b2 - 1, g = 0; g < b2; f = g++)
        e += a2[f].x * a2[g].y - a2[g].x * a2[f].y;
      return 0.5 * e;
    };
    a.Triangulate = function(a2, d) {
      var e = a2.length;
      if (3 > e)
        return null;
      var f = [], g = [], h = [], i, k, l;
      if (0 < b(a2))
        for (k = 0; k < e; k++)
          g[k] = k;
      else
        for (k = 0; k < e; k++)
          g[k] = e - 1 - k;
      var m = 2 * e;
      for (k = e - 1; 2 < e; ) {
        if (0 >= m--) {
          console.log("Warning, unable to triangulate polygon!");
          break;
        }
        i = k;
        e <= i && (i = 0);
        k = i + 1;
        e <= k && (k = 0);
        l = k + 1;
        e <= l && (l = 0);
        var p;
        a: {
          var s = p = void 0, q = void 0, n = void 0, r = void 0, v = void 0, w = void 0, x = void 0, t = void 0, s = a2[g[i]].x, q = a2[g[i]].y, n = a2[g[k]].x, r = a2[g[k]].y, v = a2[g[l]].x, w = a2[g[l]].y;
          if (1e-10 > (n - s) * (w - q) - (r - q) * (v - s))
            p = false;
          else {
            var K = void 0, D = void 0, B = void 0, z = void 0, E = void 0, G = void 0, I = void 0, Y = void 0, C = void 0, P = void 0, C = Y = I = t = x = void 0, K = v - n, D = w - r, B = s - v, z = q - w, E = n - s, G = r - q;
            for (p = 0; p < e; p++)
              if (!(p === i || p === k || p === l)) {
                if (x = a2[g[p]].x, t = a2[g[p]].y, I = x - s, Y = t - q, C = x - n, P = t - r, x -= v, t -= w, C = K * P - D * C, I = E * Y - G * I, Y = B * t - z * x, 0 <= C && 0 <= Y && 0 <= I) {
                  p = false;
                  break a;
                }
              }
            p = true;
          }
        }
        if (p) {
          f.push([a2[g[i]], a2[g[k]], a2[g[l]]]);
          h.push([g[i], g[k], g[l]]);
          i = k;
          for (l = k + 1; l < e; i++, l++)
            g[i] = g[l];
          e--;
          m = 2 * e;
        }
      }
      return d ? h : f;
    };
    a.Triangulate.area = b;
    return a;
  })(THREE.FontUtils);
  self._typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
  THREE.Curve = function() {
  };
  THREE.Curve.prototype.getPoint = function() {
    console.log("Warning, getPoint() not implemented!");
    return null;
  };
  THREE.Curve.prototype.getPointAt = function(a) {
    a = this.getUtoTmapping(a);
    return this.getPoint(a);
  };
  THREE.Curve.prototype.getPoints = function(a) {
    a || (a = 5);
    var b, c = [];
    for (b = 0; b <= a; b++)
      c.push(this.getPoint(b / a));
    return c;
  };
  THREE.Curve.prototype.getSpacedPoints = function(a) {
    a || (a = 5);
    var b, c = [];
    for (b = 0; b <= a; b++)
      c.push(this.getPointAt(b / a));
    return c;
  };
  THREE.Curve.prototype.getLength = function() {
    var a = this.getLengths();
    return a[a.length - 1];
  };
  THREE.Curve.prototype.getLengths = function(a) {
    a || (a = this.__arcLengthDivisions ? this.__arcLengthDivisions : 200);
    if (this.cacheArcLengths && this.cacheArcLengths.length == a + 1 && !this.needsUpdate)
      return this.cacheArcLengths;
    this.needsUpdate = false;
    var b = [], c, d = this.getPoint(0), e, f = 0;
    b.push(0);
    for (e = 1; e <= a; e++)
      c = this.getPoint(e / a), f += c.distanceTo(d), b.push(f), d = c;
    return this.cacheArcLengths = b;
  };
  THREE.Curve.prototype.updateArcLengths = function() {
    this.needsUpdate = true;
    this.getLengths();
  };
  THREE.Curve.prototype.getUtoTmapping = function(a, b) {
    var c = this.getLengths(), d = 0, e = c.length, f;
    f = b ? b : a * c[e - 1];
    for (var g = 0, h = e - 1, i; g <= h; )
      if (d = Math.floor(g + (h - g) / 2), i = c[d] - f, 0 > i)
        g = d + 1;
      else if (0 < i)
        h = d - 1;
      else {
        h = d;
        break;
      }
    d = h;
    if (c[d] == f)
      return d / (e - 1);
    g = c[d];
    return c = (d + (f - g) / (c[d + 1] - g)) / (e - 1);
  };
  THREE.Curve.prototype.getTangent = function(a) {
    var b = a - 1e-4, a = a + 1e-4;
    0 > b && (b = 0);
    1 < a && (a = 1);
    b = this.getPoint(b);
    return this.getPoint(a).clone().subSelf(b).normalize();
  };
  THREE.Curve.prototype.getTangentAt = function(a) {
    a = this.getUtoTmapping(a);
    return this.getTangent(a);
  };
  THREE.LineCurve = function(a, b) {
    this.v1 = a;
    this.v2 = b;
  };
  THREE.LineCurve.prototype = Object.create(THREE.Curve.prototype);
  THREE.LineCurve.prototype.getPoint = function(a) {
    var b = this.v2.clone().subSelf(this.v1);
    b.multiplyScalar(a).addSelf(this.v1);
    return b;
  };
  THREE.LineCurve.prototype.getPointAt = function(a) {
    return this.getPoint(a);
  };
  THREE.LineCurve.prototype.getTangent = function() {
    return this.v2.clone().subSelf(this.v1).normalize();
  };
  THREE.QuadraticBezierCurve = function(a, b, c) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
  };
  THREE.QuadraticBezierCurve.prototype = Object.create(THREE.Curve.prototype);
  THREE.QuadraticBezierCurve.prototype.getPoint = function(a) {
    var b;
    b = THREE.Shape.Utils.b2(a, this.v0.x, this.v1.x, this.v2.x);
    a = THREE.Shape.Utils.b2(a, this.v0.y, this.v1.y, this.v2.y);
    return new THREE.Vector2(b, a);
  };
  THREE.QuadraticBezierCurve.prototype.getTangent = function(a) {
    var b;
    b = THREE.Curve.Utils.tangentQuadraticBezier(a, this.v0.x, this.v1.x, this.v2.x);
    a = THREE.Curve.Utils.tangentQuadraticBezier(a, this.v0.y, this.v1.y, this.v2.y);
    b = new THREE.Vector2(b, a);
    b.normalize();
    return b;
  };
  THREE.CubicBezierCurve = function(a, b, c, d) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
    this.v3 = d;
  };
  THREE.CubicBezierCurve.prototype = Object.create(THREE.Curve.prototype);
  THREE.CubicBezierCurve.prototype.getPoint = function(a) {
    var b;
    b = THREE.Shape.Utils.b3(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    a = THREE.Shape.Utils.b3(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    return new THREE.Vector2(b, a);
  };
  THREE.CubicBezierCurve.prototype.getTangent = function(a) {
    var b;
    b = THREE.Curve.Utils.tangentCubicBezier(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    a = THREE.Curve.Utils.tangentCubicBezier(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    b = new THREE.Vector2(b, a);
    b.normalize();
    return b;
  };
  THREE.SplineCurve = function(a) {
    this.points = void 0 == a ? [] : a;
  };
  THREE.SplineCurve.prototype = Object.create(THREE.Curve.prototype);
  THREE.SplineCurve.prototype.getPoint = function(a) {
    var b = new THREE.Vector2(), c = [], d = this.points, e;
    e = (d.length - 1) * a;
    a = Math.floor(e);
    e -= a;
    c[0] = 0 == a ? a : a - 1;
    c[1] = a;
    c[2] = a > d.length - 2 ? d.length - 1 : a + 1;
    c[3] = a > d.length - 3 ? d.length - 1 : a + 2;
    b.x = THREE.Curve.Utils.interpolate(d[c[0]].x, d[c[1]].x, d[c[2]].x, d[c[3]].x, e);
    b.y = THREE.Curve.Utils.interpolate(d[c[0]].y, d[c[1]].y, d[c[2]].y, d[c[3]].y, e);
    return b;
  };
  THREE.EllipseCurve = function(a, b, c, d, e, f, g) {
    this.aX = a;
    this.aY = b;
    this.xRadius = c;
    this.yRadius = d;
    this.aStartAngle = e;
    this.aEndAngle = f;
    this.aClockwise = g;
  };
  THREE.EllipseCurve.prototype = Object.create(THREE.Curve.prototype);
  THREE.EllipseCurve.prototype.getPoint = function(a) {
    var b = this.aEndAngle - this.aStartAngle;
    this.aClockwise || (a = 1 - a);
    b = this.aStartAngle + a * b;
    a = this.aX + this.xRadius * Math.cos(b);
    b = this.aY + this.yRadius * Math.sin(b);
    return new THREE.Vector2(a, b);
  };
  THREE.ArcCurve = function(a, b, c, d, e, f) {
    THREE.EllipseCurve.call(this, a, b, c, c, d, e, f);
  };
  THREE.ArcCurve.prototype = Object.create(THREE.EllipseCurve.prototype);
  THREE.Curve.Utils = { tangentQuadraticBezier: function(a, b, c, d) {
    return 2 * (1 - a) * (c - b) + 2 * a * (d - c);
  }, tangentCubicBezier: function(a, b, c, d, e) {
    return -3 * b * (1 - a) * (1 - a) + 3 * c * (1 - a) * (1 - a) - 6 * a * c * (1 - a) + 6 * a * d * (1 - a) - 3 * a * a * d + 3 * a * a * e;
  }, tangentSpline: function(a) {
    return 6 * a * a - 6 * a + (3 * a * a - 4 * a + 1) + (-6 * a * a + 6 * a) + (3 * a * a - 2 * a);
  }, interpolate: function(a, b, c, d, e) {
    var a = 0.5 * (c - a), d = 0.5 * (d - b), f = e * e;
    return (2 * b - 2 * c + a + d) * e * f + (-3 * b + 3 * c - 2 * a - d) * f + a * e + b;
  } };
  THREE.Curve.create = function(a, b) {
    a.prototype = Object.create(THREE.Curve.prototype);
    a.prototype.getPoint = b;
    return a;
  };
  THREE.LineCurve3 = THREE.Curve.create(function(a, b) {
    this.v1 = a;
    this.v2 = b;
  }, function(a) {
    var b = new THREE.Vector3();
    b.sub(this.v2, this.v1);
    b.multiplyScalar(a);
    b.addSelf(this.v1);
    return b;
  });
  THREE.QuadraticBezierCurve3 = THREE.Curve.create(function(a, b, c) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
  }, function(a) {
    var b, c;
    b = THREE.Shape.Utils.b2(a, this.v0.x, this.v1.x, this.v2.x);
    c = THREE.Shape.Utils.b2(a, this.v0.y, this.v1.y, this.v2.y);
    a = THREE.Shape.Utils.b2(a, this.v0.z, this.v1.z, this.v2.z);
    return new THREE.Vector3(b, c, a);
  });
  THREE.CubicBezierCurve3 = THREE.Curve.create(function(a, b, c, d) {
    this.v0 = a;
    this.v1 = b;
    this.v2 = c;
    this.v3 = d;
  }, function(a) {
    var b, c;
    b = THREE.Shape.Utils.b3(a, this.v0.x, this.v1.x, this.v2.x, this.v3.x);
    c = THREE.Shape.Utils.b3(a, this.v0.y, this.v1.y, this.v2.y, this.v3.y);
    a = THREE.Shape.Utils.b3(a, this.v0.z, this.v1.z, this.v2.z, this.v3.z);
    return new THREE.Vector3(b, c, a);
  });
  THREE.SplineCurve3 = THREE.Curve.create(function(a) {
    this.points = void 0 == a ? [] : a;
  }, function(a) {
    var b = new THREE.Vector3(), c = [], d = this.points, e, a = (d.length - 1) * a;
    e = Math.floor(a);
    a -= e;
    c[0] = 0 == e ? e : e - 1;
    c[1] = e;
    c[2] = e > d.length - 2 ? d.length - 1 : e + 1;
    c[3] = e > d.length - 3 ? d.length - 1 : e + 2;
    e = d[c[0]];
    var f = d[c[1]], g = d[c[2]], c = d[c[3]];
    b.x = THREE.Curve.Utils.interpolate(e.x, f.x, g.x, c.x, a);
    b.y = THREE.Curve.Utils.interpolate(e.y, f.y, g.y, c.y, a);
    b.z = THREE.Curve.Utils.interpolate(e.z, f.z, g.z, c.z, a);
    return b;
  });
  THREE.ClosedSplineCurve3 = THREE.Curve.create(function(a) {
    this.points = void 0 == a ? [] : a;
  }, function(a) {
    var b = new THREE.Vector3(), c = [], d = this.points, e;
    e = (d.length - 0) * a;
    a = Math.floor(e);
    e -= a;
    a += 0 < a ? 0 : (Math.floor(Math.abs(a) / d.length) + 1) * d.length;
    c[0] = (a - 1) % d.length;
    c[1] = a % d.length;
    c[2] = (a + 1) % d.length;
    c[3] = (a + 2) % d.length;
    b.x = THREE.Curve.Utils.interpolate(d[c[0]].x, d[c[1]].x, d[c[2]].x, d[c[3]].x, e);
    b.y = THREE.Curve.Utils.interpolate(d[c[0]].y, d[c[1]].y, d[c[2]].y, d[c[3]].y, e);
    b.z = THREE.Curve.Utils.interpolate(
      d[c[0]].z,
      d[c[1]].z,
      d[c[2]].z,
      d[c[3]].z,
      e
    );
    return b;
  });
  THREE.CurvePath = function() {
    this.curves = [];
    this.bends = [];
    this.autoClose = false;
  };
  THREE.CurvePath.prototype = Object.create(THREE.Curve.prototype);
  THREE.CurvePath.prototype.add = function(a) {
    this.curves.push(a);
  };
  THREE.CurvePath.prototype.checkConnection = function() {
  };
  THREE.CurvePath.prototype.closePath = function() {
    var a = this.curves[0].getPoint(0), b = this.curves[this.curves.length - 1].getPoint(1);
    a.equals(b) || this.curves.push(new THREE.LineCurve(b, a));
  };
  THREE.CurvePath.prototype.getPoint = function(a) {
    for (var b = a * this.getLength(), c = this.getCurveLengths(), a = 0; a < c.length; ) {
      if (c[a] >= b)
        return b = c[a] - b, a = this.curves[a], b = 1 - b / a.getLength(), a.getPointAt(b);
      a++;
    }
    return null;
  };
  THREE.CurvePath.prototype.getLength = function() {
    var a = this.getCurveLengths();
    return a[a.length - 1];
  };
  THREE.CurvePath.prototype.getCurveLengths = function() {
    if (this.cacheLengths && this.cacheLengths.length == this.curves.length)
      return this.cacheLengths;
    var a = [], b = 0, c, d = this.curves.length;
    for (c = 0; c < d; c++)
      b += this.curves[c].getLength(), a.push(b);
    return this.cacheLengths = a;
  };
  THREE.CurvePath.prototype.getBoundingBox = function() {
    var a = this.getPoints(), b, c, d, e, f, g;
    b = c = Number.NEGATIVE_INFINITY;
    e = f = Number.POSITIVE_INFINITY;
    var h, i, k, l, m = a[0] instanceof THREE.Vector3;
    l = m ? new THREE.Vector3() : new THREE.Vector2();
    i = 0;
    for (k = a.length; i < k; i++)
      h = a[i], h.x > b ? b = h.x : h.x < e && (e = h.x), h.y > c ? c = h.y : h.y < f && (f = h.y), m && (h.z > d ? d = h.z : h.z < g && (g = h.z)), l.addSelf(h);
    a = { minX: e, minY: f, maxX: b, maxY: c, centroid: l.divideScalar(k) };
    m && (a.maxZ = d, a.minZ = g);
    return a;
  };
  THREE.CurvePath.prototype.createPointsGeometry = function(a) {
    a = this.getPoints(a, true);
    return this.createGeometry(a);
  };
  THREE.CurvePath.prototype.createSpacedPointsGeometry = function(a) {
    a = this.getSpacedPoints(a, true);
    return this.createGeometry(a);
  };
  THREE.CurvePath.prototype.createGeometry = function(a) {
    for (var b = new THREE.Geometry(), c = 0; c < a.length; c++)
      b.vertices.push(new THREE.Vector3(a[c].x, a[c].y, a[c].z || 0));
    return b;
  };
  THREE.CurvePath.prototype.addWrapPath = function(a) {
    this.bends.push(a);
  };
  THREE.CurvePath.prototype.getTransformedPoints = function(a, b) {
    var c = this.getPoints(a), d, e;
    b || (b = this.bends);
    d = 0;
    for (e = b.length; d < e; d++)
      c = this.getWrapPoints(c, b[d]);
    return c;
  };
  THREE.CurvePath.prototype.getTransformedSpacedPoints = function(a, b) {
    var c = this.getSpacedPoints(a), d, e;
    b || (b = this.bends);
    d = 0;
    for (e = b.length; d < e; d++)
      c = this.getWrapPoints(c, b[d]);
    return c;
  };
  THREE.CurvePath.prototype.getWrapPoints = function(a, b) {
    var c = this.getBoundingBox(), d, e, f, g, h, i;
    d = 0;
    for (e = a.length; d < e; d++)
      f = a[d], g = f.x, h = f.y, i = g / c.maxX, i = b.getUtoTmapping(i, g), g = b.getPoint(i), h = b.getNormalVector(i).multiplyScalar(h), f.x = g.x + h.x, f.y = g.y + h.y;
    return a;
  };
  THREE.Gyroscope = function() {
    THREE.Object3D.call(this);
  };
  THREE.Gyroscope.prototype = Object.create(THREE.Object3D.prototype);
  THREE.Gyroscope.prototype.updateMatrixWorld = function(a) {
    this.matrixAutoUpdate && this.updateMatrix();
    if (this.matrixWorldNeedsUpdate || a)
      this.parent ? (this.matrixWorld.multiply(this.parent.matrixWorld, this.matrix), this.matrixWorld.decompose(this.translationWorld, this.rotationWorld, this.scaleWorld), this.matrix.decompose(this.translationObject, this.rotationObject, this.scaleObject), this.matrixWorld.compose(this.translationWorld, this.rotationObject, this.scaleWorld)) : this.matrixWorld.copy(this.matrix), this.matrixWorldNeedsUpdate = false, a = true;
    for (var b = 0, c = this.children.length; b < c; b++)
      this.children[b].updateMatrixWorld(a);
  };
  THREE.Gyroscope.prototype.translationWorld = new THREE.Vector3();
  THREE.Gyroscope.prototype.translationObject = new THREE.Vector3();
  THREE.Gyroscope.prototype.rotationWorld = new THREE.Quaternion();
  THREE.Gyroscope.prototype.rotationObject = new THREE.Quaternion();
  THREE.Gyroscope.prototype.scaleWorld = new THREE.Vector3();
  THREE.Gyroscope.prototype.scaleObject = new THREE.Vector3();
  THREE.Path = function(a) {
    THREE.CurvePath.call(this);
    this.actions = [];
    a && this.fromPoints(a);
  };
  THREE.Path.prototype = Object.create(THREE.CurvePath.prototype);
  THREE.PathActions = { MOVE_TO: "moveTo", LINE_TO: "lineTo", QUADRATIC_CURVE_TO: "quadraticCurveTo", BEZIER_CURVE_TO: "bezierCurveTo", CSPLINE_THRU: "splineThru", ARC: "arc", ELLIPSE: "ellipse" };
  THREE.Path.prototype.fromPoints = function(a) {
    this.moveTo(a[0].x, a[0].y);
    for (var b = 1, c = a.length; b < c; b++)
      this.lineTo(a[b].x, a[b].y);
  };
  THREE.Path.prototype.moveTo = function(a, b) {
    var c = Array.prototype.slice.call(arguments);
    this.actions.push({ action: THREE.PathActions.MOVE_TO, args: c });
  };
  THREE.Path.prototype.lineTo = function(a, b) {
    var c = Array.prototype.slice.call(arguments), d = this.actions[this.actions.length - 1].args, d = new THREE.LineCurve(new THREE.Vector2(d[d.length - 2], d[d.length - 1]), new THREE.Vector2(a, b));
    this.curves.push(d);
    this.actions.push({ action: THREE.PathActions.LINE_TO, args: c });
  };
  THREE.Path.prototype.quadraticCurveTo = function(a, b, c, d) {
    var e = Array.prototype.slice.call(arguments), f = this.actions[this.actions.length - 1].args, f = new THREE.QuadraticBezierCurve(new THREE.Vector2(f[f.length - 2], f[f.length - 1]), new THREE.Vector2(a, b), new THREE.Vector2(c, d));
    this.curves.push(f);
    this.actions.push({ action: THREE.PathActions.QUADRATIC_CURVE_TO, args: e });
  };
  THREE.Path.prototype.bezierCurveTo = function(a, b, c, d, e, f) {
    var g = Array.prototype.slice.call(arguments), h = this.actions[this.actions.length - 1].args, h = new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length - 2], h[h.length - 1]), new THREE.Vector2(a, b), new THREE.Vector2(c, d), new THREE.Vector2(e, f));
    this.curves.push(h);
    this.actions.push({ action: THREE.PathActions.BEZIER_CURVE_TO, args: g });
  };
  THREE.Path.prototype.splineThru = function(a) {
    var b = Array.prototype.slice.call(arguments), c = this.actions[this.actions.length - 1].args, c = [new THREE.Vector2(c[c.length - 2], c[c.length - 1])];
    Array.prototype.push.apply(c, a);
    c = new THREE.SplineCurve(c);
    this.curves.push(c);
    this.actions.push({ action: THREE.PathActions.CSPLINE_THRU, args: b });
  };
  THREE.Path.prototype.arc = function(a, b, c, d, e, f) {
    var g = this.actions[this.actions.length - 1].args;
    this.absarc(a + g[g.length - 2], b + g[g.length - 1], c, d, e, f);
  };
  THREE.Path.prototype.absarc = function(a, b, c, d, e, f) {
    this.absellipse(a, b, c, c, d, e, f);
  };
  THREE.Path.prototype.ellipse = function(a, b, c, d, e, f, g) {
    var h = this.actions[this.actions.length - 1].args;
    this.absellipse(a + h[h.length - 2], b + h[h.length - 1], c, d, e, f, g);
  };
  THREE.Path.prototype.absellipse = function(a, b, c, d, e, f, g) {
    var h = Array.prototype.slice.call(arguments), i = new THREE.EllipseCurve(a, b, c, d, e, f, g);
    this.curves.push(i);
    i = i.getPoint(g ? 1 : 0);
    h.push(i.x);
    h.push(i.y);
    this.actions.push({ action: THREE.PathActions.ELLIPSE, args: h });
  };
  THREE.Path.prototype.getSpacedPoints = function(a) {
    a || (a = 40);
    for (var b = [], c = 0; c < a; c++)
      b.push(this.getPoint(c / a));
    return b;
  };
  THREE.Path.prototype.getPoints = function(a, b) {
    if (this.useSpacedPoints)
      return console.log("tata"), this.getSpacedPoints(a, b);
    var a = a || 12, c = [], d, e, f, g, h, i, k, l, m, p, s, q, n;
    d = 0;
    for (e = this.actions.length; d < e; d++)
      switch (f = this.actions[d], g = f.action, f = f.args, g) {
        case THREE.PathActions.MOVE_TO:
          c.push(new THREE.Vector2(f[0], f[1]));
          break;
        case THREE.PathActions.LINE_TO:
          c.push(new THREE.Vector2(f[0], f[1]));
          break;
        case THREE.PathActions.QUADRATIC_CURVE_TO:
          h = f[2];
          i = f[3];
          m = f[0];
          p = f[1];
          0 < c.length ? (g = c[c.length - 1], s = g.x, q = g.y) : (g = this.actions[d - 1].args, s = g[g.length - 2], q = g[g.length - 1]);
          for (f = 1; f <= a; f++)
            n = f / a, g = THREE.Shape.Utils.b2(n, s, m, h), n = THREE.Shape.Utils.b2(n, q, p, i), c.push(new THREE.Vector2(g, n));
          break;
        case THREE.PathActions.BEZIER_CURVE_TO:
          h = f[4];
          i = f[5];
          m = f[0];
          p = f[1];
          k = f[2];
          l = f[3];
          0 < c.length ? (g = c[c.length - 1], s = g.x, q = g.y) : (g = this.actions[d - 1].args, s = g[g.length - 2], q = g[g.length - 1]);
          for (f = 1; f <= a; f++)
            n = f / a, g = THREE.Shape.Utils.b3(n, s, m, k, h), n = THREE.Shape.Utils.b3(n, q, p, l, i), c.push(new THREE.Vector2(g, n));
          break;
        case THREE.PathActions.CSPLINE_THRU:
          g = this.actions[d - 1].args;
          n = [new THREE.Vector2(g[g.length - 2], g[g.length - 1])];
          g = a * f[0].length;
          n = n.concat(f[0]);
          n = new THREE.SplineCurve(n);
          for (f = 1; f <= g; f++)
            c.push(n.getPointAt(f / g));
          break;
        case THREE.PathActions.ARC:
          h = f[0];
          i = f[1];
          p = f[2];
          k = f[3];
          g = f[4];
          m = !!f[5];
          s = g - k;
          q = 2 * a;
          for (f = 1; f <= q; f++)
            n = f / q, m || (n = 1 - n), n = k + n * s, g = h + p * Math.cos(n), n = i + p * Math.sin(n), c.push(new THREE.Vector2(g, n));
          break;
        case THREE.PathActions.ELLIPSE:
          h = f[0];
          i = f[1];
          p = f[2];
          l = f[3];
          k = f[4];
          g = f[5];
          m = !!f[6];
          s = g - k;
          q = 2 * a;
          for (f = 1; f <= q; f++)
            n = f / q, m || (n = 1 - n), n = k + n * s, g = h + p * Math.cos(n), n = i + l * Math.sin(n), c.push(new THREE.Vector2(g, n));
      }
    d = c[c.length - 1];
    1e-10 > Math.abs(d.x - c[0].x) && 1e-10 > Math.abs(d.y - c[0].y) && c.splice(c.length - 1, 1);
    b && c.push(c[0]);
    return c;
  };
  THREE.Path.prototype.toShapes = function() {
    var a, b, c, d, e = [], f = new THREE.Path();
    a = 0;
    for (b = this.actions.length; a < b; a++)
      c = this.actions[a], d = c.args, c = c.action, c == THREE.PathActions.MOVE_TO && 0 != f.actions.length && (e.push(f), f = new THREE.Path()), f[c].apply(f, d);
    0 != f.actions.length && e.push(f);
    if (0 == e.length)
      return [];
    var g;
    d = [];
    a = !THREE.Shape.Utils.isClockWise(e[0].getPoints());
    if (1 == e.length)
      return f = e[0], g = new THREE.Shape(), g.actions = f.actions, g.curves = f.curves, d.push(g), d;
    if (a) {
      g = new THREE.Shape();
      a = 0;
      for (b = e.length; a < b; a++)
        f = e[a], THREE.Shape.Utils.isClockWise(f.getPoints()) ? (g.actions = f.actions, g.curves = f.curves, d.push(g), g = new THREE.Shape()) : g.holes.push(f);
    } else {
      a = 0;
      for (b = e.length; a < b; a++)
        f = e[a], THREE.Shape.Utils.isClockWise(f.getPoints()) ? (g && d.push(g), g = new THREE.Shape(), g.actions = f.actions, g.curves = f.curves) : g.holes.push(f);
      d.push(g);
    }
    return d;
  };
  THREE.Shape = function() {
    THREE.Path.apply(this, arguments);
    this.holes = [];
  };
  THREE.Shape.prototype = Object.create(THREE.Path.prototype);
  THREE.Shape.prototype.extrude = function(a) {
    return new THREE.ExtrudeGeometry(this, a);
  };
  THREE.Shape.prototype.makeGeometry = function(a) {
    return new THREE.ShapeGeometry(this, a);
  };
  THREE.Shape.prototype.getPointsHoles = function(a) {
    var b, c = this.holes.length, d = [];
    for (b = 0; b < c; b++)
      d[b] = this.holes[b].getTransformedPoints(a, this.bends);
    return d;
  };
  THREE.Shape.prototype.getSpacedPointsHoles = function(a) {
    var b, c = this.holes.length, d = [];
    for (b = 0; b < c; b++)
      d[b] = this.holes[b].getTransformedSpacedPoints(a, this.bends);
    return d;
  };
  THREE.Shape.prototype.extractAllPoints = function(a) {
    return { shape: this.getTransformedPoints(a), holes: this.getPointsHoles(a) };
  };
  THREE.Shape.prototype.extractPoints = function(a) {
    return this.useSpacedPoints ? this.extractAllSpacedPoints(a) : this.extractAllPoints(a);
  };
  THREE.Shape.prototype.extractAllSpacedPoints = function(a) {
    return { shape: this.getTransformedSpacedPoints(a), holes: this.getSpacedPointsHoles(a) };
  };
  THREE.Shape.Utils = {
    removeHoles: function(a, b) {
      var c = a.concat(), d = c.concat(), e, f, g, h, i, k, l, m, p, s, q = [];
      for (i = 0; i < b.length; i++) {
        k = b[i];
        Array.prototype.push.apply(d, k);
        f = Number.POSITIVE_INFINITY;
        for (e = 0; e < k.length; e++) {
          p = k[e];
          s = [];
          for (m = 0; m < c.length; m++)
            l = c[m], l = p.distanceToSquared(l), s.push(l), l < f && (f = l, g = e, h = m);
        }
        e = 0 <= h - 1 ? h - 1 : c.length - 1;
        f = 0 <= g - 1 ? g - 1 : k.length - 1;
        var n = [k[g], c[h], c[e]];
        m = THREE.FontUtils.Triangulate.area(n);
        var r = [k[g], k[f], c[h]];
        p = THREE.FontUtils.Triangulate.area(r);
        s = h;
        l = g;
        h += 1;
        g += -1;
        0 > h && (h += c.length);
        h %= c.length;
        0 > g && (g += k.length);
        g %= k.length;
        e = 0 <= h - 1 ? h - 1 : c.length - 1;
        f = 0 <= g - 1 ? g - 1 : k.length - 1;
        n = [k[g], c[h], c[e]];
        n = THREE.FontUtils.Triangulate.area(n);
        r = [k[g], k[f], c[h]];
        r = THREE.FontUtils.Triangulate.area(r);
        m + p > n + r && (h = s, g = l, 0 > h && (h += c.length), h %= c.length, 0 > g && (g += k.length), g %= k.length, e = 0 <= h - 1 ? h - 1 : c.length - 1, f = 0 <= g - 1 ? g - 1 : k.length - 1);
        m = c.slice(0, h);
        p = c.slice(h);
        s = k.slice(g);
        l = k.slice(0, g);
        f = [k[g], k[f], c[h]];
        q.push([k[g], c[h], c[e]]);
        q.push(f);
        c = m.concat(s).concat(l).concat(p);
      }
      return {
        shape: c,
        isolatedPts: q,
        allpoints: d
      };
    },
    triangulateShape: function(a, b) {
      var c = THREE.Shape.Utils.removeHoles(a, b), d = c.allpoints, e = c.isolatedPts, c = THREE.FontUtils.Triangulate(c.shape, false), f, g, h, i, k = {};
      f = 0;
      for (g = d.length; f < g; f++)
        i = d[f].x + ":" + d[f].y, void 0 !== k[i] && console.log("Duplicate point", i), k[i] = f;
      f = 0;
      for (g = c.length; f < g; f++) {
        h = c[f];
        for (d = 0; 3 > d; d++)
          i = h[d].x + ":" + h[d].y, i = k[i], void 0 !== i && (h[d] = i);
      }
      f = 0;
      for (g = e.length; f < g; f++) {
        h = e[f];
        for (d = 0; 3 > d; d++)
          i = h[d].x + ":" + h[d].y, i = k[i], void 0 !== i && (h[d] = i);
      }
      return c.concat(e);
    },
    isClockWise: function(a) {
      return 0 > THREE.FontUtils.Triangulate.area(a);
    },
    b2p0: function(a, b) {
      var c = 1 - a;
      return c * c * b;
    },
    b2p1: function(a, b) {
      return 2 * (1 - a) * a * b;
    },
    b2p2: function(a, b) {
      return a * a * b;
    },
    b2: function(a, b, c, d) {
      return this.b2p0(a, b) + this.b2p1(a, c) + this.b2p2(a, d);
    },
    b3p0: function(a, b) {
      var c = 1 - a;
      return c * c * c * b;
    },
    b3p1: function(a, b) {
      var c = 1 - a;
      return 3 * c * c * a * b;
    },
    b3p2: function(a, b) {
      return 3 * (1 - a) * a * a * b;
    },
    b3p3: function(a, b) {
      return a * a * a * b;
    },
    b3: function(a, b, c, d, e) {
      return this.b3p0(a, b) + this.b3p1(a, c) + this.b3p2(a, d) + this.b3p3(a, e);
    }
  };
  THREE.AnimationHandler = function() {
    var a = [], b = {}, c = { update: function(b2) {
      for (var c2 = 0; c2 < a.length; c2++)
        a[c2].update(b2);
    }, addToUpdate: function(b2) {
      -1 === a.indexOf(b2) && a.push(b2);
    }, removeFromUpdate: function(b2) {
      b2 = a.indexOf(b2);
      -1 !== b2 && a.splice(b2, 1);
    }, add: function(a2) {
      void 0 !== b[a2.name] && console.log("THREE.AnimationHandler.add: Warning! " + a2.name + " already exists in library. Overwriting.");
      b[a2.name] = a2;
      if (true !== a2.initialized) {
        for (var c2 = 0; c2 < a2.hierarchy.length; c2++) {
          for (var d2 = 0; d2 < a2.hierarchy[c2].keys.length; d2++)
            if (0 > a2.hierarchy[c2].keys[d2].time && (a2.hierarchy[c2].keys[d2].time = 0), void 0 !== a2.hierarchy[c2].keys[d2].rot && !(a2.hierarchy[c2].keys[d2].rot instanceof THREE.Quaternion)) {
              var h = a2.hierarchy[c2].keys[d2].rot;
              a2.hierarchy[c2].keys[d2].rot = new THREE.Quaternion(h[0], h[1], h[2], h[3]);
            }
          if (a2.hierarchy[c2].keys.length && void 0 !== a2.hierarchy[c2].keys[0].morphTargets) {
            h = {};
            for (d2 = 0; d2 < a2.hierarchy[c2].keys.length; d2++)
              for (var i = 0; i < a2.hierarchy[c2].keys[d2].morphTargets.length; i++) {
                var k = a2.hierarchy[c2].keys[d2].morphTargets[i];
                h[k] = -1;
              }
            a2.hierarchy[c2].usedMorphTargets = h;
            for (d2 = 0; d2 < a2.hierarchy[c2].keys.length; d2++) {
              var l = {};
              for (k in h) {
                for (i = 0; i < a2.hierarchy[c2].keys[d2].morphTargets.length; i++)
                  if (a2.hierarchy[c2].keys[d2].morphTargets[i] === k) {
                    l[k] = a2.hierarchy[c2].keys[d2].morphTargetsInfluences[i];
                    break;
                  }
                i === a2.hierarchy[c2].keys[d2].morphTargets.length && (l[k] = 0);
              }
              a2.hierarchy[c2].keys[d2].morphTargetsInfluences = l;
            }
          }
          for (d2 = 1; d2 < a2.hierarchy[c2].keys.length; d2++)
            a2.hierarchy[c2].keys[d2].time === a2.hierarchy[c2].keys[d2 - 1].time && (a2.hierarchy[c2].keys.splice(d2, 1), d2--);
          for (d2 = 0; d2 < a2.hierarchy[c2].keys.length; d2++)
            a2.hierarchy[c2].keys[d2].index = d2;
        }
        d2 = parseInt(a2.length * a2.fps, 10);
        a2.JIT = {};
        a2.JIT.hierarchy = [];
        for (c2 = 0; c2 < a2.hierarchy.length; c2++)
          a2.JIT.hierarchy.push(Array(d2));
        a2.initialized = true;
      }
    }, get: function(a2) {
      if ("string" === typeof a2) {
        if (b[a2])
          return b[a2];
        console.log("THREE.AnimationHandler.get: Couldn't find animation " + a2);
        return null;
      }
    }, parse: function(a2) {
      var b2 = [];
      if (a2 instanceof THREE.SkinnedMesh)
        for (var c2 = 0; c2 < a2.bones.length; c2++)
          b2.push(a2.bones[c2]);
      else
        d(a2, b2);
      return b2;
    } }, d = function(a2, b2) {
      b2.push(a2);
      for (var c2 = 0; c2 < a2.children.length; c2++)
        d(
          a2.children[c2],
          b2
        );
    };
    c.LINEAR = 0;
    c.CATMULLROM = 1;
    c.CATMULLROM_FORWARD = 2;
    return c;
  }();
  THREE.Animation = function(a, b, c) {
    this.root = a;
    this.data = THREE.AnimationHandler.get(b);
    this.hierarchy = THREE.AnimationHandler.parse(a);
    this.currentTime = 0;
    this.timeScale = 1;
    this.isPlaying = false;
    this.loop = this.isPaused = true;
    this.interpolationType = void 0 !== c ? c : THREE.AnimationHandler.LINEAR;
    this.points = [];
    this.target = new THREE.Vector3();
  };
  THREE.Animation.prototype.play = function(a, b) {
    if (false === this.isPlaying) {
      this.isPlaying = true;
      this.loop = void 0 !== a ? a : true;
      this.currentTime = void 0 !== b ? b : 0;
      var c, d = this.hierarchy.length, e;
      for (c = 0; c < d; c++) {
        e = this.hierarchy[c];
        this.interpolationType !== THREE.AnimationHandler.CATMULLROM_FORWARD && (e.useQuaternion = true);
        e.matrixAutoUpdate = true;
        void 0 === e.animationCache && (e.animationCache = {}, e.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 }, e.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 }, e.animationCache.originalMatrix = e instanceof THREE.Bone ? e.skinMatrix : e.matrix);
        var f = e.animationCache.prevKey;
        e = e.animationCache.nextKey;
        f.pos = this.data.hierarchy[c].keys[0];
        f.rot = this.data.hierarchy[c].keys[0];
        f.scl = this.data.hierarchy[c].keys[0];
        e.pos = this.getNextKeyWith("pos", c, 1);
        e.rot = this.getNextKeyWith("rot", c, 1);
        e.scl = this.getNextKeyWith("scl", c, 1);
      }
      this.update(0);
    }
    this.isPaused = false;
    THREE.AnimationHandler.addToUpdate(this);
  };
  THREE.Animation.prototype.pause = function() {
    true === this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused;
  };
  THREE.Animation.prototype.stop = function() {
    this.isPaused = this.isPlaying = false;
    THREE.AnimationHandler.removeFromUpdate(this);
  };
  THREE.Animation.prototype.update = function(a) {
    if (false !== this.isPlaying) {
      var b = ["pos", "rot", "scl"], c, d, e, f, g, h, i, k, l;
      l = this.currentTime += a * this.timeScale;
      k = this.currentTime %= this.data.length;
      parseInt(Math.min(k * this.data.fps, this.data.length * this.data.fps), 10);
      for (var m = 0, p = this.hierarchy.length; m < p; m++) {
        a = this.hierarchy[m];
        i = a.animationCache;
        for (var s = 0; 3 > s; s++) {
          c = b[s];
          g = i.prevKey[c];
          h = i.nextKey[c];
          if (h.time <= l) {
            if (k < l)
              if (this.loop) {
                g = this.data.hierarchy[m].keys[0];
                for (h = this.getNextKeyWith(c, m, 1); h.time < k; )
                  g = h, h = this.getNextKeyWith(c, m, h.index + 1);
              } else {
                this.stop();
                return;
              }
            else {
              do
                g = h, h = this.getNextKeyWith(c, m, h.index + 1);
              while (h.time < k);
            }
            i.prevKey[c] = g;
            i.nextKey[c] = h;
          }
          a.matrixAutoUpdate = true;
          a.matrixWorldNeedsUpdate = true;
          d = (k - g.time) / (h.time - g.time);
          e = g[c];
          f = h[c];
          if (0 > d || 1 < d)
            console.log("THREE.Animation.update: Warning! Scale out of bounds:" + d + " on bone " + m), d = 0 > d ? 0 : 1;
          if ("pos" === c)
            if (c = a.position, this.interpolationType === THREE.AnimationHandler.LINEAR)
              c.x = e[0] + (f[0] - e[0]) * d, c.y = e[1] + (f[1] - e[1]) * d, c.z = e[2] + (f[2] - e[2]) * d;
            else {
              if (this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD)
                this.points[0] = this.getPrevKeyWith("pos", m, g.index - 1).pos, this.points[1] = e, this.points[2] = f, this.points[3] = this.getNextKeyWith("pos", m, h.index + 1).pos, d = 0.33 * d + 0.33, e = this.interpolateCatmullRom(this.points, d), c.x = e[0], c.y = e[1], c.z = e[2], this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD && (d = this.interpolateCatmullRom(this.points, 1.01 * d), this.target.set(d[0], d[1], d[2]), this.target.subSelf(c), this.target.y = 0, this.target.normalize(), d = Math.atan2(this.target.x, this.target.z), a.rotation.set(0, d, 0));
            }
          else
            "rot" === c ? THREE.Quaternion.slerp(e, f, a.quaternion, d) : "scl" === c && (c = a.scale, c.x = e[0] + (f[0] - e[0]) * d, c.y = e[1] + (f[1] - e[1]) * d, c.z = e[2] + (f[2] - e[2]) * d);
        }
      }
    }
  };
  THREE.Animation.prototype.interpolateCatmullRom = function(a, b) {
    var c = [], d = [], e, f, g, h, i, k;
    e = (a.length - 1) * b;
    f = Math.floor(e);
    e -= f;
    c[0] = 0 === f ? f : f - 1;
    c[1] = f;
    c[2] = f > a.length - 2 ? f : f + 1;
    c[3] = f > a.length - 3 ? f : f + 2;
    f = a[c[0]];
    h = a[c[1]];
    i = a[c[2]];
    k = a[c[3]];
    c = e * e;
    g = e * c;
    d[0] = this.interpolate(f[0], h[0], i[0], k[0], e, c, g);
    d[1] = this.interpolate(f[1], h[1], i[1], k[1], e, c, g);
    d[2] = this.interpolate(f[2], h[2], i[2], k[2], e, c, g);
    return d;
  };
  THREE.Animation.prototype.interpolate = function(a, b, c, d, e, f, g) {
    a = 0.5 * (c - a);
    d = 0.5 * (d - b);
    return (2 * (b - c) + a + d) * g + (-3 * (b - c) - 2 * a - d) * f + a * e + b;
  };
  THREE.Animation.prototype.getNextKeyWith = function(a, b, c) {
    for (var d = this.data.hierarchy[b].keys, c = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? c < d.length - 1 ? c : d.length - 1 : c % d.length; c < d.length; c++)
      if (void 0 !== d[c][a])
        return d[c];
    return this.data.hierarchy[b].keys[0];
  };
  THREE.Animation.prototype.getPrevKeyWith = function(a, b, c) {
    for (var d = this.data.hierarchy[b].keys, c = this.interpolationType === THREE.AnimationHandler.CATMULLROM || this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ? 0 < c ? c : 0 : 0 <= c ? c : c + d.length; 0 <= c; c--)
      if (void 0 !== d[c][a])
        return d[c];
    return this.data.hierarchy[b].keys[d.length - 1];
  };
  THREE.KeyFrameAnimation = function(a, b, c) {
    this.root = a;
    this.data = THREE.AnimationHandler.get(b);
    this.hierarchy = THREE.AnimationHandler.parse(a);
    this.currentTime = 0;
    this.timeScale = 1e-3;
    this.isPlaying = false;
    this.loop = this.isPaused = true;
    this.JITCompile = void 0 !== c ? c : true;
    a = 0;
    for (b = this.hierarchy.length; a < b; a++) {
      var c = this.data.hierarchy[a].sids, d = this.hierarchy[a];
      if (this.data.hierarchy[a].keys.length && c) {
        for (var e = 0; e < c.length; e++) {
          var f = c[e], g = this.getNextKeyWith(f, a, 0);
          g && g.apply(f);
        }
        d.matrixAutoUpdate = false;
        this.data.hierarchy[a].node.updateMatrix();
        d.matrixWorldNeedsUpdate = true;
      }
    }
  };
  THREE.KeyFrameAnimation.prototype.play = function(a, b) {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.loop = void 0 !== a ? a : true;
      this.currentTime = void 0 !== b ? b : 0;
      this.startTimeMs = b;
      this.startTime = 1e7;
      this.endTime = -this.startTime;
      var c, d = this.hierarchy.length, e, f;
      for (c = 0; c < d; c++)
        e = this.hierarchy[c], f = this.data.hierarchy[c], e.useQuaternion = true, void 0 === f.animationCache && (f.animationCache = {}, f.animationCache.prevKey = null, f.animationCache.nextKey = null, f.animationCache.originalMatrix = e instanceof THREE.Bone ? e.skinMatrix : e.matrix), e = this.data.hierarchy[c].keys, e.length && (f.animationCache.prevKey = e[0], f.animationCache.nextKey = e[1], this.startTime = Math.min(e[0].time, this.startTime), this.endTime = Math.max(e[e.length - 1].time, this.endTime));
      this.update(0);
    }
    this.isPaused = false;
    THREE.AnimationHandler.addToUpdate(this);
  };
  THREE.KeyFrameAnimation.prototype.pause = function() {
    this.isPaused ? THREE.AnimationHandler.addToUpdate(this) : THREE.AnimationHandler.removeFromUpdate(this);
    this.isPaused = !this.isPaused;
  };
  THREE.KeyFrameAnimation.prototype.stop = function() {
    this.isPaused = this.isPlaying = false;
    THREE.AnimationHandler.removeFromUpdate(this);
    for (var a = 0; a < this.data.hierarchy.length; a++) {
      var b = this.hierarchy[a], c = this.data.hierarchy[a];
      if (void 0 !== c.animationCache) {
        var d = c.animationCache.originalMatrix;
        b instanceof THREE.Bone ? (d.copy(b.skinMatrix), b.skinMatrix = d) : (d.copy(b.matrix), b.matrix = d);
        delete c.animationCache;
      }
    }
  };
  THREE.KeyFrameAnimation.prototype.update = function(a) {
    if (this.isPlaying) {
      var b, c, d, e, f = this.data.JIT.hierarchy, g, h, i;
      h = this.currentTime += a * this.timeScale;
      g = this.currentTime %= this.data.length;
      g < this.startTimeMs && (g = this.currentTime = this.startTimeMs + g);
      e = parseInt(Math.min(g * this.data.fps, this.data.length * this.data.fps), 10);
      if ((i = g < h) && !this.loop) {
        for (var a = 0, k = this.hierarchy.length; a < k; a++) {
          var l = this.data.hierarchy[a].keys, f = this.data.hierarchy[a].sids;
          d = l.length - 1;
          e = this.hierarchy[a];
          if (l.length) {
            for (l = 0; l < f.length; l++)
              g = f[l], (h = this.getPrevKeyWith(g, a, d)) && h.apply(g);
            this.data.hierarchy[a].node.updateMatrix();
            e.matrixWorldNeedsUpdate = true;
          }
        }
        this.stop();
      } else if (!(g < this.startTime)) {
        a = 0;
        for (k = this.hierarchy.length; a < k; a++) {
          d = this.hierarchy[a];
          b = this.data.hierarchy[a];
          var l = b.keys, m = b.animationCache;
          if (this.JITCompile && void 0 !== f[a][e])
            d instanceof THREE.Bone ? (d.skinMatrix = f[a][e], d.matrixWorldNeedsUpdate = false) : (d.matrix = f[a][e], d.matrixWorldNeedsUpdate = true);
          else if (l.length) {
            this.JITCompile && m && (d instanceof THREE.Bone ? d.skinMatrix = m.originalMatrix : d.matrix = m.originalMatrix);
            b = m.prevKey;
            c = m.nextKey;
            if (b && c) {
              if (c.time <= h) {
                if (i && this.loop) {
                  b = l[0];
                  for (c = l[1]; c.time < g; )
                    b = c, c = l[b.index + 1];
                } else if (!i)
                  for (var p = l.length - 1; c.time < g && c.index !== p; )
                    b = c, c = l[b.index + 1];
                m.prevKey = b;
                m.nextKey = c;
              }
              c.time >= g ? b.interpolate(c, g) : b.interpolate(c, c.time);
            }
            this.data.hierarchy[a].node.updateMatrix();
            d.matrixWorldNeedsUpdate = true;
          }
        }
        if (this.JITCompile && void 0 === f[0][e]) {
          this.hierarchy[0].updateMatrixWorld(true);
          for (a = 0; a < this.hierarchy.length; a++)
            f[a][e] = this.hierarchy[a] instanceof THREE.Bone ? this.hierarchy[a].skinMatrix.clone() : this.hierarchy[a].matrix.clone();
        }
      }
    }
  };
  THREE.KeyFrameAnimation.prototype.getNextKeyWith = function(a, b, c) {
    b = this.data.hierarchy[b].keys;
    for (c %= b.length; c < b.length; c++)
      if (b[c].hasTarget(a))
        return b[c];
    return b[0];
  };
  THREE.KeyFrameAnimation.prototype.getPrevKeyWith = function(a, b, c) {
    b = this.data.hierarchy[b].keys;
    for (c = 0 <= c ? c : c + b.length; 0 <= c; c--)
      if (b[c].hasTarget(a))
        return b[c];
    return b[b.length - 1];
  };
  THREE.CubeCamera = function(a, b, c) {
    THREE.Object3D.call(this);
    var d = new THREE.PerspectiveCamera(90, 1, a, b);
    d.up.set(0, -1, 0);
    d.lookAt(new THREE.Vector3(1, 0, 0));
    this.add(d);
    var e = new THREE.PerspectiveCamera(90, 1, a, b);
    e.up.set(0, -1, 0);
    e.lookAt(new THREE.Vector3(-1, 0, 0));
    this.add(e);
    var f = new THREE.PerspectiveCamera(90, 1, a, b);
    f.up.set(0, 0, 1);
    f.lookAt(new THREE.Vector3(0, 1, 0));
    this.add(f);
    var g = new THREE.PerspectiveCamera(90, 1, a, b);
    g.up.set(0, 0, -1);
    g.lookAt(new THREE.Vector3(0, -1, 0));
    this.add(g);
    var h = new THREE.PerspectiveCamera(
      90,
      1,
      a,
      b
    );
    h.up.set(0, -1, 0);
    h.lookAt(new THREE.Vector3(0, 0, 1));
    this.add(h);
    var i = new THREE.PerspectiveCamera(90, 1, a, b);
    i.up.set(0, -1, 0);
    i.lookAt(new THREE.Vector3(0, 0, -1));
    this.add(i);
    this.renderTarget = new THREE.WebGLRenderTargetCube(c, c, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter });
    this.updateCubeMap = function(a2, b2) {
      var c2 = this.renderTarget, p = c2.generateMipmaps;
      c2.generateMipmaps = false;
      c2.activeCubeFace = 0;
      a2.render(b2, d, c2);
      c2.activeCubeFace = 1;
      a2.render(b2, e, c2);
      c2.activeCubeFace = 2;
      a2.render(b2, f, c2);
      c2.activeCubeFace = 3;
      a2.render(b2, g, c2);
      c2.activeCubeFace = 4;
      a2.render(b2, h, c2);
      c2.generateMipmaps = p;
      c2.activeCubeFace = 5;
      a2.render(b2, i, c2);
    };
  };
  THREE.CubeCamera.prototype = Object.create(THREE.Object3D.prototype);
  THREE.CombinedCamera = function(a, b, c, d, e, f, g) {
    THREE.Camera.call(this);
    this.fov = c;
    this.left = -a / 2;
    this.right = a / 2;
    this.top = b / 2;
    this.bottom = -b / 2;
    this.cameraO = new THREE.OrthographicCamera(a / -2, a / 2, b / 2, b / -2, f, g);
    this.cameraP = new THREE.PerspectiveCamera(c, a / b, d, e);
    this.zoom = 1;
    this.toPerspective();
  };
  THREE.CombinedCamera.prototype = Object.create(THREE.Camera.prototype);
  THREE.CombinedCamera.prototype.toPerspective = function() {
    this.near = this.cameraP.near;
    this.far = this.cameraP.far;
    this.cameraP.fov = this.fov / this.zoom;
    this.cameraP.updateProjectionMatrix();
    this.projectionMatrix = this.cameraP.projectionMatrix;
    this.inPerspectiveMode = true;
    this.inOrthographicMode = false;
  };
  THREE.CombinedCamera.prototype.toOrthographic = function() {
    var a = this.cameraP.aspect, b = (this.cameraP.near + this.cameraP.far) / 2, b = Math.tan(this.fov / 2) * b, a = 2 * b * a / 2, b = b / this.zoom, a = a / this.zoom;
    this.cameraO.left = -a;
    this.cameraO.right = a;
    this.cameraO.top = b;
    this.cameraO.bottom = -b;
    this.cameraO.updateProjectionMatrix();
    this.near = this.cameraO.near;
    this.far = this.cameraO.far;
    this.projectionMatrix = this.cameraO.projectionMatrix;
    this.inPerspectiveMode = false;
    this.inOrthographicMode = true;
  };
  THREE.CombinedCamera.prototype.setSize = function(a, b) {
    this.cameraP.aspect = a / b;
    this.left = -a / 2;
    this.right = a / 2;
    this.top = b / 2;
    this.bottom = -b / 2;
  };
  THREE.CombinedCamera.prototype.setFov = function(a) {
    this.fov = a;
    this.inPerspectiveMode ? this.toPerspective() : this.toOrthographic();
  };
  THREE.CombinedCamera.prototype.updateProjectionMatrix = function() {
    this.inPerspectiveMode ? this.toPerspective() : (this.toPerspective(), this.toOrthographic());
  };
  THREE.CombinedCamera.prototype.setLens = function(a, b) {
    void 0 === b && (b = 24);
    var c = 2 * THREE.Math.radToDeg(Math.atan(b / (2 * a)));
    this.setFov(c);
    return c;
  };
  THREE.CombinedCamera.prototype.setZoom = function(a) {
    this.zoom = a;
    this.inPerspectiveMode ? this.toPerspective() : this.toOrthographic();
  };
  THREE.CombinedCamera.prototype.toFrontView = function() {
    this.rotation.x = 0;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.CombinedCamera.prototype.toBackView = function() {
    this.rotation.x = 0;
    this.rotation.y = Math.PI;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.CombinedCamera.prototype.toLeftView = function() {
    this.rotation.x = 0;
    this.rotation.y = -Math.PI / 2;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.CombinedCamera.prototype.toRightView = function() {
    this.rotation.x = 0;
    this.rotation.y = Math.PI / 2;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.CombinedCamera.prototype.toTopView = function() {
    this.rotation.x = -Math.PI / 2;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.CombinedCamera.prototype.toBottomView = function() {
    this.rotation.x = Math.PI / 2;
    this.rotation.y = 0;
    this.rotation.z = 0;
    this.rotationAutoUpdate = false;
  };
  THREE.AsteriskGeometry = function(a, b) {
    THREE.Geometry.call(this);
    for (var c = 0.707 * a, d = 0.707 * b, c = [[a, 0, 0], [b, 0, 0], [-a, 0, 0], [-b, 0, 0], [0, a, 0], [0, b, 0], [0, -a, 0], [0, -b, 0], [0, 0, a], [0, 0, b], [0, 0, -a], [0, 0, -b], [c, c, 0], [d, d, 0], [-c, -c, 0], [-d, -d, 0], [c, -c, 0], [d, -d, 0], [-c, c, 0], [-d, d, 0], [c, 0, c], [d, 0, d], [-c, 0, -c], [-d, 0, -d], [c, 0, -c], [d, 0, -d], [-c, 0, c], [-d, 0, d], [0, c, c], [0, d, d], [0, -c, -c], [0, -d, -d], [0, c, -c], [0, d, -d], [0, -c, c], [0, -d, d]], d = 0, e = c.length; d < e; d++)
      this.vertices.push(new THREE.Vector3(c[d][0], c[d][1], c[d][2]));
  };
  THREE.AsteriskGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.CircleGeometry = function(a, b, c, d) {
    THREE.Geometry.call(this);
    var a = a || 50, c = void 0 !== c ? c : 0, d = void 0 !== d ? d : 2 * Math.PI, b = void 0 !== b ? Math.max(3, b) : 8, e, f = [];
    e = new THREE.Vector3();
    var g = new THREE.Vector2(0.5, 0.5);
    this.vertices.push(e);
    f.push(g);
    for (e = 0; e <= b; e++) {
      var h = new THREE.Vector3();
      h.x = a * Math.cos(c + e / b * d);
      h.y = a * Math.sin(c + e / b * d);
      this.vertices.push(h);
      f.push(new THREE.Vector2((h.x / a + 1) / 2, -(h.y / a + 1) / 2 + 1));
    }
    c = new THREE.Vector3(0, 0, -1);
    for (e = 1; e <= b; e++)
      this.faces.push(new THREE.Face3(e, e + 1, 0, [c, c, c])), this.faceVertexUvs[0].push([f[e], f[e + 1], g]);
    this.computeCentroids();
    this.computeFaceNormals();
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), a);
  };
  THREE.CircleGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.CubeGeometry = function(a, b, c, d, e, f) {
    function g(a2, b2, c2, d2, e2, f2, g2, n) {
      var r, v = h.widthSegments, w = h.heightSegments, x = e2 / 2, t = f2 / 2, K = h.vertices.length;
      if ("x" === a2 && "y" === b2 || "y" === a2 && "x" === b2)
        r = "z";
      else if ("x" === a2 && "z" === b2 || "z" === a2 && "x" === b2)
        r = "y", w = h.depthSegments;
      else if ("z" === a2 && "y" === b2 || "y" === a2 && "z" === b2)
        r = "x", v = h.depthSegments;
      var D = v + 1, B = w + 1, z = e2 / v, E = f2 / w, G = new THREE.Vector3();
      G[r] = 0 < g2 ? 1 : -1;
      for (e2 = 0; e2 < B; e2++)
        for (f2 = 0; f2 < D; f2++) {
          var I = new THREE.Vector3();
          I[a2] = (f2 * z - x) * c2;
          I[b2] = (e2 * E - t) * d2;
          I[r] = g2;
          h.vertices.push(I);
        }
      for (e2 = 0; e2 < w; e2++)
        for (f2 = 0; f2 < v; f2++)
          a2 = new THREE.Face4(f2 + D * e2 + K, f2 + D * (e2 + 1) + K, f2 + 1 + D * (e2 + 1) + K, f2 + 1 + D * e2 + K), a2.normal.copy(G), a2.vertexNormals.push(G.clone(), G.clone(), G.clone(), G.clone()), a2.materialIndex = n, h.faces.push(a2), h.faceVertexUvs[0].push([new THREE.Vector2(f2 / v, 1 - e2 / w), new THREE.Vector2(f2 / v, 1 - (e2 + 1) / w), new THREE.Vector2((f2 + 1) / v, 1 - (e2 + 1) / w), new THREE.Vector2((f2 + 1) / v, 1 - e2 / w)]);
    }
    THREE.Geometry.call(this);
    var h = this;
    this.width = a;
    this.height = b;
    this.depth = c;
    this.widthSegments = d || 1;
    this.heightSegments = e || 1;
    this.depthSegments = f || 1;
    a = this.width / 2;
    b = this.height / 2;
    c = this.depth / 2;
    g("z", "y", -1, -1, this.depth, this.height, a, 0);
    g("z", "y", 1, -1, this.depth, this.height, -a, 1);
    g("x", "z", 1, 1, this.width, this.depth, b, 2);
    g("x", "z", 1, -1, this.width, this.depth, -b, 3);
    g("x", "y", 1, -1, this.width, this.height, c, 4);
    g("x", "y", -1, -1, this.width, this.height, -c, 5);
    this.computeCentroids();
    this.mergeVertices();
  };
  THREE.CubeGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.CylinderGeometry = function(a, b, c, d, e, f) {
    THREE.Geometry.call(this);
    var a = void 0 !== a ? a : 20, b = void 0 !== b ? b : 20, c = void 0 !== c ? c : 100, g = c / 2, d = d || 8, e = e || 1, h, i, k = [], l = [];
    for (i = 0; i <= e; i++) {
      var m = [], p = [], s = i / e, q = s * (b - a) + a;
      for (h = 0; h <= d; h++) {
        var n = h / d, r = new THREE.Vector3();
        r.x = q * Math.sin(2 * n * Math.PI);
        r.y = -s * c + g;
        r.z = q * Math.cos(2 * n * Math.PI);
        this.vertices.push(r);
        m.push(this.vertices.length - 1);
        p.push(new THREE.Vector2(n, 1 - s));
      }
      k.push(m);
      l.push(p);
    }
    c = (b - a) / c;
    for (h = 0; h < d; h++) {
      0 !== a ? (m = this.vertices[k[0][h]].clone(), p = this.vertices[k[0][h + 1]].clone()) : (m = this.vertices[k[1][h]].clone(), p = this.vertices[k[1][h + 1]].clone());
      m.setY(Math.sqrt(m.x * m.x + m.z * m.z) * c).normalize();
      p.setY(Math.sqrt(p.x * p.x + p.z * p.z) * c).normalize();
      for (i = 0; i < e; i++) {
        var s = k[i][h], q = k[i + 1][h], n = k[i + 1][h + 1], r = k[i][h + 1], v = m.clone(), w = m.clone(), x = p.clone(), t = p.clone(), K = l[i][h].clone(), D = l[i + 1][h].clone(), B = l[i + 1][h + 1].clone(), z = l[i][h + 1].clone();
        this.faces.push(new THREE.Face4(s, q, n, r, [v, w, x, t]));
        this.faceVertexUvs[0].push([K, D, B, z]);
      }
    }
    if (!f && 0 < a) {
      this.vertices.push(new THREE.Vector3(0, g, 0));
      for (h = 0; h < d; h++)
        s = k[0][h], q = k[0][h + 1], n = this.vertices.length - 1, v = new THREE.Vector3(0, 1, 0), w = new THREE.Vector3(0, 1, 0), x = new THREE.Vector3(0, 1, 0), K = l[0][h].clone(), D = l[0][h + 1].clone(), B = new THREE.Vector2(D.u, 0), this.faces.push(new THREE.Face3(s, q, n, [v, w, x])), this.faceVertexUvs[0].push([K, D, B]);
    }
    if (!f && 0 < b) {
      this.vertices.push(new THREE.Vector3(0, -g, 0));
      for (h = 0; h < d; h++)
        s = k[i][h + 1], q = k[i][h], n = this.vertices.length - 1, v = new THREE.Vector3(0, -1, 0), w = new THREE.Vector3(
          0,
          -1,
          0
        ), x = new THREE.Vector3(0, -1, 0), K = l[i][h + 1].clone(), D = l[i][h].clone(), B = new THREE.Vector2(D.u, 1), this.faces.push(new THREE.Face3(s, q, n, [v, w, x])), this.faceVertexUvs[0].push([K, D, B]);
    }
    this.computeCentroids();
    this.computeFaceNormals();
  };
  THREE.CylinderGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.ExtrudeGeometry = function(a, b) {
    "undefined" !== typeof a && (THREE.Geometry.call(this), a = a instanceof Array ? a : [a], this.shapebb = a[a.length - 1].getBoundingBox(), this.addShapeList(a, b), this.computeCentroids(), this.computeFaceNormals());
  };
  THREE.ExtrudeGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.ExtrudeGeometry.prototype.addShapeList = function(a, b) {
    for (var c = a.length, d = 0; d < c; d++)
      this.addShape(a[d], b);
  };
  THREE.ExtrudeGeometry.prototype.addShape = function(a, b) {
    function c(a2, b2, c2) {
      b2 || console.log("die");
      return b2.clone().multiplyScalar(c2).addSelf(a2);
    }
    function d(a2, b2, c2) {
      var d2 = THREE.ExtrudeGeometry.__v1, e2 = THREE.ExtrudeGeometry.__v2, f2 = THREE.ExtrudeGeometry.__v3, g2 = THREE.ExtrudeGeometry.__v4, h2 = THREE.ExtrudeGeometry.__v5, i2 = THREE.ExtrudeGeometry.__v6;
      d2.set(a2.x - b2.x, a2.y - b2.y);
      e2.set(a2.x - c2.x, a2.y - c2.y);
      d2 = d2.normalize();
      e2 = e2.normalize();
      f2.set(-d2.y, d2.x);
      g2.set(e2.y, -e2.x);
      h2.copy(a2).addSelf(f2);
      i2.copy(a2).addSelf(g2);
      if (h2.equals(i2))
        return g2.clone();
      h2.copy(b2).addSelf(f2);
      i2.copy(c2).addSelf(g2);
      f2 = d2.dot(g2);
      g2 = i2.subSelf(h2).dot(g2);
      0 === f2 && (console.log("Either infinite or no solutions!"), 0 === g2 ? console.log("Its finite solutions.") : console.log("Too bad, no solutions."));
      g2 /= f2;
      return 0 > g2 ? (b2 = Math.atan2(b2.y - a2.y, b2.x - a2.x), a2 = Math.atan2(c2.y - a2.y, c2.x - a2.x), b2 > a2 && (a2 += 2 * Math.PI), c2 = (b2 + a2) / 2, a2 = -Math.cos(c2), c2 = -Math.sin(c2), new THREE.Vector2(a2, c2)) : d2.multiplyScalar(g2).addSelf(h2).subSelf(a2).clone();
    }
    function e(c2, d2) {
      var e2, f2;
      for (L = c2.length; 0 <= --L; ) {
        e2 = L;
        f2 = L - 1;
        0 > f2 && (f2 = c2.length - 1);
        for (var g2 = 0, h2 = s + 2 * l, g2 = 0; g2 < h2; g2++) {
          var i2 = N * g2, k2 = N * (g2 + 1), m2 = d2 + e2 + i2, i2 = d2 + f2 + i2, n2 = d2 + f2 + k2, k2 = d2 + e2 + k2, p2 = c2, q2 = g2, r2 = h2, t2 = e2, v2 = f2, m2 = m2 + Y, i2 = i2 + Y, n2 = n2 + Y, k2 = k2 + Y;
          I.faces.push(new THREE.Face4(m2, i2, n2, k2, null, null, w));
          m2 = x.generateSideWallUV(I, a, p2, b, m2, i2, n2, k2, q2, r2, t2, v2);
          I.faceVertexUvs[0].push(m2);
        }
      }
    }
    function f(a2, b2, c2) {
      I.vertices.push(new THREE.Vector3(a2, b2, c2));
    }
    function g(c2, d2, e2, f2) {
      c2 += Y;
      d2 += Y;
      e2 += Y;
      I.faces.push(new THREE.Face3(c2, d2, e2, null, null, v));
      c2 = f2 ? x.generateBottomUV(I, a, b, c2, d2, e2) : x.generateTopUV(I, a, b, c2, d2, e2);
      I.faceVertexUvs[0].push(c2);
    }
    var h = void 0 !== b.amount ? b.amount : 100, i = void 0 !== b.bevelThickness ? b.bevelThickness : 6, k = void 0 !== b.bevelSize ? b.bevelSize : i - 2, l = void 0 !== b.bevelSegments ? b.bevelSegments : 3, m = void 0 !== b.bevelEnabled ? b.bevelEnabled : true, p = void 0 !== b.curveSegments ? b.curveSegments : 12, s = void 0 !== b.steps ? b.steps : 1, q = b.extrudePath, n, r = false, v = b.material, w = b.extrudeMaterial, x = void 0 !== b.UVGenerator ? b.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator, t, K, D, B;
    q && (n = q.getSpacedPoints(s), r = true, m = false, t = void 0 !== b.frames ? b.frames : new THREE.TubeGeometry.FrenetFrames(
      q,
      s,
      false
    ), K = new THREE.Vector3(), D = new THREE.Vector3(), B = new THREE.Vector3());
    m || (k = i = l = 0);
    var z, E, G, I = this, Y = this.vertices.length, p = a.extractPoints(p), C = p.shape, p = p.holes;
    if (q = !THREE.Shape.Utils.isClockWise(C)) {
      C = C.reverse();
      E = 0;
      for (G = p.length; E < G; E++)
        z = p[E], THREE.Shape.Utils.isClockWise(z) && (p[E] = z.reverse());
      q = false;
    }
    var P = THREE.Shape.Utils.triangulateShape(C, p), q = C;
    E = 0;
    for (G = p.length; E < G; E++)
      z = p[E], C = C.concat(z);
    var A, J, M, T, N = C.length, fa = P.length, oa = [], L = 0, Z = q.length;
    A = Z - 1;
    for (J = L + 1; L < Z; L++, A++, J++)
      A === Z && (A = 0), J === Z && (J = 0), oa[L] = d(q[L], q[A], q[J]);
    var eb = [], Ea, jb = oa.concat();
    E = 0;
    for (G = p.length; E < G; E++) {
      z = p[E];
      Ea = [];
      L = 0;
      Z = z.length;
      A = Z - 1;
      for (J = L + 1; L < Z; L++, A++, J++)
        A === Z && (A = 0), J === Z && (J = 0), Ea[L] = d(z[L], z[A], z[J]);
      eb.push(Ea);
      jb = jb.concat(Ea);
    }
    for (A = 0; A < l; A++) {
      z = A / l;
      M = i * (1 - z);
      J = k * Math.sin(z * Math.PI / 2);
      L = 0;
      for (Z = q.length; L < Z; L++)
        T = c(q[L], oa[L], J), f(T.x, T.y, -M);
      E = 0;
      for (G = p.length; E < G; E++) {
        z = p[E];
        Ea = eb[E];
        L = 0;
        for (Z = z.length; L < Z; L++)
          T = c(z[L], Ea[L], J), f(T.x, T.y, -M);
      }
    }
    J = k;
    for (L = 0; L < N; L++)
      T = m ? c(C[L], jb[L], J) : C[L], r ? (D.copy(t.normals[0]).multiplyScalar(T.x), K.copy(t.binormals[0]).multiplyScalar(T.y), B.copy(n[0]).addSelf(D).addSelf(K), f(B.x, B.y, B.z)) : f(T.x, T.y, 0);
    for (z = 1; z <= s; z++)
      for (L = 0; L < N; L++)
        T = m ? c(C[L], jb[L], J) : C[L], r ? (D.copy(t.normals[z]).multiplyScalar(T.x), K.copy(t.binormals[z]).multiplyScalar(T.y), B.copy(n[z]).addSelf(D).addSelf(K), f(B.x, B.y, B.z)) : f(T.x, T.y, h / s * z);
    for (A = l - 1; 0 <= A; A--) {
      z = A / l;
      M = i * (1 - z);
      J = k * Math.sin(z * Math.PI / 2);
      L = 0;
      for (Z = q.length; L < Z; L++)
        T = c(q[L], oa[L], J), f(T.x, T.y, h + M);
      E = 0;
      for (G = p.length; E < G; E++) {
        z = p[E];
        Ea = eb[E];
        L = 0;
        for (Z = z.length; L < Z; L++)
          T = c(z[L], Ea[L], J), r ? f(T.x, T.y + n[s - 1].y, n[s - 1].x + M) : f(T.x, T.y, h + M);
      }
    }
    if (m) {
      i = 0 * N;
      for (L = 0; L < fa; L++)
        h = P[L], g(h[2] + i, h[1] + i, h[0] + i, true);
      i = N * (s + 2 * l);
      for (L = 0; L < fa; L++)
        h = P[L], g(h[0] + i, h[1] + i, h[2] + i, false);
    } else {
      for (L = 0; L < fa; L++)
        h = P[L], g(h[2], h[1], h[0], true);
      for (L = 0; L < fa; L++)
        h = P[L], g(h[0] + N * s, h[1] + N * s, h[2] + N * s, false);
    }
    h = 0;
    e(q, h);
    h += q.length;
    E = 0;
    for (G = p.length; E < G; E++)
      z = p[E], e(z, h), h += z.length;
  };
  THREE.ExtrudeGeometry.WorldUVGenerator = { generateTopUV: function(a, b, c, d, e, f) {
    b = a.vertices[e].x;
    e = a.vertices[e].y;
    c = a.vertices[f].x;
    f = a.vertices[f].y;
    return [new THREE.Vector2(a.vertices[d].x, a.vertices[d].y), new THREE.Vector2(b, e), new THREE.Vector2(c, f)];
  }, generateBottomUV: function(a, b, c, d, e, f) {
    return this.generateTopUV(a, b, c, d, e, f);
  }, generateSideWallUV: function(a, b, c, d, e, f, g, h) {
    var b = a.vertices[e].x, c = a.vertices[e].y, e = a.vertices[e].z, d = a.vertices[f].x, i = a.vertices[f].y, f = a.vertices[f].z, k = a.vertices[g].x, l = a.vertices[g].y, g = a.vertices[g].z, m = a.vertices[h].x, p = a.vertices[h].y, a = a.vertices[h].z;
    return 0.01 > Math.abs(c - i) ? [new THREE.Vector2(b, 1 - e), new THREE.Vector2(d, 1 - f), new THREE.Vector2(k, 1 - g), new THREE.Vector2(m, 1 - a)] : [new THREE.Vector2(c, 1 - e), new THREE.Vector2(i, 1 - f), new THREE.Vector2(l, 1 - g), new THREE.Vector2(p, 1 - a)];
  } };
  THREE.ExtrudeGeometry.__v1 = new THREE.Vector2();
  THREE.ExtrudeGeometry.__v2 = new THREE.Vector2();
  THREE.ExtrudeGeometry.__v3 = new THREE.Vector2();
  THREE.ExtrudeGeometry.__v4 = new THREE.Vector2();
  THREE.ExtrudeGeometry.__v5 = new THREE.Vector2();
  THREE.ExtrudeGeometry.__v6 = new THREE.Vector2();
  THREE.ShapeGeometry = function(a, b) {
    THREE.Geometry.call(this);
    false === a instanceof Array && (a = [a]);
    this.shapebb = a[a.length - 1].getBoundingBox();
    this.addShapeList(a, b);
    this.computeCentroids();
    this.computeFaceNormals();
  };
  THREE.ShapeGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.ShapeGeometry.prototype.addShapeList = function(a, b) {
    for (var c = 0, d = a.length; c < d; c++)
      this.addShape(a[c], b);
    return this;
  };
  THREE.ShapeGeometry.prototype.addShape = function(a, b) {
    void 0 === b && (b = {});
    var c = b.material, d = void 0 === b.UVGenerator ? THREE.ExtrudeGeometry.WorldUVGenerator : b.UVGenerator, e, f, g, h = this.vertices.length;
    e = a.extractPoints(void 0 !== b.curveSegments ? b.curveSegments : 12);
    var i = e.shape, k = e.holes;
    if (!THREE.Shape.Utils.isClockWise(i)) {
      i = i.reverse();
      e = 0;
      for (f = k.length; e < f; e++)
        g = k[e], THREE.Shape.Utils.isClockWise(g) && (k[e] = g.reverse());
    }
    var l = THREE.Shape.Utils.triangulateShape(i, k);
    e = 0;
    for (f = k.length; e < f; e++)
      g = k[e], i = i.concat(g);
    k = i.length;
    f = l.length;
    for (e = 0; e < k; e++)
      g = i[e], this.vertices.push(new THREE.Vector3(g.x, g.y, 0));
    for (e = 0; e < f; e++)
      k = l[e], i = k[0] + h, g = k[1] + h, k = k[2] + h, this.faces.push(new THREE.Face3(i, g, k, null, null, c)), this.faceVertexUvs[0].push(d.generateBottomUV(this, a, b, i, g, k));
  };
  THREE.LatheGeometry = function(a, b, c) {
    THREE.Geometry.call(this);
    for (var b = b || 12, c = c || 2 * Math.PI, d = [], e = new THREE.Matrix4().makeRotationZ(c / b), f = 0; f < a.length; f++)
      d[f] = a[f].clone(), this.vertices.push(d[f]);
    for (var g = b + 1, c = 0; c < g; c++)
      for (f = 0; f < d.length; f++)
        d[f] = e.multiplyVector3(d[f].clone()), this.vertices.push(d[f]);
    for (c = 0; c < b; c++) {
      d = 0;
      for (e = a.length; d < e - 1; d++)
        this.faces.push(new THREE.Face4(c * e + d, (c + 1) % g * e + d, (c + 1) % g * e + (d + 1) % e, c * e + (d + 1) % e)), this.faceVertexUvs[0].push([new THREE.Vector2(1 - c / b, d / e), new THREE.Vector2(1 - (c + 1) / b, d / e), new THREE.Vector2(1 - (c + 1) / b, (d + 1) / e), new THREE.Vector2(1 - c / b, (d + 1) / e)]);
    }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  };
  THREE.LatheGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.PlaneGeometry = function(a, b, c, d) {
    THREE.Geometry.call(this);
    this.width = a;
    this.height = b;
    this.widthSegments = c || 1;
    this.heightSegments = d || 1;
    for (var c = a / 2, e = b / 2, d = this.widthSegments, f = this.heightSegments, g = d + 1, h = f + 1, i = this.width / d, k = this.height / f, l = new THREE.Vector3(0, 0, 1), a = 0; a < h; a++)
      for (b = 0; b < g; b++)
        this.vertices.push(new THREE.Vector3(b * i - c, -(a * k - e), 0));
    for (a = 0; a < f; a++)
      for (b = 0; b < d; b++)
        c = new THREE.Face4(b + g * a, b + g * (a + 1), b + 1 + g * (a + 1), b + 1 + g * a), c.normal.copy(l), c.vertexNormals.push(
          l.clone(),
          l.clone(),
          l.clone(),
          l.clone()
        ), this.faces.push(c), this.faceVertexUvs[0].push([new THREE.Vector2(b / d, 1 - a / f), new THREE.Vector2(b / d, 1 - (a + 1) / f), new THREE.Vector2((b + 1) / d, 1 - (a + 1) / f), new THREE.Vector2((b + 1) / d, 1 - a / f)]);
    this.computeCentroids();
  };
  THREE.PlaneGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.SphereGeometry = function(a, b, c, d, e, f, g) {
    THREE.Geometry.call(this);
    this.radius = a || 50;
    this.widthSegments = Math.max(3, Math.floor(b) || 8);
    this.heightSegments = Math.max(2, Math.floor(c) || 6);
    for (var d = void 0 !== d ? d : 0, e = void 0 !== e ? e : 2 * Math.PI, f = void 0 !== f ? f : 0, g = void 0 !== g ? g : Math.PI, h = [], i = [], c = 0; c <= this.heightSegments; c++) {
      for (var k = [], l = [], b = 0; b <= this.widthSegments; b++) {
        var m = b / this.widthSegments, p = c / this.heightSegments, s = new THREE.Vector3();
        s.x = -this.radius * Math.cos(d + m * e) * Math.sin(f + p * g);
        s.y = this.radius * Math.cos(f + p * g);
        s.z = this.radius * Math.sin(d + m * e) * Math.sin(f + p * g);
        this.vertices.push(s);
        k.push(this.vertices.length - 1);
        l.push(new THREE.Vector2(m, 1 - p));
      }
      h.push(k);
      i.push(l);
    }
    for (c = 0; c < this.heightSegments; c++)
      for (b = 0; b < this.widthSegments; b++) {
        var d = h[c][b + 1], e = h[c][b], f = h[c + 1][b], g = h[c + 1][b + 1], k = this.vertices[d].clone().normalize(), l = this.vertices[e].clone().normalize(), m = this.vertices[f].clone().normalize(), p = this.vertices[g].clone().normalize(), s = i[c][b + 1].clone(), q = i[c][b].clone(), n = i[c + 1][b].clone(), r = i[c + 1][b + 1].clone();
        Math.abs(this.vertices[d].y) === this.radius ? (this.faces.push(new THREE.Face3(d, f, g, [k, m, p])), this.faceVertexUvs[0].push([s, n, r])) : Math.abs(this.vertices[f].y) === this.radius ? (this.faces.push(new THREE.Face3(d, e, f, [k, l, m])), this.faceVertexUvs[0].push([s, q, n])) : (this.faces.push(new THREE.Face4(d, e, f, g, [k, l, m, p])), this.faceVertexUvs[0].push([s, q, n, r]));
      }
    this.computeCentroids();
    this.computeFaceNormals();
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), a);
  };
  THREE.SphereGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.TextGeometry = function(a, b) {
    var c = THREE.FontUtils.generateShapes(a, b);
    b.amount = void 0 !== b.height ? b.height : 50;
    void 0 === b.bevelThickness && (b.bevelThickness = 10);
    void 0 === b.bevelSize && (b.bevelSize = 8);
    void 0 === b.bevelEnabled && (b.bevelEnabled = false);
    THREE.ExtrudeGeometry.call(this, c, b);
  };
  THREE.TextGeometry.prototype = Object.create(THREE.ExtrudeGeometry.prototype);
  THREE.TorusGeometry = function(a, b, c, d, e) {
    THREE.Geometry.call(this);
    this.radius = a || 100;
    this.tube = b || 40;
    this.radialSegments = c || 8;
    this.tubularSegments = d || 6;
    this.arc = e || 2 * Math.PI;
    e = new THREE.Vector3();
    a = [];
    b = [];
    for (c = 0; c <= this.radialSegments; c++)
      for (d = 0; d <= this.tubularSegments; d++) {
        var f = d / this.tubularSegments * this.arc, g = 2 * c / this.radialSegments * Math.PI;
        e.x = this.radius * Math.cos(f);
        e.y = this.radius * Math.sin(f);
        var h = new THREE.Vector3();
        h.x = (this.radius + this.tube * Math.cos(g)) * Math.cos(f);
        h.y = (this.radius + this.tube * Math.cos(g)) * Math.sin(f);
        h.z = this.tube * Math.sin(g);
        this.vertices.push(h);
        a.push(new THREE.Vector2(d / this.tubularSegments, c / this.radialSegments));
        b.push(h.clone().subSelf(e).normalize());
      }
    for (c = 1; c <= this.radialSegments; c++)
      for (d = 1; d <= this.tubularSegments; d++) {
        var e = (this.tubularSegments + 1) * c + d - 1, f = (this.tubularSegments + 1) * (c - 1) + d - 1, g = (this.tubularSegments + 1) * (c - 1) + d, h = (this.tubularSegments + 1) * c + d, i = new THREE.Face4(e, f, g, h, [b[e], b[f], b[g], b[h]]);
        i.normal.addSelf(b[e]);
        i.normal.addSelf(b[f]);
        i.normal.addSelf(b[g]);
        i.normal.addSelf(b[h]);
        i.normal.normalize();
        this.faces.push(i);
        this.faceVertexUvs[0].push([a[e].clone(), a[f].clone(), a[g].clone(), a[h].clone()]);
      }
    this.computeCentroids();
  };
  THREE.TorusGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.TorusKnotGeometry = function(a, b, c, d, e, f, g) {
    function h(a2, b2, c2, d2, e2, f2) {
      var g2 = Math.cos(a2);
      Math.cos(b2);
      b2 = Math.sin(a2);
      a2 *= c2 / d2;
      c2 = Math.cos(a2);
      g2 *= 0.5 * e2 * (2 + c2);
      b2 = 0.5 * e2 * (2 + c2) * b2;
      e2 = 0.5 * f2 * e2 * Math.sin(a2);
      return new THREE.Vector3(g2, b2, e2);
    }
    THREE.Geometry.call(this);
    this.radius = a || 100;
    this.tube = b || 40;
    this.radialSegments = c || 64;
    this.tubularSegments = d || 8;
    this.p = e || 2;
    this.q = f || 3;
    this.heightScale = g || 1;
    this.grid = Array(this.radialSegments);
    c = new THREE.Vector3();
    d = new THREE.Vector3();
    e = new THREE.Vector3();
    for (a = 0; a < this.radialSegments; ++a) {
      this.grid[a] = Array(this.tubularSegments);
      for (b = 0; b < this.tubularSegments; ++b) {
        var i = 2 * (a / this.radialSegments) * this.p * Math.PI, g = 2 * (b / this.tubularSegments) * Math.PI, f = h(i, g, this.q, this.p, this.radius, this.heightScale), i = h(i + 0.01, g, this.q, this.p, this.radius, this.heightScale);
        c.sub(i, f);
        d.add(i, f);
        e.cross(c, d);
        d.cross(e, c);
        e.normalize();
        d.normalize();
        i = -this.tube * Math.cos(g);
        g = this.tube * Math.sin(g);
        f.x += i * d.x + g * e.x;
        f.y += i * d.y + g * e.y;
        f.z += i * d.z + g * e.z;
        this.grid[a][b] = this.vertices.push(new THREE.Vector3(f.x, f.y, f.z)) - 1;
      }
    }
    for (a = 0; a < this.radialSegments; ++a)
      for (b = 0; b < this.tubularSegments; ++b) {
        var e = (a + 1) % this.radialSegments, f = (b + 1) % this.tubularSegments, c = this.grid[a][b], d = this.grid[e][b], e = this.grid[e][f], f = this.grid[a][f], g = new THREE.Vector2(a / this.radialSegments, b / this.tubularSegments), i = new THREE.Vector2((a + 1) / this.radialSegments, b / this.tubularSegments), k = new THREE.Vector2((a + 1) / this.radialSegments, (b + 1) / this.tubularSegments), l = new THREE.Vector2(a / this.radialSegments, (b + 1) / this.tubularSegments);
        this.faces.push(new THREE.Face4(
          c,
          d,
          e,
          f
        ));
        this.faceVertexUvs[0].push([g, i, k, l]);
      }
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  };
  THREE.TorusKnotGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.TubeGeometry = function(a, b, c, d, e, f) {
    THREE.Geometry.call(this);
    this.path = a;
    this.segments = b || 64;
    this.radius = c || 1;
    this.radiusSegments = d || 8;
    this.closed = e || false;
    f && (this.debug = new THREE.Object3D());
    this.grid = [];
    var g, h, e = this.segments + 1, i, k, l, f = new THREE.Vector3(), m, p, s, b = new THREE.TubeGeometry.FrenetFrames(this.path, this.segments, this.closed);
    m = b.tangents;
    p = b.normals;
    s = b.binormals;
    this.tangents = m;
    this.normals = p;
    this.binormals = s;
    for (b = 0; b < e; b++) {
      this.grid[b] = [];
      d = b / (e - 1);
      l = a.getPointAt(d);
      d = m[b];
      g = p[b];
      h = s[b];
      this.debug && (this.debug.add(new THREE.ArrowHelper(d, l, c, 255)), this.debug.add(new THREE.ArrowHelper(g, l, c, 16711680)), this.debug.add(new THREE.ArrowHelper(h, l, c, 65280)));
      for (d = 0; d < this.radiusSegments; d++)
        i = 2 * (d / this.radiusSegments) * Math.PI, k = -this.radius * Math.cos(i), i = this.radius * Math.sin(i), f.copy(l), f.x += k * g.x + i * h.x, f.y += k * g.y + i * h.y, f.z += k * g.z + i * h.z, this.grid[b][d] = this.vertices.push(new THREE.Vector3(f.x, f.y, f.z)) - 1;
    }
    for (b = 0; b < this.segments; b++)
      for (d = 0; d < this.radiusSegments; d++)
        e = this.closed ? (b + 1) % this.segments : b + 1, f = (d + 1) % this.radiusSegments, a = this.grid[b][d], c = this.grid[e][d], e = this.grid[e][f], f = this.grid[b][f], m = new THREE.Vector2(b / this.segments, d / this.radiusSegments), p = new THREE.Vector2((b + 1) / this.segments, d / this.radiusSegments), s = new THREE.Vector2((b + 1) / this.segments, (d + 1) / this.radiusSegments), g = new THREE.Vector2(b / this.segments, (d + 1) / this.radiusSegments), this.faces.push(new THREE.Face4(a, c, e, f)), this.faceVertexUvs[0].push([m, p, s, g]);
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  };
  THREE.TubeGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.TubeGeometry.FrenetFrames = function(a, b, c) {
    new THREE.Vector3();
    var d = new THREE.Vector3();
    new THREE.Vector3();
    var e = [], f = [], g = [], h = new THREE.Vector3(), i = new THREE.Matrix4(), b = b + 1, k, l, m;
    this.tangents = e;
    this.normals = f;
    this.binormals = g;
    for (k = 0; k < b; k++)
      l = k / (b - 1), e[k] = a.getTangentAt(l), e[k].normalize();
    f[0] = new THREE.Vector3();
    g[0] = new THREE.Vector3();
    a = Number.MAX_VALUE;
    k = Math.abs(e[0].x);
    l = Math.abs(e[0].y);
    m = Math.abs(e[0].z);
    k <= a && (a = k, d.set(1, 0, 0));
    l <= a && (a = l, d.set(0, 1, 0));
    m <= a && d.set(0, 0, 1);
    h.cross(e[0], d).normalize();
    f[0].cross(e[0], h);
    g[0].cross(e[0], f[0]);
    for (k = 1; k < b; k++)
      f[k] = f[k - 1].clone(), g[k] = g[k - 1].clone(), h.cross(e[k - 1], e[k]), 1e-4 < h.length() && (h.normalize(), d = Math.acos(e[k - 1].dot(e[k])), i.makeRotationAxis(h, d).multiplyVector3(f[k])), g[k].cross(e[k], f[k]);
    if (c) {
      d = Math.acos(f[0].dot(f[b - 1]));
      d /= b - 1;
      0 < e[0].dot(h.cross(f[0], f[b - 1])) && (d = -d);
      for (k = 1; k < b; k++)
        i.makeRotationAxis(e[k], d * k).multiplyVector3(f[k]), g[k].cross(e[k], f[k]);
    }
  };
  THREE.PolyhedronGeometry = function(a, b, c, d) {
    function e(a2) {
      var b2 = a2.normalize().clone();
      b2.index = i.vertices.push(b2) - 1;
      var c2 = Math.atan2(a2.z, -a2.x) / 2 / Math.PI + 0.5, a2 = Math.atan2(-a2.y, Math.sqrt(a2.x * a2.x + a2.z * a2.z)) / Math.PI + 0.5;
      b2.uv = new THREE.Vector2(c2, 1 - a2);
      return b2;
    }
    function f(a2, b2, c2, d2) {
      1 > d2 ? (d2 = new THREE.Face3(a2.index, b2.index, c2.index, [a2.clone(), b2.clone(), c2.clone()]), d2.centroid.addSelf(a2).addSelf(b2).addSelf(c2).divideScalar(3), d2.normal = d2.centroid.clone().normalize(), i.faces.push(d2), d2 = Math.atan2(d2.centroid.z, -d2.centroid.x), i.faceVertexUvs[0].push([h(a2.uv, a2, d2), h(b2.uv, b2, d2), h(c2.uv, c2, d2)])) : (d2 -= 1, f(a2, g(a2, b2), g(a2, c2), d2), f(g(a2, b2), b2, g(b2, c2), d2), f(g(a2, c2), g(b2, c2), c2, d2), f(g(a2, b2), g(b2, c2), g(a2, c2), d2));
    }
    function g(a2, b2) {
      m[a2.index] || (m[a2.index] = []);
      m[b2.index] || (m[b2.index] = []);
      var c2 = m[a2.index][b2.index];
      void 0 === c2 && (m[a2.index][b2.index] = m[b2.index][a2.index] = c2 = e(new THREE.Vector3().add(a2, b2).divideScalar(2)));
      return c2;
    }
    function h(a2, b2, c2) {
      0 > c2 && 1 === a2.x && (a2 = new THREE.Vector2(a2.x - 1, a2.y));
      0 === b2.x && 0 === b2.z && (a2 = new THREE.Vector2(c2 / 2 / Math.PI + 0.5, a2.y));
      return a2;
    }
    THREE.Geometry.call(this);
    for (var c = c || 1, d = d || 0, i = this, k = 0, l = a.length; k < l; k++)
      e(new THREE.Vector3(a[k][0], a[k][1], a[k][2]));
    for (var m = [], a = this.vertices, k = 0, l = b.length; k < l; k++)
      f(a[b[k][0]], a[b[k][1]], a[b[k][2]], d);
    this.mergeVertices();
    k = 0;
    for (l = this.vertices.length; k < l; k++)
      this.vertices[k].multiplyScalar(c);
    this.computeCentroids();
    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), c);
  };
  THREE.PolyhedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.IcosahedronGeometry = function(a, b) {
    var c = (1 + Math.sqrt(5)) / 2;
    THREE.PolyhedronGeometry.call(this, [[-1, c, 0], [1, c, 0], [-1, -c, 0], [1, -c, 0], [0, -1, c], [0, 1, c], [0, -1, -c], [0, 1, -c], [c, 0, -1], [c, 0, 1], [-c, 0, -1], [-c, 0, 1]], [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]], a, b);
  };
  THREE.IcosahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.OctahedronGeometry = function(a, b) {
    THREE.PolyhedronGeometry.call(this, [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], [[0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2], [1, 2, 5], [1, 5, 3], [1, 3, 4], [1, 4, 2]], a, b);
  };
  THREE.OctahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.TetrahedronGeometry = function(a, b) {
    THREE.PolyhedronGeometry.call(this, [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]], [[2, 1, 0], [0, 3, 2], [1, 3, 0], [2, 3, 1]], a, b);
  };
  THREE.TetrahedronGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.ParametricGeometry = function(a, b, c, d) {
    THREE.Geometry.call(this);
    var e = this.vertices, f = this.faces, g = this.faceVertexUvs[0], d = void 0 === d ? false : d, h, i, k, l, m = b + 1;
    for (h = 0; h <= c; h++) {
      l = h / c;
      for (i = 0; i <= b; i++)
        k = i / b, k = a(k, l), e.push(k);
    }
    var p, s, q, n;
    for (h = 0; h < c; h++)
      for (i = 0; i < b; i++)
        a = h * m + i, e = h * m + i + 1, l = (h + 1) * m + i, k = (h + 1) * m + i + 1, p = new THREE.Vector2(i / b, h / c), s = new THREE.Vector2((i + 1) / b, h / c), q = new THREE.Vector2(i / b, (h + 1) / c), n = new THREE.Vector2((i + 1) / b, (h + 1) / c), d ? (f.push(new THREE.Face3(a, e, l)), f.push(new THREE.Face3(
          e,
          k,
          l
        )), g.push([p, s, q]), g.push([s, n, q])) : (f.push(new THREE.Face4(a, e, k, l)), g.push([p, s, n, q]));
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  };
  THREE.ParametricGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.ConvexGeometry = function(a) {
    function b(a2) {
      var b2 = a2.length();
      return new THREE.Vector2(a2.x / b2, a2.y / b2);
    }
    THREE.Geometry.call(this);
    for (var c = [[0, 1, 2], [0, 2, 1]], d = 3; d < a.length; d++) {
      var e = d, f = a[e].clone(), g = f.length();
      f.x += g * 2e-6 * (Math.random() - 0.5);
      f.y += g * 2e-6 * (Math.random() - 0.5);
      f.z += g * 2e-6 * (Math.random() - 0.5);
      for (var g = [], h = 0; h < c.length; ) {
        var i = c[h], k = f, l = a[i[0]], m;
        m = l;
        var p = a[i[1]], s = a[i[2]], q = new THREE.Vector3(), n = new THREE.Vector3();
        q.sub(s, p);
        n.sub(m, p);
        q.crossSelf(n);
        q.normalize();
        m = q;
        l = m.dot(l);
        if (m.dot(k) >= l) {
          for (k = 0; 3 > k; k++) {
            l = [i[k], i[(k + 1) % 3]];
            m = true;
            for (p = 0; p < g.length; p++)
              if (g[p][0] === l[1] && g[p][1] === l[0]) {
                g[p] = g[g.length - 1];
                g.pop();
                m = false;
                break;
              }
            m && g.push(l);
          }
          c[h] = c[c.length - 1];
          c.pop();
        } else
          h++;
      }
      for (p = 0; p < g.length; p++)
        c.push([g[p][0], g[p][1], e]);
    }
    e = 0;
    f = Array(a.length);
    for (d = 0; d < c.length; d++) {
      g = c[d];
      for (h = 0; 3 > h; h++)
        void 0 === f[g[h]] && (f[g[h]] = e++, this.vertices.push(a[g[h]])), g[h] = f[g[h]];
    }
    for (d = 0; d < c.length; d++)
      this.faces.push(new THREE.Face3(c[d][0], c[d][1], c[d][2]));
    for (d = 0; d < this.faces.length; d++)
      g = this.faces[d], this.faceVertexUvs[0].push([b(this.vertices[g.a]), b(this.vertices[g.b]), b(this.vertices[g.c])]);
    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
  };
  THREE.ConvexGeometry.prototype = Object.create(THREE.Geometry.prototype);
  THREE.AxisHelper = function(a) {
    var b = new THREE.Geometry();
    b.vertices.push(new THREE.Vector3(), new THREE.Vector3(a || 1, 0, 0), new THREE.Vector3(), new THREE.Vector3(0, a || 1, 0), new THREE.Vector3(), new THREE.Vector3(0, 0, a || 1));
    b.colors.push(new THREE.Color(16711680), new THREE.Color(16755200), new THREE.Color(65280), new THREE.Color(11206400), new THREE.Color(255), new THREE.Color(43775));
    a = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    THREE.Line.call(this, b, a, THREE.LinePieces);
  };
  THREE.AxisHelper.prototype = Object.create(THREE.Line.prototype);
  THREE.ArrowHelper = function(a, b, c, d) {
    THREE.Object3D.call(this);
    void 0 === d && (d = 16776960);
    void 0 === c && (c = 20);
    var e = new THREE.Geometry();
    e.vertices.push(new THREE.Vector3(0, 0, 0));
    e.vertices.push(new THREE.Vector3(0, 1, 0));
    this.line = new THREE.Line(e, new THREE.LineBasicMaterial({ color: d }));
    this.add(this.line);
    e = new THREE.CylinderGeometry(0, 0.05, 0.25, 5, 1);
    this.cone = new THREE.Mesh(e, new THREE.MeshBasicMaterial({ color: d }));
    this.cone.position.set(0, 1, 0);
    this.add(this.cone);
    b instanceof THREE.Vector3 && (this.position = b);
    this.setDirection(a);
    this.setLength(c);
  };
  THREE.ArrowHelper.prototype = Object.create(THREE.Object3D.prototype);
  THREE.ArrowHelper.prototype.setDirection = function(a) {
    var b = new THREE.Vector3(0, 1, 0).crossSelf(a), a = Math.acos(new THREE.Vector3(0, 1, 0).dot(a.clone().normalize()));
    this.matrix = new THREE.Matrix4().makeRotationAxis(b.normalize(), a);
    this.rotation.setEulerFromRotationMatrix(this.matrix, this.eulerOrder);
  };
  THREE.ArrowHelper.prototype.setLength = function(a) {
    this.scale.set(a, a, a);
  };
  THREE.ArrowHelper.prototype.setColor = function(a) {
    this.line.material.color.setHex(a);
    this.cone.material.color.setHex(a);
  };
  THREE.CameraHelper = function(a) {
    function b(a2, b2, d2) {
      c(a2, d2);
      c(b2, d2);
    }
    function c(a2, b2) {
      d.geometry.vertices.push(new THREE.Vector3());
      d.geometry.colors.push(new THREE.Color(b2));
      void 0 === d.pointMap[a2] && (d.pointMap[a2] = []);
      d.pointMap[a2].push(d.geometry.vertices.length - 1);
    }
    THREE.Line.call(this);
    var d = this;
    this.geometry = new THREE.Geometry();
    this.material = new THREE.LineBasicMaterial({ color: 16777215, vertexColors: THREE.FaceColors });
    this.type = THREE.LinePieces;
    this.matrixWorld = a.matrixWorld;
    this.matrixAutoUpdate = false;
    this.pointMap = {};
    b("n1", "n2", 16755200);
    b("n2", "n4", 16755200);
    b("n4", "n3", 16755200);
    b("n3", "n1", 16755200);
    b("f1", "f2", 16755200);
    b("f2", "f4", 16755200);
    b("f4", "f3", 16755200);
    b("f3", "f1", 16755200);
    b("n1", "f1", 16755200);
    b("n2", "f2", 16755200);
    b("n3", "f3", 16755200);
    b("n4", "f4", 16755200);
    b("p", "n1", 16711680);
    b("p", "n2", 16711680);
    b("p", "n3", 16711680);
    b("p", "n4", 16711680);
    b("u1", "u2", 43775);
    b("u2", "u3", 43775);
    b("u3", "u1", 43775);
    b("c", "t", 16777215);
    b("p", "c", 3355443);
    b("cn1", "cn2", 3355443);
    b("cn3", "cn4", 3355443);
    b(
      "cf1",
      "cf2",
      3355443
    );
    b("cf3", "cf4", 3355443);
    this.camera = a;
    this.update(a);
  };
  THREE.CameraHelper.prototype = Object.create(THREE.Line.prototype);
  THREE.CameraHelper.prototype.update = function() {
    function a(a2, d, e, f) {
      THREE.CameraHelper.__v.set(d, e, f);
      THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v, THREE.CameraHelper.__c);
      a2 = b.pointMap[a2];
      if (void 0 !== a2) {
        d = 0;
        for (e = a2.length; d < e; d++)
          b.geometry.vertices[a2[d]].copy(THREE.CameraHelper.__v);
      }
    }
    var b = this;
    THREE.CameraHelper.__c.projectionMatrix.copy(this.camera.projectionMatrix);
    a("c", 0, 0, -1);
    a("t", 0, 0, 1);
    a("n1", -1, -1, -1);
    a("n2", 1, -1, -1);
    a("n3", -1, 1, -1);
    a("n4", 1, 1, -1);
    a("f1", -1, -1, 1);
    a("f2", 1, -1, 1);
    a("f3", -1, 1, 1);
    a("f4", 1, 1, 1);
    a("u1", 0.7, 1.1, -1);
    a("u2", -0.7, 1.1, -1);
    a("u3", 0, 2, -1);
    a("cf1", -1, 0, 1);
    a("cf2", 1, 0, 1);
    a("cf3", 0, -1, 1);
    a("cf4", 0, 1, 1);
    a("cn1", -1, 0, -1);
    a("cn2", 1, 0, -1);
    a("cn3", 0, -1, -1);
    a("cn4", 0, 1, -1);
    this.geometry.verticesNeedUpdate = true;
  };
  THREE.CameraHelper.__projector = new THREE.Projector();
  THREE.CameraHelper.__v = new THREE.Vector3();
  THREE.CameraHelper.__c = new THREE.Camera();
  THREE.DirectionalLightHelper = function(a, b, c) {
    THREE.Object3D.call(this);
    this.light = a;
    this.position = a.position;
    this.direction = new THREE.Vector3();
    this.direction.sub(a.target.position, a.position);
    this.color = a.color.clone();
    var d = THREE.Math.clamp(a.intensity, 0, 1);
    this.color.r *= d;
    this.color.g *= d;
    this.color.b *= d;
    var d = this.color.getHex(), e = new THREE.SphereGeometry(b, 16, 8), f = new THREE.AsteriskGeometry(1.25 * b, 2.25 * b), g = new THREE.MeshBasicMaterial({ color: d, fog: false }), h = new THREE.LineBasicMaterial({ color: d, fog: false });
    this.lightArrow = new THREE.ArrowHelper(this.direction, null, c, d);
    this.lightSphere = new THREE.Mesh(e, g);
    this.lightArrow.cone.material.fog = false;
    this.lightArrow.line.material.fog = false;
    this.lightRays = new THREE.Line(f, h, THREE.LinePieces);
    this.add(this.lightArrow);
    this.add(this.lightSphere);
    this.add(this.lightRays);
    this.lightSphere.properties.isGizmo = true;
    this.lightSphere.properties.gizmoSubject = a;
    this.lightSphere.properties.gizmoRoot = this;
    this.targetSphere = null;
    a.target.properties.targetInverse && (b = new THREE.SphereGeometry(
      b,
      8,
      4
    ), c = new THREE.MeshBasicMaterial({ color: d, wireframe: true, fog: false }), this.targetSphere = new THREE.Mesh(b, c), this.targetSphere.position = a.target.position, this.targetSphere.properties.isGizmo = true, this.targetSphere.properties.gizmoSubject = a.target, this.targetSphere.properties.gizmoRoot = this.targetSphere, a = new THREE.LineDashedMaterial({ color: d, dashSize: 4, gapSize: 4, opacity: 0.75, transparent: true, fog: false }), d = new THREE.Geometry(), d.vertices.push(this.position.clone()), d.vertices.push(this.targetSphere.position.clone()), d.computeLineDistances(), this.targetLine = new THREE.Line(d, a), this.targetLine.properties.isGizmo = true);
    this.properties.isGizmo = true;
  };
  THREE.DirectionalLightHelper.prototype = Object.create(THREE.Object3D.prototype);
  THREE.DirectionalLightHelper.prototype.update = function() {
    this.direction.sub(this.light.target.position, this.light.position);
    this.lightArrow.setDirection(this.direction);
    this.color.copy(this.light.color);
    var a = THREE.Math.clamp(this.light.intensity, 0, 1);
    this.color.r *= a;
    this.color.g *= a;
    this.color.b *= a;
    this.lightArrow.setColor(this.color.getHex());
    this.lightSphere.material.color.copy(this.color);
    this.lightRays.material.color.copy(this.color);
    this.targetSphere.material.color.copy(this.color);
    this.targetLine.material.color.copy(this.color);
    this.targetLine.geometry.vertices[0].copy(this.light.position);
    this.targetLine.geometry.vertices[1].copy(this.light.target.position);
    this.targetLine.geometry.computeLineDistances();
    this.targetLine.geometry.verticesNeedUpdate = true;
  };
  THREE.HemisphereLightHelper = function(a, b, c) {
    THREE.Object3D.call(this);
    this.light = a;
    this.position = a.position;
    var d = THREE.Math.clamp(a.intensity, 0, 1);
    this.color = a.color.clone();
    this.color.r *= d;
    this.color.g *= d;
    this.color.b *= d;
    var e = this.color.getHex();
    this.groundColor = a.groundColor.clone();
    this.groundColor.r *= d;
    this.groundColor.g *= d;
    this.groundColor.b *= d;
    for (var d = this.groundColor.getHex(), f = new THREE.SphereGeometry(b, 16, 8, 0, 2 * Math.PI, 0, 0.5 * Math.PI), g = new THREE.SphereGeometry(b, 16, 8, 0, 2 * Math.PI, 0.5 * Math.PI, Math.PI), h = new THREE.MeshBasicMaterial({ color: e, fog: false }), i = new THREE.MeshBasicMaterial({ color: d, fog: false }), k = 0, l = f.faces.length; k < l; k++)
      f.faces[k].materialIndex = 0;
    k = 0;
    for (l = g.faces.length; k < l; k++)
      g.faces[k].materialIndex = 1;
    THREE.GeometryUtils.merge(f, g);
    this.lightSphere = new THREE.Mesh(f, new THREE.MeshFaceMaterial([h, i]));
    this.lightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1.1 * (b + c), 0), c, e);
    this.lightArrow.rotation.x = Math.PI;
    this.lightArrowGround = new THREE.ArrowHelper(new THREE.Vector3(
      0,
      1,
      0
    ), new THREE.Vector3(0, -1.1 * (b + c), 0), c, d);
    b = new THREE.Object3D();
    b.rotation.x = 0.5 * -Math.PI;
    b.add(this.lightSphere);
    b.add(this.lightArrow);
    b.add(this.lightArrowGround);
    this.add(b);
    this.lightSphere.properties.isGizmo = true;
    this.lightSphere.properties.gizmoSubject = a;
    this.lightSphere.properties.gizmoRoot = this;
    this.properties.isGizmo = true;
    this.target = new THREE.Vector3();
    this.lookAt(this.target);
  };
  THREE.HemisphereLightHelper.prototype = Object.create(THREE.Object3D.prototype);
  THREE.HemisphereLightHelper.prototype.update = function() {
    var a = THREE.Math.clamp(this.light.intensity, 0, 1);
    this.color.copy(this.light.color);
    this.groundColor.copy(this.light.groundColor);
    this.color.r *= a;
    this.color.g *= a;
    this.color.b *= a;
    this.groundColor.r *= a;
    this.groundColor.g *= a;
    this.groundColor.b *= a;
    this.lightSphere.material.materials[0].color.copy(this.color);
    this.lightSphere.material.materials[1].color.copy(this.groundColor);
    this.lightArrow.setColor(this.color.getHex());
    this.lightArrowGround.setColor(this.groundColor.getHex());
    this.lookAt(this.target);
  };
  THREE.PointLightHelper = function(a, b) {
    THREE.Object3D.call(this);
    this.light = a;
    this.position = a.position;
    this.color = a.color.clone();
    var c = THREE.Math.clamp(a.intensity, 0, 1);
    this.color.r *= c;
    this.color.g *= c;
    this.color.b *= c;
    var d = this.color.getHex(), c = new THREE.SphereGeometry(b, 16, 8), e = new THREE.AsteriskGeometry(1.25 * b, 2.25 * b), f = new THREE.IcosahedronGeometry(1, 2), g = new THREE.MeshBasicMaterial({ color: d, fog: false }), h = new THREE.LineBasicMaterial({ color: d, fog: false }), d = new THREE.MeshBasicMaterial({
      color: d,
      fog: false,
      wireframe: true,
      opacity: 0.1,
      transparent: true
    });
    this.lightSphere = new THREE.Mesh(c, g);
    this.lightRays = new THREE.Line(e, h, THREE.LinePieces);
    this.lightDistance = new THREE.Mesh(f, d);
    c = a.distance;
    0 === c ? this.lightDistance.visible = false : this.lightDistance.scale.set(c, c, c);
    this.add(this.lightSphere);
    this.add(this.lightRays);
    this.add(this.lightDistance);
    this.lightSphere.properties.isGizmo = true;
    this.lightSphere.properties.gizmoSubject = a;
    this.lightSphere.properties.gizmoRoot = this;
    this.properties.isGizmo = true;
  };
  THREE.PointLightHelper.prototype = Object.create(THREE.Object3D.prototype);
  THREE.PointLightHelper.prototype.update = function() {
    this.color.copy(this.light.color);
    var a = THREE.Math.clamp(this.light.intensity, 0, 1);
    this.color.r *= a;
    this.color.g *= a;
    this.color.b *= a;
    this.lightSphere.material.color.copy(this.color);
    this.lightRays.material.color.copy(this.color);
    this.lightDistance.material.color.copy(this.color);
    a = this.light.distance;
    0 === a ? this.lightDistance.visible = false : (this.lightDistance.visible = true, this.lightDistance.scale.set(a, a, a));
  };
  THREE.SpotLightHelper = function(a, b, c) {
    THREE.Object3D.call(this);
    this.light = a;
    this.position = a.position;
    this.direction = new THREE.Vector3();
    this.direction.sub(a.target.position, a.position);
    this.color = a.color.clone();
    var d = THREE.Math.clamp(a.intensity, 0, 1);
    this.color.r *= d;
    this.color.g *= d;
    this.color.b *= d;
    var d = this.color.getHex(), e = new THREE.SphereGeometry(b, 16, 8), f = new THREE.AsteriskGeometry(1.25 * b, 2.25 * b), g = new THREE.CylinderGeometry(1e-4, 1, 1, 8, 1, true), h = new THREE.Matrix4();
    h.rotateX(-Math.PI / 2);
    h.translate(new THREE.Vector3(
      0,
      -0.5,
      0
    ));
    g.applyMatrix(h);
    var i = new THREE.MeshBasicMaterial({ color: d, fog: false }), h = new THREE.LineBasicMaterial({ color: d, fog: false }), k = new THREE.MeshBasicMaterial({ color: d, fog: false, wireframe: true, opacity: 0.3, transparent: true });
    this.lightArrow = new THREE.ArrowHelper(this.direction, null, c, d);
    this.lightSphere = new THREE.Mesh(e, i);
    this.lightCone = new THREE.Mesh(g, k);
    c = a.distance ? a.distance : 1e4;
    e = 2 * c * Math.tan(0.5 * a.angle);
    this.lightCone.scale.set(e, e, c);
    this.lightArrow.cone.material.fog = false;
    this.lightArrow.line.material.fog = false;
    this.lightRays = new THREE.Line(f, h, THREE.LinePieces);
    this.gyroscope = new THREE.Gyroscope();
    this.gyroscope.add(this.lightArrow);
    this.gyroscope.add(this.lightSphere);
    this.gyroscope.add(this.lightRays);
    this.add(this.gyroscope);
    this.add(this.lightCone);
    this.lookAt(a.target.position);
    this.lightSphere.properties.isGizmo = true;
    this.lightSphere.properties.gizmoSubject = a;
    this.lightSphere.properties.gizmoRoot = this;
    this.targetSphere = null;
    a.target.properties.targetInverse && (b = new THREE.SphereGeometry(b, 8, 4), f = new THREE.MeshBasicMaterial({
      color: d,
      wireframe: true,
      fog: false
    }), this.targetSphere = new THREE.Mesh(b, f), this.targetSphere.position = a.target.position, this.targetSphere.properties.isGizmo = true, this.targetSphere.properties.gizmoSubject = a.target, this.targetSphere.properties.gizmoRoot = this.targetSphere, a = new THREE.LineDashedMaterial({ color: d, dashSize: 4, gapSize: 4, opacity: 0.75, transparent: true, fog: false }), d = new THREE.Geometry(), d.vertices.push(this.position.clone()), d.vertices.push(this.targetSphere.position.clone()), d.computeLineDistances(), this.targetLine = new THREE.Line(d, a), this.targetLine.properties.isGizmo = true);
    this.properties.isGizmo = true;
  };
  THREE.SpotLightHelper.prototype = Object.create(THREE.Object3D.prototype);
  THREE.SpotLightHelper.prototype.update = function() {
    this.direction.sub(this.light.target.position, this.light.position);
    this.lightArrow.setDirection(this.direction);
    this.lookAt(this.light.target.position);
    var a = this.light.distance ? this.light.distance : 1e4, b = 2 * a * Math.tan(0.5 * this.light.angle);
    this.lightCone.scale.set(b, b, a);
    this.color.copy(this.light.color);
    a = THREE.Math.clamp(this.light.intensity, 0, 1);
    this.color.r *= a;
    this.color.g *= a;
    this.color.b *= a;
    this.lightArrow.setColor(this.color.getHex());
    this.lightSphere.material.color.copy(this.color);
    this.lightRays.material.color.copy(this.color);
    this.lightCone.material.color.copy(this.color);
    this.targetSphere.material.color.copy(this.color);
    this.targetLine.material.color.copy(this.color);
    this.targetLine.geometry.vertices[0].copy(this.light.position);
    this.targetLine.geometry.vertices[1].copy(this.light.target.position);
    this.targetLine.geometry.computeLineDistances();
    this.targetLine.geometry.verticesNeedUpdate = true;
  };
  THREE.ImmediateRenderObject = function() {
    THREE.Object3D.call(this);
    this.render = function() {
    };
  };
  THREE.ImmediateRenderObject.prototype = Object.create(THREE.Object3D.prototype);
  THREE.LensFlare = function(a, b, c, d, e) {
    THREE.Object3D.call(this);
    this.lensFlares = [];
    this.positionScreen = new THREE.Vector3();
    this.customUpdateCallback = void 0;
    void 0 !== a && this.add(a, b, c, d, e);
  };
  THREE.LensFlare.prototype = Object.create(THREE.Object3D.prototype);
  THREE.LensFlare.prototype.add = function(a, b, c, d, e, f) {
    void 0 === b && (b = -1);
    void 0 === c && (c = 0);
    void 0 === f && (f = 1);
    void 0 === e && (e = new THREE.Color(16777215));
    void 0 === d && (d = THREE.NormalBlending);
    c = Math.min(c, Math.max(0, c));
    this.lensFlares.push({ texture: a, size: b, distance: c, x: 0, y: 0, z: 0, scale: 1, rotation: 1, opacity: f, color: e, blending: d });
  };
  THREE.LensFlare.prototype.updateLensFlares = function() {
    var a, b = this.lensFlares.length, c, d = 2 * -this.positionScreen.x, e = 2 * -this.positionScreen.y;
    for (a = 0; a < b; a++)
      c = this.lensFlares[a], c.x = this.positionScreen.x + d * c.distance, c.y = this.positionScreen.y + e * c.distance, c.wantedRotation = 0.25 * c.x * Math.PI, c.rotation += 0.25 * (c.wantedRotation - c.rotation);
  };
  THREE.MorphBlendMesh = function(a, b) {
    THREE.Mesh.call(this, a, b);
    this.animationsMap = {};
    this.animationsList = [];
    var c = this.geometry.morphTargets.length;
    this.createAnimation("__default", 0, c - 1, c / 1);
    this.setAnimationWeight("__default", 1);
  };
  THREE.MorphBlendMesh.prototype = Object.create(THREE.Mesh.prototype);
  THREE.MorphBlendMesh.prototype.createAnimation = function(a, b, c, d) {
    b = { startFrame: b, endFrame: c, length: c - b + 1, fps: d, duration: (c - b) / d, lastFrame: 0, currentFrame: 0, active: false, time: 0, direction: 1, weight: 1, directionBackwards: false, mirroredLoop: false };
    this.animationsMap[a] = b;
    this.animationsList.push(b);
  };
  THREE.MorphBlendMesh.prototype.autoCreateAnimations = function(a) {
    for (var b = /([a-z]+)(\d+)/, c, d = {}, e = this.geometry, f = 0, g = e.morphTargets.length; f < g; f++) {
      var h = e.morphTargets[f].name.match(b);
      if (h && 1 < h.length) {
        var i = h[1];
        d[i] || (d[i] = { start: Infinity, end: -Infinity });
        h = d[i];
        f < h.start && (h.start = f);
        f > h.end && (h.end = f);
        c || (c = i);
      }
    }
    for (i in d)
      h = d[i], this.createAnimation(i, h.start, h.end, a);
    this.firstAnimation = c;
  };
  THREE.MorphBlendMesh.prototype.setAnimationDirectionForward = function(a) {
    if (a = this.animationsMap[a])
      a.direction = 1, a.directionBackwards = false;
  };
  THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward = function(a) {
    if (a = this.animationsMap[a])
      a.direction = -1, a.directionBackwards = true;
  };
  THREE.MorphBlendMesh.prototype.setAnimationFPS = function(a, b) {
    var c = this.animationsMap[a];
    c && (c.fps = b, c.duration = (c.end - c.start) / c.fps);
  };
  THREE.MorphBlendMesh.prototype.setAnimationDuration = function(a, b) {
    var c = this.animationsMap[a];
    c && (c.duration = b, c.fps = (c.end - c.start) / c.duration);
  };
  THREE.MorphBlendMesh.prototype.setAnimationWeight = function(a, b) {
    var c = this.animationsMap[a];
    c && (c.weight = b);
  };
  THREE.MorphBlendMesh.prototype.setAnimationTime = function(a, b) {
    var c = this.animationsMap[a];
    c && (c.time = b);
  };
  THREE.MorphBlendMesh.prototype.getAnimationTime = function(a) {
    var b = 0;
    if (a = this.animationsMap[a])
      b = a.time;
    return b;
  };
  THREE.MorphBlendMesh.prototype.getAnimationDuration = function(a) {
    var b = -1;
    if (a = this.animationsMap[a])
      b = a.duration;
    return b;
  };
  THREE.MorphBlendMesh.prototype.playAnimation = function(a) {
    var b = this.animationsMap[a];
    b ? (b.time = 0, b.active = true) : console.warn("animation[" + a + "] undefined");
  };
  THREE.MorphBlendMesh.prototype.stopAnimation = function(a) {
    if (a = this.animationsMap[a])
      a.active = false;
  };
  THREE.MorphBlendMesh.prototype.update = function(a) {
    for (var b = 0, c = this.animationsList.length; b < c; b++) {
      var d = this.animationsList[b];
      if (d.active) {
        var e = d.duration / d.length;
        d.time += d.direction * a;
        if (d.mirroredLoop) {
          if (d.time > d.duration || 0 > d.time)
            d.direction *= -1, d.time > d.duration && (d.time = d.duration, d.directionBackwards = true), 0 > d.time && (d.time = 0, d.directionBackwards = false);
        } else
          d.time %= d.duration, 0 > d.time && (d.time += d.duration);
        var f = d.startFrame + THREE.Math.clamp(Math.floor(d.time / e), 0, d.length - 1), g = d.weight;
        f !== d.currentFrame && (this.morphTargetInfluences[d.lastFrame] = 0, this.morphTargetInfluences[d.currentFrame] = 1 * g, this.morphTargetInfluences[f] = 0, d.lastFrame = d.currentFrame, d.currentFrame = f);
        e = d.time % e / e;
        d.directionBackwards && (e = 1 - e);
        this.morphTargetInfluences[d.currentFrame] = e * g;
        this.morphTargetInfluences[d.lastFrame] = (1 - e) * g;
      }
    }
  };
  THREE.LensFlarePlugin = function() {
    function a(a2, c2) {
      var d2 = b.createProgram(), e2 = b.createShader(b.FRAGMENT_SHADER), f2 = b.createShader(b.VERTEX_SHADER), g2 = "precision " + c2 + " float;\n";
      b.shaderSource(e2, g2 + a2.fragmentShader);
      b.shaderSource(f2, g2 + a2.vertexShader);
      b.compileShader(e2);
      b.compileShader(f2);
      b.attachShader(d2, e2);
      b.attachShader(d2, f2);
      b.linkProgram(d2);
      return d2;
    }
    var b, c, d, e, f, g, h, i, k, l, m, p, s;
    this.init = function(q) {
      b = q.context;
      c = q;
      d = q.getPrecision();
      e = new Float32Array(16);
      f = new Uint16Array(6);
      q = 0;
      e[q++] = -1;
      e[q++] = -1;
      e[q++] = 0;
      e[q++] = 0;
      e[q++] = 1;
      e[q++] = -1;
      e[q++] = 1;
      e[q++] = 0;
      e[q++] = 1;
      e[q++] = 1;
      e[q++] = 1;
      e[q++] = 1;
      e[q++] = -1;
      e[q++] = 1;
      e[q++] = 0;
      e[q++] = 1;
      q = 0;
      f[q++] = 0;
      f[q++] = 1;
      f[q++] = 2;
      f[q++] = 0;
      f[q++] = 2;
      f[q++] = 3;
      g = b.createBuffer();
      h = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, g);
      b.bufferData(b.ARRAY_BUFFER, e, b.STATIC_DRAW);
      b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, h);
      b.bufferData(b.ELEMENT_ARRAY_BUFFER, f, b.STATIC_DRAW);
      i = b.createTexture();
      k = b.createTexture();
      b.bindTexture(b.TEXTURE_2D, i);
      b.texImage2D(
        b.TEXTURE_2D,
        0,
        b.RGB,
        16,
        16,
        0,
        b.RGB,
        b.UNSIGNED_BYTE,
        null
      );
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      b.bindTexture(b.TEXTURE_2D, k);
      b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, 16, 16, 0, b.RGBA, b.UNSIGNED_BYTE, null);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST);
      b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST);
      0 >= b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS) ? (l = false, m = a(THREE.ShaderFlares.lensFlare, d)) : (l = true, m = a(THREE.ShaderFlares.lensFlareVertexTexture, d));
      p = {};
      s = {};
      p.vertex = b.getAttribLocation(m, "position");
      p.uv = b.getAttribLocation(m, "uv");
      s.renderType = b.getUniformLocation(m, "renderType");
      s.map = b.getUniformLocation(m, "map");
      s.occlusionMap = b.getUniformLocation(m, "occlusionMap");
      s.opacity = b.getUniformLocation(m, "opacity");
      s.color = b.getUniformLocation(m, "color");
      s.scale = b.getUniformLocation(m, "scale");
      s.rotation = b.getUniformLocation(m, "rotation");
      s.screenPosition = b.getUniformLocation(m, "screenPosition");
    };
    this.render = function(a2, d2, e2, f2) {
      var a2 = a2.__webglFlares, w = a2.length;
      if (w) {
        var x = new THREE.Vector3(), t = f2 / e2, K = 0.5 * e2, D = 0.5 * f2, B = 16 / f2, z = new THREE.Vector2(B * t, B), E = new THREE.Vector3(1, 1, 0), G = new THREE.Vector2(1, 1), I = s, B = p;
        b.useProgram(m);
        b.enableVertexAttribArray(p.vertex);
        b.enableVertexAttribArray(p.uv);
        b.uniform1i(I.occlusionMap, 0);
        b.uniform1i(I.map, 1);
        b.bindBuffer(b.ARRAY_BUFFER, g);
        b.vertexAttribPointer(B.vertex, 2, b.FLOAT, false, 16, 0);
        b.vertexAttribPointer(B.uv, 2, b.FLOAT, false, 16, 8);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, h);
        b.disable(b.CULL_FACE);
        b.depthMask(false);
        var Y, C, P, A, J;
        for (Y = 0; Y < w; Y++)
          if (B = 16 / f2, z.set(B * t, B), A = a2[Y], x.set(A.matrixWorld.elements[12], A.matrixWorld.elements[13], A.matrixWorld.elements[14]), d2.matrixWorldInverse.multiplyVector3(x), d2.projectionMatrix.multiplyVector3(x), E.copy(x), G.x = E.x * K + K, G.y = E.y * D + D, l || 0 < G.x && G.x < e2 && 0 < G.y && G.y < f2) {
            b.activeTexture(b.TEXTURE1);
            b.bindTexture(b.TEXTURE_2D, i);
            b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGB, G.x - 8, G.y - 8, 16, 16, 0);
            b.uniform1i(I.renderType, 0);
            b.uniform2f(I.scale, z.x, z.y);
            b.uniform3f(I.screenPosition, E.x, E.y, E.z);
            b.disable(b.BLEND);
            b.enable(b.DEPTH_TEST);
            b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
            b.activeTexture(b.TEXTURE0);
            b.bindTexture(b.TEXTURE_2D, k);
            b.copyTexImage2D(b.TEXTURE_2D, 0, b.RGBA, G.x - 8, G.y - 8, 16, 16, 0);
            b.uniform1i(I.renderType, 1);
            b.disable(b.DEPTH_TEST);
            b.activeTexture(b.TEXTURE1);
            b.bindTexture(b.TEXTURE_2D, i);
            b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0);
            A.positionScreen.copy(E);
            A.customUpdateCallback ? A.customUpdateCallback(A) : A.updateLensFlares();
            b.uniform1i(I.renderType, 2);
            b.enable(b.BLEND);
            C = 0;
            for (P = A.lensFlares.length; C < P; C++)
              J = A.lensFlares[C], 1e-3 < J.opacity && 1e-3 < J.scale && (E.x = J.x, E.y = J.y, E.z = J.z, B = J.size * J.scale / f2, z.x = B * t, z.y = B, b.uniform3f(I.screenPosition, E.x, E.y, E.z), b.uniform2f(I.scale, z.x, z.y), b.uniform1f(I.rotation, J.rotation), b.uniform1f(
                I.opacity,
                J.opacity
              ), b.uniform3f(I.color, J.color.r, J.color.g, J.color.b), c.setBlending(J.blending, J.blendEquation, J.blendSrc, J.blendDst), c.setTexture(J.texture, 1), b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0));
          }
        b.enable(b.CULL_FACE);
        b.enable(b.DEPTH_TEST);
        b.depthMask(true);
      }
    };
  };
  THREE.ShadowMapPlugin = function() {
    var a, b, c, d, e, f, g = new THREE.Frustum(), h = new THREE.Matrix4(), i = new THREE.Vector3(), k = new THREE.Vector3();
    this.init = function(g2) {
      a = g2.context;
      b = g2;
      var g2 = THREE.ShaderLib.depthRGBA, h2 = THREE.UniformsUtils.clone(g2.uniforms);
      c = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2 });
      d = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2, morphTargets: true });
      e = new THREE.ShaderMaterial({
        fragmentShader: g2.fragmentShader,
        vertexShader: g2.vertexShader,
        uniforms: h2,
        skinning: true
      });
      f = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2, morphTargets: true, skinning: true });
      c._shadowPass = true;
      d._shadowPass = true;
      e._shadowPass = true;
      f._shadowPass = true;
    };
    this.render = function(a2, c2) {
      b.shadowMapEnabled && b.shadowMapAutoUpdate && this.update(a2, c2);
    };
    this.update = function(l, m) {
      var p, s, q, n, r, v, w, x, t, K = [];
      n = 0;
      a.clearColor(1, 1, 1, 1);
      a.disable(a.BLEND);
      a.enable(a.CULL_FACE);
      a.frontFace(a.CCW);
      b.shadowMapCullFace === THREE.CullFaceFront ? a.cullFace(a.FRONT) : a.cullFace(a.BACK);
      b.setDepthTest(true);
      p = 0;
      for (s = l.__lights.length; p < s; p++)
        if (q = l.__lights[p], q.castShadow)
          if (q instanceof THREE.DirectionalLight && q.shadowCascade)
            for (r = 0; r < q.shadowCascadeCount; r++) {
              var D;
              if (q.shadowCascadeArray[r])
                D = q.shadowCascadeArray[r];
              else {
                t = q;
                w = r;
                D = new THREE.DirectionalLight();
                D.isVirtual = true;
                D.onlyShadow = true;
                D.castShadow = true;
                D.shadowCameraNear = t.shadowCameraNear;
                D.shadowCameraFar = t.shadowCameraFar;
                D.shadowCameraLeft = t.shadowCameraLeft;
                D.shadowCameraRight = t.shadowCameraRight;
                D.shadowCameraBottom = t.shadowCameraBottom;
                D.shadowCameraTop = t.shadowCameraTop;
                D.shadowCameraVisible = t.shadowCameraVisible;
                D.shadowDarkness = t.shadowDarkness;
                D.shadowBias = t.shadowCascadeBias[w];
                D.shadowMapWidth = t.shadowCascadeWidth[w];
                D.shadowMapHeight = t.shadowCascadeHeight[w];
                D.pointsWorld = [];
                D.pointsFrustum = [];
                x = D.pointsWorld;
                v = D.pointsFrustum;
                for (var B = 0; 8 > B; B++)
                  x[B] = new THREE.Vector3(), v[B] = new THREE.Vector3();
                x = t.shadowCascadeNearZ[w];
                t = t.shadowCascadeFarZ[w];
                v[0].set(-1, -1, x);
                v[1].set(1, -1, x);
                v[2].set(
                  -1,
                  1,
                  x
                );
                v[3].set(1, 1, x);
                v[4].set(-1, -1, t);
                v[5].set(1, -1, t);
                v[6].set(-1, 1, t);
                v[7].set(1, 1, t);
                D.originalCamera = m;
                v = new THREE.Gyroscope();
                v.position = q.shadowCascadeOffset;
                v.add(D);
                v.add(D.target);
                m.add(v);
                q.shadowCascadeArray[r] = D;
                console.log("Created virtualLight", D);
              }
              w = q;
              x = r;
              t = w.shadowCascadeArray[x];
              t.position.copy(w.position);
              t.target.position.copy(w.target.position);
              t.lookAt(t.target);
              t.shadowCameraVisible = w.shadowCameraVisible;
              t.shadowDarkness = w.shadowDarkness;
              t.shadowBias = w.shadowCascadeBias[x];
              v = w.shadowCascadeNearZ[x];
              w = w.shadowCascadeFarZ[x];
              t = t.pointsFrustum;
              t[0].z = v;
              t[1].z = v;
              t[2].z = v;
              t[3].z = v;
              t[4].z = w;
              t[5].z = w;
              t[6].z = w;
              t[7].z = w;
              K[n] = D;
              n++;
            }
          else
            K[n] = q, n++;
      p = 0;
      for (s = K.length; p < s; p++) {
        q = K[p];
        q.shadowMap || (r = THREE.LinearFilter, b.shadowMapType === THREE.PCFSoftShadowMap && (r = THREE.NearestFilter), q.shadowMap = new THREE.WebGLRenderTarget(q.shadowMapWidth, q.shadowMapHeight, { minFilter: r, magFilter: r, format: THREE.RGBAFormat }), q.shadowMapSize = new THREE.Vector2(q.shadowMapWidth, q.shadowMapHeight), q.shadowMatrix = new THREE.Matrix4());
        if (!q.shadowCamera) {
          if (q instanceof THREE.SpotLight)
            q.shadowCamera = new THREE.PerspectiveCamera(q.shadowCameraFov, q.shadowMapWidth / q.shadowMapHeight, q.shadowCameraNear, q.shadowCameraFar);
          else if (q instanceof THREE.DirectionalLight)
            q.shadowCamera = new THREE.OrthographicCamera(q.shadowCameraLeft, q.shadowCameraRight, q.shadowCameraTop, q.shadowCameraBottom, q.shadowCameraNear, q.shadowCameraFar);
          else {
            console.error("Unsupported light type for shadow");
            continue;
          }
          l.add(q.shadowCamera);
          b.autoUpdateScene && l.updateMatrixWorld();
        }
        q.shadowCameraVisible && !q.cameraHelper && (q.cameraHelper = new THREE.CameraHelper(q.shadowCamera), q.shadowCamera.add(q.cameraHelper));
        n = q.shadowMap;
        v = q.shadowMatrix;
        r = q.shadowCamera;
        r.position.copy(q.matrixWorld.getPosition());
        r.lookAt(q.target.matrixWorld.getPosition());
        r.updateMatrixWorld();
        r.matrixWorldInverse.getInverse(r.matrixWorld);
        if (q.isVirtual && D.originalCamera == m) {
          t = m;
          w = q.shadowCamera;
          x = q.pointsFrustum;
          B = q.pointsWorld;
          i.set(Infinity, Infinity, Infinity);
          k.set(-Infinity, -Infinity, -Infinity);
          for (var z = 0; 8 > z; z++) {
            var E = B[z];
            E.copy(x[z]);
            THREE.ShadowMapPlugin.__projector.unprojectVector(E, t);
            w.matrixWorldInverse.multiplyVector3(E);
            E.x < i.x && (i.x = E.x);
            E.x > k.x && (k.x = E.x);
            E.y < i.y && (i.y = E.y);
            E.y > k.y && (k.y = E.y);
            E.z < i.z && (i.z = E.z);
            E.z > k.z && (k.z = E.z);
          }
          w.left = i.x;
          w.right = k.x;
          w.top = k.y;
          w.bottom = i.y;
          w.updateProjectionMatrix();
        }
        q.cameraHelper && (q.cameraHelper.visible = q.shadowCameraVisible);
        q.shadowCameraVisible && q.cameraHelper.update();
        v.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
        v.multiplySelf(r.projectionMatrix);
        v.multiplySelf(r.matrixWorldInverse);
        h.multiply(r.projectionMatrix, r.matrixWorldInverse);
        g.setFromMatrix(h);
        b.setRenderTarget(n);
        b.clear();
        t = l.__webglObjects;
        q = 0;
        for (n = t.length; q < n; q++)
          if (w = t[q], v = w.object, w.render = false, v.visible && v.castShadow && (!(v instanceof THREE.Mesh || v instanceof THREE.ParticleSystem) || !v.frustumCulled || g.contains(v)))
            v._modelViewMatrix.multiply(r.matrixWorldInverse, v.matrixWorld), w.render = true;
        q = 0;
        for (n = t.length; q < n; q++)
          w = t[q], w.render && (v = w.object, w = w.buffer, B = v.material instanceof THREE.MeshFaceMaterial ? v.material.materials[0] : v.material, x = 0 < v.geometry.morphTargets.length && B.morphTargets, B = v instanceof THREE.SkinnedMesh && B.skinning, x = v.customDepthMaterial ? v.customDepthMaterial : B ? x ? f : e : x ? d : c, w instanceof THREE.BufferGeometry ? b.renderBufferDirect(r, l.__lights, null, x, w, v) : b.renderBuffer(r, l.__lights, null, x, w, v));
        t = l.__webglObjectsImmediate;
        q = 0;
        for (n = t.length; q < n; q++)
          w = t[q], v = w.object, v.visible && v.castShadow && (v._modelViewMatrix.multiply(r.matrixWorldInverse, v.matrixWorld), b.renderImmediateObject(r, l.__lights, null, c, v));
      }
      p = b.getClearColor();
      s = b.getClearAlpha();
      a.clearColor(p.r, p.g, p.b, s);
      a.enable(a.BLEND);
      b.shadowMapCullFace === THREE.CullFaceFront && a.cullFace(a.BACK);
    };
  };
  THREE.ShadowMapPlugin.__projector = new THREE.Projector();
  THREE.SpritePlugin = function() {
    function a(a2, b2) {
      return a2.z !== b2.z ? b2.z - a2.z : b2.id - a2.id;
    }
    var b, c, d, e, f, g, h, i, k, l;
    this.init = function(a2) {
      b = a2.context;
      c = a2;
      d = a2.getPrecision();
      e = new Float32Array(16);
      f = new Uint16Array(6);
      a2 = 0;
      e[a2++] = -1;
      e[a2++] = -1;
      e[a2++] = 0;
      e[a2++] = 0;
      e[a2++] = 1;
      e[a2++] = -1;
      e[a2++] = 1;
      e[a2++] = 0;
      e[a2++] = 1;
      e[a2++] = 1;
      e[a2++] = 1;
      e[a2++] = 1;
      e[a2++] = -1;
      e[a2++] = 1;
      e[a2++] = 0;
      e[a2++] = 1;
      a2 = 0;
      f[a2++] = 0;
      f[a2++] = 1;
      f[a2++] = 2;
      f[a2++] = 0;
      f[a2++] = 2;
      f[a2++] = 3;
      g = b.createBuffer();
      h = b.createBuffer();
      b.bindBuffer(b.ARRAY_BUFFER, g);
      b.bufferData(
        b.ARRAY_BUFFER,
        e,
        b.STATIC_DRAW
      );
      b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, h);
      b.bufferData(b.ELEMENT_ARRAY_BUFFER, f, b.STATIC_DRAW);
      var a2 = THREE.ShaderSprite.sprite, p = b.createProgram(), s = b.createShader(b.FRAGMENT_SHADER), q = b.createShader(b.VERTEX_SHADER), n = "precision " + d + " float;\n";
      b.shaderSource(s, n + a2.fragmentShader);
      b.shaderSource(q, n + a2.vertexShader);
      b.compileShader(s);
      b.compileShader(q);
      b.attachShader(p, s);
      b.attachShader(p, q);
      b.linkProgram(p);
      i = p;
      k = {};
      l = {};
      k.position = b.getAttribLocation(i, "position");
      k.uv = b.getAttribLocation(
        i,
        "uv"
      );
      l.uvOffset = b.getUniformLocation(i, "uvOffset");
      l.uvScale = b.getUniformLocation(i, "uvScale");
      l.rotation = b.getUniformLocation(i, "rotation");
      l.scale = b.getUniformLocation(i, "scale");
      l.alignment = b.getUniformLocation(i, "alignment");
      l.color = b.getUniformLocation(i, "color");
      l.map = b.getUniformLocation(i, "map");
      l.opacity = b.getUniformLocation(i, "opacity");
      l.useScreenCoordinates = b.getUniformLocation(i, "useScreenCoordinates");
      l.sizeAttenuation = b.getUniformLocation(i, "sizeAttenuation");
      l.screenPosition = b.getUniformLocation(
        i,
        "screenPosition"
      );
      l.modelViewMatrix = b.getUniformLocation(i, "modelViewMatrix");
      l.projectionMatrix = b.getUniformLocation(i, "projectionMatrix");
      l.fogType = b.getUniformLocation(i, "fogType");
      l.fogDensity = b.getUniformLocation(i, "fogDensity");
      l.fogNear = b.getUniformLocation(i, "fogNear");
      l.fogFar = b.getUniformLocation(i, "fogFar");
      l.fogColor = b.getUniformLocation(i, "fogColor");
      l.alphaTest = b.getUniformLocation(i, "alphaTest");
    };
    this.render = function(d2, e2, f2, q) {
      var n = d2.__webglSprites, r = n.length;
      if (r) {
        var v = k, w = l, x = q / f2, f2 = 0.5 * f2, t = 0.5 * q;
        b.useProgram(i);
        b.enableVertexAttribArray(v.position);
        b.enableVertexAttribArray(v.uv);
        b.disable(b.CULL_FACE);
        b.enable(b.BLEND);
        b.bindBuffer(b.ARRAY_BUFFER, g);
        b.vertexAttribPointer(v.position, 2, b.FLOAT, false, 16, 0);
        b.vertexAttribPointer(v.uv, 2, b.FLOAT, false, 16, 8);
        b.bindBuffer(b.ELEMENT_ARRAY_BUFFER, h);
        b.uniformMatrix4fv(w.projectionMatrix, false, e2.projectionMatrix.elements);
        b.activeTexture(b.TEXTURE0);
        b.uniform1i(w.map, 0);
        var K = v = 0, D = d2.fog;
        D ? (b.uniform3f(w.fogColor, D.color.r, D.color.g, D.color.b), D instanceof THREE.Fog ? (b.uniform1f(w.fogNear, D.near), b.uniform1f(w.fogFar, D.far), b.uniform1i(w.fogType, 1), K = v = 1) : D instanceof THREE.FogExp2 && (b.uniform1f(w.fogDensity, D.density), b.uniform1i(w.fogType, 2), K = v = 2)) : (b.uniform1i(w.fogType, 0), K = v = 0);
        for (var B, z, E = [], D = 0; D < r; D++)
          B = n[D], z = B.material, B.visible && 0 !== z.opacity && (z.useScreenCoordinates ? B.z = -B.position.z : (B._modelViewMatrix.multiply(e2.matrixWorldInverse, B.matrixWorld), B.z = -B._modelViewMatrix.elements[14]));
        n.sort(a);
        for (D = 0; D < r; D++)
          B = n[D], z = B.material, B.visible && 0 !== z.opacity && (z.map && z.map.image && z.map.image.width) && (b.uniform1f(w.alphaTest, z.alphaTest), true === z.useScreenCoordinates ? (b.uniform1i(w.useScreenCoordinates, 1), b.uniform3f(w.screenPosition, (B.position.x * c.devicePixelRatio - f2) / f2, (t - B.position.y * c.devicePixelRatio) / t, Math.max(0, Math.min(1, B.position.z))), E[0] = c.devicePixelRatio, E[1] = c.devicePixelRatio) : (b.uniform1i(w.useScreenCoordinates, 0), b.uniform1i(w.sizeAttenuation, z.sizeAttenuation ? 1 : 0), b.uniformMatrix4fv(
            w.modelViewMatrix,
            false,
            B._modelViewMatrix.elements
          ), E[0] = 1, E[1] = 1), e2 = d2.fog && z.fog ? K : 0, v !== e2 && (b.uniform1i(w.fogType, e2), v = e2), e2 = 1 / (z.scaleByViewport ? q : 1), E[0] *= e2 * x * B.scale.x, E[1] *= e2 * B.scale.y, b.uniform2f(w.uvScale, z.uvScale.x, z.uvScale.y), b.uniform2f(w.uvOffset, z.uvOffset.x, z.uvOffset.y), b.uniform2f(w.alignment, z.alignment.x, z.alignment.y), b.uniform1f(w.opacity, z.opacity), b.uniform3f(w.color, z.color.r, z.color.g, z.color.b), b.uniform1f(w.rotation, B.rotation), b.uniform2fv(w.scale, E), c.setBlending(
            z.blending,
            z.blendEquation,
            z.blendSrc,
            z.blendDst
          ), c.setDepthTest(z.depthTest), c.setDepthWrite(z.depthWrite), c.setTexture(z.map, 0), b.drawElements(b.TRIANGLES, 6, b.UNSIGNED_SHORT, 0));
        b.enable(b.CULL_FACE);
      }
    };
  };
  THREE.DepthPassPlugin = function() {
    this.enabled = false;
    this.renderTarget = null;
    var a, b, c, d, e, f, g = new THREE.Frustum(), h = new THREE.Matrix4();
    this.init = function(g2) {
      a = g2.context;
      b = g2;
      var g2 = THREE.ShaderLib.depthRGBA, h2 = THREE.UniformsUtils.clone(g2.uniforms);
      c = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2 });
      d = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2, morphTargets: true });
      e = new THREE.ShaderMaterial({
        fragmentShader: g2.fragmentShader,
        vertexShader: g2.vertexShader,
        uniforms: h2,
        skinning: true
      });
      f = new THREE.ShaderMaterial({ fragmentShader: g2.fragmentShader, vertexShader: g2.vertexShader, uniforms: h2, morphTargets: true, skinning: true });
      c._shadowPass = true;
      d._shadowPass = true;
      e._shadowPass = true;
      f._shadowPass = true;
    };
    this.render = function(a2, b2) {
      this.enabled && this.update(a2, b2);
    };
    this.update = function(i, k) {
      var l, m, p, s, q, n;
      a.clearColor(1, 1, 1, 1);
      a.disable(a.BLEND);
      b.setDepthTest(true);
      b.autoUpdateScene && i.updateMatrixWorld();
      k.matrixWorldInverse.getInverse(k.matrixWorld);
      h.multiply(
        k.projectionMatrix,
        k.matrixWorldInverse
      );
      g.setFromMatrix(h);
      b.setRenderTarget(this.renderTarget);
      b.clear();
      n = i.__webglObjects;
      l = 0;
      for (m = n.length; l < m; l++)
        if (p = n[l], q = p.object, p.render = false, q.visible && (!(q instanceof THREE.Mesh || q instanceof THREE.ParticleSystem) || !q.frustumCulled || g.contains(q)))
          q._modelViewMatrix.multiply(k.matrixWorldInverse, q.matrixWorld), p.render = true;
      var r;
      l = 0;
      for (m = n.length; l < m; l++)
        if (p = n[l], p.render && (q = p.object, p = p.buffer, !(q instanceof THREE.ParticleSystem) || q.customDepthMaterial))
          (r = q.material instanceof THREE.MeshFaceMaterial ? q.material.materials[0] : q.material) && b.setMaterialFaces(q.material), s = 0 < q.geometry.morphTargets.length && r.morphTargets, r = q instanceof THREE.SkinnedMesh && r.skinning, s = q.customDepthMaterial ? q.customDepthMaterial : r ? s ? f : e : s ? d : c, p instanceof THREE.BufferGeometry ? b.renderBufferDirect(k, i.__lights, null, s, p, q) : b.renderBuffer(k, i.__lights, null, s, p, q);
      n = i.__webglObjectsImmediate;
      l = 0;
      for (m = n.length; l < m; l++)
        p = n[l], q = p.object, q.visible && (q._modelViewMatrix.multiply(
          k.matrixWorldInverse,
          q.matrixWorld
        ), b.renderImmediateObject(k, i.__lights, null, c, q));
      l = b.getClearColor();
      m = b.getClearAlpha();
      a.clearColor(l.r, l.g, l.b, m);
      a.enable(a.BLEND);
    };
  };
  THREE.ShaderFlares = { lensFlareVertexTexture: {
    vertexShader: "uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
    fragmentShader: "uniform lowp int renderType;\nuniform sampler2D map;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
  }, lensFlare: {
    vertexShader: "uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
    fragmentShader: "precision mediump float;\nuniform lowp int renderType;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"
  } };
  THREE.ShaderSprite = { sprite: {
    vertexShader: "uniform int useScreenCoordinates;\nuniform int sizeAttenuation;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( sizeAttenuation == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
    fragmentShader: "uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\nif ( texture.a < alphaTest ) discard;\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\nif ( fogType > 0 ) {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = 0.0;\nif ( fogType == 1 ) {\nfogFactor = smoothstep( fogNear, fogFar, depth );\n} else {\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n}\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}"
  } };
})();
