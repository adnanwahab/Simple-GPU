import { init } from "../lib/main";
import updateSpritesWGSL from "../shaders/updateSprites.wgsl?raw";
import spriteWGSLFS from "../shaders/sprite_fs.wgsl?raw";
import spriteWGSLVS from "../shaders/sprite_vs.wgsl?raw";

const vertexBufferData = new Float32Array([
  -0.01, -0.02, 0.01, -0.02, 0.0, 0.02,
]);
const numParticles = 1500;
const initialParticleData = new Float32Array(numParticles * 4);
for (let i = 0; i < numParticles; ++i) {
  initialParticleData[4 * i + 0] = 5 * (Math.random() - 0.5);
  initialParticleData[4 * i + 1] = 5 * (Math.random() - 0.5);
  initialParticleData[4 * i + 2] = 20 * (Math.random() - 0.5) * 0.1;
  initialParticleData[4 * i + 3] = 20 * (Math.random() - 0.5) * 0.1;
}

const initialParticleData2 = new Float32Array(numParticles * 4);

for (let i = 0; i < numParticles; ++i) {
  initialParticleData2[4 * i + 0] = 5 * (Math.random() - 0.5);
  initialParticleData2[4 * i + 1] = 5 * (Math.random() - 0.5);
  initialParticleData2[4 * i + 2] = 20 * (Math.random() - 0.5) * 0.1;
  initialParticleData2[4 * i + 3] = 20 * (Math.random() - 0.5) * 0.1;
}

let data = {};
const options = {
  data: {},
  vs: spriteWGSLVS, // 
  shader: spriteWGSLFS, //
  compute: {
    //optional
    dispatchWorkGroups: () => {
      return Math.ceil(initialParticleData.length / 64)
    },
        numVertices: () => {
      return initialParticleData.length / 4
    },
    buffers: [initialParticleData, initialParticleData2],
    vertexBufferData,
    shader: updateSpritesWGSL,
    simParams: {
      deltaT: 0.04,
      rule1Distance: 0.1,
      rule2Distance: 0.025,
      rule3Distance: 0.025,
      rule1Scale: 0.02,
      rule2Scale: 0.05,
      rule3Scale: 0.005,
    },
  },
};

async function physics() {
  options.data = options.data; //extend

  const draw = await init(options);
  draw(data);

  requestAnimationFrame(function test() {
    draw(data);
    requestAnimationFrame(test);
    //setTimeout(test, 500)
  });
}

export default physics;
