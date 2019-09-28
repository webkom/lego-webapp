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
import { selectGalleryById } from 'app/reducers/galleries';
import { push } from 'connected-react-router';

function mapStateToProps(state, props) {
  const { pictureId, galleryId } = props.match.params;
  const picture = selectGalleryPictureById(state, { pictureId });
  const comments = selectCommentsForGalleryPicture(state, { pictureId });
  const gallery = selectGalleryById(state, { galleryId });

  return {
    comments,
    picture,
    gallery,
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
  updatePicture,
  push
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['picture.id'])
)(GalleryPictureEditModal);
