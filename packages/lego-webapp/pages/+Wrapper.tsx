import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { usePageContext } from 'vike-react/usePageContext';

export default function StoreProvider({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  return (
    <Provider store={pageContext.store}>
      <HelmetProvider
        context={import.meta.env.SSR ? pageContext.helmetContext : undefined}
      >
        {children}
      </HelmetProvider>
    </Provider>
  );
}
