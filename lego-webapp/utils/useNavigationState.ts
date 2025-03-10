import { usePageContext } from 'vike-react/usePageContext';

export const useNavigationState = <T = unknown>() => {
  const pageContext = usePageContext();
  if ('navigationState' in pageContext) {
    return pageContext.navigationState as T;
  }
  return undefined;
};
