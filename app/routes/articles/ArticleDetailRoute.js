import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchArticle } from 'app/actions/ArticleActions';
import ArticleDetail from './components/ArticleDetail';
import {
  selectArticleById,
  selectCommentsForArticle
} from 'app/reducers/articles';

const mapStateToProps = (state, props) => {
  const { articleId } = props.params;
  const article = selectArticleById(state, { articleId });
  const comments = selectCommentsForArticle(state, { articleId });

  return {
    comments,
    article,
    articleId
  };
};

const mapDispatchToProps = { fetchArticle };

export default compose(
  dispatched(
    ({ params: { articleId } }, dispatch) => dispatch(fetchArticle(articleId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(ArticleDetail);
