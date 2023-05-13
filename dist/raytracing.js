"use strict";
(() => {
  // lib/utils.js
  var addMouseEvents = function(canvas, data) {
    canvas.addEventListener("mousemove", (event) => {
      let x = event.pageX;
      let y = event.pageY;
      data.mouseX = x / event.target.clientWidth;
      data.mouseY = y / event.target.clientHeight;
    });
  };
  function createCanvas(width = 1e3, height = 1e3) {
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
  async function readBuffer(state2, buffer2, flag = false) {
    const constructor = flag ? Float32Array : Uint32Array;
    const device = state2.device;
    const commandEncoder = device.createCommandEncoder();
    const C = new constructor(buffer2.size);
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
    C.set(new constructor(CReadCopy.getMappedRange()));
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
  var count = 0;
  function makeTexture(device, textureData, options = {}) {
    if (textureData instanceof GPUTexture)
      return {
        id: count++,
        texture: textureData,
        width: textureData.width,
        height: textureData.height
      };
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
    if (HTMLCanvasElement === textureData.constructor) {
      let texture = device.createTexture({
        size: [textureData.width, textureData.height, 1],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      });
      return {
        id: count++,
        texture,
        width: textureData.width,
        height: textureData.height
      };
    }
    if (ImageBitmap === textureData.constructor) {
      let imageBitmap = textureData;
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
    } else if (typeof textureData === "object") {
      let texture = device.createTexture({
        size: [textureData.width, textureData.height, 1],
        format: textureData.format,
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      });
      return {
        id: count++,
        texture,
        width: textureData.width,
        height: textureData.height
      };
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
  function makeBindGroup2(state2, options) {
    let { device, pipeline } = state2;
    [state2.uniformBuffer, state2.uniforms] = bindUniforms(state2, options, device);
    state2.bindGroupDescriptor = state2.options.bindGroupDescriptor || {
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        // {
        //   binding: 0,
        //   resource: { buffer: state.uniformBuffer },
        // },
      ]
    };
    let result = options.bindGroup ? options.bindGroup(state2) : device.createBindGroup(state2.bindGroupDescriptor);
    return result;
  }
  function createRenderPasses(state2, options) {
    let device = state2.device;
    const mainRenderPass = {
      renderPassDescriptor: state2.renderPassDescriptor,
      texture: state2.texture,
      pipeline: state2.pipeline = makePipeline(state2, options),
      attributes: [],
      type: "draw"
    };
    if (options.uniforms || options.bindGroup) {
      mainRenderPass.bindGroup = makeBindGroup2(state2, options);
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
  var recordRenderPass = function(state2, newScope = {}, CE) {
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
    if (true) {
      state2.wtf = "true";
      const cubeTexture = state2.swapChainTexture || device.createTexture({
        size: [2e3, 2e3],
        format: navigator.gpu.getPreferredCanvasFormat(),
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
      });
      commandEncoder.copyTextureToTexture(
        {
          texture: swapChainTexture
        },
        {
          texture: cubeTexture
        },
        [2e3, 2e3]
      );
      state2.swapChainTexture = cubeTexture;
    }
    if (state2?.options?.postRender) {
      state2?.options?.postRender(commandEncoder, swapChainTexture);
    }
    if (!newScope.noSubmit) {
      device.queue.submit([commandEncoder.finish()]);
      delete state2.ctx.commandEncoder;
    }
  };
  function makePipeline(state2) {
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
      size: [1e3 * devicePixelRatio, 1e3 * devicePixelRatio],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: void 0,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
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
    const device = await adapter?.requestDevice({
      //    requiredFeatures: ["timestamp-query"],
      //https://omar-shehata.medium.com/how-to-use-webgpu-timestamp-query-9bf81fb5344a
      //https://www.graphics.rwth-aachen.de/media/papers/splatting1.pdf
    });
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    Object.assign(state2, {
      device,
      context,
      adapter
    });
    context.configure({
      device,
      format: presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING,
      alphaMode: "opaque"
    });
    function texture(img, options2) {
      const sampler = device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
        mipmapFilter: "nearest"
      });
      const texture2 = makeTexture(device, img, options2);
      return {
        id: texture2.id,
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
    function initDrawCall(options2) {
      let localState = Object.assign(
        Object.create(state2),
        {
          options: options2,
          device,
          renderPasses: [],
          wtf: true
        }
      );
      createRenderPasses(localState, options2);
      function draw(newScope = {}, commandEncoder) {
        if (Array.isArray(newScope))
          return newScope.map((scope) => draw(scope));
        if (true) {
          localState.renderPasses[0].bindGroup = makeBindGroup2(localState, options2);
        }
        recordRenderPass(localState, newScope, commandEncoder);
        return draw;
      }
      draw.canvas = canvas;
      draw.prop = prop;
      draw.buffer = buffer;
      draw.initDrawCall = initDrawCall;
      draw.state = localState;
      draw.draw = draw;
      draw.state = localState;
      draw.swapAttributeBuffer = function(data, i) {
        localState.options.attributeBufferData[i] = data;
      };
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

  // src/demos/raytracing.js
  async function basic() {
    const webgpu = await main_default();
    const device = webgpu.device;
    const cameraUniformBuffer = device.createBuffer({
      size: 4 * 16,
      // 4x4 matrix
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const drawCube = await webgpu.initDrawCall({
      frag: `

struct Uniforms {
  mouse: vec2<f32>
}
@group(0) @binding(0) var<uniform> uniforms : Uniforms;


struct sphere {
  center: vec3<f32>,
  radius: f32,
  material: f32,
  albedo: vec3<f32>
}

struct mat {
  scattered: ray,
  albedo: vec3<f32>,
  isScatter: bool
}

fn reflect(v:vec3<f32>, n:vec3<f32>) -> vec3<f32> {
  return v - 2*dot(v,n)*n;
}

struct ray {
  origin: vec3<f32>,
  direction: vec3<f32>,
}

fn unit_vector(v: vec3<f32>) -> vec3<f32>  {
  return v/ length(v);
} 

//uses T for ray with normalized vector 

fn material (r:ray, s: sphere, rec: hit_record, xy: vec2<f32>) -> mat {

  var albedo = s.albedo;

  if (s.material == 0.) {
    //metal
    var reflected = reflect(normalize(r.direction), rec.normal);
    var scattered = ray(rec.p, reflected);
    var attenuation = albedo;
    var isScatter = dot(scattered.direction, rec.normal) > 0;
    return mat(scattered, attenuation, isScatter);
  } else if (s.material == 1.) {
    //diffuse
    var direction = rec.p + rec.normal + random_in_unit_sphere(xy);
    var attenuation = albedo;

    var scattered = ray(rec.p, direction);
    return mat(
      scattered, attenuation, true
    );
  } else if (s.material == 2.) {
    var outward_normal: vec3<f32>;
    var reflected = reflect(r.direction, rec.normal);
    var ni_over_nt:f32;
    var reflect_prob = 0.;
    var cosine = 0.;
    var ref_idx = 1.5;
    if (dot(r.direction, rec.normal) > 0) {
      //outside
      outward_normal = -rec.normal;
      ni_over_nt = ref_idx;
      cosine = dot(r.direction, rec.normal) / length(r.direction);
    } else {
      //inside
      outward_normal = rec.normal;
      ni_over_nt = 1.0 / ref_idx;
      cosine = -dot(r.direction, rec.normal) / length(r.direction);
    }
    var scattered:ray;
    var refracted = refract2(r.direction, outward_normal, ni_over_nt);
    if (refracted.y == -1000.) {
      reflect_prob = reflectance(cosine, ref_idx);
      scattered = ray(rec.p, refracted );
    } else {
      scattered = ray(rec.p, reflected);
      reflect_prob = 1.0;
    }


    if (random(xy) > reflect_prob) {
      scattered = ray(rec.p, reflected);
    } else {
      scattered = ray(rec.p, refracted);
    }

    return mat(scattered, vec3<f32>(1.), true);

    // var ir = 1.5;
    // var attenuation = vec3<f32>(1.);
    // var refraction_ratio:f32;
    // if (rec.front_face) {
    //   refraction_ratio = 1.0 / ir;
    // } else {
    //   refraction_ratio = ir;
    // }

    // var unit_direction = unit_vector(r.direction);
    // var cos_theta = min(dot(-unit_direction, rec.normal) , 1.0);
    // var sin_theta = sqrt(1.0 - cos_theta * cos_theta);
    // var cannot_refract = refraction_ratio * sin_theta > 1.0;

    // var direction:vec3<f32>;
    // if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random(xy)) {
    //    //direction = reflect(unit_direction, rec.normal);
    // } else {
    //   direction = refract(unit_direction, rec.normal, refraction_ratio);
    // }
    // direction = refract(unit_direction, rec.normal, refraction_ratio);

    // var scattered = ray(rec.p, direction);
    // return mat(scattered, attenuation, true);
  }
  return mat();
}

fn refract2(v:vec3<f32>, n:vec3<f32>, ni_over_nt:f32) -> vec3<f32> {
  var uv = unit_vector(v);
  var dt = dot(uv, n);
  var discriminant = 1.0 - ni_over_nt*ni_over_nt*(1-dt*dt);
  if (discriminant > 0) {
    return ni_over_nt*(uv - n * dt)- n * sqrt(discriminant);
  } else {
    return vec3<f32>(-1000.);
  }
}

fn reflectance (cosine:f32, ref_idx:f32) -> f32{
  var r0 = (1 -ref_idx) / (1 + ref_idx);
  r0 = r0*r0;
  return r0 + (1-r0)*pow((1 - clamp(cosine, 0., 1.)), 5);
}


fn sphereHit(s: sphere, r:ray, t_min: f32, t_max: f32) -> hit_record {
  var hit: hit_record;

  var oc = r.origin - s.center; 
  var a = pow(length(r.direction), 2.);
  var half_b = dot(oc, r.direction);
  var c = dot(oc, oc) - s.radius * s.radius;
  var discriminant = half_b*half_b - a*c;
  if (discriminant < 0) {
    return hit;
  }
  var sqrtd = sqrt(discriminant);

  var root = (-half_b - sqrtd) / a;
  if (root < t_min || t_max < root) {
    root = (-half_b +sqrtd) / a;
    if (root < t_min || t_max < root) {
      return hit;
    }
  }

  hit.t = root;
  hit.p = rayAt(r, hit.t);
  hit.normal = (hit.p - s.center) / s.radius;
  hit.hit_anything = discriminant > 0.;
  hit.sphere = s;
  var outward_normal = (hit.p - s.center) / s.radius;
  hit.front_face = dot(r.direction, outward_normal) > 0;
  if (hit.front_face) {
    hit.normal = outward_normal; 
  } else {
    hit.normal = - outward_normal;
  }

  return hit;
}


  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) vertexIndex: f32
  }




struct hit_record {
  p: vec3<f32>,
  normal: vec3<f32>,
  t: f32,
  front_face: bool,
  hit_anything: bool,
  sphere: sphere
}
 
fn world_hit(sphereList:array<sphere,10>, r: ray, t_min: f32, t_max: f32) -> hit_record {
  var hit: hit_record;
  var closest_so_far = t_max;

  for (var i =0; i < 10; i += 1) {
    var didHit = sphereHit(sphereList[i], r, t_min, closest_so_far);
    if (didHit.hit_anything) { 
      closest_so_far = didHit.t;
      hit = didHit;
    }
  }

  return hit;
}

fn random(st: vec2<f32>) -> f32 {

  return fract(sin(dot(st.xy,
                       vec2(12.9898,78.233)))*
      43758.5453123);
}

fn length_squared(e:vec3<f32>) -> f32 {
  return e.x * e.x + e.y * e.y + e.z * e.z;
}


fn random_in_unit_sphere(st: vec2<f32>) -> vec3<f32> {
  // return vec3<f32>(.4, .3, .3);

 var p = vec3<f32>(random(st ), random(st ), random(st ));
  return p;
}

const infinity = 1.;
fn ray_color(r: ray, world:array<sphere, 10>, depth:f32, xy: vec2<f32>) -> vec3<f32> {
    var color = vec3<f32>(0);

    var current_ray = r;
    var hit = world_hit(world, r, 0, infinity); //a, b, sky

    //ray from camera hits sphere A
    // ray from sphere A hits sphere B
    // ray from sphere B hits sky 
    var cur_attenuation = 1.0;
    for (var i = 0; i < 50; i+= 1) {
      hit = world_hit(world, current_ray, .0000001, 1000000.); 
      if (hit.hit_anything) {
          var targ = hit.p + hit.normal;
          let mat = material(current_ray, hit.sphere, hit, xy);
          
          current_ray = mat.scattered;
          //if (hit.sphere.material != 2.) {
            color += mat.albedo; 
            cur_attenuation *= .5;
          //} else {
            //cur_attenuation = .2 ;
          //}
      } else {
        var t = hit_sphere(vec3<f32>(0,0,-1), .5, r);
        var unit_direction = normalize(r.direction);
        t = 0.5*(unit_direction.y + 1.0);
        color += (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3<f32>(0.5, 0.7, 1.0);
        return cur_attenuation * color;
      }
    }
    return color;
}
//https://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
//https://web.cse.ohio-state.edu/~shen.94/681/Site/Slides_files/reflection_refraction.pdf


fn rayAt(r:ray , t: f32) -> vec3<f32> {
  return r.origin + t * r.direction;
}

fn hit_sphere(center: vec3<f32>, radius:f32, r:ray) -> f32 {
  var oc = r.origin - center; 
  var a = pow(length(r.direction), 2.);
  var half_b = dot(oc, r.direction);
  var c = dot(oc, oc) - radius * radius;
  var discriminant = half_b*half_b - a*c;
  if (discriminant < 0) {
    return -1.0;
  } else {
    return (-half_b - sqrt(discriminant)) / a;
  }
}
//discriminant coefficent of polynomal which describes root fx=fx^2



@fragment
  fn main(in: VertexOutput) -> @location(0) vec4<f32> {
    var Hit: hit_record;
    var world:array<sphere, 10>;
    var red = vec3<f32>(1., 0., 0.);
    var green = vec3<f32>(0., 1., 0.);
    var blue = vec3<f32>(0., 0., 1.);

    var x = uniforms.mouse.x > 250;

    // var material: f32;
    // if (x) { 
    //   material = 0;
    // } else {
    //   material = 2;
    // }

    world[0] = sphere(vec3<f32>(.0, .1,-1.0), .4, 2, 
    
    
    red );
    world[1] = sphere(vec3<f32>(0,-100.5,-1), 100, 1, green);


    for (var i = 2; i < 9; i += 1) {
      
      //world[i] = sphere(vec3<f32>(-random(in.fragUV.xy) * f32(i),0,-1.), .35, 1, blue);
    }
     world[3] = sphere(vec3<f32>(0,.7,-1.), .35, 0, red);
    world[4] = sphere(vec3<f32>(.4,.3,-0.), .35, 0, green);
    // world[5] = sphere(vec3<f32>(.5,.4,.5), .35, 1, blue);
     world[6] = sphere(vec3<f32>(.1,.9,-0.), .35, 1, red);
    world[7] = sphere(vec3<f32>(-.1,.8,-2.), .35, 1, green);
    world[8] = sphere(vec3<f32>(-3.,.8,-1.), .35, 1, blue);
    world[9] = sphere(vec3<f32>(-2,0, -3), .35, 1, red);


    //try a better random function



    const aspect_ratio = 1.;
    const image_width = 500.;
    const image_height = f32(image_width / aspect_ratio);
    
    // Camera
    
    const viewport_height = 2.0;
    const viewport_width = aspect_ratio * viewport_height;
    const focal_length = 1.0;
    

    var origin = vec3<f32>(0.);
    var direction = vec3<f32>(0.);

    let horizontal = vec3(viewport_width, 0, 0);
    let vertical = vec3(0, viewport_height, 0);
    let lower_left_corner = origin - horizontal/2 - vertical/2 - vec3(0, 0, focal_length);

    var uv = in.fragUV.xy * vec2<f32>(500., 500.);
    var fragColor = vec4<f32>(1.);
    var u = uv.x / image_width; //fragment position
    var v = 1. - (uv.y / image_height); //fragment position

    var r = ray(origin, lower_left_corner + u*horizontal + v*vertical - origin);
    fragColor = vec4<f32>(sqrt(ray_color(r, world, 50, uv *  in.vertexIndex + 123.)), 1.);

    return fragColor;
  }
`,
      vert: `

  struct uniforms {
    mouse: vec2<f32>
  }
  // struct Uniforms {
  //   modelMatrix : mat4x4<f32>,
  //   normalModelMatrix : mat4x4<f32>,
  // }

  struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) vertexIndex: f32
  }

  @vertex
  fn main(
    @builtin(vertex_index) VertexIndex : u32
  ) -> VertexOutput  {
    const pos = array(
      vec2( 1.0,  1.0),
      vec2( 1.0, -1.0),
      vec2(-1.0, -1.0),
      vec2( 1.0,  1.0),
      vec2(-1.0, -1.0),
      vec2(-1.0,  1.0),
    );

    const uv = array(
      vec2(1.0, 0.0),
      vec2(1.0, 1.0),
      vec2(0.0, 1.0),
      vec2(1.0, 0.0),
      vec2(0.0, 1.0),
      vec2(0.0, 0.0),
    );
    var output : VertexOutput;
    output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);

    output.fragUV = uv[VertexIndex];
    output.vertexIndex = f32(VertexIndex);

    return output;
  }
  `,
      count: 6,
      bindGroup: function({ pipeline }) {
        return utils_default.makeBindGroup(
          device,
          pipeline.getBindGroupLayout(0),
          [cameraUniformBuffer]
        );
      }
      // uniforms: {
      //   mouse: () => [500, 500]
      // }
    });
    webgpu.canvas.addEventListener("mousemove", function(e) {
      let cameraViewProj = new Float32Array(2);
      cameraViewProj[0] = e.clientX;
      cameraViewProj[1] = e.clientY;
      webgpu.device.queue.writeBuffer(
        cameraUniformBuffer,
        0,
        cameraViewProj.buffer,
        cameraViewProj.byteOffset,
        cameraViewProj.byteLength
      );
    });
    setInterval(
      function() {
        drawCube({
          //texture: webgpu.texture(img)
        });
      },
      50
    );
  }
  basic();
})();
