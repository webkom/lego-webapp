import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchArticle } from 'app/actions/ArticleActions';
import ArticleDetail from './components/ArticleDetail';
import {
  selectArticleById,
  selectCommentsForArticle
} from 'app/reducers/articles';

function loadData({ articleId }, props) {
  props.fetchArticle(Number(articleId));
}

function mapStateToProps(state, props) {
  const { articleId } = props.params;
  const article = selectArticleById(state, { articleId });
  const comments = selectCommentsForArticle(state, { articleId });

  return {
    comments,
    article,
    articleId
  };
}

const mapDispatchToProps = { fetchArticle };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['articleId', 'loggedIn'], loadData)
)(ArticleDetail);
