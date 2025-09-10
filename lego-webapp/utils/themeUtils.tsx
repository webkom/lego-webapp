import { throttle } from 'lodash-es';
import { createContext, useCallback, useEffect } from 'react';
import { updateUserTheme } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser, useIsLoggedIn } from '~/redux/slices/auth';
import { setTheme } from '~/redux/slices/theme';

type ThemeChangeEventDetail = {
  updateUserTheme?: boolean;
};

type ApplySelectedThemeOptions = {
  updateUserTheme?: boolean;
};

export const applySelectedTheme = (
  theme: 'light' | 'dark' | 'auto',
  options: ApplySelectedThemeOptions = {
    updateUserTheme: true,
  },
) => {
  if (import.meta.env.SSR) return;

  document.documentElement.setAttribute(
    'data-theme',
    theme === 'auto' ? getOSTheme() : theme,
  );

  window.dispatchEvent(
    new CustomEvent<ThemeChangeEventDetail>('themeChange', {
      detail: {
        updateUserTheme: options.updateUserTheme,
      },
    }),
  );

  localStorage.setItem('theme', theme);
};

export const getTheme = (): 'dark' | 'light' =>
  !import.meta.env.SSR &&
  document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';

export const ThemeContext = createContext<'dark' | 'light'>(getTheme());

export const ThemeContextListener = () => {
  const dispatch = useAppDispatch();
  const username = useCurrentUser()?.username;
  const loggedIn = useIsLoggedIn();

  // Throttle ensures instant feedback first time user changes theme,
  // but also ensures user cant spam the server with requests
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledUpdateUserTheme = useCallback(
    throttle(
      (username, theme) => dispatch(updateUserTheme(username, theme)),
      2000,
    ),
    [dispatch],
  );

  useEffect(() => {
    const handleThemeChange = (event?: Event) => {
      const currentTheme = getTheme();
      dispatch(setTheme(currentTheme)); // Synchronize local state

      if (
        (event as CustomEvent<ThemeChangeEventDetail> | undefined)?.detail
          ?.updateUserTheme &&
        loggedIn &&
        username
      )
        throttledUpdateUserTheme(username, currentTheme); // Synchronize server state
    };

    handleThemeChange();
    window.addEventListener('themeChange', handleThemeChange);

    // Optimistically update theme from localStorage
    const cachedTheme =
      localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    applySelectedTheme(cachedTheme, { updateUserTheme: false });

    return () => window.removeEventListener('themeChange', handleThemeChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loggedIn, username]);

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
