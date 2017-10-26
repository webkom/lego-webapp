// @flow

import React from 'react';
// $FlowFixMe hydrate() is missing in flow-typed react-dom
import { hydrate } from 'react-dom';
import { match } from 'react-router';
import cookie from 'js-cookie';
import Root from './Root';
import { AppContainer } from 'react-hot-loader';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = (store: Store, history: any) => {
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    const rootElement: HTMLElement = (document.getElementById('root'): any);
    hydrate(
      <AppContainer>
        <Root
          getCookie={cookie.get}
          {...{ store, history, routes }}
          {...renderProps}
        />
      </AppContainer>,
      rootElement
    );
  });
};

export default renderApp;
