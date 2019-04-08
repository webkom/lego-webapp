import { compose } from 'redux';
import { connect } from 'react-redux';
import { createPage } from 'app/actions/PageActions';
import PageEditor from './components/PageEditor';
import { uploadFile } from 'app/actions/FileActions';
import { legoForm } from 'app/components/Form';
import { push } from 'connected-react-router';

function mapStateToProps(state, props) {
  return {
    isNew: true,
    page: {}
  };
}

const mapDispatchToProps = { createPage, uploadFile, push };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  legoForm({
    form: 'page-create'
  })
)(PageEditor);
