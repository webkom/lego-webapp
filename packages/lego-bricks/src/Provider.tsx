import { RouterProvider } from 'react-aria-components';
import { ThemeContext } from './ThemeContext';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  theme: 'dark' | 'light';
  navigate: ComponentProps<typeof RouterProvider>['navigate'];
  children: ReactNode;
};

export const Provider = ({ theme, navigate, children }: Props) => (
  <RouterProvider navigate={navigate}>
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  </RouterProvider>
);
