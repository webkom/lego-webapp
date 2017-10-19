import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchArticle, editArticle } from 'app/actions/ArticleActions';
import ArticleEditor from './components/ArticleEditor';
import { selectArticleById } from 'app/reducers/articles';
import { reduxForm } from 'redux-form';
import { uploadFile } from 'app/actions/FileActions';
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
      title: article.title,
      cover: article.cover,
      tags: article.tags.map(tag => ({ label: tag, value: tag })),
      content: article.content || '<p></p>'
    }
  };
};

const mapDispatchToProps = { uploadFile, fetchArticle, editArticle };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { articleId } }, dispatch) => dispatch(fetchArticle(articleId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'article',
    enableReinitialize: true
  })
)(ArticleEditor);
