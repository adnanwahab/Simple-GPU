import utils from './utils'
  function createComputePass(options, state) {
    let device = state.device
  
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: device.createShaderModule({
          code: options.code,
        }),
        entryPoint: 'main',
      },
    });
    
      const mainComputePass = {
        pipeline: pipeline,
        bindGroups: options.bindGroups(state, pipeline),
        uniforms: {
          blur: {
            buffer: utils.paramsBuffer(device),
            value: 12
          }
        },
        workGroups: [
          [], []
        ]
      }
      state.computePass = mainComputePass
  }
  
  function execComputePass (state) {
    const device = state.device
    const tileDim = 128;
    const batch = [4,4]
    const settings = {
      filterSize: 15,
      iterations: 10
    }

    const [srcWidth, srcHeight] = [512, 512];
    const blockDim = tileDim - settings.filterSize;
  
    state.commandEncoder = state.commandEncoder || device.createCommandEncoder();
    const commandEncoder = state.commandEncoder
  
    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(state.computePass.pipeline);
    computePass.setBindGroup(0, state.computePass.bindGroups[0]);
  
    computePass.setBindGroup(1, state.computePass.bindGroups[1]);
    computePass.dispatchWorkgroups(
      Math.ceil(srcWidth / blockDim),
      Math.ceil(srcHeight / batch[1])
    );
  
    computePass.setBindGroup(1, state.computePass.bindGroups[2]);
    computePass.dispatchWorkgroups(
      Math.ceil(srcHeight / blockDim),
      Math.ceil(srcWidth / batch[1])
  );
  
    for (let i = 0; i < settings.iterations - 1; ++i) {
      computePass.setBindGroup(1, state.computePass.bindGroups[3]);
      computePass.dispatchWorkgroups(
        Math.ceil(srcWidth / blockDim),
        Math.ceil(srcHeight / batch[1])
      );
  
      computePass.setBindGroup(1, state.computePass.bindGroups[2]);
      computePass.dispatchWorkgroups(
        Math.ceil(srcHeight / blockDim),
        Math.ceil(srcWidth / batch[1])
      );
    }
    computePass.end();
  }

  export  {
   execComputePass, createComputePass
  }