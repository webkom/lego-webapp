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
import { reduxForm } from 'redux-form';
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
    initialValues: {
      content: page.content,
      title: page.title
    }
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
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-edit',
    enableReinitialize: true
  })
)(PageEditor);
