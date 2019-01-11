import { compose } from 'redux';
import { connect } from 'react-redux';

import { createPoll } from 'app/actions/PollActions';
import PollEditor from './components/PollEditor';

const mapStateToProps = (state, props) => {
  return {
    actionGrant: state.polls.actionGrant,
  };
};

const mapDispachToProps = {
  editOrCreatePoll: createPoll
};

export default compose(
  connect(
    mapStateToProps,
    mapDispachToProps
  )
)(PollEditor);
