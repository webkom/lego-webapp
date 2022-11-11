import { createSlice } from '@reduxjs/toolkit';
import { orderBy } from 'lodash';
import { createSelector } from 'reselect';
import {
  createArticle,
  deleteArticle,
  fetchAll,
  fetchArticle,
} from 'app/actions/ArticleActions';
import { addMutateCommentsReducer } from 'app/reducers/comments';
import { addMutateReactionsReducer } from 'app/reducers/reactions';
import type Article from 'app/store/models/Article';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
  PaginationNext,
} from 'app/store/utils/entityReducer';

export type ArticlesState = EntityReducerState<Article>;

const initialState: ArticlesState = getInitialEntityReducerState();

const articlesSlice = createSlice({
  name: EntityType.Articles,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(
      builder,
      EntityType.Articles,
      {
        fetch: [fetchAll, fetchArticle],
        mutate: createArticle,
        delete: deleteArticle,
      },
      (builder) => {
        addMutateCommentsReducer(builder, EntityType.Articles);
        addMutateReactionsReducer(builder, EntityType.Articles);
      }
    );
  },
});

export default articlesSlice.reducer;

function transformArticle(article: Article): Article {
  return { ...article };
}

export const selectArticles = createSelector(
  (state: RootState) => state.articles.byId,
  (state: RootState) => state.articles.items,
  (_: RootState, props: { pagination: PaginationNext[string] }) =>
    props && props.pagination,
  (articlesById, articleIds, pagination) =>
    orderBy(
      (pagination ? pagination.items : articleIds).map((id) =>
        transformArticle(articlesById[id])
      ),
      ['createdAt', 'id'],
      ['desc', 'desc']
    )
);

export const selectArticlesByTag = createSelector(
  selectArticles,
  (state: RootState, props: { tag: string }) => props.tag,
  (articles, tag) =>
    articles.filter((article) =>
      tag ? article.tags.indexOf(tag) !== -1 : true
    )
);

export const selectArticleById = createSelector(
  (state: RootState) => state.articles.byId,
  (state: RootState, props: { articleId: string }) => props.articleId,
  (articlesById, articleId) => transformArticle(articlesById[articleId])
);

export const selectCommentsForArticle = createSelector(
  selectArticleById,
  (state: RootState) => state.comments.byId,
  (article, commentsById) => {
    if (!article) return [];
    return (article.comments || []).map((commentId) => commentsById[commentId]);
  }
);
