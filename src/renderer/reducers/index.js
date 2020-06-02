import {combineReducers} from 'redux'
import {mainReducer} from './mainReducer.js'
import {navItemReducer} from './navItemReducer.js'


const rootReducer = () => combineReducers({
    main: mainReducer,
    nav: navItemReducer
});

export default rootReducer;
