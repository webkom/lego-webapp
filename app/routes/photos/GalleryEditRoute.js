import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import loadingIndicator from 'app/utils/loadingIndicator';
import {
  fetch,
  deletePicture,
  updatePicture
} from 'app/actions/GalleryPictureActions';
import {
  fetchGallery,
  deleteGallery,
  updateGallery,
  updateGalleryCover
} from 'app/actions/GalleryActions';
import { push } from 'connected-react-router';
import GalleryEditor from './components/GalleryEditor';
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';

function mapStateToProps(state, props) {
  const { galleryId } = props.match.params;
  const gallery = selectGalleryById(state, { galleryId });

  return {
    isNew: false,
    gallery,
    pictures: SelectGalleryPicturesByGalleryId(state, { galleryId }),
    fetching: state.galleries.fetching || state.galleryPictures.fetching,
    hasMore: state.galleryPictures.hasMore,
    initialValues: {
      ...gallery,
      ...objectPermissionsToInitialValues(gallery),
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
  fetch,
  submitFunction: updateGallery,
  push,
  deletePicture,
  updatePicture,
  updateGalleryCover
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  prepare(({ match: { params } }, dispatch) =>
    Promise.all([
      dispatch(fetch(params.galleryId)),
      dispatch(fetchGallery(params.galleryId))
    ])
  ),
  loadingIndicator(['gallery.title'])
)(GalleryEditor);
