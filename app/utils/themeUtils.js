export const applySelectedTheme = (theme) => {
  if (__CLIENT__) {
    document.documentElement.setAttribute(
      'data-theme',
      theme === 'auto' ? getOSTheme() : theme
    );
    global.dispatchEvent(new Event('themeChange'));
  }
};

export const getTheme = () =>
  __CLIENT__ ? document.documentElement.getAttribute('data-theme') : 'light';

export const getFancyNodeColor = () => {
  return getTheme() !== 'dark' ? 'rgba(0,0,0, 0.3)' : 'rgba(255,255,255, 0.5)';
};

export const getOSTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};
