import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
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

function loadData({ eventId }, props) {
  return props.fetchEvent(Number(eventId));
}

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
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId', 'loggedIn'], loadData)
)(EventDetail);
