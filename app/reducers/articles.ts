import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Article } from 'app/actions/ActionTypes';
import { addCommentCases } from 'app/reducers/comments';
import { addReactionCases } from 'app/reducers/reactions';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';
import type { DetailedArticle } from 'app/store/models/Article';

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
  selectArticleById<DetailedArticle>,
  selectArticleBySlug<DetailedArticle>,
  (article, articleBySlug) => article || articleBySlug,
);
