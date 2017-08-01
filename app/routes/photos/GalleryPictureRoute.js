import { connect } from 'react-redux';
import GalleryPictureModal from './components/GalleryPictureModal';
import {
  selectPictureById,
  selectCommentsForPicture
} from 'app/reducers/pictures';

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

export default connect(mapStateToProps)(GalleryPictureModal);
