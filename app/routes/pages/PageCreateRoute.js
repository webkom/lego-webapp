import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchAll, createPage } from 'app/actions/PageActions';
import PageEditor from './components/PageEditor';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { selectPages } from 'app/reducers/pages';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state, props) {
  const pages = selectPages(state);
  return {
    isNew: true,
    pages,
    page: {}
  };
}

const mapDispatchToProps = { fetchAll, createPage, uploadFile };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-create'
  })
)(PageEditor);
