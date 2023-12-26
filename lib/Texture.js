let makeImgTexture = async (state) => {
  const img = document.createElement("img");
  const source = img;
  source.width = innerWidth;
  source.height = innerHeight;

  img.src = state.data.texture;

  await img.decode();

  return await createImageBitmap(img);
};

async function makeTexture(device, textureData, options={}) {
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

  if (HTMLImageElement === textureData.constructor) {

    let img = textureData
    await img.decode();
    await createImageBitmap(img);
    let imageBitmap = await createImageBitmap(img); 

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

    let texture = device.createTexture({
      size: [900, 500, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT
        ,
    });

    let imageBitmap = await makeImgTexture(state);
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );
    return texture;
  } else if (typeof textureData === 'object') {
    console.log(textureData.format)
    let texture = device.createTexture({
      size: [textureData.width, textureData.height, 1],
      format: textureData.format,
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST
    });

    return {texture, width: textureData.width, height:textureData.height};
  }
}

async function updateTexture(state) {
  let { device}  = state
  
   if (! state.options?.uniforms?.texture) 
     return console.log('no texture bound')

     const imageBitmap = await createImageBitmap(state.options.uniforms.texture);
     let cubeTexture = device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
    
    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: cubeTexture },
      [imageBitmap.width, imageBitmap.height]
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
