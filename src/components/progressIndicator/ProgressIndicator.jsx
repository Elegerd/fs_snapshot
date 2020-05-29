import React, { useState, useEffect } from 'react'
import { Line } from 'rc-progress'
import './progressIndicator.scss'


const ProgressIndicator = (props) => {
  const { count, counter, counterError, currentFile, status } = props.processingStatus;

  const percent = Math.floor(counter / (Math.floor(count * 0.01)));
  let title;
  if (status === 'done')
    title = "Done!";
  else if (status === 'saving')
    title = "Saving is in progress..."
  else if (status === 'beginning')
    title = "Process start...";
  else if (status === 'waiting')
    title = "Waiting..."
  else if (status === 'error')
    title = "Something went wrong..."
  else
    title = currentFile;

  return (
    <>
      <div title={title} className={'path_name'}>
        {title}
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
