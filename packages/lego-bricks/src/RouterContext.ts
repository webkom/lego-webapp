import { type ComponentProps, createContext, useContext } from 'react';
import type { RouterOptions } from '@react-types/shared';
import type { RouterProvider } from 'react-aria-components';

type ReactAriaNavigate = ComponentProps<typeof RouterProvider>['navigate'];
type Navigate = (
  href: string,
  options?: Parameters<ReactAriaNavigate>[1],
) => void;

export type RouterContextData = {
  navigate: Navigate;
  useLocation: <S = unknown>() => {
    pathname: string;
    search: string;
    navigationState?: S;
  };
};

export const RouterContext = createContext<RouterContextData | null>(null);

export const useRouterContext = () => {
  const router = useContext(RouterContext);
  if (!router) {
    return {
      navigate: () => {
        throw new Error(
          'LegoBricksProvider not found. Make sure to wrap your app in <LegoBricksProvider>',
        );
      },
      useLocation: () => ({}),
    } as unknown as RouterContextData;
  }
  return router;
};

export const useNavigate = () => useRouterContext().navigate;
export const useLocation = <S = unknown>() =>
  useRouterContext().useLocation<S>();
export const useClearSearchParams = (options: RouterOptions = {}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    overwriteLastHistoryEntry = true,
    keepScrollPosition = true,
    ...rest
  } = options;
  return () =>
    navigate(pathname, {
      overwriteLastHistoryEntry,
      keepScrollPosition,
      ...rest,
    });
};
