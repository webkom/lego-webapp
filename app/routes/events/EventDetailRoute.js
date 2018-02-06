import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchEvent,
  deleteEvent,
  register,
  unregister,
  payment,
  updateFeedback,
  follow,
  unfollow,
  isUserFollowing
} from 'app/actions/EventActions';
import { updateUser } from 'app/actions/UserActions';
import EventDetail from './components/EventDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import {
  selectEventById,
  selectCommentsForEvent,
  selectPoolsWithRegistrationsForEvent,
  selectPoolsForEvent,
  selectRegistrationsFromPools,
  selectMergedPoolWithRegistrations,
  selectMergedPool,
  selectWaitingRegistrationsForEvent
} from 'app/reducers/events';
import isArray from 'lodash/isArray';

const findCurrentRegistration = (registrations, currentUser) =>
  registrations.find(registration => registration.user.id === currentUser.id);

const mapStateToProps = (state, props) => {
  const { params: { eventId }, currentUser } = props;

  const event = selectEventById(state, { eventId });

  const actionGrant = state.events.actionGrant;

  const hasFullAccess = isArray(event.waitingRegistrations);

  if (!hasFullAccess) {
    const pools = event.isMerged
      ? selectMergedPool(state, { eventId })
      : selectPoolsForEvent(state, {
          eventId
        });
    return {
      actionGrant,
      loading: state.events.fetching,
      event,
      eventId,
      pools,
      comments: []
    };
  }
  const comments = selectCommentsForEvent(state, { eventId });
  const poolsWithRegistrations = event.isMerged
    ? selectMergedPoolWithRegistrations(state, { eventId })
    : selectPoolsWithRegistrationsForEvent(state, {
        eventId
      });
  const registrations = selectRegistrationsFromPools(state, { eventId });

  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId
  });
  const pools =
    waitingRegistrations.length > 0
      ? poolsWithRegistrations.concat({
          name: 'Venteliste',
          registrations: waitingRegistrations,
          permissionGroups: []
        })
      : poolsWithRegistrations;
  const currentRegistration = findCurrentRegistration(
    registrations.concat(waitingRegistrations),
    currentUser
  );

  return {
    comments,
    actionGrant,
    loading: state.events.fetching,
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
  updateFeedback,
  follow,
  unfollow,
  isUserFollowing,
  updateUser
};

const loadData = (
  { params: { eventId }, currentUser, isLoggedIn },
  dispatch
) => {
  const userId = currentUser.id;
  return dispatch(fetchEvent(eventId)).then(
    () => isLoggedIn && dispatch(isUserFollowing(eventId, userId))
  );
};

export default compose(
  prepare(loadData, ['params.eventId']),
  connect(mapStateToProps, mapDispatchToProps)
)(EventDetail);
