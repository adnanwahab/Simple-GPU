import classNames from 'classnames';
import React from 'react';

export default function SceneListView(props) {
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
            onClick={() => props.setSceneNum(idx)}
            className={sceneItemClasses} key={idx}>
                {scene}
            </li>
        })}
    </ul>);

    return (<div className="absolute left-0 top-0 z-10">
        {listView}
    </div>);
}