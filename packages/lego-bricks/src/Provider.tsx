import { RouterProvider } from 'react-aria-components';
import { RouterContext } from './RouterContext';
import { ThemeContext } from './ThemeContext';
import type { RouterContextData } from './RouterContext';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  theme: 'dark' | 'light';
  navigate: ComponentProps<typeof RouterProvider>['navigate'];
  useLocation: RouterContextData['useLocation'];
  children: ReactNode;
};

export const Provider = ({ theme, navigate, useLocation, children }: Props) => (
  <RouterProvider navigate={navigate}>
    <RouterContext.Provider value={{ navigate, useLocation }}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </RouterContext.Provider>
  </RouterProvider>
);
