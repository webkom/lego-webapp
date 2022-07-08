import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  deletePodcast,
  editPodcast,
  fetchPodcasts,
} from 'app/actions/PodcastAction';
import { selectPodcastById } from 'app/reducers/podcasts';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import PodcastEditor from './components/PodcastEditor';

const mapDispachToProps = {
  deletePodcast,
  push,
  handleSubmitCallback: editPodcast,
};

const mapStateToProps = (state, props) => {
  const id = props.match.params.podcastId;
  const podcast = selectPodcastById(state, id) || {};

  return {
    initialValues: {
      ...podcast,
      authors: (podcast.authors || []).filter(Boolean).map((user) => ({
        label: user.username,
        value: user.id,
      })),
      thanks: (podcast.thanks || []).filter(Boolean).map((user) => ({
        label: user.username,
        value: user.id,
      })),
    },
    actionGrant: state.podcasts.actionGrant,
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(mapStateToProps, mapDispachToProps),
  loadingIndicator(['initialValues.id'])
)(PodcastEditor);
