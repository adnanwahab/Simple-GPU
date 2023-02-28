"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/mouse-event/mouse.js
  var require_mouse = __commonJS({
    "node_modules/mouse-event/mouse.js"(exports) {
      "use strict";
      function mouseButtons(ev) {
        if (typeof ev === "object") {
          if ("buttons" in ev) {
            return ev.buttons;
          } else if ("which" in ev) {
            var b = ev.which;
            if (b === 2) {
              return 4;
            } else if (b === 3) {
              return 2;
            } else if (b > 0) {
              return 1 << b - 1;
            }
          } else if ("button" in ev) {
            var b = ev.button;
            if (b === 1) {
              return 4;
            } else if (b === 2) {
              return 2;
            } else if (b >= 0) {
              return 1 << b;
            }
          }
        }
        return 0;
      }
      exports.buttons = mouseButtons;
      function mouseElement(ev) {
        return ev.target || ev.srcElement || window;
      }
      exports.element = mouseElement;
      function mouseRelativeX(ev) {
        if (typeof ev === "object") {
          if ("offsetX" in ev) {
            return ev.offsetX;
          }
          var target = mouseElement(ev);
          var bounds = target.getBoundingClientRect();
          return ev.clientX - bounds.left;
        }
        return 0;
      }
      exports.x = mouseRelativeX;
      function mouseRelativeY(ev) {
        if (typeof ev === "object") {
          if ("offsetY" in ev) {
            return ev.offsetY;
          }
          var target = mouseElement(ev);
          var bounds = target.getBoundingClientRect();
          return ev.clientY - bounds.top;
        }
        return 0;
      }
      exports.y = mouseRelativeY;
    }
  });

  // node_modules/mouse-change/mouse-listen.js
  var require_mouse_listen = __commonJS({
    "node_modules/mouse-change/mouse-listen.js"(exports, module) {
      "use strict";
      module.exports = mouseListen;
      var mouse = require_mouse();
      function mouseListen(element, callback) {
        if (!callback) {
          callback = element;
          element = window;
        }
        var buttonState = 0;
        var x = 0;
        var y = 0;
        var mods = {
          shift: false,
          alt: false,
          control: false,
          meta: false
        };
        var attached = false;
        function updateMods(ev) {
          var changed = false;
          if ("altKey" in ev) {
            changed = changed || ev.altKey !== mods.alt;
            mods.alt = !!ev.altKey;
          }
          if ("shiftKey" in ev) {
            changed = changed || ev.shiftKey !== mods.shift;
            mods.shift = !!ev.shiftKey;
          }
          if ("ctrlKey" in ev) {
            changed = changed || ev.ctrlKey !== mods.control;
            mods.control = !!ev.ctrlKey;
          }
          if ("metaKey" in ev) {
            changed = changed || ev.metaKey !== mods.meta;
            mods.meta = !!ev.metaKey;
          }
          return changed;
        }
        function handleEvent(nextButtons, ev) {
          var nextX = mouse.x(ev);
          var nextY = mouse.y(ev);
          if ("buttons" in ev) {
            nextButtons = ev.buttons | 0;
          }
          if (nextButtons !== buttonState || nextX !== x || nextY !== y || updateMods(ev)) {
            buttonState = nextButtons | 0;
            x = nextX || 0;
            y = nextY || 0;
            callback && callback(buttonState, x, y, mods);
          }
        }
        function clearState(ev) {
          handleEvent(0, ev);
        }
        function handleBlur() {
          if (buttonState || x || y || mods.shift || mods.alt || mods.meta || mods.control) {
            x = y = 0;
            buttonState = 0;
            mods.shift = mods.alt = mods.control = mods.meta = false;
            callback && callback(0, 0, 0, mods);
          }
        }
        function handleMods(ev) {
          if (updateMods(ev)) {
            callback && callback(buttonState, x, y, mods);
          }
        }
        function handleMouseMove(ev) {
          if (mouse.buttons(ev) === 0) {
            handleEvent(0, ev);
          } else {
            handleEvent(buttonState, ev);
          }
        }
        function handleMouseDown(ev) {
          handleEvent(buttonState | mouse.buttons(ev), ev);
        }
        function handleMouseUp(ev) {
          handleEvent(buttonState & ~mouse.buttons(ev), ev);
        }
        function attachListeners() {
          if (attached) {
            return;
          }
          attached = true;
          element.addEventListener("mousemove", handleMouseMove);
          element.addEventListener("mousedown", handleMouseDown);
          element.addEventListener("mouseup", handleMouseUp);
          element.addEventListener("mouseleave", clearState);
          element.addEventListener("mouseenter", clearState);
          element.addEventListener("mouseout", clearState);
          element.addEventListener("mouseover", clearState);
          element.addEventListener("blur", handleBlur);
          element.addEventListener("keyup", handleMods);
          element.addEventListener("keydown", handleMods);
          element.addEventListener("keypress", handleMods);
          if (element !== window) {
            window.addEventListener("blur", handleBlur);
            window.addEventListener("keyup", handleMods);
            window.addEventListener("keydown", handleMods);
            window.addEventListener("keypress", handleMods);
          }
        }
        function detachListeners() {
          if (!attached) {
            return;
          }
          attached = false;
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mousedown", handleMouseDown);
          element.removeEventListener("mouseup", handleMouseUp);
          element.removeEventListener("mouseleave", clearState);
          element.removeEventListener("mouseenter", clearState);
          element.removeEventListener("mouseout", clearState);
          element.removeEventListener("mouseover", clearState);
          element.removeEventListener("blur", handleBlur);
          element.removeEventListener("keyup", handleMods);
          element.removeEventListener("keydown", handleMods);
          element.removeEventListener("keypress", handleMods);
          if (element !== window) {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("keyup", handleMods);
            window.removeEventListener("keydown", handleMods);
            window.removeEventListener("keypress", handleMods);
          }
        }
        attachListeners();
        var result = {
          element
        };
        Object.defineProperties(result, {
          enabled: {
            get: function() {
              return attached;
            },
            set: function(f) {
              if (f) {
                attachListeners();
              } else {
                detachListeners();
              }
            },
            enumerable: true
          },
          buttons: {
            get: function() {
              return buttonState;
            },
            enumerable: true
          },
          x: {
            get: function() {
              return x;
            },
            enumerable: true
          },
          y: {
            get: function() {
              return y;
            },
            enumerable: true
          },
          mods: {
            get: function() {
              return mods;
            },
            enumerable: true
          }
        });
        return result;
      }
    }
  });

  // node_modules/parse-unit/index.js
  var require_parse_unit = __commonJS({
    "node_modules/parse-unit/index.js"(exports, module) {
      module.exports = function parseUnit(str3, out) {
        if (!out)
          out = [0, ""];
        str3 = String(str3);
        var num = parseFloat(str3, 10);
        out[0] = num;
        out[1] = str3.match(/[\d.\-\+]*\s*(.*)/)[1] || "";
        return out;
      };
    }
  });

  // node_modules/to-px/browser.js
  var require_browser = __commonJS({
    "node_modules/to-px/browser.js"(exports, module) {
      "use strict";
      var parseUnit = require_parse_unit();
      module.exports = toPX;
      var PIXELS_PER_INCH = getSizeBrutal("in", document.body);
      function getPropertyInPX(element, prop2) {
        var parts = parseUnit(getComputedStyle(element).getPropertyValue(prop2));
        return parts[0] * toPX(parts[1], element);
      }
      function getSizeBrutal(unit, element) {
        var testDIV = document.createElement("div");
        testDIV.style["height"] = "128" + unit;
        element.appendChild(testDIV);
        var size = getPropertyInPX(testDIV, "height") / 128;
        element.removeChild(testDIV);
        return size;
      }
      function toPX(str3, element) {
        if (!str3)
          return null;
        element = element || document.body;
        str3 = (str3 + "" || "px").trim().toLowerCase();
        if (element === window || element === document) {
          element = document.body;
        }
        switch (str3) {
          case "%":
            return element.clientHeight / 100;
          case "ch":
          case "ex":
            return getSizeBrutal(str3, element);
          case "em":
            return getPropertyInPX(element, "font-size");
          case "rem":
            return getPropertyInPX(document.body, "font-size");
          case "vw":
            return window.innerWidth / 100;
          case "vh":
            return window.innerHeight / 100;
          case "vmin":
            return Math.min(window.innerWidth, window.innerHeight) / 100;
          case "vmax":
            return Math.max(window.innerWidth, window.innerHeight) / 100;
          case "in":
            return PIXELS_PER_INCH;
          case "cm":
            return PIXELS_PER_INCH / 2.54;
          case "mm":
            return PIXELS_PER_INCH / 25.4;
          case "pt":
            return PIXELS_PER_INCH / 72;
          case "pc":
            return PIXELS_PER_INCH / 6;
          case "px":
            return 1;
        }
        var parts = parseUnit(str3);
        if (!isNaN(parts[0]) && parts[1]) {
          var px = toPX(parts[1], element);
          return typeof px === "number" ? parts[0] * px : null;
        }
        return null;
      }
    }
  });

  // node_modules/mouse-wheel/wheel.js
  var require_wheel = __commonJS({
    "node_modules/mouse-wheel/wheel.js"(exports, module) {
      "use strict";
      var toPX = require_browser();
      module.exports = mouseWheelListen;
      function mouseWheelListen(element, callback, noScroll) {
        if (typeof element === "function") {
          noScroll = !!callback;
          callback = element;
          element = window;
        }
        var lineHeight = toPX("ex", element);
        var listener = function(ev) {
          if (noScroll) {
            ev.preventDefault();
          }
          var dx = ev.deltaX || 0;
          var dy = ev.deltaY || 0;
          var dz = ev.deltaZ || 0;
          var mode = ev.deltaMode;
          var scale3 = 1;
          switch (mode) {
            case 1:
              scale3 = lineHeight;
              break;
            case 2:
              scale3 = window.innerHeight;
              break;
          }
          dx *= scale3;
          dy *= scale3;
          dz *= scale3;
          if (dx || dy || dz) {
            return callback(dx, dy, dz, ev);
          }
        };
        element.addEventListener("wheel", listener);
        return listener;
      }
    }
  });

  // src/demos/water-simulation.js
  var import_mouse_change = __toESM(require_mouse_listen());
  var import_mouse_wheel = __toESM(require_wheel());

  // src/demos/scan.ts
  var MAX_BUFFER_SIZE = 134217728;
  var DEFAULT_DATA_TYPE = "f32";
  var DEFAULT_DATA_SIZE = 4;
  var DEFAULT_DATA_FUNC = "A + B";
  var DEFAULT_DATA_UNIT = "0.";
  var WebGPUScan = class {
    logNumBanks = 5;
    threadsPerGroup = 256;
    itemsPerThread = 256;
    itemsPerGroup = 65536;
    itemSize = 4;
    device;
    prefixSumShader;
    postBindGroupLayout;
    dataBindGroupLayout;
    postBuffer;
    postBindGroup;
    prefixSumIn;
    prefixSumPost;
    prefixSumOut;
    minItems() {
      return this.itemsPerGroup;
    }
    minSize() {
      return this.minItems() * this.itemSize;
    }
    maxItems() {
      return Math.min(this.itemsPerGroup * this.itemsPerGroup, Math.floor(MAX_BUFFER_SIZE / (this.itemSize * this.itemsPerGroup)) * this.itemsPerGroup);
    }
    maxSize() {
      return this.itemSize;
    }
    constructor(config) {
      this.device = config.device;
      if (config["threadsPerGroup"]) {
        this.threadsPerGroup = config["threadsPerGroup"] >>> 0;
        if (this.threadsPerGroup < 1 || this.threadsPerGroup > 256) {
          throw new Error("Threads per group must be between 1 and 256");
        }
      }
      if (config["itemsPerThread"]) {
        this.itemsPerThread = config["itemsPerThread"] >>> 0;
        if (this.itemsPerThread < 1) {
          throw new Error("Items per thread must be > 1");
        }
      }
      this.itemsPerGroup = this.threadsPerGroup * this.itemsPerThread;
      const dataType = config.dataType || DEFAULT_DATA_TYPE;
      const dataSize = config.dataSize || DEFAULT_DATA_SIZE;
      const dataFunc = config.dataFunc || DEFAULT_DATA_FUNC;
      const dataUnit = config.dataUnit || DEFAULT_DATA_UNIT;
      this.itemSize = dataSize;
      this.prefixSumShader = this.device.createShaderModule({
        code: `
${config.header || ""}

@binding(0) @group(0) var<storage, read_write> post : array<${dataType}>;
@binding(0) @group(1) var<storage, read_write> data : array<${dataType}>;
@binding(1) @group(1) var<storage, read_write> work : array<${dataType}>;

fn conflictFreeOffset (offset:u32) -> u32 {
  return offset + (offset >> ${this.logNumBanks});
}
  
var<workgroup> workerSums : array<${dataType}, ${2 * this.threadsPerGroup}>;
fn partialSum (localId : u32) -> ${dataType} {
  var offset = 1u;
  for (var d = ${this.threadsPerGroup >> 1}u; d > 0u; d = d >> 1u) {
    if (localId < d) {
      var ai = conflictFreeOffset(offset * (2u * localId + 1u) - 1u);
      var bi = conflictFreeOffset(offset * (2u * localId + 2u) - 1u);
      var A = workerSums[ai];
      var B = workerSums[bi];
      workerSums[bi] = ${dataFunc};
    }
    offset *= 2u;
    workgroupBarrier();
  }
  if (localId == 0u) {
    workerSums[conflictFreeOffset(${this.threadsPerGroup - 1}u)] = ${dataUnit};
  }
  for (var d = 1u; d < ${this.threadsPerGroup}u; d = d * 2u) {
    offset = offset >> 1u;
    if (localId < d) {
      var ai = conflictFreeOffset(offset * (2u * localId + 1u) - 1u);
      var bi = conflictFreeOffset(offset * (2u * localId + 2u) - 1u);
      var A = workerSums[ai];
      var B = workerSums[bi];
      workerSums[ai] = B;
      workerSums[bi] = ${dataFunc};
    }
    workgroupBarrier();
  }

  return workerSums[conflictFreeOffset(localId)];
}
  
@compute @workgroup_size(${this.threadsPerGroup}, 1, 1)
fn prefixSumIn(
  @builtin(workgroup_id) groupId : vec3<u32>,
  @builtin(local_invocation_id) localVec : vec3<u32>,
  @builtin(global_invocation_id) globalVec : vec3<u32>) {
  var localId = localVec.x;
  var globalId = globalVec.x;
  var offset = ${this.itemsPerThread}u * globalId;

  var A = ${dataUnit};
  var localVals = array<${dataType}, ${this.itemsPerThread}>();
  for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
    var B = data[offset + i];
    A = ${dataFunc};
    localVals[i] = A;
  }
  workerSums[conflictFreeOffset(localId)] = A;
  workgroupBarrier();

  A = partialSum(localId);

  for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
    var B = localVals[i];
    var C = ${dataFunc};
    work[offset + i] = C;
    if (i == ${this.itemsPerThread - 1}u && localId == ${this.threadsPerGroup - 1}u) {
      post[groupId.x] = C;
    }
  }
}

@compute @workgroup_size(${this.threadsPerGroup}, 1, 1)
fn prefixSumPost(@builtin(local_invocation_id) localVec : vec3<u32>) {
  var localId = localVec.x;
  var offset = localId * ${this.itemsPerThread}u;

  var A = ${dataUnit};
  var localVals = array<${dataType}, ${this.itemsPerThread}>();
  for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
    var B = post[offset + i];
    A = ${dataFunc};
    localVals[i] = A;
  }
  workerSums[conflictFreeOffset(localId)] = A;
  workgroupBarrier();

  A = partialSum(localId);
  for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
    var B = localVals[i];
    post[offset + i] = ${dataFunc};
  }
}

@compute @workgroup_size(${this.threadsPerGroup}, 1, 1)
fn prefixSumOut(
  @builtin(workgroup_id) groupId : vec3<u32>,
  @builtin(global_invocation_id) globalVec : vec3<u32>) {
  var globalId = globalVec.x;
  var offset = ${this.itemsPerThread}u * globalId;
  if (groupId.x > 0u) {
    var s = post[groupId.x - 1u];
    for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
      data[offset + i] = s + work[offset + i];
    }
  } else {
    for (var i = 0u; i < ${this.itemsPerThread}u; i = i + 1u) {
      data[offset + i] = work[offset + i];
    }
  }
}
`
      });
      this.postBuffer = this.device.createBuffer({
        label: "postBuffer",
        size: this.itemsPerGroup * this.itemSize,
        usage: GPUBufferUsage.STORAGE
      });
      this.postBindGroupLayout = this.device.createBindGroupLayout({
        label: "postBindGroupLayout",
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage",
            hasDynamicOffset: false,
            minBindingSize: this.itemSize * this.itemsPerGroup
          }
        }]
      });
      this.postBindGroup = this.device.createBindGroup({
        label: "postBindGroup",
        layout: this.postBindGroupLayout,
        entries: [{
          binding: 0,
          resource: {
            buffer: this.postBuffer
          }
        }]
      });
      this.dataBindGroupLayout = this.device.createBindGroupLayout({
        label: "dataBindGroupLayout",
        entries: [{
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage",
            hasDynamicOffset: false,
            minBindingSize: this.itemSize * this.itemsPerGroup
          }
        }, {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage",
            hasDynamicOffset: false,
            minBindingSize: this.itemSize * this.itemsPerGroup
          }
        }]
      });
      const layout = this.device.createPipelineLayout({
        label: "commonScanLayout",
        bindGroupLayouts: [
          this.postBindGroupLayout,
          this.dataBindGroupLayout
        ]
      });
      this.prefixSumIn = this.device.createComputePipelineAsync({
        label: "prefixSumIn",
        layout,
        compute: {
          module: this.prefixSumShader,
          entryPoint: "prefixSumIn"
        }
      });
      this.prefixSumPost = this.device.createComputePipelineAsync({
        label: "prefixSumPost",
        layout: this.device.createPipelineLayout({
          label: "postScanLayout",
          bindGroupLayouts: [this.postBindGroupLayout]
        }),
        compute: {
          module: this.prefixSumShader,
          entryPoint: "prefixSumPost"
        }
      });
      this.prefixSumOut = this.device.createComputePipelineAsync({
        label: "prefixSumOut",
        layout,
        compute: {
          module: this.prefixSumShader,
          entryPoint: "prefixSumOut"
        }
      });
    }
    async createPass(n, data, work) {
      if (n < this.minItems() || n > this.maxItems() || n % this.itemsPerGroup !== 0) {
        throw new Error("Invalid item count");
      }
      let ownsWorkBuffer = false;
      let workBuffer = null;
      if (n > this.minItems()) {
        if (work) {
          workBuffer = work;
        } else {
          workBuffer = this.device.createBuffer(
            {
              label: "workBuffer",
              size: n * this.itemSize,
              usage: GPUBufferUsage.STORAGE
            }
          );
          ownsWorkBuffer = true;
        }
      }
      let dataBindGroup;
      if (workBuffer) {
        dataBindGroup = this.device.createBindGroup({
          label: "dataBindGroup",
          layout: this.dataBindGroupLayout,
          entries: [{
            binding: 0,
            resource: {
              buffer: data
            }
          }, {
            binding: 1,
            resource: {
              buffer: workBuffer
            }
          }]
        });
      } else {
        dataBindGroup = this.device.createBindGroup({
          label: "dataBindGroupSmall",
          layout: this.postBindGroupLayout,
          entries: [{
            binding: 0,
            resource: {
              buffer: data
            }
          }]
        });
      }
      return new WebGPUScanPass(
        n / this.itemsPerGroup >>> 0,
        dataBindGroup,
        this.postBindGroup,
        workBuffer,
        ownsWorkBuffer,
        await this.prefixSumIn,
        await this.prefixSumPost,
        await this.prefixSumOut
      );
    }
    destroy() {
      this.postBuffer.destroy();
    }
  };
  var WebGPUScanPass = class {
    constructor(numGroups, dataBindGroup, postBindGroup, work, ownsWorkBuffer, prefixSumIn, prefixSumPost, prefixSumOut) {
      this.numGroups = numGroups;
      this.dataBindGroup = dataBindGroup;
      this.postBindGroup = postBindGroup;
      this.work = work;
      this.ownsWorkBuffer = ownsWorkBuffer;
      this.prefixSumIn = prefixSumIn;
      this.prefixSumPost = prefixSumPost;
      this.prefixSumOut = prefixSumOut;
    }
    run(passEncoder) {
      if (this.work) {
        passEncoder.setBindGroup(0, this.postBindGroup);
        passEncoder.setBindGroup(1, this.dataBindGroup);
        passEncoder.setPipeline(this.prefixSumIn);
        passEncoder.dispatchWorkgroups(this.numGroups);
        passEncoder.setPipeline(this.prefixSumPost);
        passEncoder.dispatchWorkgroups(1);
        passEncoder.setPipeline(this.prefixSumOut);
        passEncoder.dispatchWorkgroups(this.numGroups);
      } else {
        passEncoder.setBindGroup(0, this.dataBindGroup);
        passEncoder.setPipeline(this.prefixSumPost);
        passEncoder.dispatchWorkgroups(1);
      }
    }
    destroy() {
      if (this.ownsWorkBuffer && this.work) {
        this.work.destroy();
      }
    }
  };

  // lib/utils.js
  var addMouseEvents = function(canvas, data) {
    canvas.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      data.mouseX = x / event.target.clientWidth;
      data.mouseY = y / event.target.clientHeight;
    });
  };
  function createCanvas(width = 500, height = 500) {
    let dpi = devicePixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    canvas.style.width = width + "px";
    document.body.appendChild(canvas);
    return canvas;
  }
  function isBuffer(buffer2) {
    return buffer2.__proto__.constructor.name === "GPUBuffer";
  }
  function makeResource(resource) {
    return isBuffer(resource) ? { buffer: resource } : resource;
  }
  function makeBindGroupDescriptor(layout, resourceList, offset = 0) {
    return {
      layout,
      entries: resourceList.map((resource, i) => {
        return {
          binding: i + offset,
          resource: makeResource(resource)
        };
      })
    };
  }
  async function readBuffer(state2, buffer2) {
    const device = state2.device;
    const commandEncoder = device.createCommandEncoder();
    const C = new Float32Array(buffer2.size);
    const CReadCopy = device.createBuffer({
      size: buffer2.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    const texture = device.createTexture({
      size: [500, 500, 1],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
    });
    commandEncoder.copyBufferToBuffer(buffer2, 0, CReadCopy, 0, buffer2.size);
    device.queue.submit([commandEncoder.finish()]);
    await CReadCopy.mapAsync(GPUMapMode.READ);
    C.set(new Float32Array(CReadCopy.getMappedRange()));
    CReadCopy.unmap();
    return C;
  }
  function createBuffer(device, stuff) {
    const buffer2 = device.createBuffer({
      size: 4,
      mappedAtCreation: true,
      usage: GPUBufferUsage.UNIFORM
    });
    new Uint32Array(buffer2.getMappedRange())[0] = stuff;
    buffer2.unmap();
    return buffer2;
  }
  function makeBuffer(device, size = 4, usage, data, type) {
    const buffer2 = device.createBuffer({
      size,
      mappedAtCreation: true,
      usage: GPUBufferUsage[usage]
    });
    new type(buffer2.getMappedRange()).set(data);
    buffer2.unmap();
    return buffer2;
  }
  var paramsBuffer = function(device) {
    return device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    });
  };
  function makeBindGroup(device, pipelineLayout, resourceList, offset) {
    return device.createBindGroup(makeBindGroupDescriptor(pipelineLayout, resourceList, offset));
  }
  var utils_default = {
    paramsBuffer,
    makeBuffer,
    createBuffer,
    createCanvas,
    addMouseEvents,
    makeBindGroupDescriptor,
    makeBindGroup,
    readBuffer
  };

  // lib/Texture.js
  var makeImgTexture = async (state2) => {
    const img = document.createElement("img");
    const source = img;
    source.width = innerWidth;
    source.height = innerHeight;
    img.src = state2.data.texture;
    await img.decode();
    return await createImageBitmap(img);
  };
  async function makeTexture(device, textureData, options = {}) {
    if (Array.isArray(textureData)) {
      return {
        width: textureData[0],
        height: textureData[1],
        texture: device.createTexture({
          size: {
            width: textureData[0],
            height: textureData[1]
          },
          format: "rgba8unorm",
          usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        })
      };
    }
    if (HTMLImageElement === textureData.constructor) {
      let img = textureData;
      await img.decode();
      await createImageBitmap(img);
      let imageBitmap = await createImageBitmap(img);
      let texture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        mipLevelCount: options.mipLevelCount,
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.STORAGE_BINDING
      });
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture },
        [imageBitmap.width, imageBitmap.height]
      );
      return {
        imageBitmap,
        texture,
        width: imageBitmap.width,
        height: imageBitmap.height
      };
    } else if ("string" === typeof textureData) {
      let texture = device.createTexture({
        size: [900, 500, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      });
      let imageBitmap = await makeImgTexture(state);
      device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture },
        [imageBitmap.width, imageBitmap.height]
      );
      return texture;
    } else if (typeof textureData === "object") {
      console.log(textureData.format);
      let texture = device.createTexture({
        size: [textureData.width, textureData.height, 1],
        format: textureData.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      });
      return { texture, width: textureData.width, height: textureData.height };
    }
  }

  // lib/computePass.js
  function createComputePass(options, state2) {
    let device = state2.device;
    const pipeline = device.createComputePipeline({
      layout: "auto",
      label: options.label,
      compute: {
        module: device.createShaderModule({
          code: options.code
        }),
        entryPoint: options.entryPoint || "main"
      }
    });
    const mainComputePass = {
      pipeline,
      bindGroups: options.bindGroups(state2, pipeline),
      uniforms: {
        blur: {
          buffer: utils_default.paramsBuffer(device),
          value: 15
        }
      },
      workGroups: [
        [],
        []
      ]
    };
    state2.computePass = mainComputePass;
  }

  // lib/main.js
  function isFunction(fn) {
    return fn.call;
  }
  function bindUniforms(state2, options, device) {
    const context = { tick: Date.now() };
    let size = 0;
    let uniforms = {};
    for (let key in options.uniforms) {
      if (!isFunction(options.uniforms[key]))
        continue;
      if (options.uniforms[key].isProp)
        continue;
      let result = options.uniforms[key](context);
      size += result.byteLength || 4;
      uniforms[key] = function(a) {
        device.queue.writeBuffer(state2.uniformBuffer, size, a.buffer, a.byteOffset, a.byteLength);
      };
    }
    const uniformBuffer = device.createBuffer({
      size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    return [uniformBuffer, uniforms];
  }
  async function makeBindGroup2(state2, options) {
    let { device, pipeline } = state2;
    [state2.uniformBuffer, state2.uniforms] = bindUniforms(state2, options, device);
    state2.bindGroupDescriptor = state2.options.bindGroupDescriptor || {
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: state2.uniformBuffer }
        }
      ]
    };
    if (state2.options?.uniforms?.texture) {
      let texture = await state2.options.uniforms.texture;
      state2.bindGroupDescriptor.entries.push(
        {
          binding: 1,
          resource: texture.sampler
        },
        {
          binding: 2,
          resource: texture.texture.createView()
        }
      );
    }
    return options.bindGroup ? options.bindGroup(state2) : device.createBindGroup(state2.bindGroupDescriptor);
  }
  async function createRenderPasses(state2, options) {
    let device = state2.device;
    const mainRenderPass = {
      renderPassDescriptor: state2.renderPassDescriptor,
      texture: state2.texture,
      pipeline: state2.pipeline = await makePipeline(state2, options),
      attributes: [],
      type: "draw"
    };
    if (options.uniforms || options.bindGroup) {
      mainRenderPass.bindGroup = await makeBindGroup2(state2, options);
    }
    if (options.indices) {
      mainRenderPass.indices = options.indices;
    }
    for (var key in state2.options.attributes) {
      mainRenderPass.attributes.push(updateAttributes(state2, device, key));
    }
    state2.renderPasses.push(mainRenderPass);
  }
  function updateUniforms(state2, device, newScope) {
    let size = 0;
    const context = { tick: Date.now() };
    for (let key in state2.options.uniforms) {
      if (!isFunction(state2.options.uniforms[key]))
        continue;
      if (state2.options.uniforms[key].isProp) {
        return;
      }
      let result = isFunction(state2.options.uniforms[key]) ? state2.options.uniforms[key](context) : state2.options.uniforms[key];
      device.queue.writeBuffer(state2.uniformBuffer, size, result.buffer, result.byteOffset, result.byteLength);
      size += result.byteLength;
    }
  }
  function isTypedArray(array) {
    return array.subarray;
  }
  function updateAttributes(state2, device, name) {
    let cubeVertexArray;
    if (isTypedArray(state2.options.attributes)) {
      cubeVertexArray = state2.options.attributes[name];
    } else {
      cubeVertexArray = new Float32Array(state2.options.attributes[name].data.flat());
    }
    return utils_default.makeBuffer(device, cubeVertexArray.byteLength, "VERTEX", cubeVertexArray, Float32Array);
  }
  var recordRenderPass = async function(state2, newScope = {}, CE) {
    let { device, renderPassDescriptor } = state2;
    const swapChainTexture = state2.context.getCurrentTexture();
    if (state2.options.renderPassDescriptor) {
      renderPassDescriptor = state2.options.renderPassDescriptor;
    } else {
      renderPassDescriptor.colorAttachments[0].view = swapChainTexture.createView();
    }
    const commandEncoder = CE || state2.ctx.commandEncoder || device.createCommandEncoder();
    state2.ctx.commandEncoder = commandEncoder;
    let _ = state2.renderPasses[0];
    if (!_)
      return console.log("no worky");
    if (state2.options?.uniforms)
      updateUniforms(state2, device, newScope);
    let passEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor
    );
    if (state2.options.attributeBufferData) {
      for (let i = 0; i < state2.options.attributeBufferData.length; i++) {
        passEncoder.setVertexBuffer(i, state2.options.attributeBufferData[i]);
      }
    } else {
      for (let i = 0; i < _.attributes.length; i++) {
        passEncoder.setVertexBuffer(i, _.attributes[i]);
      }
    }
    passEncoder.setPipeline(_.pipeline);
    if (_.bindGroup) {
      if (Array.isArray(_.bindGroup)) {
        _.bindGroup.forEach(function(bg, i) {
          passEncoder.setBindGroup(i, bg);
        });
      } else
        passEncoder.setBindGroup(0, _.bindGroup);
    }
    if (_.indices) {
      const icoFaces = utils_default.makeBuffer(device, _.indices.length * 2, "INDEX", _.indices, Uint16Array);
      passEncoder.setIndexBuffer(icoFaces, "uint16");
      passEncoder.drawIndexed(state2.options.indexCount);
    } else {
      passEncoder.draw(state2?.options?.count || 6, state2?.options?.instances || 1, 0, 0);
    }
    passEncoder.end();
    if (state2?.options?.postRender)
      state2?.options?.postRender(commandEncoder, swapChainTexture);
    if (!newScope.noSubmit) {
      device.queue.submit([commandEncoder.finish()]);
      delete state2.ctx.commandEncoder;
    }
  };
  async function makePipeline(state2) {
    let { device } = state2;
    let pipelineDesc = {
      layout: state2.options.layout || "auto",
      label: state2?.options?.label || "simple-gpu-draw",
      vertex: {
        module: device.createShaderModule({
          code: state2?.options?.shader?.code || state2.options.vert
        }),
        entryPoint: state2?.options?.shader?.vertEntryPoint || "main"
      },
      fragment: {
        module: device.createShaderModule({
          code: state2?.options?.shader?.code || state2.options.frag
        }),
        entryPoint: state2?.options?.shader?.fragEntryPoint || "main",
        targets: state2.options.targets ? state2.options.targets.map((format) => {
          return { format };
        }) : [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
            blend: state2.options.blend
          }
        ]
      },
      primitive: {
        topology: state2?.options?.primitive || "triangle-list"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus"
      }
    };
    if (state2.options.attributeBuffers) {
      pipelineDesc.vertex.buffers = state2.options.attributeBuffers;
    } else if (state2.options.attributes) {
      pipelineDesc.vertex.buffers = [];
      pipelineDesc.vertex.buffers.push(
        {
          arrayStride: 4 * state2.options.attributes.position.data[0].length,
          //two vertices so 4 bytes each
          attributes: [
            {
              // position
              shaderLocation: 0,
              offset: 0,
              format: state2.options.attributes.position.format
            },
            {
              // color
              shaderLocation: 1,
              offset: state2.options.attributes?.uv?.offset || 0,
              //format: state.options.attributes.uv.format,
              format: "float32x2"
            }
          ]
        }
      );
    }
    const depthTexture = device.createTexture({
      size: [500 * devicePixelRatio, 500 * devicePixelRatio],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: void 0,
          clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    };
    state2.renderPassDescriptor = renderPassDescriptor;
    return device.createRenderPipeline({ ...pipelineDesc });
  }
  async function init(options = {}) {
    let canvas = options.canvas || utils_default.createCanvas();
    let ctx = {};
    const state2 = {
      renderPassDescriptor: {},
      options,
      compute: options.compute,
      //user data
      renderPasses: [],
      //internal state
      canvas,
      ctx
    };
    if (!navigator.gpu)
      return alert("Error: webgpu is not available. Please install canary!!!");
    const context = canvas.getContext("webgpu");
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice();
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    Object.assign(state2, {
      device,
      context,
      adapter
    });
    context.configure({
      device,
      format: presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      alphaMode: "opaque"
    });
    async function texture(img, options2) {
      const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "nearest"
      });
      const texture2 = await makeTexture(device, img, options2);
      return {
        data: img,
        texture: texture2.texture,
        sampler,
        width: texture2.width,
        height: texture2.height,
        imageBitmap: texture2.imageBitmap,
        read: async function(n) {
          const C = new Float32Array(n * n);
          const CReadCopy = device.createBuffer({
            size: m * n * 4,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
          });
          await CReadCopy.mapAsync(GPUMapMode.READ);
          c.set(new Float32Array(CReadCopy.getMappedRange()));
          CReadCopy.unmap();
          return c;
        }
      };
    }
    return {
      initDrawCall,
      buffer,
      prop,
      clear,
      frame,
      initComputeCall,
      device,
      context,
      texture,
      attribute,
      canvas,
      state: state2
    };
    function initComputeCall(options2) {
      let localState = {
        ...state2
      };
      localState.compute = options2;
      createComputePass(options2, localState);
      function compute(options3, CE) {
        localState.compute.exec(localState, CE);
        return localState;
      }
      compute.submit = function() {
        state2.device.queue.submit([state2.commandEncoder.finish()]);
        delete state2.commandEncoder;
      };
      compute.state = state2;
      return compute;
    }
    function frame(cb) {
      requestAnimationFrame(function recur() {
        cb();
        requestAnimationFrame(recur);
      });
    }
    async function initDrawCall(options2) {
      let localState = Object.assign(
        Object.create(state2),
        {
          options: options2,
          device,
          renderPasses: []
        }
      );
      await createRenderPasses(localState, options2);
      function draw(newScope, commandEncoder) {
        if (Array.isArray(newScope))
          return newScope.map((scope) => draw(scope));
        recordRenderPass(localState, newScope, commandEncoder);
        return draw;
      }
      draw.canvas = canvas;
      draw.prop = prop;
      draw.buffer = buffer;
      draw.initDrawCall = initDrawCall;
      draw.state = localState;
      draw.draw = draw;
      return draw;
    }
  }
  function clear(options) {
    state.clearValue.r = options.color[0];
    state.clearValue.g = options.color[1];
    state.clearValue.b = options.color[2];
  }
  function buffer(array) {
    if (!(this instanceof buffer))
      return new buffer(array);
    this.array = array;
  }
  function prop(name) {
    let functor = (state2, newScope) => {
      let context = {
        viewportWidth: 500,
        viewportHeight: 500,
        tick: performance.now()
      };
      return newscope[name];
    };
    functor.isProp = true;
    return functor;
  }
  function attribute(data, offset, format) {
    return {
      data,
      offset,
      format: `float32x${format}`
    };
  }
  var main_default = init;

  // node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i = arguments.length;
      while (i--) {
        y += arguments[i] * arguments[i];
      }
      return Math.sqrt(y);
    };

  // node_modules/gl-matrix/esm/mat4.js
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.hypot(x, y, z);
    var s, c2, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s = Math.sin(rad);
    c2 = Math.cos(rad);
    t = 1 - c2;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c2;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c2;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c2;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c2 + a20 * s;
    out[5] = a11 * c2 + a21 * s;
    out[6] = a12 * c2 + a22 * s;
    out[7] = a13 * c2 + a23 * s;
    out[8] = a20 * c2 - a10 * s;
    out[9] = a21 * c2 - a11 * s;
    out[10] = a22 * c2 - a12 * s;
    out[11] = a23 * c2 - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c2 - a20 * s;
    out[1] = a01 * c2 - a21 * s;
    out[2] = a02 * c2 - a22 * s;
    out[3] = a03 * c2 - a23 * s;
    out[8] = a00 * s + a20 * c2;
    out[9] = a01 * s + a21 * c2;
    out[10] = a02 * s + a22 * c2;
    out[11] = a03 * s + a23 * c2;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c2 + a10 * s;
    out[1] = a01 * c2 + a11 * s;
    out[2] = a02 * c2 + a12 * s;
    out[3] = a03 * c2 + a13 * s;
    out[4] = a10 * c2 - a00 * s;
    out[5] = a11 * c2 - a01 * s;
    out[6] = a12 * c2 - a02 * s;
    out[7] = a13 * c2 - a03 * s;
    return out;
  }
  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len2 = Math.hypot(x, y, z);
    var s, c2, t;
    if (len2 < EPSILON) {
      return null;
    }
    len2 = 1 / len2;
    x *= len2;
    y *= len2;
    z *= len2;
    s = Math.sin(rad);
    c2 = Math.cos(rad);
    t = 1 - c2;
    out[0] = x * x * t + c2;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c2;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c2;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c2;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c2 = Math.cos(rad);
    out[0] = c2;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q, v) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  function fromRotationTranslationScale(out, q, v, s) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len2;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len2 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len2;
    z1 *= len2;
    z2 *= len2;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len2 = Math.hypot(x0, x1, x2);
    if (!len2) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len2 = 1 / len2;
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len2 = Math.hypot(y0, y1, y2);
    if (!len2) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len2 = 1 / len2;
      y0 *= len2;
      y1 *= len2;
      y2 *= len2;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len2 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      z0 *= len2;
      z1 *= len2;
      z2 *= len2;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len2 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
      x0 *= len2;
      x1 *= len2;
      x2 *= len2;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b, scale3) {
    out[0] = a[0] + b[0] * scale3;
    out[1] = a[1] + b[1] * scale3;
    out[2] = a[2] + b[2] * scale3;
    out[3] = a[3] + b[3] * scale3;
    out[4] = a[4] + b[4] * scale3;
    out[5] = a[5] + b[5] * scale3;
    out[6] = a[6] + b[6] * scale3;
    out[7] = a[7] + b[7] * scale3;
    out[8] = a[8] + b[8] * scale3;
    out[9] = a[9] + b[9] * scale3;
    out[10] = a[10] + b[10] * scale3;
    out[11] = a[11] + b[11] * scale3;
    out[12] = a[12] + b[12] * scale3;
    out[13] = a[13] + b[13] * scale3;
    out[14] = a[14] + b[14] * scale3;
    out[15] = a[15] + b[15] * scale3;
    return out;
  }
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;

  // node_modules/gl-matrix/esm/vec3.js
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create2,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create2() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function scaleAndAdd(out, a, b, scale3) {
    out[0] = a[0] + b[0] * scale3;
    out[1] = a[1] + b[1] * scale3;
    out[2] = a[2] + b[2] * scale3;
    return out;
  }
  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len2 = x * x + y * y + z * z;
    if (len2 > 0) {
      len2 = 1 / Math.sqrt(len2);
    }
    out[0] = a[0] * len2;
    out[1] = a[1] * len2;
    out[2] = a[2] * len2;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function hermite(out, a, b, c2, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d[2] * factor4;
    return out;
  }
  function bezier(out, a, b, c2, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c2[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c2[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c2[2] * factor3 + d[2] * factor4;
    return out;
  }
  function random(out, scale3) {
    scale3 = scale3 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale3;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale3;
    return out;
  }
  function transformMat4(out, a, m2) {
    var x = a[0], y = a[1], z = a[2];
    var w = m2[3] * x + m2[7] * y + m2[11] * z + m2[15];
    w = w || 1;
    out[0] = (m2[0] * x + m2[4] * y + m2[8] * z + m2[12]) / w;
    out[1] = (m2[1] * x + m2[5] * y + m2[9] * z + m2[13]) / w;
    out[2] = (m2[2] * x + m2[6] * y + m2[10] * z + m2[14]) / w;
    return out;
  }
  function transformMat3(out, a, m2) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m2[0] + y * m2[3] + z * m2[6];
    out[1] = x * m2[1] + y * m2[4] + z * m2[7];
    out[2] = x * m2[2] + y * m2[5] + z * m2[8];
    return out;
  }
  function transformQuat(out, a, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var x = a[0], y = a[1], z = a[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateY2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateZ2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function angle(a, b) {
    var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function equals2(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = function() {
    var vec = create2();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  }();

  // src/demos/water-simulation.js
  var NUM_PARTICLES = 256 * 4 * 128;
  var particlesCount = NUM_PARTICLES;
  var SCAN_THREADS = 256;
  var PARTICLE_WORKGROUP_SIZE = SCAN_THREADS;
  var NGROUPS = NUM_PARTICLES / 256;
  var isBrowser = typeof window !== "undefined";
  var COLLISION_TABLE_SIZE = particlesCount;
  var HASH_VEC = [
    1,
    Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 1 / 3)),
    Math.ceil(Math.pow(COLLISION_TABLE_SIZE, 2 / 3))
  ];
  var MAX_BUCKET_SIZE = 16;
  var PARTICLE_RADIUS = 0.05;
  var GRID_SPACING = 2 * PARTICLE_RADIUS;
  function createCamera(props_) {
    var props = props_ || {};
    if (typeof props.noScroll === "undefined") {
      props.noScroll = props.preventDefault;
    }
    var cameraState = {
      view: mat4_exports.identity(new Float32Array(16)),
      projection: mat4_exports.identity(new Float32Array(16)),
      center: new Float32Array(props.center || 3),
      theta: props.theta || 0,
      phi: props.phi || 0,
      distance: Math.log(props.distance || 10),
      eye: new Float32Array(3),
      up: new Float32Array(props.up || [0, 1, 0]),
      fovy: props.fovy || Math.PI / 4,
      near: typeof props.near !== "undefined" ? props.near : 0.01,
      far: typeof props.far !== "undefined" ? props.far : 1e3,
      noScroll: typeof props.noScroll !== "undefined" ? props.noScroll : false,
      flipY: !!props.flipY,
      dtheta: 0,
      dphi: 0,
      rotationSpeed: typeof props.rotationSpeed !== "undefined" ? props.rotationSpeed : 1,
      zoomSpeed: typeof props.zoomSpeed !== "undefined" ? props.zoomSpeed : 1,
      renderOnDirty: typeof props.renderOnDirty !== void 0 ? !!props.renderOnDirty : false
    };
    var element = props.element;
    var damping = typeof props.damping !== "undefined" ? props.damping : 0.9;
    var right = new Float32Array([1, 0, 0]);
    var front = new Float32Array([0, 0, 1]);
    var minDistance = Math.log("minDistance" in props ? props.minDistance : 0.1);
    var maxDistance = Math.log("maxDistance" in props ? props.maxDistance : 1e3);
    var ddistance = 0;
    var prevX = 0;
    var prevY = 0;
    if (isBrowser && props.mouse !== false) {
      let getWidth2 = function() {
        return element ? element.offsetWidth : window.innerWidth;
      }, getHeight2 = function() {
        return element ? element.offsetHeight : window.innerHeight;
      };
      var getWidth = getWidth2, getHeight = getHeight2;
      var source = element;
      (0, import_mouse_change.default)(source, function(buttons, x, y) {
        if (buttons & 1) {
          var dx = (x - prevX) / getWidth2();
          var dy = (y - prevY) / getHeight2();
          cameraState.dtheta += cameraState.rotationSpeed * 4 * dx;
          cameraState.dphi += cameraState.rotationSpeed * 4 * dy;
          cameraState.dirty = true;
        }
        prevX = x;
        prevY = y;
      });
      (0, import_mouse_wheel.default)(source, function(dx, dy) {
        ddistance += dy / getHeight2() * cameraState.zoomSpeed;
        cameraState.dirty = true;
      }, props.noScroll);
    }
    function damp(x) {
      var xd = x * damping;
      if (Math.abs(xd) < 0.1) {
        return 0;
      }
      cameraState.dirty = true;
      return xd;
    }
    function clamp(x, lo, hi) {
      return Math.min(Math.max(x, lo), hi);
    }
    function updateCamera(props2) {
      Object.keys(props2).forEach(function(prop2) {
        cameraState[prop2] = props2[prop2];
      });
      var center = cameraState.center;
      var eye = cameraState.eye;
      var up = cameraState.up;
      var dtheta = cameraState.dtheta;
      var dphi = cameraState.dphi;
      cameraState.theta += dtheta;
      cameraState.phi = clamp(
        cameraState.phi + dphi,
        -Math.PI / 2,
        Math.PI / 2
      );
      cameraState.distance = clamp(
        cameraState.distance + ddistance,
        minDistance,
        maxDistance
      );
      cameraState.dtheta = damp(dtheta);
      cameraState.dphi = damp(dphi);
      ddistance = damp(ddistance);
      var theta = cameraState.theta;
      var phi = cameraState.phi;
      var r = Math.exp(cameraState.distance);
      var vf = r * Math.sin(theta) * Math.cos(phi);
      var vr = r * Math.cos(theta) * Math.cos(phi);
      var vu = r * Math.sin(phi);
      for (var i = 0; i < 3; ++i) {
        eye[i] = center[i] + vf * front[i] + vr * right[i] + vu * up[i];
      }
      mat4_exports.lookAt(cameraState.view, eye, center, up);
    }
    cameraState.dirty = true;
    function setupCamera() {
      updateCamera(props);
      cameraState.perspective = mat4_exports.perspective(
        cameraState.projection,
        cameraState.fovy,
        1,
        cameraState.near,
        cameraState.far
      );
      return {
        projection: cameraState.projection,
        view: cameraState.view
      };
    }
    return setupCamera;
  }
  var predefines = `struct Uniforms {                                  
  force: vec2<f32>,                              
  dt: f32,                                       
  bounce: u32,                                   
  friction: f32,                                 
  aspectRatio: f32,                              
  w: f32,
  h: f32,
};

struct BucketContents {
  indices : array<i32, 50>,
  count : u32,
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

fn getNeighbors (centerId: u32) -> BucketContents {
  //for 27 neighboring bucketHashes, append particleId onto list 
  var result : BucketContents;

    for (var i = -1; i < 2; i = i + 1) {
        for (var j = -1; j < 2; j = j + 1) {
          for (var k = -1; k < 2; k = k + 1) {
            var bucketId = (centerId + bucketHash(vec3<i32>(i, j, k))) % ${COLLISION_TABLE_SIZE}u;
            var bucketStart = hashCounts[bucketId];
            var bucketEnd = ${NUM_PARTICLES}u;
            if bucketId < ${COLLISION_TABLE_SIZE - 1} {
              bucketEnd = hashCounts[bucketId + 1];
            }
            //result.count += min(bucketEnd - bucketStart, ${MAX_BUCKET_SIZE}u);
            for (var n = 0u; n < ${MAX_BUCKET_SIZE}u; n = n + 1u) {
              var p = bucketStart + n;
              if p >= bucketEnd {
                //result[i][j][k].indices[n] = -1;
              } else {
                result.indices[result.count] = i32(particleIds[p]);
                result.count += 1u;
              }
            }
           }
        }
      }
      return result;
    }


const ABS_WALL_POS = vec3<f32>(.7,.7,.5);
const GRID_CELL_SIZE = vec3<f32>(5.,5.,5.);

const effectRadius = 0.3f;
const restDensity = 250.0f;
const relaxCFM = 400.0f;
const dim = 10;
const isArtPressureEnabled = 1;
const artPressureRadius = 0.006f;
const artPressureCoeff = 0.001f;
const artPressureExp = 4;
const isVorticityConfEnabled = 1;
const vorticityConfCoeff = 0.0004f;
const xsphViscosityCoeff = 0.0001f;
const PI = 3.14156932;
const timeStep = 0.0000000000010f;

const POLY6_COEFF = 315. / (64. * PI * pow(effectRadius, 9));
const SPIKY_COEFF = 15 / PI * pow(effectRadius, 6);
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
`;
  async function basic() {
    let webgpu = await main_default();
    const cameraUniformBuffer = webgpu.device.createBuffer({
      size: 3 * 4 * 16,
      // 4x4 matrix
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const particleSize = 16;
    const computeUniformsBuffer = webgpu.device.createBuffer({
      size: 96,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
    });
    function makeBuffer2(size = particlesCount, flag = 1, log) {
      const gpuBufferSize = particlesCount * particleSize;
      const gpuBuffer = webgpu.device.createBuffer({
        size: gpuBufferSize,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true
      });
      const particlesBuffer = new Float32Array(gpuBuffer.getMappedRange());
      for (let iParticle = 0; iParticle < particlesCount; iParticle++) {
        particlesBuffer[4 * iParticle + 0] = flag && Math.random() * 2 - 1;
        particlesBuffer[4 * iParticle + 1] = flag && Math.random();
        particlesBuffer[4 * iParticle + 2] = flag && Math.random() * 2 - 1;
        particlesBuffer[4 * iParticle + 3] = 0;
      }
      if (log)
        console.log(particlesBuffer);
      gpuBuffer.unmap();
      return gpuBuffer;
    }
    const posBuffer = makeBuffer2(particlesCount, 1);
    const velocityBuffer = makeBuffer2(particlesCount, 0);
    const vorticityBuffer = makeBuffer2(particlesCount, 0);
    const predictionBuffer = makeBuffer2(particlesCount, 0);
    const densityBuffer = makeBuffer2(particlesCount / 4, 0);
    const constBuffer = makeBuffer2(particlesCount, 0);
    const correctParticle = makeBuffer2(particlesCount, 0);
    const hashCounts = makeBuffer2(COLLISION_TABLE_SIZE * 4, 0, false);
    const particleIds = makeBuffer2(COLLISION_TABLE_SIZE * 4, 0, false);
    window.z = await utils_default.readBuffer(webgpu.state, predictionBuffer);
    const resetPass = webgpu.initComputeCall({
      label: `resetPass`,
      code: `  
  @binding(0) @group(0) var<storage, read_write> hashCounts : array<u32>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    hashCounts[index] = 0;
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            //particleIds, 
            hashCounts
          ]
        );
        return [computeBindGroup];
      }
    });
    const COMMON_SHADER_FUNCS = `
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
`;
    const predictedPosition = webgpu.initComputeCall({
      label: `predictedPosition`,
      code: `
  @group(0) @binding(0) var<storage,read_write> velocityStorage: array<vec4<f32>>;
   @group(0) @binding(1) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    var velocity = velocityStorage[index];
    // var correctPar = correctParticle[index];
  
    var GRAVITY_ACC = vec4<f32>(0,-1., 0, 0);
    velocityStorage[index] = velocity;

    //1. predicted Position
    const timeStep = 0.10f;
    var newVel = velocityStorage[index] + GRAVITY_ACC * timeStep;

    predPos[index] = particlesStorage[index] + newVel * timeStep;
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        state2.computePass.computePass = computePass;
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            velocityBuffer,
            predictionBuffer,
            posBuffer
            //correctParticle
          ]
        );
        return [computeBindGroup];
      }
    });
    const computeDensity = webgpu.initComputeCall({
      label: `computeDensity`,
      code: `
  ${predefines}
   @group(0) @binding(0) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(1) var<storage,read_write> density: array<f32>;

  @group(0) @binding(2) var<storage,read_write> hashCounts: array<u32>;
  @group(0) @binding(3) var<storage,read_write> particleIds: array<u32>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;  

    let pos = predPos[index];
    var fluidDensity = 0.;

    
    var startEnd = getNeighbors(index);

      
    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      fluidDensity += poly6(pos - predPos[e], effectRadius);
    }

    density[index] = fluidDensity;
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        state2.computePass.computePass = computePass;
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            predictionBuffer,
            densityBuffer,
            hashCounts,
            particleIds
          ]
        );
        return [computeBindGroup];
      }
    });
    const gridCountPipeline = webgpu.initComputeCall({
      label: `gridCountPipeline`,
      code: `
  ${COMMON_SHADER_FUNCS}
  @binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
  @binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;
  
  @compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn main (@builtin(global_invocation_id) globalVec : vec3<u32>) {
    var id = globalVec.x;
    var bucket = particleHash(positions[id].xyz);
    atomicAdd(&hashCounts[bucket], 1u);
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            posBuffer,
            hashCounts
          ]
        );
        return [computeBindGroup];
      }
    });
    const gridCopyParticlePipeline = webgpu.initComputeCall({
      label: `gridCopyParticlePipeline`,
      code: `
${COMMON_SHADER_FUNCS}
  @binding(0) @group(0) var<storage, read> positions : array<vec4<f32>>;
  @binding(1) @group(0) var<storage, read_write> hashCounts : array<atomic<u32>>;
  @binding(2) @group(0) var<storage, read_write> particleIds : array<u32>;
  @compute @workgroup_size(${PARTICLE_WORKGROUP_SIZE},1,1) fn main (@builtin(global_invocation_id) globalVec : vec3<u32>) {
  var id = globalVec.x;
  var bucket = particleHash(positions[id].xyz);
  var offset = atomicSub(&hashCounts[bucket], 1u) - 1u;
  particleIds[offset] = id;
}`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            posBuffer,
            hashCounts,
            particleIds
          ]
        );
        return [computeBindGroup];
      }
    });
    const applyVorticityCompute = webgpu.initComputeCall({
      label: `applyVorticityCompute`,
      code: `
  ${predefines}
  
  var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> vorticity: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(4) var<storage,read_write> constFactor: array<f32>;
  @group(0) @binding(5) var<storage,read_write> correctParticle: array<vec4<f32>>;

  @binding(6) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(7) @group(0) var<storage, read_write> hashCounts : array<u32>;
  @binding(8) @group(0) var<storage, read_write> particlesStorage : array<vec4<f32>>;

  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    var f = uniforms.friction;
    let index: u32 = GlobalInvocationID.x;
    var velocity = velocityStorage[index];
    var vort = vorticity[index];
    var correctPar = correctParticle[index];
  
    {
      var pos = predPos[index];    
      var n = vec4<f32>(0);

      var vort = vec4<f32>(0);
      var startEnd = getNeighbors(index);

      
      for (var i = 0u; i < startEnd.count; i++) {
        var e = startEnd.indices[i];
        vort = vec4<f32>(cross((velocityStorage[e] - velocity).xyz, gradSpiky(pos - predPos[index], effectRadius).xyz), 1.);
      }
      vorticity[index] = vort;
    }
  
    //7 vorticity confinement
    {
      let pos = particlesStorage[index];
      var n = vec4<f32>(0.0f);
      var startEnd = getNeighbors(index);

      for (var i = 0u; i < startEnd.count; i++) {
        var e = startEnd.indices[i];
        //n += 1.;//(vorticity[e]);
        //* gradSpiky(pos - predPos[e], effectRadius);
      }
      velocityStorage[index] += 
      
      vec4<f32>(vorticityConfCoeff * cross(normalize(n).xyz, vorticity[index].xyz) * .0000000000000000000000000001, 0.);
    }
  
  
    //8 apply XsphViscosityCorrection
  {
    var pos = predPos[index];
    var velocity = velocityStorage[index];
    var viscosity = vec4<f32>(0.);
  
    var lambdaI = constFactor[index];

    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      viscosity += (velocityStorage[e] - velocity) * poly6(pos - predPos[e], effectRadius);
    }
    velocityStorage[index] = velocity + xsphViscosityCoeff * viscosity;
  }
  
  //9 apply Bounding Wall
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            computeUniformsBuffer,
            velocityBuffer,
            vorticityBuffer,
            predictionBuffer,
            constBuffer,
            correctParticle,
            hashCounts,
            particleIds,
            posBuffer
          ]
        );
        return [computeBindGroup];
      }
    });
    const applyConstraintCompute = webgpu.initComputeCall({
      label: `applyConstraintCompute`,
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            computeUniformsBuffer,
            velocityBuffer,
            predictionBuffer,
            densityBuffer,
            constBuffer,
            posBuffer,
            correctParticle,
            hashCounts,
            particleIds
          ]
        );
        return [computeBindGroup];
      },
      code: `
  ${predefines}
  var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;
  @group(0) @binding(0) var<uniform> uniforms: Uniforms;
  @group(0) @binding(1) var<storage,read_write> velocityStorage: array<vec4<f32>>;
  @group(0) @binding(2) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(3) var<storage,read_write> densityStorage: array<f32>;
  @group(0) @binding(4) var<storage,read_write> constFactor: array<f32>;
  @group(0) @binding(5) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  @group(0) @binding(6) var<storage,read_write> correctParticle: array<vec4<f32>>;


  @binding(7) @group(0) var<storage, read_write> particleIds : array<u32>;
  @binding(8) @group(0) var<storage, read_write> hashCounts : array<u32>;

  
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    var pos = particlesStorage[index];
    var velocity = velocityStorage[index];
    var correctPar = correctParticle[index];
    var aspectRatioStuff = uniforms.aspectRatio;
    var constraint = constFactor[index];
    var fluidDensity = densityStorage[index];
   
    //3. compute constraint factor
  {
    var vec = vec4<f32>(0);
    var grad = vec4<f32>(0);
    var sumGradCi = vec4<f32>(0);
    var sumSqGradC = 0.;
    var pos = predPos[index];
    let densityC = fluidDensity / restDensity - 1.0;
    
    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      vec = pos - predPos[e];

      grad = gradSpiky(vec, effectRadius);

      sumGradCi += grad;

      sumSqGradC += dot(grad, grad);
    }
    
    sumSqGradC += dot(sumGradCi, sumGradCi);
    sumSqGradC /= restDensity * restDensity;
  
    constFactor[index] = - densityC / (sumSqGradC + relaxCFM);
  }
  //4. compute constraint correction
  {
    var pos = predPos[index];
    var lambdaI = constFactor[index];
    var corr = vec4<f32>(0.0);
    var vec = vec4<f32>(0.0);
     
    var startEnd = getNeighbors(index);

    for (var i = 0u; i < startEnd.count; i++) {
      var e = startEnd.indices[i];
      vec = pos - predPos[e];
      corr += (lambdaI + constFactor[e] + artPressure(vec)) * gradSpiky(vec, effectRadius);
    }
    correctParticle[index] = corr / restDensity;

    predPos[index] = predPos[index] + correctParticle[index];
  
    velocityStorage[index] = predPos[index] - particlesStorage[index];
  }
    const MAX_VEL = vec4<f32>(30.);
    velocityStorage[index] = clamp((predPos[index] - pos[index]) / (100. + FLOAT_EPS), -MAX_VEL, MAX_VEL);
  
   particlesStorage[index] = vec4<f32>(clamp(predPos[index].xyz, -ABS_WALL_POS, ABS_WALL_POS), 1.);

  //9 apply Bounding Wall
  }`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      }
    });
    const updatePositionCompute = webgpu.initComputeCall({
      label: `updatePositionCompute`,
      code: `  
  var<workgroup> tile : array<array<vec3<f32>, 128>, 4>;
  @group(0) @binding(0) var<storage,read_write> predPos: array<vec4<f32>>;
  @group(0) @binding(1) var<storage,read_write> particlesStorage: array<vec4<f32>>;
  
  @compute @workgroup_size(256)
  fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index: u32 = GlobalInvocationID.x;
    let predPos = predPos[index];
  
  const ABS_WALL_POS = vec3<f32>(.7,.7,.5);

  particlesStorage[index] = vec4<f32>(clamp(predPos.xyz, -ABS_WALL_POS, ABS_WALL_POS), 1.);
  //9 apply Bounding Wall
}`,
      exec: function(state2) {
        const device2 = state2.device;
        const commandEncoder = state2.ctx.commandEncoder = state2.ctx.commandEncoder || device2.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(state2.computePass.pipeline);
        computePass.setBindGroup(0, state2.computePass.bindGroups[0]);
        computePass.dispatchWorkgroups(NGROUPS);
        computePass.end();
      },
      bindGroups: function(state2, computePipeline) {
        const computeBindGroup = utils_default.makeBindGroup(
          state2.device,
          computePipeline.getBindGroupLayout(0),
          [
            predictionBuffer,
            posBuffer
          ]
        );
        return [computeBindGroup];
      }
    });
    const attractors = [];
    const attractor = {
      position: [0, 0],
      force: 0.1 * 0.1
    };
    attractor.position[0] = 0;
    attractor.position[1] = 0;
    attractors.push(attractor);
    function buildComputeUniforms(dt, aspectRatio, force, attractors2) {
      const buffer2 = new ArrayBuffer(96);
      new Float32Array(buffer2, 0, 2).set([force[0], force[1]]);
      new Float32Array(buffer2, 8, 1).set([dt]);
      new Uint32Array(buffer2, 12, 1).set([3]);
      new Float32Array(buffer2, 16, 1).set([0.5]);
      new Float32Array(buffer2, 20, 1).set([0]);
      new Uint32Array(buffer2, 24, 1).set([500]);
      new Uint32Array(buffer2, 28, 1).set([500]);
      return buffer2;
    }
    const quadBuffer = webgpu.device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 2 * 6,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });
    new Float32Array(quadBuffer.getMappedRange()).set([
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      -1,
      1,
      1,
      -1,
      1
    ]);
    quadBuffer.unmap();
    const now = Date.now();
    setInterval(function() {
      const elapsed = (Date.now() - now) * 1e-6;
      const uniformsBufferData = buildComputeUniforms(elapsed, 0.1, [0.5, 0.5], attractors);
      webgpu.device.queue.writeBuffer(computeUniformsBuffer, 0, uniformsBufferData);
    }, 100);
    const buffers = [
      {
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x4"
          }
        ],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
        stepMode: "instance"
      },
      {
        attributes: [
          {
            shaderLocation: 1,
            offset: 0,
            format: "float32x2"
          }
        ],
        arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
        stepMode: "vertex"
      }
    ];
    const device = webgpu.device;
    const model = mat4_exports.identity(new Float32Array(16));
    function getCameraViewProjMatrix() {
      const eyePosition = vec3_exports.fromValues(0, 0, -1.5);
      const upVector = vec3_exports.fromValues(0, 1, 0);
      const origin = vec3_exports.fromValues(0, 0, 0);
      const rad = Math.PI * (Date.now() / 5);
      mat4_exports.rotate(
        model,
        model,
        1,
        vec3_exports.fromValues(
          Math.sin(0),
          Math.cos(1),
          0
        )
      );
      let projectionMatrix = mat4_exports.create();
      let viewProjectionMatrix = mat4_exports.create();
      mat4_exports.perspectiveZO(
        projectionMatrix,
        1,
        500 / 500,
        0.1,
        500
      );
      mat4_exports.multiply(viewProjectionMatrix, projectionMatrix, viewProjectionMatrix);
      let renderParamsHost = new ArrayBuffer(4 * 4 * 4);
      let viewProjectionMatrixHost = new Float32Array(renderParamsHost);
      viewProjectionMatrixHost.set(viewProjectionMatrix);
      return viewProjectionMatrixHost;
    }
    const cameraViewProj = getCameraViewProjMatrix();
    const blend = {
      color: {
        srcFactor: "src-alpha",
        dstFactor: "one",
        operation: "add"
      },
      alpha: {
        srcFactor: "zero",
        dstFactor: "one",
        operation: "add"
      }
    };
    const drawCube = await webgpu.initDrawCall({
      shader: {
        vertEntryPoint: "main_vertex",
        fragEntryPoint: "main_fragment",
        code: `struct Uniforms {             //             align(16)  size(24)
    color: vec4<f32>,         // offset(0)   align(16)  size(16)
    spriteSize: vec2<f32>,    // offset(16)   align(8)  size(8)
};

struct Camera {
  projectionMatrix : mat4x4<f32>,
  viewMatrix : mat4x4<f32>,
  modelMatrix: mat4x4<f32>
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
    
     camera.projectionMatrix * camera.viewMatrix *  camera.modelMatrix * 
   vec4<f32>(inPosition.xy + (.009 + uniforms.spriteSize) * quadCorner, inPosition.z, 1.);
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

    return  col + vec4<f32>(distanceFromCenter - 1.5, 0,1.,.1);
}
`
      },
      attributeBuffers: buffers,
      attributeBufferData: [
        posBuffer,
        quadBuffer
      ],
      count: 6,
      blend,
      instances: particlesCount,
      bindGroup: function({ pipeline }) {
        const uniformsBuffer = webgpu.device.createBuffer({
          size: 32,
          usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        });
        return webgpu.device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: {
                buffer: uniformsBuffer
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
    });
    let camera = createCamera({
      center: [-7, -0, -0],
      damping: 0,
      noScroll: true,
      renderOnDirty: true,
      element: webgpu.canvas
    });
    let stuff = camera();
    const identity2 = mat4_exports.identity([]);
    const v = new Float32Array([0.9951236248016357, -0.03326542302966118, 0.09285693615674973, 0, 0, 0.941413164138794, 0.33725544810295105, 0, -0.09863568842411041, -0.33561086654663086, 0.9368224740028381, 0, 0.19727137684822083, 0.20051512122154236, -3.9743294715881348, 1]);
    const gridCountScan = new WebGPUScan({
      device,
      threadsPerGroup: SCAN_THREADS,
      itemsPerThread: 4,
      dataType: "u32",
      dataSize: 4,
      dataFunc: "A + B",
      dataUnit: "0u"
    });
    const gridCountScanPass = await gridCountScan.createPass(COLLISION_TABLE_SIZE, hashCounts);
    setInterval(
      async function() {
        let { projection, view } = camera();
        cameraViewProj;
        device.queue.writeBuffer(
          cameraUniformBuffer,
          0,
          cameraViewProj.buffer,
          cameraViewProj.byteOffset,
          cameraViewProj.byteLength
        );
        device.queue.writeBuffer(
          cameraUniformBuffer,
          0,
          projection.buffer,
          projection.byteOffset,
          projection.byteLength
        );
        device.queue.writeBuffer(
          cameraUniformBuffer,
          64,
          view.buffer,
          view.byteOffset,
          view.byteLength
        );
        device.queue.writeBuffer(
          cameraUniformBuffer,
          128,
          model.buffer,
          model.byteOffset,
          model.byteLength
        );
        let localState = resetPass();
        let commandEncoder = device.createCommandEncoder();
        predictedPosition();
        gridCountPipeline();
        const computePass = commandEncoder.beginComputePass();
        window.hashCounts = await utils_default.readBuffer(webgpu.state, hashCounts);
        gridCountScanPass.run(computePass);
        computePass.end();
        gridCopyParticlePipeline();
        window.particleIds = await utils_default.readBuffer(webgpu.state, particleIds);
        computeDensity();
        for (var i = 0; i < 2; i++)
          applyConstraintCompute();
        applyVorticityCompute();
        updatePositionCompute();
        drawCube({});
        window.density = await utils_default.readBuffer(webgpu.state, densityBuffer);
        window.countY = function countY() {
          let stuff2 = window.w;
          let result = [];
          for (let i2 = 0; i2 < stuff2.length; i2 += 4) {
            result.push(stuff2[i2 + 1]);
          }
          console.log(result);
        };
      },
      50
    );
  }
  basic();
})();
