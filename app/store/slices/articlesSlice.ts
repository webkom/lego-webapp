import { createSelector } from 'reselect';
import { Article } from '../../actions/ActionTypes';
import type { ReactionEntity } from 'app/store/slices/reactionsSlice';
import { mutateReactions } from 'app/store/slices/reactionsSlice';
import { mutateComments } from 'app/store/slices/commentsSlice';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { orderBy } from 'lodash';
import type { Article as ArticleType } from 'app/models';
import 'app/models';
export type ArticleEntity = {
  id: number;
  title: string;
  contentTarget: string;
  description: string;
  author: Record<string, any>;
  cover: string;
  coverPlaceholder: string;
  createdAt: string;
  content: string;
  startTime: string;
  text: string;
  tags: Array<string>;
  reactionsGrouped: Array<ReactionEntity>;
  reactions: Array<ReactionEntity>;
  actionGrant: Record<string, any>;
  comments: Array<number>;
  youtubeUrl: string;
};
export default createEntityReducer({
  key: 'articles',
  types: {
    fetch: Article.FETCH,
    mutate: Article.CREATE,
    delete: Article.DELETE,
  },
  mutate: joinReducers(mutateComments('articles'), mutateReactions('articles')),
});

function transformArticle(article) {
  return { ...article };
}

export const selectArticles = createSelector(
  (state) => state.articles.byId,
  (state) => state.articles.items,
  (_, props) => props && props.pagination,
  (articlesById, articleIds, pagination) =>
    orderBy<ArticleType>(
      (pagination ? pagination.items : articleIds).map((id) =>
        transformArticle(articlesById[id])
      ) as ReadonlyArray<ArticleType>,
      ['createdAt', 'id'],
      ['desc', 'desc']
    )
);
export const selectArticlesByTag = createSelector(
  selectArticles,
  (state, props) => props.tag,
  (articles, tag) =>
    articles.filter((article) =>
      tag ? article.tags.indexOf(tag) !== -1 : true
    )
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
export const selectReactionsForArticle = createSelector(
  selectArticleById,
  (state) => state.reactions.byId,
  (article, reactionsById) => {
    if (!article) return [];
    return (article.reactionsGrouped || []).map(
      (reactionId) => reactionsById[reactionId]
    );
  }
);
