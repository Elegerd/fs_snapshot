import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from './reducers'


export default function configureStore() {
  const composeEnhancers = (typeof window !== 'undefined'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancer = composeEnhancers(
    applyMiddleware(thunk),
  );

  const store = createStore(createRootReducer(), enhancer);
  return store;
};
