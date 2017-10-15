import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  updateGallery,
  fetchGallery,
  deletePicture,
  deleteGallery,
  updatePicture,
  updateGalleryCover
} from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import GalleryEditor from './components/GalleryEditor';
import {
  selectGalleryById,
  selectPicturesForGallery
} from 'app/reducers/galleries';

function mapStateToProps(state, props) {
  const { galleryId } = props.params;
  const gallery = selectGalleryById(state, { galleryId });

  return {
    isNew: false,
    gallery,
    pictures: selectPicturesForGallery(state, { galleryId }),
    initialValues: {
      ...gallery,
      photographers: gallery.photographers.map(photographer => ({
        label: photographer.fullName,
        value: photographer.id
      })),
      event: gallery.event && {
        label: gallery.event.title,
        value: gallery.event.id
      }
    }
  };
}

const mapDispatchToProps = {
  fetchGallery,
  deleteGallery,
  updateGallery,
  push,
  deletePicture,
  updatePicture,
  updateGalleryCover
};

export default compose(
  dispatched(
    ({ params: { galleryId } }, dispatch) => dispatch(fetchGallery(galleryId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(GalleryEditor);
