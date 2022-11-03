import { connect } from 'react-redux';
import ArticleEditor from './components/ArticleEditor';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';
import { compose } from 'redux';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

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
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(ArticleEditor);
