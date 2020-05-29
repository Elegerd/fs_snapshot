import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectSnapshots } from '../../actions/mainActions.js'
import Table from '../commonComponents/Table.jsx'
import './analysis.scss'


const { myIpcRenderer } = window;

const Analysis = () => {
  const dispatch = useDispatch();
  const { selectedSnapshots, analysis } = useSelector(state => state.main);

  const onClickSelectSnapshots = () => dispatch(selectSnapshots());
  const onClickAnalysis = () => {
    myIpcRenderer.send('APP_SNAPSHOTS_ANALYSIS', selectedSnapshots);
  }

  const renderSelectSnapshots = () => {
    return (
      <div>
        <h2> Select the path to snapshots: </h2>
        <button onClick={_ => onClickSelectSnapshots()}>
          Select snapshots
        </button>
      </div>
    );
  };

  const renderAnalysisButton = () => {
    return (
      <div>
        <button onClick={_ => onClickAnalysis()}>
          Make an analysis
        </button>
      </div>
    );
  };

  const renderSelectedSnapshots = () => {
    return (
      <div className={'selected-snapshots'}>
        <div className={'selected-snapshots__title'}> Snapshots </div>
        <Table objects={selectedSnapshots}/>
        <div className={'selected-snapshots__caption'}>
          Selected snapshots
          {selectedSnapshots.length < 2 && (
            <span className={'selected-snapshots__caption--notice'}>
              (select two snapshots)
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderAnalysis = () => {
    return (
      <>
        {!analysis ? (
          <p> Waiting... </p>
        ) : <>
          {analysis.status === 'done' &&
            <Table objects={analysis.result.map(a => a.comparison)}/>
          }
          {analysis.status === 'error' &&
            <p>An error has occurred!</p>
          }
        </>}
      </>
    );
  };

  return (
    <>
      <h1>Analysis</h1>
      <div className={'analysis'}>
        {renderSelectSnapshots()}
        {Array.isArray(selectedSnapshots) && (
          <>
            {renderSelectedSnapshots()}
            {selectedSnapshots.length > 1 && renderAnalysisButton()}
            {renderAnalysis()}
          </>
        )}
      </div>
    </>
  );
};

export default Analysis;
