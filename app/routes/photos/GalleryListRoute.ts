import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetch } from 'app/actions/GalleryActions';
import { selectGalleries } from 'app/reducers/galleries';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Overview from './components/Overview';

const mapStateToProps = (state) => {
  const actionGrant = state.galleries.actionGrant;
  return {
    actionGrant,
    galleries: selectGalleries(state),
    fetching: state.galleries.fetching,
    hasMore: state.galleries.hasMore,
  };
};

const mapDispatchToProps = {
  fetch,
  push,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchGalleryList', (props, dispatch) =>
    dispatch(fetch()),
  ),
)(Overview);
