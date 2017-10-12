import { compose } from 'redux';
import { dispatched } from 'react-prepare';
import { connect } from 'react-redux';
import { fetchAll, fetchPage, updatePage } from 'app/actions/PageActions';
import { uploadFile } from 'app/actions/FileActions';
import PageEditor from './components/PageEditor';
import { reduxForm } from 'redux-form';
import {
  selectParent,
  selectPageBySlug,
  selectPages
} from 'app/reducers/pages';
import { isEmpty } from 'lodash';

function loadData({ pageSlug }, props) {
  return props.fetchPage(pageSlug).then(() => props.fetchAll());
}

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  if (isEmpty(page))
    return {
      isNew: false
    };
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
  dispatched((props, dispatch) => dispatch(loadData())),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'page-edit',
    enableReinitialize: true
  })
)(PageEditor);
