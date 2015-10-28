import 'babel/polyfill';
import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-react-router';
import configureStore from './utils/configureStore';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const store = configureStore();

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
);
