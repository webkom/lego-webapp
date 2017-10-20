import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import loadingIndicator from 'app/utils/loadingIndicator';
import { fetchArticle, editArticle } from 'app/actions/ArticleActions';
import ArticleEditor from './components/ArticleEditor';
import { selectArticleById } from 'app/reducers/articles';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const { articleId } = props.params;
  const article = selectArticleById(state, { articleId });

  return {
    article,
    articleId,
    isNew: false,
    initialValues: {
      ...article,
      tags: (article.tags || []).map(tag => ({ label: tag, value: tag }))
    }
  };
};

const mapDispatchToProps = { fetchArticle, submitArticle: editArticle };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ params: { articleId } }, dispatch) =>
    dispatch(fetchArticle(articleId))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['article.content'])
)(ArticleEditor);
