import { makeBench, mustHave } from './boilerplate';
const BLOCK_SHIFT = 3;
const BLOCK_SIZE = 1 << BLOCK_SHIFT;
async function main() {
    const adapter = mustHave(await navigator.gpu.requestAdapter());
    const device = await adapter.requestDevice();
    const multiplyPipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
            module: device.createShaderModule({
                code: `
struct MatrixParams {
  M : u32,
  N : u32,
  K : u32,
}
@binding(0) @group(0) var<uniform> params : MatrixParams;
        
@binding(1) @group(0) var<storage, read> aCoeffs : array<vec4<f32>>;
@binding(2) @group(0) var<storage, read> bCoeffs : array<vec4<f32>>;
@binding(3) @group(0) var<storage, read_write> cCoeffs : array<vec4<f32>>;

var<workgroup> aBlock : array<array<mat4x4<f32>, ${BLOCK_SIZE}>, ${BLOCK_SIZE}>;
var<workgroup> bBlock : array<array<mat4x4<f32>, ${BLOCK_SIZE}>, ${BLOCK_SIZE}>;

@compute @workgroup_size(${BLOCK_SIZE}, ${BLOCK_SIZE}, 1)
fn matrixMult(
  @builtin(workgroup_id) groupId : vec3<u32>,
  @builtin(local_invocation_id) localId : vec3<u32>) {
  var M = params.M;
  var N = params.N;
  var K = params.K;
  var Q = (groupId.xy * ${BLOCK_SIZE}u) + (localId.xy * 4u);
  var ii = localId.x;
  var jj = localId.y;
  var out = mat4x4<f32>();
  for (var k = 0u; k < K; k = k + ${BLOCK_SIZE * 4}u) {
    for (var r = 0u; r < 4u; r = r + 1u) {
      aBlock[ii][jj][r] = aCoeffs[(K * (Q.x + r) + 4u * jj + k) >> 2];
      bBlock[ii][jj][r] = bCoeffs[(N * (4u * ii + k + r) + Q.y) >> 2];
    }
    workgroupBarrier();
    for (var kk = 0u; kk < 8u; kk = kk + 1u) {
      out = out + transpose(aBlock[ii][kk]) * transpose(bBlock[kk][jj]);
    }
    workgroupBarrier();
  }
  for (var r = 0u; r < 4u; r = r + 1u) {
    cCoeffs[(M * (Q.x + r) + Q.y) >> 2] = out[r];
  }
}`
            }),
            entryPoint: 'matrixMult'
        }
    });
    const kernels = {
        async gpu(m, n, k) {
            const paramBuffer = device.createBuffer({
                size: 3 * 4,
                usage: GPUBufferUsage.UNIFORM,
                mappedAtCreation: true
            });
            new Uint32Array(paramBuffer.getMappedRange()).set([m, n, k]);
            paramBuffer.unmap();
            const Abuffer = device.createBuffer({
                size: m * k * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            const Bbuffer = device.createBuffer({
                size: k * n * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });
            const Cbuffer = device.createBuffer({
                size: m * n * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
            });
            const CReadCopy = device.createBuffer({
                size: m * n * 4,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
            });
            const bindGroup = device.createBindGroup({
                layout: multiplyPipeline.getBindGroupLayout(0),
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: paramBuffer
                        }
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: Abuffer
                        }
                    },
                    {
                        binding: 2,
                        resource: {
                            buffer: Bbuffer,
                        }
                    },
                    {
                        binding: 3,
                        resource: {
                            buffer: Cbuffer
                        }
                    }
                ]
            });
            return {
                async mult(a, b, c) {
                    device.queue.writeBuffer(Abuffer, 0, a.buffer, a.byteOffset, a.byteLength);
                    device.queue.writeBuffer(Bbuffer, 0, b.buffer, b.byteOffset, b.byteLength);
                    const commandEncoder = device.createCommandEncoder();
                    const passEncoder = commandEncoder.beginComputePass();
                    passEncoder.setPipeline(multiplyPipeline);
                    passEncoder.setBindGroup(0, bindGroup);
                    passEncoder.dispatchWorkgroups(n / (BLOCK_SIZE * 4), m / (BLOCK_SIZE * 4), 1);
                    passEncoder.end();
                    commandEncoder.copyBufferToBuffer(Cbuffer, 0, CReadCopy, 0, 4 * n * m);
                    device.queue.submit([commandEncoder.finish()]);
                    await CReadCopy.mapAsync(GPUMapMode.READ);
                    c.set(new Float32Array(CReadCopy.getMappedRange()));
                    CReadCopy.unmap();
                },
                async free() {
                    paramBuffer.destroy();
                    Abuffer.destroy();
                    Bbuffer.destroy();
                    Cbuffer.destroy();
                }
            };
        },
        async cpu(m, n, k) {
            return {
                async mult(a, b, c) {
                    for (let ii = 0; ii < m; ++ii) {
                        for (let jj = 0; jj < n; ++jj) {
                            let s = 0;
                            for (let kk = 0; kk < k; ++kk) {
                                s += a[k * ii + kk] * b[n * kk + jj];
                            }
                            c[n * ii + jj] = s;
                        }
                    }
                },
                async free() {
                    // placeholder
                }
            };
        },
    };
    const ui = makeBench({
        header: `Single precision matrix multiply demo.
This measures the number of flops required to multiply two NxN matrices together across various values of N.
The matrix size (N) must be a multiple of ${BLOCK_SIZE * 4}.`,
        inputs: {
            startN: {
                label: 'Start N',
                props: { type: 'number', min: '' + (BLOCK_SIZE * 4), max: '2048', step: '' + (BLOCK_SIZE * 4), value: '' + (BLOCK_SIZE * 4) },
                value: (x) => +x
            },
            endN: {
                label: 'End N',
                props: { type: 'number', min: '' + (BLOCK_SIZE * 4), max: '2048', step: '' + (BLOCK_SIZE * 4), value: '1024' },
                value: (x) => +x
            },
            stepN: {
                label: 'Step N',
                props: { type: 'number', min: '' + (BLOCK_SIZE * 4), max: '2048', step: '' + (BLOCK_SIZE * 4), value: '64' },
                value: (x) => +x
            },
            iter: {
                label: 'Iterations per step',
                props: { type: 'number', min: '1', max: '100', step: '1', value: '10' },
                value: (x) => +x
            }
        },
        kernels,
    });
    function randMatrix(m, n) {
        const A = new Float32Array(m * n);
        for (let i = 0; i < A.length; ++i) {
            A[i] = 2 * Math.random() - 1;
        }
        return A;
    }
    while (true) {
        const { inputs: { startN, endN, stepN, iter }, kernel } = await ui.go();
        ui.clear();
        ui.log(`Benchmarking ${kernel} from n = ${startN} to ${endN} (step = ${stepN}) ${iter}/step....`);
        for (let n = startN; n <= endN; n += stepN) {
            const alg = await kernels[kernel](n, n, n);
            const A = randMatrix(n, n);
            const B = randMatrix(n, n);
            const C = new Float32Array(n * n);
            const tStart = performance.now();
            for (let i = 0; i < iter; ++i) {
                await alg.mult(A, B, C);
            }
            const tElapsed = performance.now() - tStart;
            const work = 2 * iter * Math.pow(n, 3);
            ui.log(`${n}x${n}: ${((1000 * work / tElapsed) / 1e9).toFixed(3)} GFLOPs (avg ${tElapsed / iter} ms)`);
            await alg.free();
            await ui.sleep(16);
        }
    }
}
main().catch(err => console.error(err));