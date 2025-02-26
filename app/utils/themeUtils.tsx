import { createContext, useEffect } from 'react';
import { setTheme } from 'app/reducers/theme';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

export const applySelectedTheme = (theme) => {
  if (__CLIENT__) {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'auto' ? getOSTheme() : theme,
    );
    global.dispatchEvent(new Event('themeChange'));
    localStorage.setItem('theme', theme);
  }
};

export const getTheme = (): 'dark' | 'light' =>
  __CLIENT__ && document.documentElement.getAttribute('data-theme') === 'dark'
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
