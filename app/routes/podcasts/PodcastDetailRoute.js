import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPodcastById } from 'app/reducers/podcasts';
import { fetchPodcasts } from 'app/actions/PodcastAction';
import prepare from 'app/utils/prepare';
import Podcast from './components/Podcast';

const mapStateToProps = (state, props) => {
  const id = props.params.podcastId;
  return {
    podcasts: selectPodcastById(state, id),
    actionGrant: state.podcasts.actionGrant
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(mapStateToProps, null)
)(Podcast);
