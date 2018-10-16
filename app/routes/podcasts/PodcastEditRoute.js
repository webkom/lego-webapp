import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPodcastById } from 'app/reducers/podcasts';
import { fetchPodcasts, deletePodcast } from 'app/actions/PodcastAction';
import prepare from 'app/utils/prepare';
import PodcastEditor from './components/PodcastEditor';
import { push } from 'react-router-redux';

const mapDispachToProps = { deletePodcast, push };

const mapStateToProps = (state, props) => {
  const id = props.params.podcastId;
  return {
    ...selectPodcastById(state, id),
    actionGrant: state.podcasts.actionGrant
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(mapStateToProps, mapDispachToProps)
)(PodcastEditor);
