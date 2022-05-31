import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPodcasts } from 'app/reducers/podcasts';
import { fetchPodcasts, addPodcast } from 'app/actions/PodcastAction';
import prepare from 'app/utils/prepare';
import PodcastEditor from './components/PodcastEditor';

const mapStateToProps = (state, props) => {
  return {
    isNew: true,
    podcasts: selectPodcasts(state),
    actionGrant: state.podcasts.actionGrant,
    initialValues: {},
  };
};

const mapDispachToProps = {
  handleSubmitCallback: addPodcast,
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(mapStateToProps, mapDispachToProps)
)(PodcastEditor);
