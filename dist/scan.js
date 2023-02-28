"use strict";
(() => {
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
})();
