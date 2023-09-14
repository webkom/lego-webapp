import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { uploadFile } from 'app/actions/FileActions';
import {
  fetchAll,
  fetchPage,
  updatePage,
  deletePage,
} from 'app/actions/PageActions';
import { legoForm } from 'app/components/Form/';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';
import { selectPageBySlug } from 'app/reducers/pages';
import { categoryOptions } from 'app/routes/pages/PageDetailRoute';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import PageEditor from './components/PageEditor';

function mapStateToProps(state, props) {
  const { pageSlug } = props.match.params;
  const page = selectPageBySlug(state, {
    pageSlug,
  });
  if (!page)
    return {
      isNew: false,
      pageSlug,
    };
  return {
    page,
    pageSlug,
    initialValues: {
      ...page,
      ...objectPermissionsToInitialValues(page),
      category: categoryOptions.find(
        ({ value, label }) => value === page.category
      ),
    },
  };
}

const mapDispatchToProps = {
  fetchAll,
  fetchPage,
  updatePage,
  uploadFile,
  deletePage,
  push,
};
export default compose(
  withPreparedDispatch(
    'fetchPageEdit',
    (props, dispatch) => dispatch(fetchPage(props.match.params.pageSlug)),
    (props) => [props.match.params.pageSlug]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  legoForm({
    form: 'page-edit',
  })
)(PageEditor);
