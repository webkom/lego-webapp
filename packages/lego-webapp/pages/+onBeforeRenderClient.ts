import { PageContextClient } from 'vike/types';
import createStore from '~/redux/createStore';
import cookie from 'js-cookie';

export function onBeforeRenderClient(pageContext: PageContextClient) {
  pageContext.store = createStore(pageContext.storeInitialState, {
    getCookie: (key) => cookie.get(key),
  });
}
