import ReactDOM from 'react-dom/client'
const root = ReactDOM.createRoot(document.querySelector('#root'))
import React, { useRef, useEffect, useState} from 'react';
import * as THREE from 'three';
import * as d3 from 'd3'


import {LASWorkerLoader} from '@loaders.gl/las';
import App from './lidar.jsx'


const CameraView = (props) => {
    const [getData, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            // Construct the URL with query parameters
            const queryParams = new URLSearchParams({
                'time': props.time,
                'segment_id': 'segment_id'
            });
            let url = `http://localhost:3000/frameData?${queryParams}`;
            url = `https://raw.githubusercontent.com/adnanwahab/Simple-GPU/master/test_data/100.json`
        
            // Make a GET request
            fetch(url)
                .then(response => response.json())
                .then(data => setData(Object.values(data)))
                .catch(error => console.log('Error:', error));
        };

        // Call the fetchData function
        fetchData();
    }, [props.time]); 

    let imgTags = getData.map((url, index) => {
        return <img key={index} width={'90px'} height='90px' src={`data:image/jpeg;base64,${url}`}/>
    })

    return <>{imgTags}<div>wow cool</div></>
}

const ThreeComponent = (props) => {
    const canvasRef = useRef();
    const [getPointCloud, setPointCloud] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            // Construct the URL with query parameters
            const queryParams = new URLSearchParams({
                'time': props.time,
                'segment_id': 'segment_id'
            });
            let url = `http://localhost:3000/frameData?${queryParams}`;
            url = `https://raw.githubusercontent.com/adnanwahab/Simple-GPU/master/test_data/15X0DAhrkKITYGr5FzGLEHrq0DXBk3AR-315966479660007000.csv`
        
            // Make a GET request
            const data = await d3.dsv(",", "https://raw.githubusercontent.com/adnanwahab/Simple-GPU/master/test_data/15X0DAhrkKITYGr5FzGLEHrq0DXBk3AR-315966479660007000.csv");
            setPointCloud(data)
            //console.log('pointcloud', data)
        };

        // Call the fetchData function
        fetchData();
    }, [props.time]); 



    useEffect(() => {
        // Initialize the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 2000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight * .9);
        canvasRef.current.appendChild(renderer.domElement);
        canvasRef.current.style.pointerEvents = 'none'
        // Add your Three.js objects here
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;
        camera.position.y = -2.5;
        camera.position.x = 2.9;
        //canvasRef.current.style.opacity = .1
        // Animation loop
        const animate = () => {
            if (getPointCloud) {
                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                for (let i = 0; i < getPointCloud.length; i++) {
                    let point = getPointCloud[i]
                    const x = point.x
                    const y = point.y
                    const z = point.z
                    vertices.push(x, y, z);
                }
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

                // Material for Points
                const material = new THREE.PointsMaterial({ color: 0xff0000, size: 100.5 });

                // Creating the Point Cloud
                const pointCloud = new THREE.Points(geometry, material);
                scene.add(pointCloud);
            }            
            requestAnimationFrame(animate);

            // Update your scene here
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight * .5);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            canvasRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={canvasRef}></div>;
};

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


function VideoSeekPlayer(props) {
    let [getTime, setTime ] = React.useState(50)
    function handleOnMouseMove(e) {
        let percent = e.clientX / 628
        setTime(percent * 100)
    }
    useEffect(() => {
        // Set up the interval
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1); // Increment the time
        }, 5000); // 1000 milliseconds = 1 second

        // Clear the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, []);



    return <div className='mt-48'>
    <CameraView time={getTime}></CameraView>
    <ThreeComponent time={getTime}/>
    <div><PlayButton></PlayButton></div>
    <div 
    onMouseMove = {(e) => handleOnMouseMove(e)}
    style={{width: `${getTime}%`}} aria-valuemax="100" aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" className="relative h-2 overflow-hidden rounded-full bg-primary/20 w-[100%] pointer-cursor">
        <div 
        
        
        data-state="indeterminate" data-max="100" className="cursor-pointer h-full w-full flex-1 bg-primary transition-all bg-pink-500" style={{transform: `translateX(-34%)`}}>
        </div>
    </div>
</div>
}

function main() {
    console.log('hello kodiak')
    return root.render(<>
        <div className="">
            <App></App>
            {/* <div>Hello Kodiak!</div>
            <VideoSeekPlayer></VideoSeekPlayer> */}
        </div>
        </>
    )
}


export default main