import { compose } from 'redux';
import { dispatched } from '@webkom/react-prepare';
import { connect } from 'react-redux';
import {
  fetchAll,
  fetchPage,
  updatePage,
  deletePage
} from 'app/actions/PageActions';
import { uploadFile } from 'app/actions/FileActions';
import PageEditor from './components/PageEditor';
import { legoForm } from 'app/components/Form/';
import { selectPageBySlug } from 'app/reducers/pages';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  if (!page)
    return {
      isNew: false,
      pageSlug
    };
  return {
    page,
    pageSlug,
    initialValues: page
  };
}

const mapDispatchToProps = {
  fetchAll,
  fetchPage,
  updatePage,
  uploadFile,
  deletePage,
  push
};

export default compose(
  dispatched(({ params: { pageSlug } }, dispatch) =>
    dispatch(fetchPage(pageSlug))
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  legoForm({
    form: 'page-edit'
  })
)(PageEditor);
