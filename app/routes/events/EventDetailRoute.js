import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchEvent,
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

function getRegistrationsFromPools(pools = []) {
  return pools.reduce((users, pool) => [...users, ...pool.registrations], []);
}

function findCurrentRegistration(registrations, currentUser) {
  return registrations.find(
    registration => registration.user.id === currentUser.id
  );
}

const mapStateToProps = (state, props) => {
  const {
    params: {
      eventId
    },
    currentUser
  } = props;

  const event = selectEventById(state, { eventId });
  const actionGrant = state.events.actionGrant;
  const comments = selectCommentsForEvent(state, { eventId });
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = getRegistrationsFromPools(pools);
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const poolsWithWaitingRegistrations = waitingRegistrations.length > 0
    ? [
        ...pools,
        {
          name: 'Venteliste',
          registrations: waitingRegistrations
        }
      ]
    : pools;
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
    currentRegistration,
    waitingRegistrations,
    poolsWithWaitingRegistrations
  };
};

const mapDispatchToProps = {
  fetchEvent,
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
