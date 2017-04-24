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
  selectPoolsWithRegistrationsForEvent
} from 'app/reducers/events';

function getRegistrationsFromPools(pools = []) {
  return pools.reduce((users, pool) => [...users, ...pool.registrations], []);
}

function findCurrentRegistration(registrations, currentUser) {
  return registrations.find(
    registration => registration.user.id === currentUser.id
  );
}

function mapStateToProps(state, props) {
  const {
    params: {
      eventId
    },
    currentUser
  } = props;

  const event = selectEventById(state, { eventId });
  const comments = selectCommentsForEvent(state, { eventId });
  const pools = selectPoolsWithRegistrationsForEvent(state, { eventId });

  const registrations = getRegistrationsFromPools(pools);
  const currentRegistration = findCurrentRegistration(
    registrations,
    currentUser
  );

  return {
    comments,
    event,
    eventId,
    pools,
    registrations,
    currentRegistration
  };
}

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
