import { connect } from 'react-redux';
import ArticleEditor from './components/ArticleEditor';
import { createArticle } from 'app/actions/ArticleActions';
import { uploadFile } from 'app/actions/FileActions';

const mapStateToProps = () => ({ isNew: true, article: {} });

const mapDispatchToProps = {
  createArticle,
  uploadFile
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEditor);
