import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Article } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addCommentCases } from '~/redux/slices/comments';
import { addReactionCases } from '~/redux/slices/reactions';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Articles, {
  sortComparer: (a, b) => moment(a.createdAt).diff(moment(b.createdAt)),
});

const articlesSlice = createSlice({
  name: EntityType.Articles,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Article.FETCH],
    deleteActions: [Article.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Articles, addCase);
      addReactionCases(EntityType.Articles, addCase);
    },
  }),
});

export default articlesSlice.reducer;

export const {
  selectAllPaginated: selectArticles,
  selectById: selectArticleById,
  selectByField: selectArticlesByField,
} = legoAdapter.getSelectors((state: RootState) => state.articles);

export const selectArticlesByTag = selectArticlesByField(
  'tags',
  (entityTags, tag: string) => entityTags.includes(tag),
);
export const selectArticleBySlug = selectArticlesByField('slug').single;
export const selectArticleByIdOrSlug = createSelector(
  selectArticleById,
  selectArticleBySlug,
  (article, articleBySlug) => article || articleBySlug,
);
