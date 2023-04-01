const csv = require('csv-parser')
const fs = require('fs')
const results = [];


//tween from center point to current position using vector field 
//theres simulation data 
//data.ra = 
//data.dec =
//data.parallax =  


fs.createReadStream('./gaia.csv')
  .pipe(csv())
  .on('data', (data) => {
    results.push([
        data.ra, 
        data.dec,
        data.parallax,
        data.phot_g_mean_mag,
        data.phot_g_mean_flux,
        data.bp_rp
    ])
    })
  .on('end', () => {
    const resultBuffer = new Float32Array(results.length * 6)
    results.forEach((d, i) => {
        d.forEach((datum, j) => {
            resultBuffer[j] = datum;
        })
    })
    fs.writeFileSync('bye.txt', resultBuffer)
  });