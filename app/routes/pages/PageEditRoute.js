import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchAll,
  fetchPage,
  updatePage,
  deletePage,
} from 'app/actions/PageActions';
import { uploadFile } from 'app/actions/FileActions';
import PageEditor from './components/PageEditor';
import { legoForm } from 'app/components/Form/';
import { selectPageBySlug, categoryOptions } from 'app/reducers/pages';
import { push } from 'connected-react-router';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';

function mapStateToProps(state, props) {
  const { pageSlug } = props.match.params;
  const page = selectPageBySlug(state, { pageSlug });
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
  prepare(
    (
      {
        match: {
          params: { pageSlug },
        },
      },
      dispatch
    ) => dispatch(fetchPage(pageSlug)),
    ['match.params.pageSlug']
  ),
  connect(mapStateToProps, mapDispatchToProps),
  legoForm({
    form: 'page-edit',
  })
)(PageEditor);
