import { loadableReady } from '@loadable/component';
import { createRoot, hydrateRoot } from 'react-dom/client';
import routes from 'app/routes';
import Root from './Root';
import type { Store } from 'app/store/createStore';

const renderApp = ({
  store,
  history,
  isSSR,
}: {
  store: Store;
  history: any;
  isSSR: boolean;
}) => {
  const rootElement: HTMLElement = document.getElementById('root');
  loadableReady(() => {
    if (isSSR) {
      hydrateRoot(
        rootElement,
        <Root
          {...{
            store,
            history,
            routes,
          }}
        />,
      );
    } else {
      createRoot(rootElement).render(
        <Root
          {...{
            store,
            history,
            routes,
          }}
        />,
      );
    }
  });
};

export default renderApp;
