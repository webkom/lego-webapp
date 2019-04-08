// @flow

import React from 'react';
// $FlowFixMe hydrate() is missing in flow-typed react-dom
import { hydrate } from 'react-dom';
import Root from './Root';
import { AppContainer } from 'react-hot-loader';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = (store: Store, history: any) => {
  const rootElement: HTMLElement = (document.getElementById('root'): any);
  hydrate(
    <AppContainer>
      <Root {...{ store, history, routes }} />
    </AppContainer>,
    rootElement
  );
};

export default renderApp;
