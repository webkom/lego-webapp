import imageLogoLight from 'app/assets/logo-dark.png';
import imageLogoDark from 'app/assets/logo.png';

export const applySelectedTheme = theme => {
  if (document) {
    document.documentElement.setAttribute('data-theme', theme);
    global.dispatchEvent(new Event('themeChange'));
  }
};

export const getTheme = () => {
  return (
    (document &&
      document.documentElement &&
      document.documentElement.getAttribute('data-theme')) ||
    'light'
  );
};

export const getLogoImage = () => {
  return getTheme() !== 'dark' ? imageLogoLight : imageLogoDark;
};

export const getFancyNodeColor = () => {
  return getTheme() !== 'dark' ? 'rgba(0,0,0, 0.3)' : 'rgba(255,255,255, 0.5)';
};
