import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {selectSnapshots} from '../../actions/mainActions.js'
import Table from '../commonComponents/Table.jsx'
import {setAnalysis} from "../../actions/mainActions"
import './analysis.scss'


const {myIpcRenderer} = window;

const Analysis = () => {
    const dispatch = useDispatch();
    const {selectedSnapshots, analysis} = useSelector(state => state.main);

    const onClickSelectSnapshots = () => dispatch(selectSnapshots());
    const onClickAnalysis = () => {
        myIpcRenderer.send('APP_SNAPSHOTS_ANALYSIS', selectedSnapshots);
    }
    const resetAnalysis = () => dispatch(setAnalysis(null));

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
        if (analysis)
            return null;
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
                <div className={'selected-snapshots__title'}> Snapshots</div>
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
                {analysis &&
                <div>
                    {(analysis.status === 'beginning' || analysis.status === 'processing') &&
                    <p>Started the process of comparing snapshots...</p>
                    }
                    {analysis.status === 'done' &&
                    <>
                        <p>Done! The path to the file:</p>
                        <p title={analysis.pathToSave}>{analysis.pathToSave}</p>
                    </>
                    }
                    {analysis.status === 'error' &&
                    <p>An error has occurred!</p>
                    }
                    <button onClick={_ => resetAnalysis()}>
                        Reset directories
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
                        {renderSelectedSnapshots()}
                        {(selectedSnapshots.length > 1) && renderAnalysisButton()}
                        {renderAnalysis()}
                    </>
                )}
            </div>
        </>
    );
};

export default Analysis;
