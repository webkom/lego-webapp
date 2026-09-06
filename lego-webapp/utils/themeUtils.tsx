import { useEffect } from 'react';
import { Thunk } from 'app/types';
import { updateUserTheme } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCurrentUser } from '~/redux/slices/auth';
import { setTheme } from '~/redux/slices/theme';
import type { AppDispatch } from '~/redux/createStore';

export type ThemePreference = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme-preference';
const LEGACY_THEME_STORAGE_KEY = 'theme';
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';

export const resolveTheme = (
  account: unknown,
  stored: unknown,
  osDark: boolean,
): ResolvedTheme => {
  if (account === 'dark' || account === 'light') return account;
  if (account !== 'auto' && (stored === 'dark' || stored === 'light'))
    return stored;
  return osDark ? 'dark' : 'light';
};

export const themeBootstrapScript = (account: ThemePreference | undefined) => `
(function () {
  try {
    var stored = null;
    try { stored = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
    var osDark = window.matchMedia('${PREFERS_DARK_QUERY}').matches;
    document.documentElement.setAttribute(
      'data-theme',
      (${resolveTheme.toString()})(${JSON.stringify(account ?? null).replace(/</g, '\\u003c')}, stored, osDark)
    );
  } catch (e) {}
})();`;

const osPrefersDark = () => window.matchMedia(PREFERS_DARK_QUERY).matches;

const storedPreference = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStoredPreference = (preference: ThemePreference) => {
  try {
    if (preference === 'auto') localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    return;
  }
};

const removeLegacyStoredPreference = () => {
  try {
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    return;
  }
};

const applyResolvedTheme = (dispatch: AppDispatch, resolved: ResolvedTheme) => {
  document.documentElement.setAttribute('data-theme', resolved);
  dispatch(setTheme(resolved));
};

export const useTheme = () => useAppSelector((state) => state.theme.theme);

export const applySelectedTheme =
  (preference: ThemePreference): Thunk<void> =>
  (dispatch, getState) => {
    if (import.meta.env.SSR) return;
    if (
      preference !== 'light' &&
      preference !== 'dark' &&
      preference !== 'auto'
    )
      return;

    const username = selectCurrentUser(getState())?.username;
    if (username) dispatch(updateUserTheme(username, preference));
    else writeStoredPreference(preference);

    applyResolvedTheme(
      dispatch,
      resolveTheme(preference, null, osPrefersDark()),
    );
  };

export const ThemeManager = () => {
  const dispatch = useAppDispatch();
  const accountTheme = useAppSelector(
    (state) => selectCurrentUser(state)?.selectedTheme,
  );

  useEffect(() => {
    removeLegacyStoredPreference();

    const resolve = () =>
      applyResolvedTheme(
        dispatch,
        resolveTheme(accountTheme, storedPreference(), osPrefersDark()),
      );

    resolve();

    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) resolve();
    };
    const osQuery = window.matchMedia(PREFERS_DARK_QUERY);
    window.addEventListener('storage', onStorage);
    osQuery.addEventListener?.('change', resolve);

    return () => {
      window.removeEventListener('storage', onStorage);
      osQuery.removeEventListener?.('change', resolve);
    };
  }, [dispatch, accountTheme]);

  return null;
};
