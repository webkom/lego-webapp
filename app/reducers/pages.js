// @flow

import { createSelector } from 'reselect';
import { Page } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type PageEntity = {
  id: number;
  title: string;
  slug: string;
  content: string;
  comments: Array<number>;
};

export default createEntityReducer({
  key: 'pages',
  types: {
    fetch: Page.FETCH
  }
});

export const selectPageBySlug = createSelector(
  (state) => state.pages.byId,
  (state, props) => props.pageSlug,
  (pagesBySlug, pageSlug) => pagesBySlug[pageSlug] || {}
);
