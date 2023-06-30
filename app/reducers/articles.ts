import { orderBy } from 'lodash';
import { createSelector } from 'reselect';
import { mutateComments, selectCommentEntities } from 'app/reducers/comments';
import { mutateReactions } from 'app/reducers/reactions';
import { selectUserById } from 'app/reducers/users';
import { typeable } from 'app/reducers/utils';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import type { RootState } from 'app/store/createRootReducer';
import type { PublicArticle, UnknownArticle } from 'app/store/models/Article';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { Article } from '../actions/ActionTypes';
import type { Selector } from 'reselect';

export default createEntityReducer<UnknownArticle>({
  key: 'articles',
  types: {
    fetch: Article.FETCH,
    mutate: Article.CREATE,
    delete: Article.DELETE,
  },
  mutate: joinReducers(
    mutateReactions<UnknownArticle>('articles'),
    mutateComments<UnknownArticle>('articles')
  ),
});

function transformArticle(article) {
  return { ...article };
}

export const selectArticles = typeable(
  createSelector(
    (state) => state.articles.byId,
    (state) => state.articles.items,
    (_, props) => props && props.pagination,
    (articlesById, articleIds, pagination) =>
      orderBy<UnknownArticle>(
        (pagination ? pagination.items : articleIds).map((id) =>
          transformArticle(articlesById[id])
        ) as ReadonlyArray<UnknownArticle>,
        ['createdAt', 'id'],
        ['desc', 'desc']
      )
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
  selectCommentEntities,
  (article, commentEntities) => {
    if (!article) return [];
    return (article.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
