import { connect } from 'react-redux';
import { compose } from 'redux';
import { deleteComment } from 'app/actions/CommentActions';
import {
  fetchEvent,
  deleteEvent,
  register,
  unregister,
  payment,
  updateFeedback,
  follow,
  unfollow,
  isUserFollowing,
} from 'app/actions/EventActions';
import {
  selectEventById,
  selectEventBySlug,
  selectCommentsForEvent,
  selectPoolsWithRegistrationsForEvent,
  selectPoolsForEvent,
  selectRegistrationsFromPools,
  selectMergedPoolWithRegistrations,
  selectMergedPool,
  selectWaitingRegistrationsForEvent,
  selectRegistrationForEventByUserId,
} from 'app/reducers/events';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { selectUserWithGroups } from 'app/reducers/users';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EventDetail from './components/EventDetail';

const mapStateToProps = (state, props) => {
  const {
    match: {
      params: { eventIdOrSlug },
    },
    currentUser,
  } = props;
  const event = !isNaN(eventIdOrSlug)
    ? selectEventById(state, { eventId: eventIdOrSlug })
    : selectEventBySlug(state, { eventSlug: eventIdOrSlug });

  /*
    * FIXME: This produces an insane amount of location change events for some reason
  if (event?.slug && eventIdOrSlug !== event.slug) {
    props.history.replace(`/events/${event.slug}`);
  }
  */

  const eventId = event.id;

  const actionGrant = event.actionGrant || [];
  const hasFullAccess = Boolean(event.waitingRegistrations);
  const user = state.auth
    ? selectUserWithGroups(state, {
        username: state.auth.username,
      })
    : null;
  const penalties = user
    ? selectPenaltyByUserId(state, {
        userId: user.id,
      })
    : [];

  if (!hasFullAccess) {
    const normalPools = event.isMerged
      ? selectMergedPool(state, {
          eventId,
        })
      : selectPoolsForEvent(state, {
          eventId,
        });
    const pools =
      event.waitingRegistrationCount > 0
        ? normalPools.concat({
            name: 'Venteliste',
            registrationCount: event.waitingRegistrationCount,
            permissionGroups: [],
          })
        : normalPools;
    return {
      actionGrant,
      notLoading: !state.events.fetching,
      event,
      eventId,
      pools,
      comments: [],
    };
  }

  const comments = selectCommentsForEvent(state, {
    eventId,
  });
  const poolsWithRegistrations = event.isMerged
    ? selectMergedPoolWithRegistrations(state, {
        eventId,
      })
    : selectPoolsWithRegistrationsForEvent(state, {
        eventId,
      });
  const registrations = selectRegistrationsFromPools(state, {
    eventId,
  });
  const waitingRegistrations = selectWaitingRegistrationsForEvent(state, {
    eventId,
  });
  const pools =
    waitingRegistrations.length > 0
      ? poolsWithRegistrations.concat({
          name: 'Venteliste',
          registrations: waitingRegistrations,
          registrationCount: waitingRegistrations.length,
          permissionGroups: [],
        })
      : poolsWithRegistrations;
  const currentPool = pools.find((pool) =>
    pool.registrations.some(
      (registration) => registration.user.id === currentUser.id
    )
  );
  let currentRegistration;
  let currentRegistrationIndex;

  if (currentPool) {
    currentRegistrationIndex = currentPool.registrations.findIndex(
      (registration) => registration.user.id === currentUser.id
    );
    currentRegistration = currentPool.registrations[currentRegistrationIndex];
  }

  const hasSimpleWaitingList = poolsWithRegistrations.length <= 1;
  const pendingRegistration = selectRegistrationForEventByUserId(state, {
    eventId,
    userId: currentUser.id,
  });
  return {
    comments,
    actionGrant,
    notLoading: !state.events.fetching,
    event,
    eventId,
    pools,
    registrations,
    currentRegistration,
    currentRegistrationIndex,
    pendingRegistration,
    hasSimpleWaitingList,
    penalties,
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
  deleteComment,
};

const propertyGenerator = (props, config) => {
  if (!props.event) return;
  const tags = (props.event.tags || []).map((content) => ({
    content,
    property: 'article:tag',
  }));
  return [
    {
      property: 'og:title',
      content: props.event.title,
    },
    {
      element: 'title',
      children: props.event.title,
    },
    {
      element: 'link',
      rel: 'canonical',
      href: `${config.webUrl}/events/${props.event.id}`,
    },
    {
      property: 'og:description',
      content: props.event.description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image:width',
      content: '1667',
    },
    {
      property: 'og:image:height',
      content: '500',
    },
    {
      property: 'og:url',
      content: `${config.webUrl}/events/${props.event.id}`,
    },
    {
      property: 'og:image',
      content: props.event.cover,
    },
    ...tags,
  ];
};

export default compose(
  withPreparedDispatch(
    'fetchEventDetail',
    (props, dispatch) => dispatch(fetchEvent(props.match.params.eventIdOrSlug)),
    (props) => [props.match.params.eventIdOrSlug]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['notLoading', 'event.text']),
  helmet(propertyGenerator)
)(EventDetail);
