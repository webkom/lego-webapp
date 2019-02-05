import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import { fetchArticle } from 'app/actions/ArticleActions';
import { deleteComment } from 'app/actions/CommentActions';
import ArticleDetail from './components/ArticleDetail';
import {
  selectArticleById,
  selectCommentsForArticle
} from 'app/reducers/articles';
import { selectUserById } from 'app/reducers/users';

function loadData(props, dispatch) {
  return dispatch(fetchArticle(props.params.articleId));
}

const mapStateToProps = (state, props) => {
  const { articleId } = props.params;
  const article = selectArticleById(state, { articleId });
  const comments = selectCommentsForArticle(state, { articleId });
  const author = selectUserById(state, { userId: article.author });

  const youtubeParams = {};
  if (article.youtubeUrl) {
    const params = new URL(article.youtubeUrl).searchParams;
    for (const [key, value] of params.entries()) {
      youtubeParams[key] = value;
    }
  }

  return {
    fetching: state.articles.fetching,
    comments,
    article,
    articleId,
    author,
    youtubeParams: article.youtubeUrl ? youtubeParams : {}
  };
};

const mapDispatchToProps = { fetchArticle, deleteComment };

export default compose(
  prepare(loadData, ['params.articleId']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['article.content']),
  helmet((props, config) => {
    const tags = props.article.tags.map(content => ({
      content,
      property: 'article:tag'
    }));

    return [
      {
        property: 'og:title',
        content: props.article.title
      },
      {
        element: 'title',
        children: props.article.title
      },
      {
        element: 'link',
        rel: 'canonical',
        href: `${config.webUrl}/articles/${props.article.id}`
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:image:width',
        content: '500'
      },
      {
        property: 'og:image:height',
        content: '500'
      },
      {
        property: 'og:url',
        content: `${config.webUrl}/articles/${props.article.id}`
      },
      {
        property: 'og:image',
        content: props.article.cover
      },
      {
        property: 'article:published_time',
        content: props.article.createdAt
      },

      {
        property: 'og:description',
        content: props.article.description
      },
      {
        property: 'article:author',
        content: `${config.webUrl}/users/${props.author.username}`
      },
      ...tags
    ];
  })
)(ArticleDetail);
