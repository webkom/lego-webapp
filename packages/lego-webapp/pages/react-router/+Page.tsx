import { RouterProvider } from 'react-router';
import { usePageContext } from 'vike-react/usePageContext';

export default function Page() {
  const pageContext = usePageContext();
  return <RouterProvider router={pageContext.router} />;
}
