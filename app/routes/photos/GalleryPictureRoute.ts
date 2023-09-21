import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { updateGalleryCover, fetchGallery } from 'app/actions/GalleryActions';
import {
  fetchSiblingGallerPicture,
  fetchGalleryPicture,
  deletePicture,
} from 'app/actions/GalleryPictureActions';
import { selectGalleryById } from 'app/reducers/galleries';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import {
  SelectGalleryPicturesByGalleryId,
  selectGalleryPictureById,
  selectCommentsForGalleryPicture,
} from '../../reducers/galleryPictures';
import GalleryPictureModal from './components/GalleryPictureModal';

function mapStateToProps(state, props) {
  const { galleryId, pictureId } = props.match.params;
  const pictures = SelectGalleryPicturesByGalleryId(state, {
    galleryId,
  });
  const picture = selectGalleryPictureById(state, {
    pictureId,
  });
  const comments = selectCommentsForGalleryPicture(state, {
    pictureId,
  });
  const actionGrant = state.galleries.byId[galleryId]
    ? state.galleries.byId[galleryId].actionGrant
    : [];
  const fetching = state.galleries.fetching || state.galleryPictures.fetching;
  const hasMore = state.galleryPictures.hasMore;
  const gallery = selectGalleryById(state, {
    galleryId,
  });
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
    pictureId,
    gallery,
  };
}

const mapDispatchToProps = {
  push,
  deletePicture,
  updateGalleryCover,
  fetchSiblingGallerPicture,
};

const propertyGenerator = (props, config) => {
  if (!props.picture) return;
  const url = `${config.webUrl}/gallery/${props.gallery.id}/picture/${props.picture.id}/`;
  // Becuase the parent route sets the title and description
  // based on the metadata of the gallery, we don't have to do it
  // explicitly here.
  return [
    {
      element: 'link',
      rel: 'canonical',
      href: url,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:image',
      content: props.picture.file,
    },
  ];
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch(
    'fetchGalleryPicture',
    ({ match: { params } }, dispatch) =>
      Promise.all([
        dispatch(fetchGalleryPicture(params.galleryId, params.pictureId)),
        dispatch(fetchGallery(params.galleryId)),
      ])
  ),
  helmet(propertyGenerator),
  loadingIndicator(['picture.id', 'gallery.id'])
)(GalleryPictureModal);
