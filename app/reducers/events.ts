import { createSlice } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import config from 'app/config';
import { eventSchema } from 'app/reducers';
import { addCommentCases } from 'app/reducers/comments';
import { selectUserEntities } from 'app/reducers/users';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Event } from '../actions/ActionTypes';
import { selectPoolEntities } from './pools';
import {
  selectAllRegistrations,
  selectRegistrationEntities,
} from './registrations';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type {
  AuthUserDetailedEvent,
  DetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { PublicGroup } from 'app/store/models/Group';
import type { AuthPool, PublicPool } from 'app/store/models/Pool';
import type {
  DetailedRegistration,
  ReadRegistration,
} from 'app/store/models/Registration';
import type {
  AdministrateUser,
  AdministrateUserWithGrade,
  PublicUser,
} from 'app/store/models/User';
import type { AnyAction } from 'redux';
import type { Optional, Overwrite } from 'utility-types';

const legoAdapter = createLegoAdapter(EntityType.Events);

const eventsSlice = createSlice({
  name: EntityType.Events,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Event.FETCH, Event.FETCH_PREVIOUS, Event.FETCH_UPCOMING],
    deleteActions: [Event.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.Events, addCase);

      addCase(Event.SOCKET_EVENT_UPDATED, (state, action: AnyAction) => {
        const events = normalize(action.payload, eventSchema).entities
          .events as DetailedEvent[];
        legoAdapter.upsertMany(state, events);
      });
      addCase(Event.SOCKET_REGISTRATION.SUCCESS, (state, action: AnyAction) => {
        const eventId = action.meta.eventId;
        const registration = action.payload;
        const stateEvent = state.entities[eventId] as DetailedEvent;

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
          const stateEvent = state.entities[eventId] as DetailedEvent;
          const registration = action.payload;

          if (!stateEvent) {
            return;
          }

          const isCurrentUser =
            registration.user &&
            checkIfCurrentUser(registration.user.id, currentUser.id);

          if (isCurrentUser) {
            stateEvent.activationTime = activationTimeFromMeta;
          }

          if (fromPool) {
            stateEvent.registrationCount--;
          } else {
            stateEvent.waitingRegistrationCount--;
          }

          if (stateEvent.waitingRegistrations) {
            stateEvent.waitingRegistrations =
              stateEvent.waitingRegistrations.filter(
                (id) => id !== action.payload.id,
              );
          }

          stateEvent.following = false;
        },
      );
      addCase(Event.FOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.body.target] as
          | UserDetailedEvent
          | undefined;
        if (event) event.following = action.payload.id;
      });
      addCase(Event.UNFOLLOW.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.eventId] as
          | UserDetailedEvent
          | undefined;
        if (event) event.following = false;
      });
      addCase(Event.FETCH_FOLLOWERS.SUCCESS, (state, action: AnyAction) => {
        const event = state.entities[action.meta.eventId] as UserDetailedEvent;
        const followObj = action.payload.results.find(
          (follow) => follow.follower.id === action.meta.currentUserId,
        );
        event.following = followObj?.id;
      });
    },
  }),
});

export default eventsSlice.reducer;
export const {
  selectAllPaginated: selectAllEvents,
  selectById: selectEventById,
  selectEntities: selectEventEntities,
  selectIds: selectEventIds,
  selectByField: selectEventsByField,
} = legoAdapter.getSelectors((state: RootState) => state.events);

const selectEventBySlug = selectEventsByField('slug').single;
export const selectEventByIdOrSlug = createSelector(
  selectEventBySlug,
  selectEventById,
  (eventBySlug, eventById) => eventBySlug || eventById,
);

export function transformEvent(event: DetailedEvent) {
  return {
    ...event,
    startTime: event.startTime && moment(event.startTime).toISOString(),
    endTime: event.endTime && moment(event.endTime).toISOString(),
    activationTime:
      event.activationTime && moment(event.activationTime).toISOString(),
    mergeTime: event.mergeTime && moment(event.mergeTime).toISOString(),
    useCaptcha: config.environment === 'ci' ? false : event.useCaptcha,
  };
}

export const selectTransformedEventById = createSelector(
  selectEventEntities,
  (_: RootState, props: { eventId: EntityId }) => props.eventId,
  (eventsById, eventId) => {
    const event = eventsById[eventId];

    if (event) {
      return transformEvent(event);
    }

    return {};
  },
);

export type PoolRegistrationWithUser = Overwrite<
  ReadRegistration,
  { user: PublicUser }
>;
export type PoolWithRegistrations = Overwrite<
  Optional<AuthPool, 'activationDate'>,
  { registrations: PoolRegistrationWithUser[] }
>;
export const selectPoolsForEvent = createSelector(
  selectEventById<DetailedEvent>,
  selectPoolEntities,
  (event, poolEntities) => {
    if (!event) return [];
    return (event.pools || []).map((poolId) => poolEntities[poolId]);
  },
);
export const selectPoolsWithRegistrationsForEvent = createSelector(
  selectPoolsForEvent,
  selectRegistrationEntities<ReadRegistration>,
  selectUserEntities<PublicUser>,
  (pools, registrationEntities, userEntities) =>
    (pools as AuthPool[]).map((pool) => ({
      ...pool,
      registrations:
        'registrations' in pool
          ? orderBy(
              pool.registrations.map((regId) => {
                const registration = registrationEntities[regId];
                return {
                  ...registration,
                  user: userEntities[registration.user],
                };
              }),
              'sharedMemberships',
              'desc',
            )
          : [],
    })) as PoolWithRegistrations[],
);
export const selectMergedPool = createSelector(selectPoolsForEvent, (pools) => {
  if (pools.length === 0) return [];
  return [
    {
      id: 'merged',
      name: 'Deltakere',
      ...pools.reduce(
        (total, pool) => {
          const capacity = total.capacity + pool.capacity;
          const permissionGroups = total.permissionGroups.concat(
            pool.permissionGroups,
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
          permissionGroups: [] as PublicGroup[],
          registrationCount: 0,
        },
      ),
    } satisfies Optional<PublicPool, 'activationDate'>,
  ];
});
export const selectMergedPoolWithRegistrations = createSelector(
  selectPoolsForEvent,
  selectRegistrationEntities<ReadRegistration>,
  selectUserEntities<PublicUser>,
  (pools, registrationEntities, userEntities) => {
    if (pools.length === 0) return [];
    return [
      {
        id: 'merged',
        name: 'Deltakere',
        ...pools.reduce(
          (total, pool) => {
            const capacity = total.capacity + pool.capacity;
            const permissionGroups = total.permissionGroups.concat(
              pool.permissionGroups,
            );
            const registrations =
              'registrations' in pool
                ? total.registrations.concat(
                    pool.registrations?.map((regId) => {
                      const registration = registrationEntities[regId];
                      return {
                        ...registration,
                        user: userEntities[registration.user],
                      };
                    }),
                  )
                : [];
            return {
              capacity,
              permissionGroups,
              registrations: orderBy(
                registrations,
                'sharedMemberships',
                'desc',
              ),
              registrationCount: registrations.length,
            };
          },
          {
            capacity: 0,
            permissionGroups: [] as PublicGroup[],
            registrations: [] as PoolRegistrationWithUser[],
            registrationCount: 0,
          },
        ),
      },
    ] satisfies PoolWithRegistrations[];
  },
);

export type SelectedAdminRegistration = Overwrite<
  DetailedRegistration,
  {
    user: AdministrateUserWithGrade;
    createdBy: AdministrateUser | null;
    updatedBy: AdministrateUser | null;
  }
>;
// Typed for admin-view
export const selectAllRegistrationsForEvent = createSelector(
  selectAllRegistrations<DetailedRegistration>,
  selectUserEntities<AdministrateUserWithGrade>, //
  (_: RootState, props: { eventId?: EntityId }) => props.eventId,
  (registrations, usersById, eventId) =>
    registrations
      .filter((registration) => registration.event === Number(eventId))
      .map((registration) => {
        const user = usersById[registration.user];
        const createdBy =
          usersById[registration.createdBy] !== undefined
            ? usersById[registration.createdBy]
            : null;
        const updatedBy =
          usersById[registration.updatedBy] !== undefined
            ? usersById[registration.updatedBy]
            : null;
        return {
          ...registration,
          user,
          createdBy,
          updatedBy,
        } satisfies SelectedAdminRegistration;
      }),
);
export const selectWaitingRegistrationsForEvent = createSelector(
  selectEventById<AuthUserDetailedEvent | DetailedEvent>,
  selectRegistrationEntities<ReadRegistration>,
  selectUserEntities<PublicUser>,
  (event, registrationEntities, userEntities) => {
    if (!event || !('waitingRegistrations' in event)) return [];
    return (event.waitingRegistrations || []).map((regId) => {
      const registration = registrationEntities[regId];
      return { ...registration, user: userEntities[registration.user] };
    });
  },
);
export const selectRegistrationForEventByUserId = createSelector(
  selectAllRegistrations<ReadRegistration>,
  (_: RootState, props: { eventId?: EntityId; userId?: EntityId }) => props,
  (registrations, { eventId, userId }) => {
    return eventId && userId
      ? registrations.find(
          (reg) => reg.user === userId && reg.event === eventId,
        )
      : undefined;
  },
);
export const selectRegistrationsFromPools = createSelector(
  selectPoolsWithRegistrationsForEvent,
  (pools) => {
    const registrationPools = pools.filter((pool) => pool.registrations);
    if (registrationPools.length === 0) return [];
    return orderBy(
      registrationPools.flatMap((pool) => pool.registrations || []),
      'sharedMemberships',
      'desc',
    );
  },
);
export const selectRegistrationGroups = createSelector(
  selectAllRegistrationsForEvent,
  (registrations) => {
    const grouped = groupBy(registrations, (obj) =>
      moment(obj.unregistrationDate).isValid() ? 'unregistered' : 'registered',
    );
    const registered = (grouped['registered'] || []).sort((a, b) =>
      moment(a.registrationDate).diff(b.registrationDate),
    );
    const unregistered = (grouped['unregistered'] || []).sort((a, b) =>
      moment(a.unregistrationDate).diff(b.unregistrationDate),
    );
    return {
      registered,
      unregistered,
    };
  },
);
