import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setProcessingStatus, setAnalysis} from '../../actions/mainActions.js'
import {Switch, Route} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar.jsx'
import HomePage from '../homePage/HomePage.jsx'
import Overview from '../overview/Overview.jsx'
import Analysis from '../analysis/Analysis.jsx'
import Setting from '../setting/Setting.jsx'
import './appSpace.scss'
import {setSetting} from "../../actions/mainActions";


const {myIpcRenderer} = window;
const AppSpace = () => {

    let removeListenerGetHash, removeListenerAnalysis, removeListenerSetting;
    const dispatch = useDispatch();

    useEffect(() => {
        removeListenerGetHash = myIpcRenderer.on('APP_GET_HASH_FILES_REPLY', data => {
            dispatch(setProcessingStatus(data));
        });
        removeListenerAnalysis = myIpcRenderer.on('APP_SNAPSHOTS_ANALYSIS_REPLY', data => {
            dispatch(setAnalysis(data));
        });
        removeListenerSetting = myIpcRenderer.on('APP_SETTING_REPLY', data => {
            dispatch(setSetting(data));
        });
        myIpcRenderer.send('APP_SETTING');
        return () => {
            if (typeof removeListenerGetHash !== 'undefined')
                removeListenerGetHash();
            if (typeof removeListenerAnalysis !== 'undefined')
                removeListenerAnalysis();
            if (typeof removeListenerSetting !== 'undefined')
                removeListenerSetting();
        }
    }, []);

    return (
        <>
            <Sidebar/>
            <main>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route path='/overview' component={Overview}/>
                    <Route path='/analysis' component={Analysis}/>
                    <Route path='/setting' component={Setting}/>
                </Switch>
            </main>
        </>
    );
};

export default AppSpace;
