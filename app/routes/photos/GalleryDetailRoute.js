import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchGallery } from 'app/actions/GalleryActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import {
  fetch,
  uploadAndCreateGalleryPicture
} from 'app/actions/GalleryPictureActions';
import { push } from 'react-router-redux';
import GalleryDetail from './components/GalleryDetail';
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';

function mapStateToProps(state, props) {
  const { galleryId } = props.params;

  console.log(SelectGalleryPicturesByGalleryId(state, { galleryId }));
  return {
    gallery: selectGalleryById(state, { galleryId }),
    pictures: SelectGalleryPicturesByGalleryId(state, { galleryId }),
    fetching: state.galleries.fetching || state.galleryPictures.fetching,
    hasMore: state.galleryPictures.hasMore
  };
}

const mapDispatchToProps = { push, fetch, uploadAndCreateGalleryPicture };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(({ params }, dispatch) =>
    Promise.all([
      dispatch(fetch(params.galleryId)),
      dispatch(fetchGallery(params.galleryId))
    ])
  ),
  loadingIndicator(['gallery.title'])
)(GalleryDetail);
