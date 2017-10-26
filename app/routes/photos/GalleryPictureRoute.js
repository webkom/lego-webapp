import { connect } from 'react-redux';
import GalleryPictureModal from './components/GalleryPictureModal';
import {
  selectPictureById,
  selectCommentsForPicture
} from 'app/reducers/galleryPictures';
import { deletePicture, updateGalleryCover } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';

function mapStateToProps(state, props) {
  const { pictureId } = props.params;
  const picture = selectPictureById(state, { pictureId });
  const comments = selectCommentsForPicture(state, { pictureId });

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

export default connect(mapStateToProps, mapDispatchToProps)(
  GalleryPictureModal
);
