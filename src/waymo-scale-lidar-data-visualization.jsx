import {useState, useEffect, useRef} from 'react'
import classNames from 'classnames';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import firefliesVertexShader from './fireFliesVertexShader'
import firefliesFragmentShader from './fireFliesFragmentShader'
import './App.css';


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const clock = new THREE.Clock()

let data_url = `https://lidar-now.scale.ai/example_data/pandaset/scene-3/7.json`
let json = await fetch(data_url).then(res => res.json())

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

function ThreeScene(props) {
    const visualizerRef = useRef(null);
    const [jsonData, setJsonData] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            let make_url = (scene_num, frame_num) => 
                `https://raw.githubusercontent.com/adnanwahab/Simple-GPU/adnan/static/scale/scene_${scene_num}/${frame_num}.json`

            let data_url = make_url(props.scene_num, props.frame_num)
            //data_url = `https://raw.githubusercontent.com/adnanwahab/Simple-GPU/adnan/static/scale/scene_1/1.json`
            //let data_url = `https://lidar-now.scale.ai/example_data/pandaset/scene-3/7.json`
            let response = await fetch(data_url)
            console.log('data_url', data_url)
            let json = await response.json()
            setJsonData(json)
            const point_count = json.points.length;
            console.log('pointCount', point_count)
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
        }
    
        fetchData()
    }, [props.scene_num, props.frame_num])

    useEffect(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      visualizerRef.current.appendChild(renderer.domElement);
  
      scene.add(fireflies)

      camera.position.z = 15;
  
      // Animation loop
      const animate = function () {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime()
        firefliesMaterial.uniforms.uTime.value = elapsedTime
        renderer.render(scene, camera);
      };
  
      animate();
  
      // Handle resizing
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
  
      window.addEventListener('resize', handleResize);
  
      // Clean up
      return () => {
        visualizerRef.current.removeChild(renderer.domElement);
        window.removeEventListener('resize', handleResize);
        scene.dispose();
      };
    }, []);

    return <div ref={visualizerRef} />;
  }
  

function CameraView (props) {
    let content = json.images.map((image, idx) => {
        return (<div className="basis-1/6" key={idx}>
        <img height="100px" width="200px"
        key={idx} className="camera-view-image" src={image.image_url} />
        </div>)
    })

    return <div className="flex flex-row">
        {content}
    </div>
}

function VideoSeekPlayer(props) {
    let [getTime, setTime] = useState(0)

    function handleOnMouseMove(e) {
        let percent = e.clientX / e.target.clientWidth
        percent = Math.round(percent * 6) + 1;
        console.log(percent)
        setTime(percent)
        props.onTimeUpdate(percent)
    }

    return (
    
        <>
            <progress 
            
            onMouseMove={(e) => handleOnMouseMove(e)}
            className="progress progress-secondary w-full" value={getTime} max="100" />
        </>
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
    const [frame_num, setFrameNum] = useState(1);

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
                <PlayButton />
                <VideoSeekPlayer onTimeUpdate={(time) => setFrameNum(time)} />
            </div>
            <ThreeScene scene_num={scene_num} frame_num={frame_num}/>
        </>
    );
}

function main() {
    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<MainComponent />);
}
export default main



//window.camera = camera
// window.addEventListener('resize', () => {
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight * .86;
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//     firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
// })
// const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 4
// camera.position.y = 2
// camera.position.z = 4
// scene.add(camera)
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true
// const renderer = new THREE.WebGLRenderer({
//     canvas,
//     antialias: true
// })
// renderer.setSize(sizes.width, sizes.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor('#333')
