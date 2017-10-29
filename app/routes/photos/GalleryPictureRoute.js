import { connect } from 'react-redux';
import { compose } from 'redux';
import GalleryPictureModal from './components/GalleryPictureModal';
import loadingIndicator from 'app/utils/loadingIndicator';
import {
  selectGalleryPictureById,
  selectCommentsForGalleryPicture
} from 'app/reducers/galleryPictures';
import { deletePicture } from 'app/actions/GalleryPictureActions';
import { updateGalleryCover } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  const { pictureId } = props.params;
  const picture = selectGalleryPictureById(state, { pictureId });
  const comments = selectCommentsForGalleryPicture(state, { pictureId });

  return {
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
  loadingIndicator(['picture.id'])
)(GalleryPictureModal);
