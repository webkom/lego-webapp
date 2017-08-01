import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchGallery, addPictures } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import GalleryDetail from './components/GalleryDetail';
import {
  selectGalleryById,
  selectPicturesForGallery
} from 'app/reducers/galleries';

function loadData({ galleryId }, props) {
  props.fetchGallery(props.params.galleryId);
}

function mapStateToProps(state, props) {
  const { galleryId } = props.params;

  return {
    gallery: selectGalleryById(state, { galleryId }),
    pictures: selectPicturesForGallery(state, { galleryId })
  };
}

const mapDispatchToProps = { fetchGallery, push, addPictures };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(GalleryDetail);
