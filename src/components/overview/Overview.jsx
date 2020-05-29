import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectDirectories, setDirectories, setProcessingStatus } from '../../actions/mainActions.js'
import ProgressIndicator from '../progressIndicator/ProgressIndicator.jsx'
import Table from '../commonComponents/Table.jsx'
import './overview.scss'


const { myIpcRenderer } = window;

const Overview = () => {
  const dispatch = useDispatch();
  const { selectedDirectories, processingStatus } = useSelector(state => state.main);

  const onClickSelectDirectories = () => dispatch(selectDirectories());
  const getSnaphot = () => {
    dispatch(setProcessingStatus({ status: 'waiting' }));
    myIpcRenderer.send('APP_GET_HASH_FILES', selectedDirectories);
  }
  const resetDir = () => dispatch(setDirectories(null));
  const processCancle = () => {};
  const resetStates = () => {
    dispatch(setDirectories(null));
    dispatch(setProcessingStatus(null));
  };

  const renderSelect = () => {
    return (
      <div>
        <h2> Select the path to the directories: </h2>
        <button className={'overview__button'} onClick={_ => onClickSelectDirectories()}>
          Select directories
        </button>
      </div>
    );
  };

  const renderGetSnapshot = () => {
    return (
      <div className={'overview_container'}>
        <button className={'overview__button'} onClick={_ => getSnaphot()}>
          Get snapshot
        </button>
        <button className={'overview__button'} onClick={_ => resetDir()}>
          Reset directories
        </button>
      </div>
    );
  }

  const renderTable = () => {
    return (
      <div className={'dir-table'}>
        <div className={'dir-table__title'}> Directory </div>
        <Table objects={selectedDirectories}/>
        <div className={'dir-table__caption'}> Selected directories </div>
      </div>
    );
  };

  const renderProcessing = () => {
    return (
      <div className={'process_container'}>
        <ProgressIndicator processingStatus={processingStatus}/>
        {(processingStatus.status === 'done' || processingStatus.status === 'error') &&
          <button className={'overview__button'} onClick={_ => resetStates()}>
            Reset process
          </button>
        }
      </div>
    );
  };

  return (
    <>
      <h1>Overview</h1>
      <div className={'overview'}>
        {(Array.isArray(selectedDirectories) && selectedDirectories.length > 0) ?
          <>
            {renderTable()}
            {processingStatus ?
              renderProcessing() : renderGetSnapshot()
            }
          </> :
          renderSelect()
        }
      </div>
    </>
  );
};

export default Overview;
