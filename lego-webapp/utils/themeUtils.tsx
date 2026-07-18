import { throttle } from 'lodash-es';
import { useEffect } from 'react';
import { updateUserTheme } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCurrentUser, useCurrentUser } from '~/redux/slices/auth';
import { setTheme } from '~/redux/slices/theme';
import type { AppDispatch } from '~/redux/createStore';
import type { RootState } from '~/redux/rootReducer';

export type ThemePreference = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

// The one precedence rule for the whole app: an explicit account theme wins,
// then an explicit choice stored on this device, then the OS. 'auto' (and
// anything unknown) falls through to the next level
export const resolveTheme = (
  account: unknown,
  stored: unknown,
  osDark: boolean,
): ResolvedTheme =>
  account === 'dark' || account === 'light'
    ? account
    : stored === 'dark' || stored === 'light'
      ? stored
      : osDark
        ? 'dark'
        : 'light';

// Pre-paint script for +Head, built from resolveTheme itself so the theme
// painted first can never disagree with what ThemeManager applies after
// hydration
export const themeBootstrapScript = (account: ThemePreference) => `
(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    document.documentElement.setAttribute(
      'data-theme',
      (${resolveTheme.toString()})(
        ${JSON.stringify(account)},
        stored,
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    );
  } catch (e) {}
})();`;

const osPrefersDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const storedPreference = () => {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
};

// The only place data-theme is written after first paint
const applyResolvedTheme = (dispatch: AppDispatch, resolved: ResolvedTheme) => {
  document.documentElement.setAttribute('data-theme', resolved);
  dispatch(setTheme(resolved));
};

export const getTheme = (): ResolvedTheme =>
  !import.meta.env.SSR &&
  document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';

export const useTheme = () => useAppSelector((state) => state.theme.theme);

// Throttle ensures instant feedback the first time the user changes theme,
// but also ensures the user can't spam the server with requests
const syncUserTheme = throttle(
  (dispatch: AppDispatch, username: string, theme: ResolvedTheme) =>
    dispatch(updateUserTheme(username, theme)),
  2000,
);

// The user explicitly picked a theme: store the choice on this device, apply
// it, and sync it to their account when logged in
export const applySelectedTheme =
  (preference: ResolvedTheme) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (import.meta.env.SSR) return;

    try {
      localStorage.setItem('theme', preference);
    } catch {
      /* storage unavailable - the theme still applies for this page view */
    }

    applyResolvedTheme(
      dispatch,
      resolveTheme(null, preference, osPrefersDark()),
    );

    const username = selectCurrentUser(getState())?.username;
    if (username) syncUserTheme(dispatch, username, preference);
  };

// Owns the theme after hydration: applies the resolved theme on mount and
// re-resolves when the account preference changes (login, settings save),
// when another tab changes the stored choice, or when the OS switches
// appearance while the preference is 'auto'
export const ThemeManager = () => {
  const dispatch = useAppDispatch();
  const accountTheme = useCurrentUser()?.selectedTheme;

  useEffect(() => {
    const resolve = () =>
      applyResolvedTheme(
        dispatch,
        resolveTheme(accountTheme, storedPreference(), osPrefersDark()),
      );

    resolve();

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'theme') resolve();
    };
    const osQuery = window.matchMedia('(prefers-color-scheme: dark)');

    window.addEventListener('storage', onStorage);
    osQuery.addEventListener('change', resolve);

    return () => {
      window.removeEventListener('storage', onStorage);
      osQuery.removeEventListener('change', resolve);
    };
  }, [dispatch, accountTheme]);

  return null;
};
