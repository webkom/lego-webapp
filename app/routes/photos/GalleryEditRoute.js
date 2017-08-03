import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchGallery,
  deletePicture,
  editPicture
} from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import GalleryEditor from './components/GalleryEditor';
import { reduxForm } from 'redux-form';
import {
  selectGalleryById,
  selectPicturesForGallery
} from 'app/reducers/galleries';

function loadData({ galleryId }, props) {
  props.fetchGallery(props.params.galleryId);
}

function mapStateToProps(state, props) {
  const { galleryId } = props.params;
  const gallery = selectGalleryById(state, { galleryId });

  return {
    isNew: false,
    gallery,
    pictures: selectPicturesForGallery(state, { galleryId }),
    initialValues: gallery
  };
}

const mapDispatchToProps = { fetchGallery, push, deletePicture, editPicture };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['galleryId', 'loggedIn'], loadData),
  reduxForm({
    destroyOnUnmount: false,
    form: 'gallery',
    enableReinitialize: true
  })
)(GalleryEditor);
