const MAX_BUFFER_SIZE = 134217728

const DEFAULT_DATA_TYPE = 'f32'
const DEFAULT_DATA_SIZE = 4
const DEFAULT_DATA_FUNC = 'A + B'
const DEFAULT_DATA_UNIT = '0.'

export class WebGPUScan {
  public logNumBanks:number = 5
  public threadsPerGroup:number = 256
  public itemsPerThread:number = 256
  public itemsPerGroup:number = 65536
  public itemSize = 4

  public device:GPUDevice
  public prefixSumShader:GPUShaderModule
  public postBindGroupLayout:GPUBindGroupLayout
  public dataBindGroupLayout:GPUBindGroupLayout
  public postBuffer:GPUBuffer
  public postBindGroup:GPUBindGroup
  public prefixSumIn:Promise<GPUComputePipeline>
  public prefixSumPost:Promise<GPUComputePipeline>
  public prefixSumOut:Promise<GPUComputePipeline>

  public minItems () {
    return this.itemsPerGroup
  }

  public minSize () {
    return this.minItems() * this.itemSize
  }

  public maxItems () {
    return Math.min(this.itemsPerGroup * this.itemsPerGroup, Math.floor(MAX_BUFFER_SIZE / (this.itemSize * this.itemsPerGroup)) * this.itemsPerGroup)
  }

  public maxSize () {
    return this.itemSize
  }

  constructor (config:{
    device: GPUDevice,

    // performance tuning parameter, used to avoid bank conflicts on some hw
    logNumBanks?: number,

    // workgroup size
    threadsPerGroup?: number,

    // number of items brute force scanned per-thread
    itemsPerThread?: number,

    // header is prepended to genrated code, can be used to define custom functions and data types
    header?: string,

    // type signature of scan data
    dataType?: string,

    // size of a single scan element in bytes
    dataSize?: number,

    // inline macro function for combining two elements.  the ordered pair of elements is (A, B)
    dataFunc?: string,

    // unit (identity) element of the monoid we are summing over
    dataUnit?: string
  }) {
    this.device = config.device

    // set up performance tuning parameters
    if (config['threadsPerGroup']) {
      this.threadsPerGroup = config['threadsPerGroup'] >>> 0
      if (this.threadsPerGroup < 1 || this.threadsPerGroup > 256) {
        throw new Error('Threads per group must be between 1 and 256')
      }
    }
    if (config['itemsPerThread']) {
      this.itemsPerThread = config['itemsPerThread'] >>> 0
      if (this.itemsPerThread < 1) {
        throw new Error('Items per thread must be > 1')
      }
    }
    this.itemsPerGroup = this.threadsPerGroup * this.itemsPerThread

    // generate shader code
    const dataType = config.dataType || DEFAULT_DATA_TYPE
    const dataSize = config.dataSize || DEFAULT_DATA_SIZE
    const dataFunc = config.dataFunc || DEFAULT_DATA_FUNC
    const dataUnit = config.dataUnit || DEFAULT_DATA_UNIT
    this.itemSize = dataSize
    this.prefixSumShader = this.device.createShaderModule({
      code: `
${config.header || ''}

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
    })

    this.postBuffer = this.device.createBuffer({
      label: 'postBuffer',
      size: this.itemsPerGroup * this.itemSize,
      usage: GPUBufferUsage.STORAGE
    })

    this.postBindGroupLayout = this.device.createBindGroupLayout({
      label: 'postBindGroupLayout',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
          hasDynamicOffset: false,
          minBindingSize: this.itemSize * this.itemsPerGroup
        }
      }]
    } as const)

    this.postBindGroup = this.device.createBindGroup({
      label: 'postBindGroup',
      layout: this.postBindGroupLayout,
      entries: [{
        binding: 0,
        resource: {
          buffer: this.postBuffer
        }
      }]
    })

    this.dataBindGroupLayout = this.device.createBindGroupLayout({
      label: 'dataBindGroupLayout',
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
          hasDynamicOffset: false,
          minBindingSize: this.itemSize * this.itemsPerGroup
        }
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
          hasDynamicOffset: false,
          minBindingSize: this.itemSize * this.itemsPerGroup
        }
      }]
    } as const)

    // create pipelines
    const layout = this.device.createPipelineLayout({
      label: 'commonScanLayout',
      bindGroupLayouts: [
        this.postBindGroupLayout,
        this.dataBindGroupLayout
      ]
    })
    this.prefixSumIn = this.device.createComputePipelineAsync({
      label: 'prefixSumIn',
      layout,
      compute: {
        module: this.prefixSumShader,
        entryPoint: 'prefixSumIn'
      }
    })
    this.prefixSumPost = this.device.createComputePipelineAsync({
      label: 'prefixSumPost',
      layout: this.device.createPipelineLayout({
        label: 'postScanLayout',
        bindGroupLayouts: [ this.postBindGroupLayout ]
      }),
      compute: {
        module: this.prefixSumShader,
        entryPoint: 'prefixSumPost'
      }
    })
    this.prefixSumOut = this.device.createComputePipelineAsync({
      label: 'prefixSumOut',
      layout,
      compute: {
        module: this.prefixSumShader,
        entryPoint: 'prefixSumOut'
      }
    })
  }

  public async createPass (n:number, data:GPUBuffer, work?:GPUBuffer) : Promise<WebGPUScanPass> {
    if (n < this.minItems() || n > this.maxItems() || (n % this.itemsPerGroup) !== 0) {
      throw new Error('Invalid item count')
    }
    // allocate work buffer only if required
    let ownsWorkBuffer = false
    let workBuffer = null
    if (n > this.minItems()) {
      if (work) {
        workBuffer = work
      } else {
        workBuffer = this.device.createBuffer(
          {
            label: 'workBuffer',
            size: n * this.itemSize,
            usage: GPUBufferUsage.STORAGE
          }
        )
        ownsWorkBuffer = true
      }
    }

    let dataBindGroup:GPUBindGroup
    if (workBuffer) {
      dataBindGroup = this.device.createBindGroup({
        label: 'dataBindGroup',
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
      } as const)
    } else {
      dataBindGroup = this.device.createBindGroup({
        label: 'dataBindGroupSmall',
        layout: this.postBindGroupLayout,
        entries: [{
          binding: 0,
          resource: {
            buffer: data
          }
        }]
      } as const)
    }
    return new WebGPUScanPass(
      (n / this.itemsPerGroup) >>> 0,
      dataBindGroup,
      this.postBindGroup,
      workBuffer,
      ownsWorkBuffer,
      await this.prefixSumIn,
      await this.prefixSumPost,
      await this.prefixSumOut
    )
  }

  public destroy () {
    this.postBuffer.destroy()
  }  
}

export class WebGPUScanPass {
  constructor (
    public numGroups:number,
    public dataBindGroup:GPUBindGroup,
    public postBindGroup:GPUBindGroup,
    public work:GPUBuffer|null,
    public ownsWorkBuffer:boolean,
    public prefixSumIn:GPUComputePipeline,
    public prefixSumPost:GPUComputePipeline,
    public prefixSumOut:GPUComputePipeline,
  ) {
  }

  public run(passEncoder:GPUComputePassEncoder) {
    if (this.work) {
      // large pass
      passEncoder.setBindGroup(0, this.postBindGroup)
      passEncoder.setBindGroup(1, this.dataBindGroup)
      passEncoder.setPipeline(this.prefixSumIn)
      passEncoder.dispatchWorkgroups(this.numGroups)
      passEncoder.setPipeline(this.prefixSumPost)
      passEncoder.dispatchWorkgroups(1)
      passEncoder.setPipeline(this.prefixSumOut)
      passEncoder.dispatchWorkgroups(this.numGroups)
    } else {
      // small pass
      passEncoder.setBindGroup(0, this.dataBindGroup)
      passEncoder.setPipeline(this.prefixSumPost)
      passEncoder.dispatchWorkgroups(1)
    }
  }

  public destroy () {
    if (this.ownsWorkBuffer && this.work) {
      this.work.destroy()
    }
  }
}