import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAll } from 'app/actions/PollActions';
import { selectPolls } from 'app/reducers/polls';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import PollsList from './components/PollsList';
import type { RootState } from 'app/store/createRootReducer';

const mapStateToProps = (state: RootState) => {
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
