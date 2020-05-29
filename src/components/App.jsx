import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore.js'
import { HashRouter } from 'react-router-dom'
import AppSpace from './appSpace/AppSpace.jsx'


const store = configureStore();

const App = () => {

  return (
    <>
      <Provider store={store}>
        <HashRouter>
          <AppSpace/>
        </HashRouter>
      </Provider>
    </>
  );
};

export default App;
