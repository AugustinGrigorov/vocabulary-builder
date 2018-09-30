import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

import App from './App';

import './index.css';

const reduxDevtoolsExtensionHook = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const composeEnhancers = window[reduxDevtoolsExtensionHook] || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
