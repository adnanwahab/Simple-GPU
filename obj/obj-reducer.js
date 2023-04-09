let fs = require('fs').promises
let f = require('fs')
const path = require('path');


let folders = ["/1/", "/2/", "/3/", "/4/", "/5/"]

async function doStuff () {
  folders.forEach(async d => {
    let files = (await fs.readdir(__dirname + d)).filter(file => (path.extname(file) === '.obj'));
    files.forEach(function (file, i) {
      //console.log(i)
      writeShit(file, d)
      //console.log(__dirname + d, files)
  });
  f.writeFileSync(__dirname + d + 'meta.json', JSON.stringify({files: files.length}))
  })
}

doStuff()


async function writeShit (file, dir) {
  file = __dirname + dir +  file;
   const writeTo = 
  file.substr(0, file.lastIndexOf(".")) + ".bin";
  //console.log(writeTo)
  //console.log(file)
  //o Beta_Joints_Beta_Joints.005
  let data = await fs.readFile(file)
    let lines = data.toString().split('\n')
    let frame = []
    
    lines.forEach((line, idx) => {
      if (line[0] === 'v' && line[1] == ' ') {
        //if (idx=== 4)
        //console.log(line)
        frame.push(line.slice(2).split(' ')
        .map(parseFloat).concat(0))
      }
      
      
    })
    //console.log(lines.length)
    //if (i === 0) frame.forEach(console.log)

    let numbers = frame.flat()
    //console.log(numbers.length)
      let buffer= new Float32Array(numbers.length);
      buffer.set(numbers)
      //console.log(numbers)
      var b = Buffer.alloc(buffer.length * 4)
      //var b = Buffer.from(buffer)
      //console.log(__dirname + dir + `/${i}myfile.bin`)
      for (let i = 0; i < buffer.length; i++) {
        // console.log(buffer[i])
        b.writeFloatLE(buffer[i] || 0, i*4)
      }
    // console.log(writeTo)
    // var wstream = f.createWriteStream('data.dat');
    // wstream.write(b);
    // wstream.end();
    //console.log(writeTo)
    console.log(writeTo)
    f.writeFileSync(writeTo, b)
  // await fs.writeFile(writeTo,
  //   b, function (err, data) {
  //    console.log(data)
  //  })
  //  console.log('done writing ', __dirname + dir + `/${i}myfile.bin`)


}



