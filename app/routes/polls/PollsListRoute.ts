import { compose } from 'redux';
import { connect } from 'react-redux';
import loadingIndicator from 'app/utils/loadingIndicator';
import { selectPolls } from 'app/store/slices/pollsSlice';
import { fetchAll } from 'app/actions/PollActions';
import PollsList from './components/PollsList';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  return {
    polls: selectPolls(state),
    actionGrant: state.polls.actionGrant,
    fetching: state.polls.fetching,
    hasMore: state.polls.hasMore,
  };
};

const mapDispatchToProps = {
  fetchAll,
};
export default compose(
  withPreparedDispatch('fetchPollsList', (props, dispatch) =>
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['polls'])
)(PollsList);
