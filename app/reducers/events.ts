import { createSlice } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import config from 'app/config';
import { eventSchema } from 'app/reducers';
import { addCommentCases, selectCommentEntities } from 'app/reducers/comments';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import mergeObjects from 'app/utils/mergeObjects';
import { Event } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';
import type { FollowerItem, Dateish } from 'app/models';
import type { RootState } from 'app/store/createRootReducer';
import type { ID } from 'app/store/models';
import type {
  AuthUserDetailedEvent,
  UnknownEvent,
} from 'app/store/models/Event';
import type { AsyncApiActionSuccessWithEntityType } from 'app/utils/legoAdapter/asyncApiActions';

type RegistrationEvent = AuthUserDetailedEvent & {
  loading?: boolean;
};

const legoAdapter = createLegoAdapter(EntityType.Events);

const eventsSlice = createSlice({
  name: 'events',
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Event.FETCH, Event.FETCH_PREVIOUS, Event.FETCH_UPCOMING],
    deleteActions: [Event.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Events, addCase);
      addCase(
        Event.FETCH_PREVIOUS.SUCCESS,
        (
          state,
          action: AsyncApiActionSuccessWithEntityType<EntityType.Events>
        ) => {
          if (!action.payload.entities.events) return;
          legoAdapter.upsertMany(
            state,
            Object.values(action.payload.entities.events).map((event) => ({
              ...event,
              isUsersUpcoming: false,
            }))
          );
        }
      );
      addCase(
        Event.FETCH_UPCOMING.SUCCESS,
        (
          state,
          action: AsyncApiActionSuccessWithEntityType<EntityType.Events>
        ) => {
          if (!action.payload.entities.events) return;
          legoAdapter.upsertMany(
            state,
            Object.values(action.payload.entities.events).map((event) => ({
              ...event,
              isUsersUpcoming: true,
            }))
          );
        }
      );
      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const events = normalize(action.payload, eventSchema).entities
          .events as UnknownEvent[];
        state.entities = mergeObjects(state.entities, events);
      });
      addCase(Event.REQUEST_REGISTER.BEGIN, (state, action: AnyAction) => {
        const event = state.entities[action.meta.id];
        if (event) event.loading = true;
      });
      addCase(Event.SOCKET_REGISTRATION.SUCCESS, (state, action: AnyAction) => {
        const eventId = action.meta.eventId;
        const registration = action.payload;
        const stateEvent = state.entities[eventId] as RegistrationEvent;

        if (!stateEvent) {
          return;
        }

        let registrationCount = stateEvent.registrationCount;
        let waitingRegistrations = stateEvent.waitingRegistrations;
        let waitingRegistrationCount = stateEvent.waitingRegistrationCount ?? 0;

        if (!registration.pool) {
          waitingRegistrationCount = waitingRegistrationCount + 1;

          if (waitingRegistrations) {
            waitingRegistrations = [...waitingRegistrations, registration.id];
          }
        } else {
          registrationCount++;
        }

        stateEvent.loading = false;
        stateEvent.registrationCount = registrationCount;
        stateEvent.waitingRegistrationCount = waitingRegistrationCount;

        if (waitingRegistrations) {
          stateEvent.waitingRegistrations = waitingRegistrations;
        }
      });
      addCase(
        Event.SOCKET_UNREGISTRATION.SUCCESS,
        (state, action: AnyAction) => {
          const {
            eventId,
            activationTime: activationTimeFromMeta,
            fromPool,
            currentUser,
          } = action.meta;
          const stateEvent = state.entities[eventId] as RegistrationEvent;
          const registration = action.payload;

          if (!stateEvent) {
            return;
          }

          const isCurrentUser =
            registration.user &&
            checkIfCurrentUser(registration.user.id, currentUser.id);
          stateEvent.loading = false;

          if (isCurrentUser) {
            stateEvent.activationTime = activationTimeFromMeta;
          }

          if (fromPool) {
            stateEvent.registrationCount--;
          } else {
            stateEvent.waitingRegistrationCount!--;
          }

          if (stateEvent.waitingRegistrations) {
            stateEvent.waitingRegistrations =
              stateEvent.waitingRegistrations.filter(
                (id) => id !== action.payload.id
              );
          }
        }
      );
      addCase(Event.REQUEST_REGISTER.FAILURE, (state, action: AnyAction) => {
        const event = state.entities[action.meta.id];
        if (event) event.loading = false;
      });
      addCase(Event.SOCKET_REGISTRATION.FAILURE, (state, action: AnyAction) => {
        const event = state.entities[action.meta.eventId];
        if (event) event.loading = false;
      });
      addCase(Event.FOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[
          action.meta.body.target
        ] as AuthUserDetailedEvent;
        if (event) event.following = action.payload.result;
      });
      addCase(Event.UNFOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[
          action.meta.eventId
        ] as AuthUserDetailedEvent;
        if (event) event.following = false;
      });
      addCase(Event.IS_USER_FOLLOWING.SUCCESS, (state, action: AnyAction) => {
        const isFollowing =
          Object.values(
            action.payload.entities.followersEvent as FollowerItem[]
          ).find(
            (fe) =>
              fe.follower === action.meta.currentUserId &&
              fe.target === action.meta.eventId
          )?.id ?? false;
        const event = state.entities[
          action.meta.eventId
        ] as AuthUserDetailedEvent;
        if (event) event.following = isFollowing;
      });
    },
  }),
});

export default eventsSlice.reducer;
const { selectAll, selectById, selectEntities } =
  legoAdapter.getSelectors<RootState>((state) => state.events);

function transformEvent(event: UnknownEvent) {
  return {
    ...event,
    useCaptcha: config.environment === 'ci' ? false : event.useCaptcha,
  };
}

function transformRegistration(registration) {
  return {
    ...registration,
    registrationDate: moment(registration.registrationDate),
    unregistrationDate: moment(registration.unregistrationDate),
  };
}

export const selectEvents = createSelector(selectAll, (events) =>
  events.map(transformEvent)
);
export const selectPreviousEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.isUsersUpcoming === false)
);
export const selectUpcomingEvents = createSelector(selectEvents, (events) =>
  events.filter((event) => event.isUsersUpcoming)
);
export const selectSortedEvents = createSelector(selectEvents, (events) =>
  [...events].sort(
    (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix()
  )
);
export const selectEventById = createSelector(selectById, (event) =>
  event ? transformEvent(event) : {}
);
export const selectEventBySlug = createSelector(
  selectEntities,
  (_: RootState, props: { eventSlug: string }) => props.eventSlug,
  (eventsById, eventSlug) => {
    const event = Object.values(eventsById).find(
      (event) => event?.slug === eventSlug
    );

    return event ? transformEvent(event) : {};
  }
);

export const selectPoolsForEvent = createSelector(
  selectEventById,
  (state: RootState) => state.pools.byId,
  (event, poolsById) => {
    if (!event) return [];
    return (event.pools || []).map((poolId) => poolsById[poolId]);
  }
);
export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  (state: RootState) => state.registrations.byId,
  (state: RootState) => state.users.byId,
  (pools, registrationsById, usersById) =>
    pools.map((pool) => ({
      ...pool,
      registrations: orderBy(
        (pool.registrations || []).map((regId) => {
          const registration = registrationsById[regId];
          return { ...registration, user: usersById[registration.user] };
        }),
        'sharedMemberships',
        'desc'
      ),
    }))
);
export const selectMergedPool = createSelector(selectPoolsForEvent, (pools) => {
  if (pools.length === 0) return [];
  return [
    {
      name: 'Deltakere',
      ...pools.reduce(
        (total, pool) => {
          const capacity = total.capacity + pool.capacity;
          const permissionGroups = total.permissionGroups.concat(
            pool.permissionGroups
          );
          const registrationCount =
            total.registrationCount + pool.registrationCount;
          return {
            capacity,
            permissionGroups,
            registrationCount,
          };
        },
        {
          capacity: 0,
          permissionGroups: [],
          registrationCount: 0,
        }
      ),
    },
  ];
});
export const selectMergedPoolWithRegistrations = createSelector(
  selectPoolsForEvent,
  (state: RootState) => state.registrations.byId,
  (state: RootState) => state.users.byId,
  (pools, registrationsById, usersById) => {
    if (pools.length === 0) return [];
    return [
      {
        name: 'Deltakere',
        ...pools.reduce(
          (total, pool) => {
            const capacity = total.capacity + pool.capacity;
            const permissionGroups = total.permissionGroups.concat(
              pool.permissionGroups
            );
            const registrations = total.registrations.concat(
              pool.registrations.map((regId) => {
                const registration = registrationsById[regId];
                return { ...registration, user: usersById[registration.user] };
              })
            );
            return {
              capacity,
              permissionGroups,
              registrations: orderBy(
                registrations,
                'sharedMemberships',
                'desc'
              ),
              registrationCount: registrations.length,
            };
          },
          {
            capacity: 0,
            permissionGroups: [],
            registrations: [],
            registrationCount: 0,
          }
        ),
      },
    ];
  }
);
export const selectAllRegistrationsForEvent = createSelector(
  (state: RootState) => state.registrations.byId,
  (state: RootState) => state.registrations.items,
  (state: RootState) => state.users.byId,
  (_: RootState, props: { eventId: ID }) => props.eventId,
  (registrationsById, registrationItems, usersById, eventId) =>
    registrationItems
      .map((regId) => registrationsById[regId])
      .filter((registration) => registration.event === Number(eventId))
      .map((registration) => {
        const user = registration.user.id
          ? registration.user
          : usersById[registration.user];
        const createdBy =
          registration.createdBy !== null &&
          usersById[registration.createdBy] !== undefined
            ? usersById[registration.createdBy]
            : null;
        const updatedBy =
          registration.updatedBy !== null &&
          usersById[registration.createdBy] !== undefined
            ? usersById[registration.updatedBy]
            : null;
        return transformRegistration({
          ...registration,
          user,
          createdBy,
          updatedBy,
        });
      })
);
export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById,
  (state: RootState) => state.registrations.byId,
  (state: RootState) => state.users.byId,
  (event, registrationsById, usersById) => {
    if (!event) return [];
    return (event.waitingRegistrations || []).map((regId) => {
      const registration = registrationsById[regId];
      return { ...registration, user: usersById[registration.user] };
    });
  }
);
export const selectRegistrationForEventByUserId = createSelector(
  selectAllRegistrationsForEvent,
  (_: RootState, props: { userId: ID }) => props.userId,
  (registrations, userId) => {
    const userReg = registrations.filter((reg) => reg.user.id === userId);
    return userReg.length > 0 ? userReg[0] : null;
  }
);
export const selectCommentsForEvent = createSelector(
  selectEventById,
  selectCommentEntities,
  (event, commentEntities) => {
    if (!event) return [];
    return (event.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
export const selectRegistrationsFromPools = createSelector(
  selectPoolsWithRegistrationsForEvent,
  (pools) =>
    orderBy(
      // $FlowFixMe
      pools.flatMap((pool) => pool.registrations || []),
      'sharedMemberships',
      'desc'
    )
);
export const getRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  (registrations) => {
    const grouped = groupBy(registrations, (obj) =>
      obj.unregistrationDate.isValid() ? 'unregistered' : 'registered'
    );
    const registered = (grouped['registered'] || []).sort((a, b) =>
      a.registrationDate.diff(b.registrationDate)
    );
    const unregistered = (grouped['unregistered'] || []).sort((a, b) =>
      a.unregistrationDate.diff(b.unregistrationDate)
    );
    return {
      registered,
      unregistered,
    };
  }
);

// Select events that occur on a specific day. Events that last over multiple days will be selected for every day it takes place. However, some events, like parties, might last over midnight, and it looks kind of weird for that event to be selected for two different days. Therefore, we add the criteria that an event has to last for more 24 hours in order for it to get selected for multiple days.
export const selectEventsByDay = createSelector(
  selectAll,
  (_: RootState, props: { day: Dateish }) => props.day,
  (events, day) =>
    events.filter(
      (event) =>
        moment(event.startTime).isSame(day, 'day') ||
        (moment(event.startTime).isSameOrBefore(day, 'day') &&
          moment(event.endTime).isSameOrAfter(day, 'day') &&
          moment.duration(moment(event.endTime).diff(moment(event.startTime))) >
            moment.duration(1, 'days'))
    )
);
