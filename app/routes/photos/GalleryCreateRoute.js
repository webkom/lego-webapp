import { compose } from 'redux';
import { connect } from 'react-redux';
import { createGallery } from 'app/actions/GalleryActions';
import { push } from 'connected-react-router';
import GalleryEditor from './components/GalleryEditor';
import { objectPermissionsInitialValues } from 'app/components/Form/ObjectPermissions';

const mapStateToProps = () => ({
  isNew: true,
  initialValues: {
    ...objectPermissionsInitialValues
  }
});

const mapDispatchToProps = { submitFunction: createGallery, push };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(GalleryEditor);
