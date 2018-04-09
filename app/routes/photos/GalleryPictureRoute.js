import { connect } from 'react-redux';
import { compose } from 'redux';
import { SelectGalleryPicturesByGalleryId } from '../../reducers/galleryPictures';
import GalleryPictureModal from './components/GalleryPictureModal';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import {
  fetchSiblingGallerPicture,
  fetchGalleryPicture
} from 'app/actions/GalleryPictureActions';
import {
  selectGalleryPictureById,
  selectCommentsForGalleryPicture
} from 'app/reducers/galleryPictures';
import { deletePicture } from 'app/actions/GalleryPictureActions';
import { updateGalleryCover } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  const { galleryId, pictureId } = props.params;
  const pictures = SelectGalleryPicturesByGalleryId(state, { galleryId });
  const picture = selectGalleryPictureById(state, { pictureId });
  const comments = selectCommentsForGalleryPicture(state, { pictureId });
  const actionGrant = state.galleries.byId[galleryId].actionGrant;
  const fetching = state.galleries.fetching || state.galleryPictures.fetching;
  const hasMore = state.galleryPictures.hasMore;

  let isFirstImage = false;
  let isLastImage = false;
  if (pictures.length > 0 && pictureId) {
    if (Number(pictures[0].id) === Number(pictureId)) {
      isFirstImage = true;
    }
    if (
      Number(pictures[pictures.length - 1].id) === Number(pictureId) &&
      !hasMore
    ) {
      isLastImage = true;
    }
  }

  return {
    isFirstImage,
    isLastImage,
    fetching,
    hasMore,
    pictures,
    actionGrant,
    comments,
    picture,
    pictureId
  };
}

const mapDispatchToProps = {
  push,
  deletePicture,
  updateGalleryCover,
  fetchSiblingGallerPicture
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ params }, dispatch) =>
    dispatch(fetchGalleryPicture(params.galleryId, params.pictureId))
  ),
  loadingIndicator(['picture.id'])
)(GalleryPictureModal);
