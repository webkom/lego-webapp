import 'babel-polyfill';
import React from 'react';
import moment from 'moment';
import { render } from 'react-dom';
import { browserHistory, match } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'app/utils/configureStore';
import Root from './Root';
import routes from 'app/routes';

moment.locale('nb-NO');

global.log = function log(self = this) {
  console.log(self);
  return this;
};

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = configureStore(preloadedState);
const history = syncHistoryWithStore(browserHistory, store);

const rootElement = document.getElementById('root');

const renderApp = () => (
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
      <AppContainer>
        <Root {...{ store, history, routes }} {...renderProps} />
      </AppContainer>,
      rootElement
    );
  })
);

if (module.hot) {
  module.hot.accept('./Root', () => {
    renderApp();
  });
}

renderApp();
