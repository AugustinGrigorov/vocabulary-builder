import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretDown,
  faMinusSquare,
  faTrophy,
  faSpinner,
  faExclamationTriangle,
  faSearch,
  faPlusCircle,
  faPenSquare,
  faTimesCircle,
  faCommentAlt,
} from '@fortawesome/free-solid-svg-icons';

import rootReducer from './reducers';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.css';

library.add(
  faCaretDown,
  faMinusSquare,
  faTrophy,
  faSpinner,
  faExclamationTriangle,
  faSearch,
  faPlusCircle,
  faPenSquare,
  faTimesCircle,
  faCommentAlt,
);

const reduxDevtoolsExtensionHook = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const composeEnhancers = window[reduxDevtoolsExtensionHook] || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ),
);

if (window.Cypress) {
  window.store = store;
}

if (window.location.hostname === 'vocabularybuilder.online') {
  Sentry.init({ dsn: 'https://b99e1867e4ee4002b9bb2b047d2f1080@sentry.io/2851266' });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
