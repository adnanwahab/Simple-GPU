const fs = require('fs');


let data = JSON.parse(fs.readFileSync('1.json'));



// Simulating reading JSON data (replace this with actual file reading)
const jsonData = data

// Extract points data
const points = jsonData.points;

// Create a typed array
const numFields = 5; // x, y, z, i, d
const typedArray = new Float32Array(points.length * numFields);

// Populate the typed array
points.forEach((point, index) => {
  typedArray[index * numFields] = point.x;
  typedArray[index * numFields + 1] = point.y;
  typedArray[index * numFields + 2] = point.z;
  typedArray[index * numFields + 3] = point.i;
  typedArray[index * numFields + 4] = point.d;
});

// Write the binary data to a file
const buffer = Buffer.from(typedArray.buffer);
fs.writeFile('points.bin', buffer, (err) => {
  if (err) throw err;
  console.log('The binary file has been saved!');
});
