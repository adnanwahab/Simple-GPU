const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { tableFromIPC } = require('apache-arrow');
const util = require('util');
const glob = require('glob');
const fs = require('fs');

const port = 3000;

app.use(bodyParser.json());



async function readFeatherFile(filePath) {
    const table = tableFromIPC([
        filePath,
    ].map((file) => fs.readFileSync(file)));
    return table
}

async function getImages() {
    try {
        let path = '/home/adnan/argo/converted/'
        let frame_num = Math.floor(Math.random() * 100)
        //console.log(frame_num)
        let pathName = `${path}${frame_num}.json`
        const files = JSON.parse(fs.readFileSync(pathName))
        //console.log(typeof files)
        //console.log(Object.values(files))
        return files
      } catch (err) {
        console.error(err);
      }
}




app.get('/frameData', async(req, res) => {
    //console.log(req.params)
    //console.log(req.query)
    //let frameData = await readFeatherFile('/media/adnan/DATA Drive/argo/test/4a78c5db-041b-347b-9821-ceb82f99e3f8/sensors/lidar/315974320759722000.feather');
    let path = '/home/adnan/argo/converted'
    let frameData = fs.readFileSync(`${path}/15X0DAhrkKITYGr5FzGLEHrq0DXBk3AR-315966491359660000.csv`, 'utf8');
    let images = getImages()
    console.log(Object.keys(images).length)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        //'frameData': frameData, //this is a typed array
        'images': ['hi', 'how', 'are', 'you'], //this is an array of base64 encoded images
    }))
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
