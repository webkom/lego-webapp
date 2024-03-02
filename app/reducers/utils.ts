import type { Selector } from 'reselect';

/*
Helper for allowing type overrides on selector functions
F.ex. the article selector selects UnknownArticle from the store, but we know it will be a PublicArticle
With this we can write selectArticles<PublicArticle[]>(...)
 */
export const typeable =
  <State, Result, Params extends never | readonly any[] = any[]>(
    selector: Selector<State, Result, Params>,
  ) =>
  <T extends Result = Result>(state: State, ...params: Params) =>
    selector(state, ...params) as unknown as T;
