import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchArticle,
  editArticle,
  deleteArticle,
} from 'app/actions/ArticleActions';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';
import { LoginPage } from 'app/components/LoginForm';
import { selectArticleById } from 'app/reducers/articles';
import { selectCurrentUser } from 'app/reducers/auth';
import { selectUserById } from 'app/reducers/users';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import ArticleEditor from './components/ArticleEditor';

const mapStateToProps = (state, props) => {
  const { articleId } = props.match.params;
  const article = selectArticleById(state, {
    articleId,
  });

  const currentUser = selectCurrentUser(state);
  const authors = article?.authors?.length
    ? article.authors.map((e) => selectUserById(state, { userId: e }))
    : [currentUser];

  return {
    article,
    articleId,
    isNew: false,
    initialValues: {
      ...article,
      ...objectPermissionsToInitialValues({
        canViewGroups: article.canViewGroups,
        canEditGroups: article.canEditGroups,
        canEditUsers: article.canEditUsers,
      }),
      authors: authors
        .filter(Boolean)
        .map((user) => ({ user, label: user.fullName, value: user.id })),
      tags: (article.tags || []).map((tag) => ({
        label: tag,
        value: tag,
      })),
    },
  };
};

const mapDispatchToProps = {
  deleteArticle,
  fetchArticle,
  submitArticle: editArticle,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch(
    'fetchArticleEdit',
    (
      {
        match: {
          params: { articleId },
        },
      },
      dispatch
    ) => dispatch(fetchArticle(articleId))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['article.content'])
)(ArticleEditor);
