// @flow

import { createSelector } from 'reselect';
import { Page } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { selectGroups } from './groups';

export type PageEntity = {
  id: number,
  title: string,
  slug: string,
  content: string,
  comments: Array<number>,
  picture: string
};

export default createEntityReducer({
  key: 'pages',
  types: {
    fetch: Page.FETCH
  }
});

export const selectPageBySlug = createSelector(
  state => state.pages.byId,
  (state, props) => props.pageSlug,
  (pagesBySlug, pageSlug) => pagesBySlug[pageSlug] || {}
);

export const selectPages = createSelector(
  state => state.pages.byId,
  (pagesBySlug, pageSlug) =>
    Object.keys(pagesBySlug).map(slug => pagesBySlug[slug])
);

export const selectPagesForHierarchy = createSelector(
  state => selectPages(state),
  (state, props) => props.title,
  (pages, title) => ({
    title,
    items: pages.map(page => ({
      url: `/pages/info/${page.slug}`,
      title: page.title
    }))
  })
);

export const selectGroupsForHierarchy = createSelector(
  state => selectGroups(state),
  (state, props) => props.title,
  (groups, title) => ({
    title,
    items: groups.map(page => ({
      url: `/pages/komiteer/${page.id}`,
      title: page.name
    }))
  })
);
