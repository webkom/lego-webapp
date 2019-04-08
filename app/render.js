// @flow

import React from 'react';
// $FlowFixMe hydrate() is missing in flow-typed react-dom
import { hydrate, render } from 'react-dom';
import Root from './Root';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = (store: Store, history: any, isSSR: boolean) => {
  const rootElement: HTMLElement = (document.getElementById('root'): any);
  const reactRenderFunc = isSSR ? hydrate : render;
  reactRenderFunc(
    <AppContainer>
      <Root {...{ store, history, routes }} />
    </AppContainer>,
    rootElement
  );
};

export default renderApp;
