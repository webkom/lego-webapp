import { loadableReady } from '@loadable/component';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Root from './Root';
import type { Store } from 'app/store/createStore';

const renderApp = ({
  store,
  isSSR,
}: {
  store: Store;
  isSSR: boolean | undefined;
}) => {
  const rootElement: HTMLElement = document.getElementById('root')!;

  loadableReady(() => {
    const root = <Root store={store} />;

    if (isSSR) {
      hydrateRoot(rootElement, root);
    } else {
      createRoot(rootElement).render(root);
    }
  });
};

export default renderApp;
