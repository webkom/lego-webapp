// @flow

import { createSelector } from 'reselect';
import { Page } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';

export type PageEntity = {
  id: number;
  title: string;
  slug: string;
  content: string;
  comments: Array<number>;
};

function hierarchyReducer(state: any, action: any) {
  if (action.type === Page.FETCH_HIERARCHY.SUCCESS) {
    // Assign the hierarchy to each slug,
    // so we can easily retrieve it later on:
    const hierarchy = action.payload.reduce((total, page) => ({
      ...total,
      [page.slug]: action.payload
    }), {});

    return {
      ...state,
      hierarchy
    };
  }

  return state;
}

const entityReducer = createEntityReducer({
  key: 'pages',
  types: {
    fetch: Page.FETCH
  },
  initialState: {
    hierarchy: {}
  }
});

export default joinReducers(hierarchyReducer, entityReducer);

export const selectPageBySlug = createSelector(
  (state) => state.pages.byId,
  (state, props) => props.pageSlug,
  (pagesBySlug, pageSlug) => pagesBySlug[pageSlug] || {}
);

export const selectHierarchyBySlug = createSelector(
  (state) => state.pages.hierarchy,
  (state, props) => props.pageSlug,
  (hierarchy, pageSlug) => hierarchy[pageSlug] || {}
);
