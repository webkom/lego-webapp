// @flow

import React from 'react';
// $FlowFixMe hydrate() is missing in flow-typed react-dom
import { hydrate, render } from 'react-dom';
import Root from './Root';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = ({
  store,
  history,
  isSSR
}: {
  store: Store,
  history: any,
  isSSR: boolean
}) => {
  const rootElement: HTMLElement = (document.getElementById('root'): any);
  const reactRenderFunc = isSSR ? hydrate : render;
  reactRenderFunc(<Root {...{ store, history, routes }} />, rootElement);
};

export default renderApp;
