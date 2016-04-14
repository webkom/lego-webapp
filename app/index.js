import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'app/utils/configureStore';
import routes from 'app/routes';

moment.locale('nb-NO');

if (__DEV__) {
  global.log = function log(self = this) {
    console.log(self);
    return this;
  };
}

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider {...{ store }}>
    <Router {...{ history }}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
