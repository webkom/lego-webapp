import { createContext, useEffect } from 'react';
import { setTheme } from 'app/reducers/theme';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

export const applySelectedTheme = (theme) => {
  if (__CLIENT__) {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'auto' ? getOSTheme() : theme
    );
    window.dispatchEvent(new Event('themeChange'));
  }
};

export const getTheme = (): 'dark' | 'light' =>
  __CLIENT__ && document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';

export const ThemeContextListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleThemeChange = () => dispatch(setTheme(getTheme()));

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, [dispatch]);

  return <></>;
};

export const useTheme = () => {
  return useAppSelector((state) => state.theme.theme);
};

export const getFancyNodeColor = (theme: 'dark' | 'light') => {
  return theme === 'light' ? 'rgba(0,0,0, 0.3)' : 'rgba(255,255,255, 0.5)';
};

export const getOSTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};
