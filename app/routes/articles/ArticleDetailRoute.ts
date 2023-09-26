import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchArticle } from 'app/actions/ArticleActions';
import { deleteComment } from 'app/actions/CommentActions';
import { fetchEmojis } from 'app/actions/EmojiActions';
import {
  selectArticleById,
  selectArticleBySlug,
  selectCommentsForArticle,
} from 'app/reducers/articles';
import { selectEmojis } from 'app/reducers/emojis';
import { selectUserById } from 'app/reducers/users';
import type { PublicArticle } from 'app/store/models/Article';
import type { PublicUser } from 'app/store/models/User';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import ArticleDetail from './components/ArticleDetail';
import type { RouteChildrenProps } from 'react-router';

type Params = {
  articleId: string;
};

const mapStateToProps = (state, props) => {
  const { articleIdOrSlug } = props.match.params;
  const article = !isNaN(articleIdOrSlug)
    ? selectArticleById(state, {
        articleId: articleIdOrSlug,
      })
    : selectArticleBySlug(state, {
        articleSlug: articleIdOrSlug,
      });
  const articleId = article && article.id;

  const comments = selectCommentsForArticle(state, {
    articleId,
  });
  const authors = article.authors?.map((e) => {
    return selectUserById(state, {
      userId: e,
    });
  });
  const emojis = selectEmojis(state);

  return {
    fetching: state.articles.fetching,
    fetchingEmojis: state.emojis.fetching,
    comments,
    article,
    articleId,
    authors,
    emojis,
  };
};

const mapDispatchToProps = {
  fetchArticle,
  fetchEmojis,
  deleteComment,
};
export default compose(
  withPreparedDispatch(
    'fetchArticleDetail',
    (props: RouteChildrenProps<Params>, dispatch) =>
      Promise.all([
        dispatch(fetchArticle(props.match.params.articleIdOrSlug)),
        dispatch(fetchEmojis()),
      ]),
    (props) => [props.match.params.articleIdOrSlug]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['article.content']),
  helmet((props: { article: PublicArticle; authors: PublicUser[] }, config) => {
    const tags = props.article.tags.map((content) => ({
      content,
      property: 'article:tag',
    }));

    const authors = props.authors.map((author) => ({
      property: 'article:authors',
      content: `${config.webUrl}/users/${author.username}`,
    }));

    return [
      {
        property: 'og:title',
        content: props.article.title,
      },
      {
        element: 'title',
        children: props.article.title,
      },
      {
        element: 'link',
        rel: 'canonical',
        href: `${config.webUrl}/articles/${props.article.id}`,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        property: 'og:image:width',
        content: '500',
      },
      {
        property: 'og:image:height',
        content: '500',
      },
      {
        property: 'og:url',
        content: `${config.webUrl}/articles/${props.article.id}`,
      },
      {
        property: 'og:image',
        content: props.article.cover,
      },
      {
        property: 'article:published_time',
        content: props.article.createdAt.toString(),
      },
      {
        property: 'og:description',
        content: props.article.description,
      },
      ...authors,
      ...tags,
    ];
  })
)(ArticleDetail);
