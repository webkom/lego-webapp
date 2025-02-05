import { isEmpty } from 'lodash-es';
import serialize from 'serialize-javascript';
import config from 'app/config';
import { selectCurrentUser } from 'app/reducers/auth';
import type { RootState } from 'app/store/createRootReducer';
import type { HelmetServerState } from 'react-helmet-async/lib/types';

const analytics = import.meta.env.DEV
  ? '' // The .replace() removes the protocol (https://) part of the url, leaving just the domain
  : `<script defer data-domain=${config.webUrl.replace(
      /(^\w+:|^)\/\//,
      '',
    )} src="https://ls.webkom.dev/js/script.js"></script>`;

// If user has selected theme auto and device is in dark mode; ensure we update
// the theme before first render to screen
const autoDarkModeScript = `
(function () {
  try {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches === true) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();
`;

const selectSelectedTheme = (reduxState: RootState) =>
  (!isEmpty(reduxState) && selectCurrentUser(reduxState)?.selectedTheme) ||
  'auto';

export const populateTemplateHead = (
  template: string,
  { helmet, reduxState }: { helmet?: HelmetServerState; reduxState: RootState },
) => {
  const selectedTheme = selectSelectedTheme(reduxState);

  return template
    .replace(
      `<html lang='nb'>`,
      `<html lang='nb' data-theme='${selectedTheme === 'auto' ? 'light' : selectedTheme}'>`,
    )
    .replace(`<!--helmet-title-->`, helmet?.title.toString() ?? '')
    .replace(`<!--helmet-meta-->`, helmet?.meta.toString() ?? '')
    .replace(`<!--analytics-->`, analytics);
};

export const populateTemplateTail = (
  template: string,
  {
    preparedStateCode,
    reduxState,
  }: { preparedStateCode: string; reduxState: RootState },
) => {
  const selectedTheme = selectSelectedTheme(reduxState);

  return template.replace(
    `<!--scripts-->`,
    `<script>
        window.__CONFIG__ = ${serialize(config, {
          isJSON: true,
        })};
        window.__PRELOADED_STATE__ = ${serialize(reduxState, {
          isJSON: true,
        })};
        window.__IS_SSR__ = true;
        ${preparedStateCode}
        ${selectedTheme === 'auto' ? autoDarkModeScript : ''}
      </script>`,
  );
};
