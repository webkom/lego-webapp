import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import { uploadFile } from 'app/actions/FileActions';
import {
  deletePage,
  fetchAll,
  fetchPage,
  updatePage,
} from 'app/actions/PageActions';
import { legoForm } from 'app/components/Form/';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';
import { categoryOptions, selectPageBySlug } from 'app/reducers/pages';
import prepare from 'app/utils/prepare';
import PageEditor from './components/PageEditor';

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
