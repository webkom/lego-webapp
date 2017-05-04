// @flow

import React from 'react';
import { render } from 'react-dom';
import { match } from 'react-router';
import Root from './Root';
import { AppContainer } from 'react-hot-loader';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = (store: Store, history: any) => {
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    render(
      <AppContainer>
        <Root {...{ store, history, routes }} {...renderProps} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
};

export default renderApp;
