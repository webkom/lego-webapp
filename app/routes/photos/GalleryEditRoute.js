import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  deleteGallery,
  fetchGallery,
  updateGallery,
  updateGalleryCover,
} from 'app/actions/GalleryActions';
import {
  deletePicture,
  fetch,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import GalleryEditor from './components/GalleryEditor';

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
      photographers: gallery.photographers.map((photographer) => ({
        label: photographer.fullName,
        value: photographer.id,
      })),
      event: gallery.event && {
        label: gallery.event.title,
        value: gallery.event.id,
      },
    },
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
  updateGalleryCover,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ match: { params } }, dispatch) =>
    Promise.all([
      dispatch(fetch(params.galleryId)),
      dispatch(fetchGallery(params.galleryId)),
    ])
  ),
  loadingIndicator(['gallery.title'])
)(GalleryEditor);
