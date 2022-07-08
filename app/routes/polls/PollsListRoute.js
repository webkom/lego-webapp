import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/PollActions';
import { selectPolls } from 'app/reducers/polls';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import PollsList from './components/PollsList';

const mapStateToProps = (state, props) => {
  return {
    polls: selectPolls(state),
    actionGrant: state.polls.actionGrant,
    fetching: state.polls.fetching,
    hasMore: state.polls.hasMore,
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['polls'])
)(PollsList);
