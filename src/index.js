import React from 'react';
import ReactDOM from 'react-dom';
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
  faCommentAlt
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

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
