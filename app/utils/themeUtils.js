import imageLogoLightMode from 'app/assets/logo-dark.png';
import imageLogoDarkMode from 'app/assets/logo.png';
import bannerLightMode from 'app/assets/om-abakus-banner.png';
import bannerDarkMode from 'app/assets/om-abakus-banner-dark-mode.png';

const isClientSide = () => typeof window !== 'undefined' && document;

export const applySelectedTheme = theme => {
  if (isClientSide()) {
    document.documentElement.setAttribute('data-theme', theme);
    global.dispatchEvent(new Event('themeChange'));
  }
};

export const getTheme = () =>
  isClientSide()
    ? document.documentElement.getAttribute('data-theme')
    : 'light';

export const getLogoImage = () => {
  return getTheme() !== 'dark' ? imageLogoLightMode : imageLogoDarkMode;
};

export const getAboutAbakusBanner = () => {
  return getTheme() !== 'dark' ? bannerLightMode : bannerDarkMode;
};

export const getFancyNodeColor = () => {
  return getTheme() !== 'dark' ? 'rgba(0,0,0, 0.3)' : 'rgba(255,255,255, 0.5)';
};
