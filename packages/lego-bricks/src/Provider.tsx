import { RouterProvider } from 'react-aria-components';
import { LocationProvider } from './LocationContext';
import { ThemeContext } from './ThemeContext';
import type { LocationContextType } from './LocationContext';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  theme: 'dark' | 'light';
  navigate: ComponentProps<typeof RouterProvider>['navigate'];
  children: ReactNode;
} & LocationContextType;

export const Provider = ({ theme, navigate, useLocation, children }: Props) => (
  <RouterProvider navigate={navigate}>
    <LocationProvider value={{ navigate, useLocation }}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </LocationProvider>
  </RouterProvider>
);
