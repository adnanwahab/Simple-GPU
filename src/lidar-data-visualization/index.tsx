import React, {useState, useEffect, useRef, useReducer} from 'react'
import { createRoot } from 'react-dom/client';

import './App.css';
import SceneListView from './SceneListView'
import CameraView from './CameraView'
import VideoSeekPlayer from './VideoSeekPlayer'
import ThreeVisualizer from './ThreeVisualizer'

type DeviceGpsPose = {
    lat: number;
    lon: number;
  };
  
  type DevicePosition = {
    x: number;
    y: number;
    z: number;
  };
  
  type DeviceHeading = {
    w: number;
    x: number;
    y: number;
    z: number;
  };
  
  type CameraImage = {
    fx: number;
    fy: number;
    cx: number;
    cy: number;
    position: DevicePosition;
    heading: DeviceHeading;
    image_url: string;
  };
  
  type SceneData = {
    device_gps_pose: DeviceGpsPose;
    device_position: DevicePosition;
    device_heading: DeviceHeading;
    images: CameraImage[];
    timestamp: number;
  };

let data_url = `https://lidar-now.scale.ai/example_data/pandaset/scene-3/7.json`
let json = await fetch(data_url).then(res => res.json())
let sceneData: SceneData = json;
console.log(sceneData)

type InitialState = {
    count: number;
    draftCount: string | number
}

const initialState: InitialState = {
    count: 0,
    draftCount: 0
}

const action = {
    type: 'increment',
    payload: 1
}

const reducer2 = (state = initialState, action: any) => {
    const {count, draftCount} = state;

    if (action.type === 'increment') {
        return {count: count + 1, draftCount: draftCount}
    }

}

type Action = {
    type: 'increment' | 'decrement' | 'reset'
}

type ReducerState = ReturnType<typeof reducer>

const reducer = (count: number, newValue: number): number => {
    return newValue
}


function MainComponent() {
    const [count, dispatch] = useReducer(reducer, 0)

    const [scene_num, setSceneNum] = useState<number>(1);
    const [frame_num, setFrameNum] = useState<number>(1);

    useEffect(() => {
        console.log('scene Num changes!', scene_num + 1);
    }, [scene_num]);

    return (
        <>
            <SceneListView scene_num={scene_num} setSceneNum={setSceneNum}></SceneListView>
            <CameraView json={json}/>
            <VideoSeekPlayer onTimeUpdate={(time) => setFrameNum(time)} />
            <ThreeVisualizer scene_num={scene_num} frame_num={frame_num}/>
        </>
    );
}

function main() {
    const domNode = document.getElementById('root');
    const root = createRoot(domNode);
    root.render(<MainComponent />);
}
export default main
