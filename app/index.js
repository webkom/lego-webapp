import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'app/utils/configureStore';
import Root from './Root';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const rootElement = document.getElementById('root');

render(
  <AppContainer>
    <Root {...{ store, history }} />
  </AppContainer>,
  rootElement
);

if (module.hot) {
  module.hot.accept('./Root', () => {
    render(
      <AppContainer>
        <Root {...{ store, history }} />
      </AppContainer>,
      rootElement
    );
  });
}
