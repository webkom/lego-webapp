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
import helmet from 'app/utils/helmet';

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
  connect(mapStateToProps, mapDispatchToProps),
  helmet((props, config) => {
    if (!props.event) return;
    const tags = (props.event.tags || []).map(content => ({
      content,
      property: 'article:tag'
    }));

    return [
      {
        property: 'og:title',
        content: props.event.title
      },
      {
        element: 'title',
        children: props.event.title
      },
      {
        element: 'link',
        rel: 'canonical',
        href: `${config.webUrl}/events/${props.event.id}`
      },
      {
        property: 'og:description',
        content: props.event.description
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:image:width',
        content: '1667'
      },
      {
        property: 'og:image:height',
        content: '500'
      },
      {
        property: 'og:url',
        content: `${config.webUrl}/events/${props.event.id}`
      },
      {
        property: 'og:image',
        content: props.event.cover
      },
      ...tags
    ];
  })
)(EventDetail);
