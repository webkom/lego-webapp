import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { addReactionCases } from 'app/reducers/reactions';
import { selectUserById } from 'app/reducers/users';
import { typeable } from 'app/reducers/utils';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import type { RootState } from 'app/store/createRootReducer';
import type { PublicArticle, UnknownArticle } from 'app/store/models/Article';
import { EntityType } from 'app/store/models/entities';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Article } from '../actions/ActionTypes';
import type { Selector } from 'reselect';

const legoAdapter = createLegoAdapter(EntityType.Articles, {
  fetchActions: [Article.FETCH],
  deleteActions: [Article.DELETE],
  sortComparer: (a, b) => moment(a.createdAt).diff(moment(b.createdAt)),
});

const articlesSlice = createSlice({
  name: EntityType.Articles,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers((builder) => {
    addCommentCases(EntityType.Articles, builder.addCase);
    addReactionCases(EntityType.Articles, builder.addCase);
  }),
});

export default articlesSlice.reducer;
export const {
  selectAll: selectAllArticles,
  selectIds: selectArticleIds,
  selectEntities: selectArticleEntities,
  selectById: selectArticleById,
} = legoAdapter.getSelectors((state: RootState) => state.articles);

type SelectArticlesOpts = {
  pagination?: Pagination;
};
export const selectArticles = typeable(
  createSelector(
    selectArticleEntities,
    selectArticleIds,
    (_: RootState, props: SelectArticlesOpts) => props && props.pagination,
    (articlesById, articleIds, pagination) =>
      (pagination ? pagination.ids : articleIds).map(
        (id) => articlesById[id]
      ) as ReadonlyArray<UnknownArticle>
  )
);

export const selectArticlesWithAuthorDetails: Selector<
  RootState,
  ArticleWithAuthorDetails[],
  [
    {
      pagination: any;
    }
  ]
> = (state, props) =>
  selectArticles<PublicArticle[]>(state, props).map((article) => ({
    ...article,
    authors: article.authors.map((e) => {
      return selectUserById(state, {
        userId: e,
      });
    }),
  }));

export const selectCommentsForArticle = createSelector(
  selectArticleById,
  selectCommentEntities,
  (article, commentEntities) => {
    if (!article) return [];
    return (article.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
