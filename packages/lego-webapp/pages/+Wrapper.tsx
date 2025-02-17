import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { usePageContext } from 'vike-react/usePageContext';

export default function StoreProvider({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  return <Provider store={pageContext.store}>{children}</Provider>;
}
