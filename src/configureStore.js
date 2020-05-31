import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from './reducers'


export default function configureStore() {
    const composeEnhancers = (typeof window !== 'undefined'
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

    const enhancer = composeEnhancers(
        applyMiddleware(thunk),
    );

    return createStore(createRootReducer(), enhancer);
};
