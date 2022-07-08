import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import { createGallery } from 'app/actions/GalleryActions';
import { objectPermissionsInitialValues } from 'app/components/Form/ObjectPermissions';
import GalleryEditor from './components/GalleryEditor';

const mapStateToProps = () => ({
  isNew: true,
  initialValues: {
    ...objectPermissionsInitialValues,
  },
});

const mapDispatchToProps = { submitFunction: createGallery, push };

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  GalleryEditor
);
