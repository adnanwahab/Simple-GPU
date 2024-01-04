
import { createRoot } from 'react-dom/client'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
let data_url = `https://lidar-now.scale.ai/example_data/pandaset/scene-3/7.json`
let json = await fetch(data_url).then(res => res.json())
const firefliesVertexShader = `uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}`
const firefliesFragmentShader = `void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}`
const canvas = document.createElement('canvas')
//setTimeout(function () { document.querySelector('#root').appendChild(canvas) })
console.log('json!!', json)
const scene = new THREE.Scene()
const firefliesGeometry = new THREE.BufferGeometry()
const point_count = json.points.length;
const positionArray = new Float32Array(point_count * 3)
const scaleArray = new Float32Array(point_count)

for(let i = 0; i < point_count; i++) {
    positionArray[i * 3 + 0] = json.points[i].x
    positionArray[i * 3 + 1] = json.points[i].y
    positionArray[i * 3 + 2] = json.points[i].z

    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
const firefliesMaterial = new THREE.ShaderMaterial({ uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 }
    },
    vertexShader: firefliesVertexShader,
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#333')
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

function main() {
    tick()
    let content = json.images.map((image, idx) => {
        return <img 
        height="100px"
        width="200px"
        
        key={idx} className="camera-view-image" src={image.image_url} />
    })

    //const root = createRoot(document.querySelector('#root'))

    //root.render(content)

    document.querySelector('#root').appendChild(canvas)
    let rootElement = document.querySelector('#root');
    rootElement.style.display = 'flex';
    rootElement.style.justifyContent = 'space-between';
}

export default main