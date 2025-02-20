import * as Sentry from '@sentry/node';
import { prepare } from '@webkom/react-prepare';
import { parse } from 'cookie';
import JSDOM from 'jsdom';
import moment from 'moment-timezone';
import {
  createStaticHandler,
  createStaticRouter,
  type StaticHandlerContext,
} from 'react-router';
import { PageContextServer } from 'vike/types';
import { PageContextProvider } from 'vike-react/usePageContext';
import { routerConfig } from 'app/routes';
import { fetchMeta } from '~/redux/actions/MetaActions';
import { loginAutomaticallyIfPossible } from '~/redux/actions/UserActions';
import { sentryServerConfig } from '~/sentry.server.config';
import createStore from '../redux/createStore';
import Wrapper from './+Wrapper';

const createReactRouterFetchRequest = (pageContext: PageContextServer) => {
  const origin = `${pageContext.urlParsed.protocol}://${pageContext.urlParsed.hostname}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  const url = new URL(pageContext.urlOriginal || pageContext.url, origin);

  // const controller = new AbortController();
  // res.on('close', () => controller.abort());

  const headers = new Headers();

  for (const [key, values] of Object.entries(pageContext.headers ?? {})) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  const init = {
    method: 'GET',
    headers,
  };

  return new Request(url.href, init);
};

export async function onBeforeRenderHtml(pageContext: PageContextServer) {
  sentryServerConfig();
  moment.locale('nb-NO');
  const cookies = parse(pageContext.headers?.['cookie'] ?? '');
  pageContext.store = createStore(
    {},
    {
      Sentry,
      getCookie: (key) => cookies[key],
    },
  );
  await pageContext.store.dispatch(loginAutomaticallyIfPossible());
  await pageContext.store.dispatch(fetchMeta());
  // SSR Support for LegoEditor
  pageContext.domParser = (val: string) => new JSDOM(val).window.document;
  // Helmet support
  pageContext.helmetContext = {};
  // React router support
  const { query, dataRoutes } = createStaticHandler(routerConfig);
  const fetchRequest = createReactRouterFetchRequest(pageContext);
  const context = (await query(fetchRequest)) as StaticHandlerContext;
  pageContext.router = createStaticRouter(dataRoutes, context);
  pageContext.routerContext = context;
  // Fucking react-prepare
  const Page = pageContext.Page;
  if (Page)
    await prepare(
      <PageContextProvider pageContext={pageContext}>
        <Wrapper>
          <Page />
        </Wrapper>
      </PageContextProvider>,
    );
}
