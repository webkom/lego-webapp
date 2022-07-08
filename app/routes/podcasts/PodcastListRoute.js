import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchPodcasts } from 'app/actions/PodcastAction';
import { selectPodcasts } from 'app/reducers/podcasts';
import prepare from 'app/utils/prepare';
import PodcastList from './components/PodcastList';

const mapStateToProps = (state, props) => {
  return {
    podcasts: selectPodcasts(state),
    actionGrant: state.podcasts.actionGrant,
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(mapStateToProps, null)
)(PodcastList);
