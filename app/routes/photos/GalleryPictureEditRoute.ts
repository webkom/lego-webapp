import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  deletePicture,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import { selectGalleryById } from 'app/reducers/galleries';
import {
  selectGalleryPictureById,
  selectCommentsForGalleryPicture,
} from 'app/reducers/galleryPictures';
import loadingIndicator from 'app/utils/loadingIndicator';
import GalleryPictureEditModal from './components/GalleryPictureEditModal';

function mapStateToProps(state, props) {
  const { pictureId, galleryId } = props.match.params;
  const picture = selectGalleryPictureById(state, {
    pictureId,
  });
  const comments = selectCommentsForGalleryPicture(state, {
    pictureId,
  });
  const gallery = selectGalleryById(state, {
    galleryId,
  });
  return {
    comments,
    picture,
    gallery,
    initialValues: {
      ...picture,
      taggees:
        picture &&
        picture.taggees.map((taggee) => ({
          value: taggee.id,
          label: taggee.fullName,
        })),
    },
  };
}

const mapDispatchToProps = {
  deletePicture,
  updatePicture,
  push,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['picture.id'])
)(GalleryPictureEditModal);
