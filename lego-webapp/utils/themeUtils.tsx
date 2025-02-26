import { createContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { setTheme } from '~/redux/slices/theme';

export const applySelectedTheme = (theme: 'light' | 'dark' | 'auto') => {
  if (!import.meta.env.SSR) {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'auto' ? getOSTheme() : theme,
    );
    window.dispatchEvent(new Event('themeChange'));
    localStorage.setItem('theme', theme);
  }
};

export const getTheme = (): 'dark' | 'light' =>
  !import.meta.env.SSR &&
  document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';

export const ThemeContext = createContext<'dark' | 'light'>(getTheme());

export const ThemeContextListener = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Configure listener to synchronize state
    const handleThemeChange = () => dispatch(setTheme(getTheme()));
    handleThemeChange();
    window.addEventListener('themeChange', handleThemeChange);

    // Optimistically upadte theme from localStorage
    const cachedTheme =
      localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    applySelectedTheme(cachedTheme);

    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, [dispatch]);

  return <></>;
};

export const useTheme = () => {
  return useAppSelector((state) => state.theme.theme);
};

export const getOSTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};
