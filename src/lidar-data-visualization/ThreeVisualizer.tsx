import React, {useState, useEffect, useRef, useReducer} from 'react'
import * as THREE from 'three'
import firefliesVertexShader from './fireFliesVertexShader'
import firefliesFragmentShader from './fireFliesFragmentShader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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


type ThreeVisualizerProps = {
  scene_num: number;
  frame_num: number;
}

export default function ThreeVisualizer(props:ThreeVisualizerProps) {
    const visualizerRef = useRef(null);
    
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
            //console.log(typedArray)
            //console.log(typedArray.length);
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