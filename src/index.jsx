import './index.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App.jsx'


ReactDOM.render(<App/>, document.getElementById('root'));
console.log('👋 This message is being logged by "index.jsx", included via webpack');
