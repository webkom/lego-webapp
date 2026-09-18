/*
This is not really the correct place to put the store creation logic,
however currently on older version of vike this is the only hook running
before +data is loaded so we need it here in the meantime. 

TODO: move to +onCreatePageContext when vike deps are updated
*/
import * as Sentry from '@sentry/node';
import { parse } from 'cookie';
import { PageContextServer } from 'vike/types';
import { fetchMeta } from '~/redux/actions/MetaActions';
import { loginAutomaticallyIfPossible } from '~/redux/actions/UserActions';
import { sentryServerConfig } from '~/sentry.server.config';
import createStore from '../redux/createStore';

export async function guard(pageContext: PageContextServer) {
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
}
