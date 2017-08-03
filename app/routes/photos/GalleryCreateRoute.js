import { compose } from 'redux';
import { connect } from 'react-redux';
import { createGallery } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import GalleryEditor from './components/GalleryEditor';
import { reduxForm } from 'redux-form';

function mapStateToProps(state, props) {
  return {
    isNew: true
  };
}

const mapDispatchToProps = { createGallery, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: false,
    form: 'gallery'
  })
)(GalleryEditor);
