import { connect } from 'react-redux';
import ArticleEditor from './components/ArticleEditor';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

const mapStateToProps = () => ({
  isNew: true,
  article: {},
  initialValues: {
    content: '<p></p>'
  }
});

const mapDispatchToProps = { createArticle, uploadFile };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'article'
  })
)(ArticleEditor);
