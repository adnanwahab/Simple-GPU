//https://scale.com/open-av-datasets/pandaset

import {useState, useEffect} from 'react'
import classNames from 'classnames';

import { createRoot } from 'react-dom/client';

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
    sizes.height = window.innerHeight * .86;
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

function CameraView () {
    let content = json.images.map((image, idx) => {
        return (<div className="basis-1/6">
        <img height="100px" width="200px"
        key={idx} className="camera-view-image" src={image.image_url} />
        </div>)
    })

    return <div className="flex flex-row">
        {content}
    </div>
}

function VideoSeekPlayer() {
    let [getTime, setTime] = useState(0)

    function handleOnMouseMove(e) {
        let percent = e.clientX / 628
        setTime(percent * 100)
    }

    return (<div className="relative h-2 overflow-hidden rounded-full bg-red-500 w-full pointer-cursor"
                onMouseMove = {(e) => handleOnMouseMove(e)}
                aria-valuemax="100" aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" >
            <div 
            // style={{width: `${getTime}%`}} 
            data-state="indeterminate" data-max="100" className="cursor-pointer h-full w-full flex-1 bg-primary transition-all bg-pink-500" style={{transform: `translateX(-34%)`}}>
            </div>
        </div>
    )
}

const PlayButton = ({ size = 24, color = 'pink', ...props }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill='aliceblue' 
        xmlns="http://www.w3.org/2000/svg" 
        className="cursor-pointer"
        {...props}
    >
        <path d="M8 5v14l11-7-11-7z" fill="pink"/>
    </svg>
);

function MainComponent() {
    const [scene_num, setSceneNum] = useState(1);

    useEffect(() => {
        console.log('scene Num changes!', scene_num + 1);
    }, [scene_num]);

    let scenes = Array.from({length: 8}, (_, i) => `Scene_${i+1}`)

    
    let listView = (<ul className='border border-blue-500'>
        {scenes.map((scene, idx) => {
        let isActive = scene_num === idx;
        const sceneItemClasses = classNames({
            'bg-pink-500': isActive,
            'p-2 border border-blue-500 hover:bg-pink-500': true, 
            });

            return <li 
            onClick={() => setSceneNum(idx)}
            className={sceneItemClasses} key={idx}>
                {scene}
            </li>
        })}
    </ul>)

    return (
        <>
            <div className="absolute left-0 top-0 z-10">
                {listView}
            </div>
            <div className="absolute left-24 top-0 z-10">
                <CameraView />
            </div>
            <div className="absolute left-24 top-28 z-10 w-full bg-gray-500">
                <span className="pb-5 hidden">Hello Tesla!!</span>
                <PlayButton />
                <VideoSeekPlayer />
            </div>
        </>
    );
}

function main() {
    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<MainComponent />);
    document.body.appendChild(canvas)
    tick()
}

export default main


