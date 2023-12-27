import { makeBench, mustHave } from './boilerplate';
import { WebGPUScan } from './scan';

async function main() {
    const adapter = mustHave(await navigator.gpu.requestAdapter());
    const device = await adapter.requestDevice();
    const prefixSum = new WebGPUScan({
        device
    });
    const kernels = {
        async gpu(n) {
            const dataBuffer = device.createBuffer({
                label: 'dataBuffer',
                size: n * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            });
            const readBuffer = device.createBuffer({
                label: 'readBuffer',
                size: n * 4,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
            });
            const pass = await prefixSum.createPass(n, dataBuffer);
            return {
                async prefixsum(out, src, skipTransfer) {
                    if (!skipTransfer) {
                        device.queue.writeBuffer(dataBuffer, 0, src.buffer, src.byteOffset, src.byteLength);
                    }
                    const commandEncoder = device.createCommandEncoder();
                    const passEncoder = commandEncoder.beginComputePass();
                    pass.run(passEncoder);
                    passEncoder.end();
                    if (!skipTransfer) {
                        commandEncoder.copyBufferToBuffer(dataBuffer, 0, readBuffer, 0, 4 * n);
                    }
                    device.queue.submit([commandEncoder.finish()]);
                    if (!skipTransfer) {
                        await readBuffer.mapAsync(GPUMapMode.READ);
                        out.set(new Float32Array(readBuffer.getMappedRange()));
                        readBuffer.unmap();
                    }
                    else {
                        await device.queue.onSubmittedWorkDone();
                    }
                },
                async free() {
                    pass.destroy();
                    dataBuffer.destroy();
                    readBuffer.destroy();
                }
            };
        },
        async cpu(n) {
            return {
                async prefixsum(out, src) {
                    let s = 0;
                    for (let i = 0; i < src.length; ++i) {
                        s += src[i];
                        out[i] = s;
                    }
                },
                async free() { }
            };
        },
    };
    const minN = Math.log2(prefixSum.minItems()) | 0;
    const maxN = Math.log2(prefixSum.maxItems()) | 0;
    const rangeN = {
        type: 'number',
        min: '' + minN,
        max: '' + maxN,
        step: '1',
    };
    const ui = makeBench({
        header: `GPU prefix sum/scan demo.  Array length N must be a multiple of ${prefixSum.itemsPerGroup}.
GPU performance is bottlenecked by data transfer costs.  Disabling CPU transfer will improve performance.`,
        inputs: {
            startN: {
                label: 'Min logN',
                props: Object.assign({ value: '' + minN }, rangeN),
                value: (x) => +x
            },
            endN: {
                label: 'Max logN',
                props: Object.assign({ value: '' + maxN }, rangeN),
                value: (x) => +x
            },
            iter: {
                label: 'Iterations per step',
                props: { type: 'number', min: '1', max: '300', step: '1', value: '100' },
                value: (x) => +x,
            },
            transfer: {
                label: 'Enable GPU transfer',
                props: { type: 'checkbox', checked: true },
                value: (_, e) => !!e.checked,
            },
            test: {
                label: 'Test mode',
                props: { type: 'checkbox', checked: false },
                value: (_, e) => !!e.checked
            }
        },
        kernels,
    });
    function randArray(n) {
        const A = new Float32Array(n);
        for (let i = 0; i < A.length; ++i) {
            A[i] = 2 * Math.random() - 1;
        }
        return A;
    }
    while (true) {
        const { inputs: { startN, endN, iter, transfer, test }, kernel } = await ui.go();
        ui.clear();
        if (test) {
            const n = 1 << startN;
            ui.log(`Testing ${kernel} with n=${n}`);
            const alg = await kernels[kernel](n);
            const A = randArray(n);
            const B = new Float32Array(n);
            const C = new Float32Array(n);
            const doTest = async () => {
                ui.log('run cpu...');
                C[0] = A[0];
                for (let i = 1; i < n; ++i) {
                    C[i] = C[i - 1] + A[i];
                    B[i] = 0;
                }
                ui.log('run kernel...');
                await alg.prefixsum(B, A, false);
                ui.log('testing...');
                await ui.sleep(100);
                let foundError = false;
                for (let i = 0; i < n; ++i) {
                    if (Math.abs(C[i] - B[i]) > 0.001) {
                        ui.log(`!! ${i}: ${C[i].toFixed(4)} != ${B[i].toFixed(4)}`);
                        await ui.sleep(5);
                    }
                }
                if (!foundError) {
                    ui.log('Pass');
                }
            };
            for (let i = 0; i < n; ++i) {
                A[i] = 1;
            }
            ui.log('test 1...');
            await doTest();
            ui.log('test random...');
            await doTest();
            await alg.free();
        }
        else {
            ui.log(`Benchmarking ${kernel} from n = 2^${startN} to 2^${endN} ${iter}/step....`);
            for (let logn = startN; logn <= endN; ++logn) {
                const n = 1 << logn;
                const alg = await kernels[kernel](n);
                const A = randArray(n);
                const B = new Float32Array(n);
                const tStart = performance.now();
                for (let i = 0; i < iter; ++i) {
                    await alg.prefixsum(B, A, !transfer);
                }
                const tElapsed = performance.now() - tStart;
                const work = iter * n;
                ui.log(`n=${n}: ~${(work / tElapsed).toPrecision(3)} FLOPs (${tElapsed.toPrecision(4)} ms, avg ${(tElapsed / iter).toPrecision(4)} ms per pass)`);
                await alg.free();
                await ui.sleep(16);
            }
            ui.log('done');
        }
    }
}

function demo () {
    main().catch(err => console.error(err));
}

export default demo