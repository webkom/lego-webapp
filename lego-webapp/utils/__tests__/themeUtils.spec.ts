import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { selectCurrentUser } from '~/redux/slices/auth';
import {
  applySelectedTheme,
  resolveTheme,
  themeBootstrapScript,
} from '../themeUtils';
import type { ThemePreference } from '../themeUtils';

vi.mock('~/redux/actions/UserActions', () => ({
  updateUserTheme: (username: string, theme: string) => ({
    type: 'user/updateTheme',
    username,
    theme,
  }),
}));
vi.mock('~/redux/hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));
vi.mock('~/redux/slices/auth', () => ({ selectCurrentUser: vi.fn() }));
vi.mock('~/redux/slices/theme', () => ({
  setTheme: (theme: string) => ({ type: 'theme/setTheme', theme }),
}));

const stubMatchMedia = (osDark: boolean) =>
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: osDark }));

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('resolveTheme', () => {
  it('prefers an explicit account theme over everything', () => {
    expect(resolveTheme('dark', 'light', false)).toBe('dark');
    expect(resolveTheme('light', 'dark', true)).toBe('light');
  });

  it('follows the OS for account auto, ignoring the device choice', () => {
    expect(resolveTheme('auto', 'dark', false)).toBe('light');
    expect(resolveTheme('auto', 'light', true)).toBe('dark');
  });

  it('uses the stored device choice when logged out', () => {
    expect(resolveTheme(undefined, 'dark', false)).toBe('dark');
    expect(resolveTheme(null, 'light', true)).toBe('light');
  });

  it('falls back to the OS preference last', () => {
    expect(resolveTheme(undefined, null, true)).toBe('dark');
    expect(resolveTheme(undefined, 'garbage', false)).toBe('light');
  });
});

describe('themeBootstrapScript', () => {
  const runBootstrap = (
    account: ThemePreference | undefined,
    stored: string | null,
    osDark: boolean,
  ) => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    if (stored !== null) localStorage.setItem('theme-preference', stored);
    stubMatchMedia(osDark);

    new Function(themeBootstrapScript(account))();

    return document.documentElement.getAttribute('data-theme');
  };

  it('always agrees with resolveTheme', () => {
    const accounts = [undefined, 'auto', 'light', 'dark'] as const;
    const storedValues = [null, 'auto', 'light', 'dark', 'garbage'];

    for (const account of accounts) {
      for (const stored of storedValues) {
        for (const osDark of [false, true]) {
          expect(runBootstrap(account, stored, osDark)).toBe(
            resolveTheme(account, stored, osDark),
          );
        }
      }
    }
  });

  it('ignores the legacy theme key', () => {
    localStorage.setItem('theme', 'light');
    stubMatchMedia(true);

    new Function(themeBootstrapScript(undefined))();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('falls back to the OS preference when localStorage throws', () => {
    stubMatchMedia(true);
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
    });

    new Function(themeBootstrapScript(undefined))();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('cannot break out of the script tag', () => {
    expect(themeBootstrapScript('</script>' as never)).not.toContain(
      '</script>',
    );
  });
});

describe('applySelectedTheme', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();

  const apply = (preference: ThemePreference) =>
    applySelectedTheme(preference)(dispatch, getState, undefined as never);

  beforeEach(() => {
    dispatch.mockClear();
    stubMatchMedia(false);
    vi.mocked(selectCurrentUser).mockReturnValue(undefined);
  });

  it('stores the choice on the device and applies it when logged out', () => {
    apply('dark');

    expect(localStorage.getItem('theme-preference')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(dispatch).toHaveBeenCalledWith({
      type: 'theme/setTheme',
      theme: 'dark',
    });
  });

  it('clears the device choice and follows the OS on auto', () => {
    localStorage.setItem('theme-preference', 'dark');
    stubMatchMedia(true);

    apply('auto');

    expect(localStorage.getItem('theme-preference')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('syncs to the account instead of the device when logged in', () => {
    vi.mocked(selectCurrentUser).mockReturnValue({
      username: 'test1',
    } as never);

    apply('light');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'user/updateTheme',
      username: 'test1',
      theme: 'light',
    });
    expect(localStorage.getItem('theme-preference')).toBeNull();
  });

  it('ignores values that are not a theme preference', () => {
    apply(undefined as never);

    expect(dispatch).not.toHaveBeenCalled();
    expect(localStorage.getItem('theme-preference')).toBeNull();
  });
});
