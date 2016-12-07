import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import {
  fetchEvent,
  register,
  unregister,
  payment
} from 'app/actions/EventActions';
import EventDetail from './components/EventDetail';
import {
  selectEventById,
  selectCommentsForEvent,
  selectPoolsWithRegistrationsForEvent
} from 'app/reducers/events';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

function mapStateToProps(state, props) {
  const { eventId } = props.params;
  const event = selectEventById(state, { eventId });
  const comments = selectCommentsForEvent(state, { eventId });
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  return {
    comments,
    event,
    eventId,
    pools
  };
}

const mapDispatchToProps = { fetchEvent, register, unregister, payment };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId', 'loggedIn'], loadData),
)(EventDetail);
