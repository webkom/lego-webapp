import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectPollsById } from 'app/reducers/polls';
import { fetchPoll } from 'app/actions/PollActions';
import prepare from 'app/utils/prepare';
import PollDetail from './components/PollDetail'
import { deletePoll, editPoll, votePoll } from 'app/actions/PollActions'
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, props) => {
  const id = props.params.pollsId;
  const poll = selectPollsById(state, id);

  if (poll) return {
    poll: poll,
    fetching: state.polls.fetching,
    actionGrant: poll.actionGrant ? poll.actionGrant : [],
    initialValues: {
      pollId: id,
      title: poll.title,
      description: poll.description,
      pinned: poll.pinned,
      tags: poll.tags.map(value => ({
        className: 'Select-create-option-placeholder',
        label: value,
        value: value
      })),
      options: poll.options,
    }
  };
};


const mapDispatchToProps = {
  deletePoll,
  editPoll,
  votePoll
};


export default compose(
  prepare((props, dispatch) => dispatch(fetchPoll(props.params.pollsId))),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['poll.id'])
)(PollDetail);
