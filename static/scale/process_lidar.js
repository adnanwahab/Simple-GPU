const fs = require('fs');
const path = require('path');


let lidarPaths = []

function readDirectories(dirPath) {
  // Check if the current path is a directory
  if (fs.lstatSync(dirPath).isDirectory()) {
    console.log(`Directory: ${dirPath}`);

    // Read the contents of the directory
    const items = fs.readdirSync(dirPath);

    // Recursively read each item in the directory
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      readDirectories(fullPath);
      //console.log(fullPath)
      if (path.extname(fullPath) === '.json') {
        lidarPaths.push(fullPath);
      }
    });
  }
}

// Replace 'startPath' with your starting directory
const startPath = __dirname;
readDirectories(startPath);


console.log(lidarPaths.length)


lidarPaths.forEach(function (path, index) {
  let data = JSON.parse(fs.readFileSync(path));
  console.log(path)
  const jsonData = data
  const points = jsonData.points;


  const numFields = 5; // x, y, z, i, d
  const typedArray = new Float32Array(points.length * numFields);

  points.forEach((point, index) => {
    typedArray[index * numFields] = point.x;
    typedArray[index * numFields + 1] = point.y;
    typedArray[index * numFields + 2] = point.z;
    typedArray[index * numFields + 3] = point.i;
    typedArray[index * numFields + 4] = point.d;
  });
  const buffer = Buffer.from(typedArray.buffer);
  fs.writeFile(path.replace('.json', '.bin'), buffer, (err) => {
    if (err) throw err;
    console.log('The binary file has been saved!');
  });
  delete jsonData.points
  fs.writeFile(path, JSON.stringify(jsonData), (err) => {
    if (err) throw err;
    console.log('The json file has been saved!');
  });
})
// 


// // Simulating reading JSON data (replace this with actual file reading)
// 

// // Extract points data
// 

// // Create a typed array


// // Populate the typed array


// // Write the binary data to a file

