// @flow

import React from 'react';
// $FlowFixMe hydrate() is missing in flow-typed react-dom
import { hydrate, render } from 'react-dom';
import { match } from 'react-router';
import Root from './Root';
import routes from 'app/routes';
import type { Store } from 'app/types';

const renderApp = (store: Store, history: any) => {
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    const rootElement: HTMLElement = (document.getElementById('root'): any);
    const reactRenderFunc = isSSR ? hydrate : render;
    reactRenderFunc(
      <Root {...{ store, history, routes }} {...renderProps} />,
      rootElement
    );
  });
};

export default renderApp;
