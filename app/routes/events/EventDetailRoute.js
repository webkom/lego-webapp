import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchEvent,
  deleteEvent,
  register,
  unregister,
  payment,
  updateFeedback
} from 'app/actions/EventActions';
import EventDetail from './components/EventDetail';
import {
  selectEventById,
  selectCommentsForEvent,
  selectPoolsWithRegistrationsForEvent,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';

const getRegistrationsFromPools = (pools = []) =>
  pools.reduce((users, pool) => [...users, ...pool.registrations], []);

const findCurrentRegistration = (registrations, currentUser) =>
  registrations.find(registration => registration.user.id === currentUser.id);

const mapStateToProps = (state, props) => {
  const { params: { eventId }, currentUser } = props;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const comments = selectCommentsForEvent(state, { eventId });
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = getRegistrationsFromPools(pools);
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  if (waitingRegistrations.length > 0) {
    pools.push({
      name: 'Venteliste',
      registrations: waitingRegistrations
    });
  }
  const currentRegistration = findCurrentRegistration(
    registrations.concat(waitingRegistrations),
    currentUser
  );

  return {
    comments,
    actionGrant,
    event,
    eventId,
    pools,
    registrations,
    currentRegistration
  };
};

const mapDispatchToProps = {
  fetchEvent,
  deleteEvent,
  register,
  unregister,
  payment,
  updateFeedback
};

export default compose(
  dispatched(
    ({ params: { eventId } }, dispatch) =>
      dispatch(fetchEvent(Number(eventId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventDetail);
