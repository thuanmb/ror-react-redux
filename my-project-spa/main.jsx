/* eslint-disable global-require */
// Runtime polyfill for ES2015
import 'babel-polyfill';

import FastClick from 'fastclick';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import store from 'CorePath/store';

const render = () => {
  const Root = require('./root').default;
  ReactDOM.render(<AppContainer><Root store={store} /></AppContainer>, document.getElementById('my-project-container'));
};

render();


// Eliminates the 300ms delay between a physical tap
// and the firing of a click event on mobile browsers
// https://github.com/ftlabs/fastclick

FastClick.attach(document.body);

// Module hot reload
if (module.hot) {
  module.hot.accept('./root', render);
}
