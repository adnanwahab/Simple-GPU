import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const root = `/Users/adnanwahab/Documents/GitHub/simple-webgpu`
const ROOT_DIR = path.join(root)
const DIST_DIR = path.join(ROOT_DIR, 'dist')
const DEMO_DIR = path.join(ROOT_DIR, 'src/demos')

const htmlTemplate = (name) => 
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${name} : Simple-GpU</title>
  </head>
  <body>
    <div style="position:absolute;left:0;top:0;margin:0;padding-left:0;padding-right:0;padding-top:10px;padding-bottom:10px;text-align:center;width:100%;z-index:10;background-color:rgba(255,255,255,0.5);font-weight:bold;">
      <a href="https://github.com/stackgpu/simple-webgpu/tree/master/src/demos/${name}.js">${name}.ts</a>
    </div>
    <script src="${name}.js"></script>
  </body>
</html>
`

async function main () {
  // initialize www dir
  try {
    await fs.mkdir(DIST_DIR, {
      recursive: true
    })
  } catch {}
  // write all the files to the destination dir
  const fileList = []
  for (const file of await fs.readdir(DEMO_DIR)) {
    const basename = path.basename(file, '.js')
    await fs.writeFile(
      path.join(DIST_DIR, `${basename}.html`),
      htmlTemplate(basename)
    )
    fileList.push(`${basename}.html`)
  }
  // write index file
  await fs.writeFile(
    path.join(DIST_DIR, `index.html`),
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adnan's WebGPU experiments</title>
  </head>
  <body>
    <ul>
      ${fileList.map((p) => `<li><a href="${p}">${p}</a></li>`).join('\n')}
    </ul>
  </body>
</html>
`

  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
