const fs = require('fs');

let data = JSON.parse(fs.readFileSync('1.json'));

const typedArray = new Float32Array(data.points.length * 4);

for (let i = 0; i < data.points.length; i += 4) {
  typedArray[i] = data.points[i].x;
  typedArray[i] = data.points[i].y;
  typedArray[i] = data.points[i].z;

}

// Specify the file name
const fileName = 'typedArrayFile.bin';

// Write the typed array to the file
fs.writeFileSync(fileName, typedArray);

console.log(`Typed array has been written to ${fileName}`);
