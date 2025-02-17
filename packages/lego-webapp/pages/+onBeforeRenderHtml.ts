import { parse } from 'cookie';
import { PageContextServer } from 'vike/types';
import createStore from '../redux/createStore';

export function onBeforeRenderHtml(pageContext: PageContextServer) {
  const cookies = parse(pageContext.headers?.['cookie'] ?? '');
  pageContext.store = createStore(
    {},
    {
      getCookie: (key) => cookies[key],
    },
  );
}
