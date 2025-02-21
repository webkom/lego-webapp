import { useState } from 'react';
import { RouterProvider } from 'react-router';
import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  const [router] = useState(pageContext.router);

  return <RouterProvider router={router} />;
}
