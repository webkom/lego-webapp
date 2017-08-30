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
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';

const findCurrentRegistration = (registrations, currentUser) =>
  registrations.find(registration => registration.user.id === currentUser.id);

const mapStateToProps = (state, props) => {
  const { params: { eventId }, currentUser } = props;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const comments = selectCommentsForEvent(state, { eventId });
  const poolsWithRegistrations = selectPoolsWithRegistrationsForEvent(state, {
    eventId
  });
  const registrations = selectRegistrationsFromPools(state, { eventId });

  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  let pools =
    waitingRegistrations.length > 0
      ? [
          ...poolsWithRegistrations,
          {
            name: 'Venteliste',
            registrations: waitingRegistrations,
            permissionGroups: []
          }
        ]
      : poolsWithRegistrations;
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
    ({ params: { eventId } }, dispatch) => dispatch(fetchEvent(eventId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventDetail);
