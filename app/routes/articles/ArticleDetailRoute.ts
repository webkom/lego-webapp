import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchArticle } from 'app/actions/ArticleActions';
import { deleteComment } from 'app/actions/CommentActions';
import { fetchEmojis } from 'app/actions/EmojiActions';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import {
  selectArticleById,
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

const mapStateToProps = (state, props) => {
  const { articleId } = props.match.params;
  const article = selectArticleById(state, {
    articleId,
  });
  const comments = selectCommentsForArticle(state, {
    articleId,
  });
  const author = selectUserById(state, {
    userId: article.author,
  });
  const emojis = selectEmojis(state);
  return {
    fetching: state.articles.fetching,
    fetchingEmojis: state.emojis.fetching,
    comments,
    article,
    articleId,
    author,
    emojis,
  };
};

const mapDispatchToProps = {
  fetchArticle,
  fetchEmojis,
  deleteComment,
  addReaction,
  deleteReaction,
};
export default compose(
  withPreparedDispatch(
    'fetchArticleDetail',
    (props, dispatch) =>
      dispatch(fetchArticle(props.match.params.articleId), fetchEmojis()),
    (props) => [props.match.params.articleId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['article.content']),
  helmet((props: { article: PublicArticle; author: PublicUser }, config) => {
    const tags = props.article.tags.map((content) => ({
      content,
      property: 'article:tag',
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
      {
        property: 'article:author',
        content: `${config.webUrl}/users/${props.author.username}`,
      },
      ...tags,
    ];
  })
)(ArticleDetail);
