import React from 'react'
import {Line} from 'rc-progress'
import './progressIndicator.scss'


const ProgressIndicator = (props) => {
    const {count, message, counter, counterError} = props.processingStatus;
    const percent = Math.floor(counter / (Math.floor(count * 0.01)));

    return (
        <>
            <div title={message} className={'path_name'}>
                {message}
            </div>
            <Line percent={percent} strokeWidth={3} trailWidth={3} className={'progress-line'}
                  strokeColor={"#334ce7"} trailColor={"#f9f9fb"} strokeLinecap={'square'}/>
            <div className={'progress-status'}>
                <div className={'progress-status__success'}></div>
                <div className={'progress-status__counter'}>{(counter - counterError) || 0}</div>
                <div className={'progress-status__reject'}></div>
                <div className={'progress-status__counter'}>{counterError || 0}</div>
            </div>
        </>
    );
};

export default ProgressIndicator;