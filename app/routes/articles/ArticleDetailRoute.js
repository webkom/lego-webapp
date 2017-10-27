import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import { fetchArticle } from 'app/actions/ArticleActions';
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

  return {
    fetching: state.articles.fetching,
    comments,
    article,
    articleId,
    author
  };
};

const mapDispatchToProps = { fetchArticle };

export default compose(
  prepare(loadData, ['params.articleId']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['article.content']),
  helmet((props, config) => [
    {
      property: 'og:title',
      content: props.article.title
    },
    {
      property: 'title',
      content: props.article.title
    },
    {
      property: 'og:type',
      content: 'article'
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
      property: 'article:author',
      content: `${config.webUrl}/users/${props.author.username}`
    }
  ])
)(ArticleDetail);
