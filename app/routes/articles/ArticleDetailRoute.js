import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
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
  loadingIndicator(['article.content'])
)(ArticleDetail);
