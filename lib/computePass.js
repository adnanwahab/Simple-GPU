import utils from './utils'
  function createComputePass(options, state) {
    let device = state.device
  
    const pipeline = device.createComputePipeline({
      layout: 'auto',
      label: options.label,
      compute: {
        module: device.createShaderModule({
          code: options.code,
        }),
        entryPoint: options.entryPoint || 'main',
      },
    });

      const mainComputePass = {
        pipeline: pipeline,
        bindGroups: options.bindGroups(state, pipeline),
        uniforms: {
          blur: {
            buffer: utils.paramsBuffer(device),
            value: 15
          }
        },
        workGroups: [
          [], []
        ]
      }
      state.computePass = mainComputePass
  }

  export  {
   createComputePass
  }