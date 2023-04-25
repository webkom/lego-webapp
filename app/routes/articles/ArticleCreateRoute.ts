import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import ArticleEditor from './components/ArticleEditor';

const mapStateToProps = () => ({
  isNew: true,
  article: {},
  initialValues: {
    content: '',
  },
});

const mapDispatchToProps = {
  submitArticle: createArticle,
  uploadFile,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(ArticleEditor);
