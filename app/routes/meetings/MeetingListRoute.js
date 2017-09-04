// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/MeetingActions';
import MeetingList from './components/MeetingList';
import { dispatched } from 'react-prepare';

const mapStateToProps = state => {
  // TODO: Write selectors for meetings
  const meetings = state.meetings.items.map(id => state.meetings.byId[id]);
  const userMe = state.users.byId[state.auth.username];
  return {
    meetings,
    userMe
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
