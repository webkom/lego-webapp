import { loadableReady } from '@loadable/component';
import { hydrate, render } from 'react-dom';
import routes from 'app/routes';
import type { Store } from 'app/store/createStore';
import Root from './Root';

const renderApp = ({
  store,
  history,
  isSSR,
}: {
  store: Store;
  history: any;
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
