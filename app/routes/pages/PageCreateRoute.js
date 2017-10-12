import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll, createPage } from 'app/actions/PageActions';
import { dispatched } from 'react-prepare';
import PageEditor from './components/PageEditor';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { selectPages } from 'app/reducers/pages';

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
  dispatched((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-create'
  })
)(PageEditor);
