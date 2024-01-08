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
            data_url = `https://github.com/adnanwahab/Simple-GPU/raw/adnan/static/scale/scene_8/typedArrayFile.bin`
            const response = await fetch(`https://simple-gpu.surge.sh/scale/scene_${props.scene_num}/2.bin`);

            if (! response.ok) return console.error('that shouldnt happen..')
            const arrayBuffer = await response.arrayBuffer();
            const typedArray = new Float32Array(arrayBuffer);
            console.log(typedArray)
            console.log(typedArray.length);
            for(let i = 0; i < typedArray.length; i += 5) {
                positionArray[i * 5 + 0] = typedArray[i]
                positionArray[i * 5 + 1] = typedArray[i + 1]
                positionArray[i * 5 + 2] = typedArray[i + 2]

                //scaleArray[i] = typedArray[i + 3] * .01
                scaleArray[i] = 1
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
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true

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

    return (
        <div className="absolute left-24 top-0 z-10">
        <div className="flex flex-row">
            {content}
        </div>
    </div>)
}

function VideoSeekPlayer(props) {
    let [getTime, setTime] = useState(0)

    function handleOnMouseMove(e) {
        const element = e.target;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const width = rect.right - rect.left;
        const percent = (x / width) * 100;
        const roundedPercent = Math.round(percent / 100 * 7);
        setTime(roundedPercent)
        props.onTimeUpdate(roundedPercent)
    }

    return (
        <>
            <div 
            onMouseMove={(e) => handleOnMouseMove(e)}
            className="absolute left-24 top-28 z-10 bg-gray-500">
                <PlayButton />
                <div className="inline">frame #{getTime} - hover to change frame</div>
                <progress 
                className="block progress progress-secondary w-96" value={getTime} max="7" />
            </div>

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
        className="cursor-pointer inline"
        {...props}
    >
        <path d="M8 5v14l11-7-11-7z" fill="pink"/>
    </svg>
);

function SceneListView(props) {
    let {scene_num} = props;
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
    </ul>);

    return (<div className="absolute left-0 top-0 z-10">
        {listView}
    </div>);
}

function MainComponent() {
    const [scene_num, setSceneNum] = useState(1);
    const [frame_num, setFrameNum] = useState(1);

    useEffect(() => {
        console.log('scene Num changes!', scene_num + 1);
    }, [scene_num]);

    return (
        <>
            <SceneListView></SceneListView>
            <CameraView />
            <VideoSeekPlayer onTimeUpdate={(time) => setFrameNum(time)} />
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
