import React, {useState, useEffect, useRef, useReducer} from 'react'

export default function VideoSeekPlayer(props) {
    let [getTime, setTime] = useState<number>(0)

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