import { PageContextServer } from 'vike/types';

export function onAfterRenderHtml(pageContext: PageContextServer) {
  pageContext.storeInitialState = pageContext.store.getState();
}
