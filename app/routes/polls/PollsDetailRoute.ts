import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchPoll,
  deletePoll,
  editPoll,
  votePoll,
} from 'app/actions/PollActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectPollById } from 'app/reducers/polls';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import PollDetail from './components/PollDetail';

const mapStateToProps = (state, props) => {
  const id = props.match.params.pollsId;
  const poll = selectPollById(state, id);
  if (!poll) return {};
  return {
    poll: poll,
    fetching: state.polls.fetching,
    actionGrant: poll.actionGrant ? poll.actionGrant : [],
    initialValues: {
      pollId: id,
      title: poll.title,
      description: poll.description,
      resultsHidden: poll.resultsHidden,
      pinned: poll.pinned,
      tags: poll.tags.map((value) => ({
        className: 'Select-create-option-placeholder',
        label: value,
        value: value,
      })),
      options: poll.options,
    },
  };
};

const mapDispatchToProps = {
  deletePoll,
  editPoll,
  votePoll,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchPollsDetail', (props, dispatch) =>
    dispatch(fetchPoll(props.match.params.pollsId)),
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['poll.id']),
)(PollDetail);
