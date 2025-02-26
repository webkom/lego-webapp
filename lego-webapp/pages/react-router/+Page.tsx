import { useState } from 'react';
import { RouterProvider, StaticRouterProvider } from 'react-router';
import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const [router] = useState(pageContext.router);

  return import.meta.env.SSR ? (
    <StaticRouterProvider
      context={pageContext.routerContext!}
      router={router}
    />
  ) : (
    <RouterProvider router={router} />
  );
}
