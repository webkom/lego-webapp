import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { uploadFile } from 'app/actions/FileActions';
import { createPage } from 'app/actions/PageActions';
import { legoForm } from 'app/components/Form';
import PageEditor from './components/PageEditor';

function mapStateToProps() {
  return {
    isNew: true,
    page: {},
  };
}

const mapDispatchToProps = {
  createPage,
  uploadFile,
  push,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  legoForm({
    form: 'page-create',
  }),
)(PageEditor);
