import { loadableReady } from '@loadable/component';
import { hydrate, render } from 'react-dom';
import Root from './Root';
import routes from 'app/routes';
import { Store } from 'app/store/store';
import type { History } from 'history';

const renderApp = ({
  store,
  history,
  isSSR,
}: {
  store: Store;
  history: History;
  isSSR: boolean;
}) => {
  const rootElement: HTMLElement = document.getElementById('root') as any;
  const reactRenderFunc = isSSR ? hydrate : render;
  loadableReady(() => {
    reactRenderFunc(
      <Root
        {...{
          store,
          history,
          routes,
        }}
      />,
      rootElement
    );
  });
};

export default renderApp;
