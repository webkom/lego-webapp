import { usePageContext } from 'vike-react/usePageContext';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

export default function StoreProvider({ children }: PropsWithChildren) {
  const pageContext = usePageContext();
  return <Provider store={pageContext.store}>{children}</Provider>;
}
