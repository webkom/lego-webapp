import { connect } from 'react-redux';
import GalleryEditor from './components/GalleryEditor';
import { createGallery } from 'app/actions/GalleryActions';
import { uploadFile } from 'app/actions/FileActions';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

const mapStateToProps = () => ({
  isNew: true,
  gallery: {}
});

const mapDispatchToProps = { createGallery, uploadFile };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'gallery'
  })
)(GalleryEditor);
