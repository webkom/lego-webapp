// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/MeetingActions';
import MeetingList from './components/MeetingList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  const meetings = state.meetings.items.map((id) => state.meetings.byId[id]);
  const usernameMe = state.auth.username;
  return {
    meetings,
    usernameMe,
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(MeetingList);
