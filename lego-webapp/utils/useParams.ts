import { usePageContext } from 'vike-react/usePageContext';

export const useParams = <T = Record<string, string>>() => {
  const { routeParams } = usePageContext();
  return routeParams as T;
};
