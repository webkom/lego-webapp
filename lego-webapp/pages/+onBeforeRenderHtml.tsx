import * as Sentry from '@sentry/node';
import { parse } from 'cookie';
import { PageContextServer } from 'vike/types';
import { useConfig } from 'vike-react/useConfig';
import { PageContextProvider } from 'vike-react/usePageContext';
import { fetchMeta } from '~/redux/actions/MetaActions';
import { loginAutomaticallyIfPossible } from '~/redux/actions/UserActions';
import { selectCurrentUser } from '~/redux/slices/auth';
import { sentryServerConfig } from '~/sentry.server.config';
import { prepareWithTimeout } from '~/utils/prepareWithTimeout';
import createStore from '../redux/createStore';
import Wrapper from './+Wrapper';

export async function onBeforeRenderHtml(pageContext: PageContextServer) {
  const config = useConfig();

  sentryServerConfig();
  const cookies = parse(pageContext.headers?.['cookie'] ?? '');
  pageContext.store = createStore(
    {},
    {
      Sentry,
      getCookie: (key) => cookies[key],
    },
  );
  try {
    await pageContext.store.dispatch(loginAutomaticallyIfPossible());
    await pageContext.store.dispatch(fetchMeta());
  } catch (_) {
    /* Errors will be set in the redux state */
  }

  const state = pageContext.store.getState();
  const selectedTheme = selectCurrentUser(state)?.selectedTheme || 'light';
  config({ htmlAttributes: { 'data-theme': selectedTheme } });

  // Helmet support
  pageContext.helmetContext = {};
  // Fucking react-prepare
  const Page = pageContext.Page;
  if (Page)
    try {
      pageContext.preparedStateCode = await prepareWithTimeout(
        <PageContextProvider pageContext={pageContext}>
          <Wrapper>
            <Page />
          </Wrapper>
        </PageContextProvider>,
      );
    } catch (error) {
      console.error(error);
    }
}
