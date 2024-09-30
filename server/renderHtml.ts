import { isEmpty } from 'lodash-es';
import serialize from 'serialize-javascript';
import { selectCurrentUser } from 'app/reducers/auth';
import config from '../config/env';
import type { render } from 'app/entryServer';

export const renderHtml = (
  template: string,
  {
    reactHtml,
    reduxState,
    helmet,
    preparedStateCode,
  }: Awaited<ReturnType<typeof render>>,
) => {
  const selectedTheme =
    (!isEmpty(reduxState) && selectCurrentUser(reduxState)?.selectedTheme) ||
    'auto';

  return template
    .replace(
      `data-theme='light'`,
      `data-theme='${selectedTheme === 'auto' ? 'light' : selectedTheme}'`,
    )
    .replace(`<!--helmet-title-->`, helmet?.title.toString() ?? '')
    .replace(`<!--app-body-->`, reactHtml ?? '')
    .replace(
      `/* js-code */`,
      `window.__CONFIG__ = ${serialize(config, {
        isJSON: true,
      })};
        window.__PRELOADED_STATE__ = ${serialize(reduxState, {
          isJSON: true,
        })};
        window.__IS_SSR__ = true;
        ${preparedStateCode}`,
    );
};
