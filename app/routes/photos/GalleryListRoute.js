import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetch } from 'app/actions/GalleryActions';
import { push } from 'react-router-redux';
import Overview from './components/Overview';
import { selectGalleries } from 'app/reducers/galleries';

const mapStateToProps = state => ({
  galleries: selectGalleries(state),
  fetching: state.galleries.fetching,
  hasMore: state.galleries.hasMore
});

const mapDispatchToProps = { fetch, push };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare((props, dispatch) => dispatch(fetch()))
)(Overview);
