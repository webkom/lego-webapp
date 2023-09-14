import { loadableReady } from '@loadable/component';
import { createRoot, hydrateRoot } from 'react-dom/client';
import routes from 'app/routes';
import Root from './Root';
import type { StoreWithHistory } from 'app/store/createStore';

const renderApp = ({
  store,
  connectedHistory,
  isSSR,
}: StoreWithHistory & { isSSR: boolean | undefined }) => {
  const rootElement: HTMLElement = document.getElementById('root')!;

  loadableReady(() => {
    if (isSSR) {
      hydrateRoot(
        rootElement,
        <Root
          {...{
            store,
            connectedHistory,
            routes,
          }}
        />
      );
    } else {
      createRoot(rootElement).render(
        <Root
          {...{
            store,
            connectedHistory,
            routes,
          }}
        />
      );
    }
  });
};

export default renderApp;
