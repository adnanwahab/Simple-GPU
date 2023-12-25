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
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        // Add your Three.js objects here
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

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
            renderer.setSize(window.innerWidth, window.innerHeight);
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

function main() {
    console.log('hello kodiak')
    return root.render(<>
        <div className="App">
            <div>Hello Kodiak</div>
            <ThreeComponent />
        </div>
        </>
    )
}


export default main