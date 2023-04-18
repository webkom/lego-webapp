import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectCurrentUser } from 'app/reducers/auth';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import ArticleEditor from './components/ArticleEditor';

const mapStateToProps = (state) => {
  const currentUser = selectCurrentUser(state);
  const authors = [currentUser];
  return {
    isNew: true,
    article: {},
    initialValues: {
      content: '',
      authors: authors.map((user) => ({
        ...user,
        label: user.fullName,
        value: user.id,
      })),
    },
  };
};
const mapDispatchToProps = {
  submitArticle: createArticle,
  uploadFile,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(ArticleEditor);
