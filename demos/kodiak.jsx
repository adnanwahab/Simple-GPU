import ReactDOM from 'react-dom/client'
const root = ReactDOM.createRoot(document.querySelector('#root'))
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeComponent = () => {
    const canvasRef = useRef();

    useEffect(() => {
        // Initialize the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
        canvasRef.current.style.opacity = .1


        // Animation loop
        const animate = () => {
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
        }, 1000); // 1000 milliseconds = 1 second

        // Clear the interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, []);



    return <div>
    {props.children}
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
            <div>Hello Kodiak!</div>
            <VideoSeekPlayer>
                <ThreeComponent />
            </VideoSeekPlayer>
        </div>
        </>
    )
}


export default main