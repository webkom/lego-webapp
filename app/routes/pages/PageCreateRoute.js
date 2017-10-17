import { compose } from 'redux';
import { connect } from 'react-redux';
import { createPage } from 'app/actions/PageActions';
import PageEditor from './components/PageEditor';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  return {
    isNew: true,
    page: {}
  };
}

const mapDispatchToProps = { createPage, uploadFile, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-create'
  })
)(PageEditor);
