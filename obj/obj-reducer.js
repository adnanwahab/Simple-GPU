let fs = require('fs').promises
let f = require('fs')


let folders = ["/1", "/2", "/3", "/4", "/5"].slice(0, 1)

async function doStuff () {
  folders.forEach(async (dir) => {
    for (let i = 0; i < 200; i++) {
    writeShit(dir, i)
  }
})
}

doStuff()


async function writeShit (dir, i) {
  
  let file = __dirname + dir +  `/${i}myfile.obj`;
  const writeTo = __dirname + dir + `/${i}myfile.bin`;
  //console.log(writeTo)
  //console.log(file)
  let data = await fs.readFile(file)
    let lines = data.toString().split('\n')
    let frame = []
    lines.forEach((line, idx) => {
      if (line[0] === 'v') {
//        if (idx=== 4)console.log(line)
        frame.push(line.slice(2).split(' ')
        .map(parseFloat).concat(0))
      }
      
      
    })
    //console.log(frame)

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
    console.log(writeTo)
    f.writeFileSync(writeTo, b)
  // await fs.writeFile(writeTo,
  //   b, function (err, data) {
  //    console.log(data)
  //  })
  //  console.log('done writing ', __dirname + dir + `/${i}myfile.bin`)


}



