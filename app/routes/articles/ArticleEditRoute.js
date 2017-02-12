import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchArticle, editArticle } from 'app/actions/ArticleActions';
import ArticleEditor from './components/ArticleEditor';
import { selectArticleById } from 'app/reducers/articles';
import { reduxForm } from 'redux-form';
import { uploadFile } from 'app/actions/FileActions';

function loadData({ articleId }, props) {
  props.fetchArticle(Number(articleId));
}

function mapStateToProps(state, props) {
  const { articleId } = props.params;
  const article = selectArticleById(state, { articleId });

  return {
    article,
    articleId,
    isNew: false,
    initialValues: {
      ...article,
      content: article.content || '<p></p>'
    }
  };
}

const mapDispatchToProps = { fetchArticle, editArticle, uploadFile };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['articleId', 'loggedIn'], loadData),
  reduxForm({
    destroyOnUnmount: false,
    form: 'article',
    enableReinitialize: true
  })
)(ArticleEditor);
