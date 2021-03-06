import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../data/rootReducer.js";
import apiMiddleware from '../data/middleware/api.middleware'
const isReduxDevToolsSupported = () => !!window.__REDUX_DEVTOOLS_EXTENSION__;
const MIDDLEWARES = [thunk, apiMiddleware];

const configureStore = (initialState = {}) => {
  return createStore(
    rootReducer,
    initialState,
    isReduxDevToolsSupported()
      ? compose(
        applyMiddleware(...MIDDLEWARES),
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )
      : applyMiddleware(...MIDDLEWARES)
  );
};

export default configureStore;