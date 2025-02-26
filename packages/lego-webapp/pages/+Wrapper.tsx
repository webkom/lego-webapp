import { PropsWithChildren, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { usePageContext } from 'vike-react/usePageContext';
import { ThemeContextListener } from 'app/utils/themeUtils';

export default function StoreProvider({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  const [store] = useState(pageContext.store);

  return (
    <Provider store={store}>
      <HelmetProvider
        context={import.meta.env.SSR ? pageContext.helmetContext : undefined}
      >
        <ThemeContextListener />
        {children}
      </HelmetProvider>
    </Provider>
  );
}
