import { connect } from 'react-redux';
import GalleryPictureEditModal from './components/GalleryPictureEditModal';
import {
  deletePicture,
  updatePicture
} from 'app/actions/GalleryPictureActions';
import { compose } from 'redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import {
  selectGalleryPictureById,
  selectCommentsForGalleryPicture
} from 'app/reducers/galleryPictures';

function mapStateToProps(state, props) {
  const { pictureId } = props.params;
  const picture = selectGalleryPictureById(state, { pictureId });
  const comments = selectCommentsForGalleryPicture(state, { pictureId });

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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['picture.id'])
)(GalleryPictureEditModal);
