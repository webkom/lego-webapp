import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchEvent } from 'app/actions/EventActions';
import EventDetail from './components/EventDetail';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

function mapStateToProps(state, props) {
  const { eventId } = props.params;
  const event = state.events.byId[eventId];
  const comments = event ? (event.comments || []).map((id) => state.comments.byId[id]) : [];

  return {
    loggedIn: state.auth.token !== null,
    user: state.auth,
    comments,
    event,
    eventId
  };
}

const mapDispatchToProps = { fetchEvent };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId'], loadData),
)(EventDetail);
