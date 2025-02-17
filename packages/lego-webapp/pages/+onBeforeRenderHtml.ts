import { PageContextServer } from 'vike/types';
import createStore from '../redux/createStore';
import cookie from 'cookie';

export function onBeforeRenderHtml(pageContext: PageContextServer) {
  const cookies = cookie.parse(pageContext.headers?.['cookie'] ?? '');
  pageContext.store = createStore(
    {},
    {
      getCookie: (key) => cookies[key],
    },
  );
}
