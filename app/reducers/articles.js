// @flow

import { createSelector } from 'reselect';
import { Article } from '../actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

export type ArticleEntity = {
  id: number;
  title: string;
  description: string;
  text: string;
  comments: Array<number>;
};

const mutate = mutateComments('articles');

export default createEntityReducer({
  key: 'articles',
  types: {
    fetch: Article.FETCH
  },
  mutate
});

function transformArticle(article) {
  return {
    ...article
  };
}

export const selectArticles = createSelector(
  (state) => state.articles.byId,
  (state) => state.articles.items,
  (articlesById, articleIds) => articleIds.map((id) => transformArticle(articlesById[id]))
);

export const selectArticleById = createSelector(
  (state) => state.articles.byId,
  (state, props) => props.articleId,
  (articlesById, articleId) => transformArticle(articlesById[articleId])
);

export const selectCommentsForArticle = createSelector(
  selectArticleById,
  (state) => state.comments.byId,
  (article, commentsById) => {
    if (!article) return [];
    return (article.comments || []).map((commentId) => commentsById[commentId]);
  }
);
