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
  return props.fetchEvent(Number(eventId));
}

function selectRegistrations(pools) {
  return (pools || [])
    .reduce((users, pool) => (
      [...users, ...pool.registrations]
    ), []);
}

function selectCurrentRegistration(registrations, currentUser) {
  return registrations.find((reg) => (
    reg.user.id === currentUser.id
  ));
}

function mapStateToProps(state, props) {
  const { eventId } = props.params;
  const event = selectEventById(state, { eventId });
  const comments = selectCommentsForEvent(state, { eventId });
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = selectRegistrations(pools);
  const currentRegistration = selectCurrentRegistration(registrations, props.currentUser);

  return {
    comments,
    event,
    eventId,
    pools,
    registrations,
    currentRegistration
  };
}

const mapDispatchToProps = { fetchEvent, register, unregister, payment };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId', 'loggedIn'], loadData),
)(EventDetail);
