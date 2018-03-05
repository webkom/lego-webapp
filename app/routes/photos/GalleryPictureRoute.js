import { connect } from 'react-redux';
import { compose } from 'redux';
import GalleryPictureModal from './components/GalleryPictureModal';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import { fetchGalleryPicture } from 'app/actions/GalleryPictureActions';
import {
  selectGalleryPictureById,
  selectCommentsForGalleryPicture
} from 'app/reducers/galleryPictures';
import { deletePicture } from 'app/actions/GalleryPictureActions';
import { updateGalleryCover } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  const { galleryId, pictureId } = props.params;
  const picture = selectGalleryPictureById(state, { pictureId });
  const comments = selectCommentsForGalleryPicture(state, { pictureId });
  const actionGrant = state.galleries.byId[galleryId].actionGrant;
  return {
    actionGrant,
    comments,
    picture,
    pictureId
  };
}

const mapDispatchToProps = {
  push,
  deletePicture,
  updateGalleryCover
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ params }, dispatch) =>
    dispatch(fetchGalleryPicture(params.galleryId, params.pictureId))
  ),
  loadingIndicator(['picture.id'])
)(GalleryPictureModal);
