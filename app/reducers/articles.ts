import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Article } from 'app/actions/ActionTypes';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { addReactionCases } from 'app/reducers/reactions';
import { selectUserById } from 'app/reducers/users';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';
import type { PublicArticle } from 'app/store/models/Article';
import type { PublicUser } from 'app/store/models/User';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { Selector } from 'reselect';
import type { Overwrite } from 'utility-types';

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
} = legoAdapter.getSelectors((state: RootState) => state.articles);

export type ArticleWithAuthorDetails = Overwrite<
  PublicArticle,
  { authors: PublicUser[] }
>;
export const selectArticlesWithAuthorDetails: Selector<
  RootState,
  ArticleWithAuthorDetails[],
  [
    {
      pagination?: Pagination;
    },
  ]
> = (state, props) =>
  selectArticles(state, props).map((article) => ({
    ...article,
    authors: article.authors.map((e) => {
      return selectUserById(state, {
        userId: e,
      });
    }),
  }));

export const selectArticlesByTag = createSelector(
  selectArticles,
  (_: RootState, props: { tag: string }) => props.tag,
  (articles, tag) =>
    articles.filter((article) =>
      tag ? article.tags.indexOf(tag) !== -1 : true,
    ),
);

export const selectArticleBySlug = createSelector(
  (state: RootState) => state.articles.entities,
  (_: RootState, slug: string) => slug,
  (articlesById, articleSlug) =>
    Object.values(articlesById).find(
      (article) => article?.slug === articleSlug,
    ),
);

export const selectArticleByIdOrSlug = (
  state: RootState,
  articleIdOrSlug: string | number,
) => {
  return isNaN(Number(articleIdOrSlug))
    ? selectArticleBySlug(state, String(articleIdOrSlug))
    : selectArticleById(state, articleIdOrSlug);
};

export const selectCommentsForArticle = createSelector(
  selectArticleById,
  selectCommentEntities,
  (article, commentEntities) => {
    if (!article) return [];
    return (('comments' in article && article.comments) || []).map(
      (commentId) => commentEntities[commentId],
    );
  },
);
