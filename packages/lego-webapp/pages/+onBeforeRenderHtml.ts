import { parse } from 'cookie';
import {
  createStaticHandler,
  createStaticRouter,
  type StaticHandlerContext,
} from 'react-router';
import { PageContextServer } from 'vike/types';
import { routerConfig } from '~/pages/react-router/routerConfig';
import createStore from '../redux/createStore';

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
  // React router support
  const { query, dataRoutes } = createStaticHandler(routerConfig);
  const fetchRequest = createReactRouterFetchRequest(pageContext);
  const context = (await query(fetchRequest)) as StaticHandlerContext;
  pageContext.router = createStaticRouter(dataRoutes, context);
  pageContext.routerContext = context;
}
