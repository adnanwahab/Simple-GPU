let makeImgTexture = async (state) => {
  const img = document.createElement("img");
  const source = img;
  source.width = innerWidth;
  source.height = innerHeight;

  img.src = state.data.texture;

  return img
};


let count = 0;
function makeTexture(device, textureData, options={}) {
//  console.log(textureData)
if (textureData instanceof GPUTexture) 
return {
  id: count++,
  texture: textureData, width: textureData.width, height:textureData.height
}

  if (Array.isArray(textureData)) {
    return{
      width: textureData[0],
        height: textureData[1],
      texture: device.createTexture({
      size: {
        width: textureData[0],
        height: textureData[1],
      },
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.TEXTURE_BINDING,
    })}
  }
  if (HTMLCanvasElement === textureData.constructor) {
      let texture = device.createTexture({
        size: [textureData.width, textureData.height, 1],
        format:  "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST
      });
      return {
        id: count++,
        texture, width: textureData.width, height:textureData.height
    }
  }

  if (ImageBitmap === textureData.constructor) {
    let imageBitmap = textureData

    let texture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      mipLevelCount: options.mipLevelCount,
      format:  "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.STORAGE_BINDING,
    });
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );
    return {
      imageBitmap,
      texture, width: imageBitmap.width, height: imageBitmap.height};
  } else if ("string" === typeof textureData) {

    // let texture = device.createTexture({
    //   size: [900, 500, 1],
    //   format: "rgba8unorm",
    //   usage:
    //     GPUTextureUsage.TEXTURE_BINDING |
    //     GPUTextureUsage.COPY_DST |
    //     GPUTextureUsage.RENDER_ATTACHMENT
    //     ,
    // });

    // let imageBitmap = await makeImgTexture(state);
    // device.queue.copyExternalImageToTexture(
    //   { source: imageBitmap },
    //   { texture: texture },
    //   [imageBitmap.width, imageBitmap.height]
    // );
    // return texture;
  } else if (typeof textureData === 'object') {
    let texture = device.createTexture({
      size: [textureData.width, textureData.height, 1],
      format: textureData.format,
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST
    });

    return {
      id: count++,
      texture, width: textureData.width, height:textureData.height};
  }
}

function updateTexture(state) {
  let { device}  = state
  
   if (! state.options?.uniforms?.texture) 
     return console.log('no texture bound')
     let cubeTexture = device.createTexture({
      size: [state.data.width, state.data.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    
    device.queue.copyExternalImageToTexture(
      { source: state.data },
      { texture: cubeTexture },
      [state.data.width, state.data.height]
    );
    return cubeTexture
  // if ((state.data.texture)) {
  // let data = new Uint8Array(
  //   //@ts-ignore
  //   new Array(1024).fill(5).map((d, i) => {
  //     return state.data.texture
  //       ? state.data.texture[i % state.data.texture.length]
  //       : Math.random();
  //   })
  //  );

  // state.device.queue.writeTexture(
  //   { texture: state.options.uniforms.texture },
  //   data.buffer,
  //   {
  //     bytesPerRow: 3200,
  //     rowsPerImage: 600,
  //   },
  //   [256, 1]
  // );
  // }
}

export {updateTexture, makeTexture,}
