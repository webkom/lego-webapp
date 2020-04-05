import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPodcastById } from 'app/reducers/podcasts';
import {
  fetchPodcasts,
  deletePodcast,
  editPodcast
} from 'app/actions/PodcastAction';
import prepare from 'app/utils/prepare';
import PodcastEditor from './components/PodcastEditor';
import { push } from 'connected-react-router';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapDispachToProps = {
  deletePodcast,
  push,
  handleSubmitCallback: editPodcast
};

const mapStateToProps = (state, props) => {
  const id = props.match.params.podcastId;
  const podcast = selectPodcastById(state, id) || {};

  return {
    initialValues: {
      ...podcast,
      authors: (podcast.authors || []).filter(Boolean).map(user => ({
        label: user.username,
        value: user.id
      })),
      thanks: (podcast.thanks || []).filter(Boolean).map(user => ({
        label: user.username,
        value: user.id
      }))
    },
    actionGrant: state.podcasts.actionGrant
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(
    mapStateToProps,
    mapDispachToProps
  ),
  loadingIndicator(['initialValues.id'])
)(PodcastEditor);
