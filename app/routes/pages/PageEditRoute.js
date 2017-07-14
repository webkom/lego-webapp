import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchAll, fetchPage, updatePage } from 'app/actions/PageActions';
import { uploadFile } from 'app/actions/FileActions';
import PageEditor from './components/PageEditor';
import { reduxForm } from 'redux-form';
import {
  selectParent,
  selectPageBySlug,
  selectPages
} from 'app/reducers/pages';

function loadData({ pageSlug }, props) {
  props.fetchPage(pageSlug);
  props.fetchAll();
}

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  const parent = selectParent(state, { parentPk: page.parent });
  const pages = selectPages(state);
  return {
    parent,
    pages,
    page,
    pageSlug,
    initialValues: {
      content: page.content,
      title: page.title,
      parent: {
        label: parent.title,
        value: parent.pk
      }
    }
  };
}

const mapDispatchToProps = { fetchAll, fetchPage, updatePage, uploadFile };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['pageSlug', 'loggedIn'], loadData),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-edit',
    enableReinitialize: true
  })
)(PageEditor);
