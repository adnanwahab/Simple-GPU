// // Import @tensorflow/tfjs or @tensorflow/tfjs-core
// import * as tf from '@tensorflow/tfjs';
// // Add the WebGPU backend to the global backend registry.
// import '@tensorflow/tfjs-backend-webgpu';
// // Set the backend to WebGPU and wait for the module to be ready.
// tf.setBackend('webgpu').then(() => main());


// import * as posedetection from '@tensorflow-models/face-detection';






// function focusGame() {}

// export default focusGame





// let video = document.querySelector('video')

// const setupCamera = () => {
//   navigator.mediaDevices.getUserMedia({
//     video: {width: 600, height: 400},
//     audio: false
//   }).then((stream) => {
//     video.srcObject = stream;
//   })
// }

// const detectFaces = async () => {
//   const prediction = await model.estimateFaces(video, false)

//   console.log(predictions)
// }
// model = blazeface.load()
// detectFaces()

// video.addEventListener("loadeddata", async () => {
//   model = await blazeface.load();
//   detectFaces();
// })