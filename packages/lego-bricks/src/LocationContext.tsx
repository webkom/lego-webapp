import { type ComponentProps, createContext, useContext } from 'react';
import type { RouterProvider } from 'react-aria-components';

export interface LocationContextType {
  navigate: ComponentProps<typeof RouterProvider>['navigate'];
  useLocation: () => { pathname: string; search: string };
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider = LocationContext.Provider;

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a lego-bricks Provider');
  }
  return context.useLocation();
};

export const useNavigate = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a lego-bricks Provider');
  }
  return context.navigate;
};
