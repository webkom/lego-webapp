import { createSlice } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash-es';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { createSelector } from 'reselect';
import { isCurrentUser as checkIfCurrentUser } from '~/pages/users/utils';
import { Event } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { eventSchema } from '~/redux/schemas';
import { addCommentCases } from '~/redux/slices/comments';
import { selectUserEntities } from '~/redux/slices/users';
import { selectPoolEntities } from './pools';
import {
  selectAllRegistrations,
  selectRegistrationEntities,
} from './registrations';
import type { EntityId } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';
import type { Optional, Overwrite } from 'utility-types';
import type {
  AuthUserDetailedEvent,
  DetailedEvent,
  UserDetailedEvent,
} from '~/redux/models/Event';
import type { PublicGroup } from '~/redux/models/Group';
import type { AuthPool, PublicPool } from '~/redux/models/Pool';
import type {
  DetailedRegistration,
  ReadRegistration,
} from '~/redux/models/Registration';
import type {
  AdministrateUser,
  AdministrateUserWithGrade,
  PublicUser,
  PublicUserWithAbakusGroups,
} from '~/redux/models/User';
import type { RootState } from '~/redux/rootReducer';

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
        const stateEvent = state.entities[eventId] as
          | DetailedEvent
          | UserDetailedEvent
          | AuthUserDetailedEvent;

        if (!stateEvent) {
          return;
        }

        let registrationCount = stateEvent.registrationCount;
        const hasRegistrationAccess = 'waitingRegistrations' in stateEvent;
        let waitingRegistrationCount = stateEvent.waitingRegistrationCount ?? 0;

        if (!registration.pool) {
          waitingRegistrationCount = waitingRegistrationCount + 1;

          if (hasRegistrationAccess) {
            stateEvent.waitingRegistrations = [
              ...(stateEvent.waitingRegistrations ?? []),
              registration.id,
            ];
          }
        } else {
          registrationCount++;
        }

        stateEvent.registrationCount = registrationCount;
        stateEvent.waitingRegistrationCount = waitingRegistrationCount;
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
          const stateEvent = state.entities[eventId] as
            | DetailedEvent
            | UserDetailedEvent
            | AuthUserDetailedEvent;
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
          } else if (stateEvent.waitingRegistrationCount !== undefined) {
            stateEvent.waitingRegistrationCount--;
          }

          if (
            'waitingRegistrations' in stateEvent &&
            stateEvent.waitingRegistrations
          ) {
            stateEvent.waitingRegistrations =
              stateEvent.waitingRegistrations.filter(
                (id) => id !== action.payload.id,
              );
          }

          if ('following' in stateEvent) {
            stateEvent.following = false;
          }
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

export type PoolRegistrationWithUser = Overwrite<
  ReadRegistration,
  { user: PublicUserWithAbakusGroups }
>;
export type PoolWithRegistrations = Overwrite<
  Optional<AuthPool, 'activationDate'>,
  { registrations: PoolRegistrationWithUser[] }
> & {
  isWaitingList?: boolean;
};
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
  selectUserEntities<PublicUserWithAbakusGroups>,
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
            const allPermissionGroupIds = total.allPermissionGroupIds.concat(
              'allPermissionGroupIds' in pool ? pool.allPermissionGroupIds : [],
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
              allPermissionGroupIds,
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
            allPermissionGroupIds: [] as EntityId[],
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
