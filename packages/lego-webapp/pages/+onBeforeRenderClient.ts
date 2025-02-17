import cookie from 'js-cookie';
import { PageContextClient } from 'vike/types';
import createStore from '../redux/createStore';

export function onBeforeRenderClient(pageContext: PageContextClient) {
  pageContext.store = createStore(pageContext.storeInitialState, {
    getCookie: (key) => cookie.get(key),
  });
}
