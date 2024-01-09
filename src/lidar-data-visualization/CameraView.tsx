import React, {useState, useEffect, useRef, useReducer} from 'react'


export default function CameraView (props) {
    let content = props.json.images.map((image, idx) => {
        return (<div className="basis-1/6" key={idx}>
        <img height="100px" width="200px"
        key={idx} className="camera-view-image" src={image.image_url} />
        </div>)
    })

    return (
        <div className="absolute left-24 top-0 z-10 w-5/6">
            <div className="flex flex-row">
                {content}
            </div>
    </div>)
};