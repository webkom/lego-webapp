import { compose } from 'redux';
import { connect } from 'react-redux';
import { createGallery } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import GalleryEditor from './components/GalleryEditor';

const mapStateToProps = () => ({
  isNew: true
});

const mapDispatchToProps = { submitFunction: createGallery, push };

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  GalleryEditor
);
