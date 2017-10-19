import { connect } from 'react-redux';
import ArticleEditor from './components/ArticleEditor';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = () => ({
  isNew: true,
  article: {},
  initialValues: {
    content: ''
  }
});

const mapDispatchToProps = { createArticle, uploadFile };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'article'
  })
)(ArticleEditor);
