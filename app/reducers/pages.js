// @flow

import { createSelector } from 'reselect';
import values from 'lodash/values';
import { Page } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type PageEntity = {
  id: number,
  title: string,
  slug: string,
  content: string,
  comments: Array<number>
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

const rootKey = 'root';
/**
 * Maps parent PKs to a list of their children:
 */
const selectParents = createSelector(
  state => state.pages.byId,
  pagesBySlug =>
    Object.keys(pagesBySlug)
      .map(key => pagesBySlug[key])
      .reduce((total, page) => {
        const parent = page.parent || rootKey;
        const existing = total[parent] || [];
        return {
          ...total,
          [parent]: [...existing, page]
        };
      }, {})
);

/**
 * Finds the siblings of the given parent PK
 * (includes self)
 */
export const selectSiblings = createSelector(
  selectParents,
  (state, props) => props.parentPk || rootKey,
  (pagesByParent, parentPk) => pagesByParent[parentPk] || []
);

/**
 * Finds the children of the given PK
 */
export const selectChildren = createSelector(
  state => values(state.pages.byId),
  (state, props) => props.parentPk,
  (pages, parentPk) => pages.filter(page => page.parent === parentPk) || {}
);

export const selectPages = createSelector(
  state => state.pages.byId,
  (pagesBySlug, pageSlug) =>
    Object.keys(pagesBySlug).map(slug => pagesBySlug[slug]) || []
);

/**
 * Finds the page with the given parent PK.
 */
export const selectParent = createSelector(
  state => values(state.pages.byId),
  (state, props) => props.parentPk,
  (pages, parentPk) => pages.find(page => page.pk === parentPk) || {}
);
