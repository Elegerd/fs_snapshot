import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {selectSnapshots} from '../../actions/mainActions.js'
import Table from '../commonComponents/Table.jsx'
import {setAnalysis, setSnapshots} from '../../actions/mainActions.js'
import './analysis.scss'


const {myIpcRenderer} = window;

const Analysis = () => {
    const dispatch = useDispatch();
    const {selectedSnapshots, analysis} = useSelector(state => state.main);

    const onClickSelectSnapshots = () => dispatch(selectSnapshots());
    const onClickAnalysis = () => myIpcRenderer.send('APP_SNAPSHOTS_ANALYSIS', selectedSnapshots);
    const onClickResetAnalysis = () => {
        dispatch(setAnalysis(null));
        dispatch(setSnapshots(null));
    };
    const onClickResetSnapshots = () => dispatch(setSnapshots(null));


    const renderAnalysisButton = () => {
        if (analysis)
            return null;
        return (
            <div>
                <button onClick={onClickAnalysis}>
                    Make an analysis
                </button>
                <button onClick={onClickResetSnapshots}>
                    Reset snapshots
                </button>
            </div>
        );
    };

    const renderSelectSnapshots = () => {
        return (
            <div>
                {!(Array.isArray(selectedSnapshots) && selectedSnapshots.length >= 2) &&
                <>
                    <h2> Select the path to snapshots: </h2>
                    <button onClick={onClickSelectSnapshots}>
                        Select snapshots
                    </button>
                </>
                }
                {Array.isArray(selectedSnapshots) &&
                <div className={'selected-snapshots'}>
                    <div className={'selected-snapshots__title'}> Snapshot</div>
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
                }
            </div>
        );
    };

    const renderAnalysis = () => {
        return (
            <>
                {analysis &&
                <div className={'analysis__status'}>
                    {(analysis.status === 'beginning' || analysis.status === 'processing') &&
                    <h2>Started the process of comparing snapshots...</h2>
                    }
                    {analysis.status === 'done' &&
                    <>
                        <h2>Done! The path to the file:</h2>
                        <p title={analysis.pathToSave}>{analysis.pathToSave}</p>
                    </>
                    }
                    {analysis.status === 'error' &&
                    <h2>An error has occurred!</h2>
                    }
                    <button className={'analysis__button'} onClick={onClickResetAnalysis}>
                        Reset process
                    </button>
                </div>}
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
                        {(selectedSnapshots.length > 1) && renderAnalysisButton()}
                        {renderAnalysis()}
                    </>
                )}
            </div>
        </>
    );
};

export default Analysis;
