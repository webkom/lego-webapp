import { prepare } from '@webkom/react-prepare';
import { parse } from 'cookie';
import {
  createStaticHandler,
  createStaticRouter,
  type StaticHandlerContext,
} from 'react-router';
import { PageContextServer } from 'vike/types';
import { PageContextProvider } from 'vike-react/usePageContext';
import { routerConfig } from '~/pages/react-router/routerConfig';
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
  const cookies = parse(pageContext.headers?.['cookie'] ?? '');
  pageContext.store = createStore(
    {},
    {
      getCookie: (key) => cookies[key],
    },
  );
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
