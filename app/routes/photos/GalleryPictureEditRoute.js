import { connect } from 'react-redux';
import GalleryPictureEditModal from './components/GalleryPictureEditModal';
import { deletePicture, updatePicture } from 'app/actions/GalleryActions';
import {
  selectPictureById,
  selectCommentsForPicture
} from 'app/reducers/galleryPictures';

function mapStateToProps(state, props) {
  const { pictureId } = props.params;
  const picture = selectPictureById(state, { pictureId });
  const comments = selectCommentsForPicture(state, { pictureId });

  return {
    comments,
    picture,
    initialValues: {
      ...picture,
      taggees:
        picture &&
        picture.taggees.map(taggee => ({
          value: taggee.id,
          label: taggee.fullName
        }))
    }
  };
}

const mapDispatchToProps = {
  deletePicture,
  updatePicture
};

export default connect(mapStateToProps, mapDispatchToProps)(
  GalleryPictureEditModal
);
