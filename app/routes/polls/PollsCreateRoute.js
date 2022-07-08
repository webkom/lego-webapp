import { connect } from 'react-redux';
import { compose } from 'redux';

import { createPoll } from 'app/actions/PollActions';
import PollEditor from './components/PollEditor';

const mapDispatchToProps = {
  editOrCreatePoll: createPoll,
};

export default compose(connect(null, mapDispatchToProps))(PollEditor);
