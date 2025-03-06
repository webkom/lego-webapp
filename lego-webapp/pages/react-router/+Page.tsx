import { useState } from 'react';
import { RouterProvider, StaticRouterProvider } from 'react-router';
import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const [router] = useState(pageContext.router);

  // "Gracefully" fail when client-navigating from migrated route to react-router route
  if (!router) {
    window.location.reload();
    return null;
  }

  return import.meta.env.SSR ? (
    <StaticRouterProvider
      context={pageContext.routerContext!}
      router={router}
    />
  ) : (
    <RouterProvider router={router} />
  );
}
