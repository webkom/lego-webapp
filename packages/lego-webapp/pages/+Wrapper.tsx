import { PropsWithChildren, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { usePageContext } from 'vike-react/usePageContext';

export default function StoreProvider({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  const [store] = useState(pageContext.store);

  return (
    <Provider store={store}>
      <HelmetProvider
        context={import.meta.env.SSR ? pageContext.helmetContext : undefined}
      >
        {children}
      </HelmetProvider>
    </Provider>
  );
}
