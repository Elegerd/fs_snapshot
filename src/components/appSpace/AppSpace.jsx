import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setProcessingStatus, setAnalisis  } from '../../actions/mainActions.js'
import { Switch, Route } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar.jsx'
import HomePage from '../homePage/HomePage.jsx'
import Overview from '../overview/Overview.jsx'
import Analysis from '../analysis/Analysis.jsx'
import Setting from '../setting/Setting.jsx'
import './appSpace.scss'


const AppSpace = () => {

  let removeListenerGetHash, removeListenerAnalysis;
  const dispatch = useDispatch();

  useEffect(() => {
    removeListenerGetHash = myIpcRenderer.on('APP_GET_HASH_FILES_REPLY', data => {
      dispatch(setProcessingStatus(data));
    });
    removeListenerAnalysis = myIpcRenderer.on('APP_SNAPSHOTS_ANALYSIS_REPLY', data => {
      dispatch(setAnalisis(data))
    });

    return () => {
      if (typeof removeListenerGetHash !== 'undefined')
        removeListenerGetHash();
      if (typeof removeListenerAnalysis !== 'undefined')
        removeListenerAnalysis();
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
