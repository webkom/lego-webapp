// @flow

import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';

import routes from 'app/routes';
import type { Store } from 'app/types';
import Root from './Root';

const renderApp = ({
  store,
  history,
  isSSR,
}: {
  store: Store,
  history: any,
  isSSR: boolean,
}) => {
  const rootElement: HTMLElement = (document.getElementById('root'): any);
  const reactRenderFunc = isSSR ? hydrate : render;
  loadableReady(() => {
    reactRenderFunc(<Root {...{ store, history, routes }} />, rootElement);
  });
};

export default renderApp;
