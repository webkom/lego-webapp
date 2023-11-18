import { describe, it, expect } from 'vitest';
import { Event } from 'app/actions/ActionTypes';
import events from '../events';
import type { UnknownEvent } from 'app/store/models/Event';

describe('reducers', () => {
  const baseState = {
    actionGrant: [],
    paginationNext: {},
    fetching: false,
    ids: [1],
    entities: {
      1: {
        id: 1,
        title: 'evt',
      } as UnknownEvent,
    },
  };
  describe('previous and upcoming events', () => {
    it('Event.FETCH_PREVIOUS.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FETCH_PREVIOUS.SUCCESS,
        meta: {
          endpoint: '/events/previous/',
        },
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                title: 'test',
              },
            },
          },
          result: [2],
        },
      };
      const newState = events(prevState, action);
      expect(newState.ids).toEqual([1, 2]);
      expect(newState.entities).toEqual({
        1: {
          id: 1,
          title: 'evt',
        },
        2: {
          id: 2,
          title: 'test',
          isUsersUpcoming: false,
        },
      });
    });
    it('Event.FETCH_UPCOMING.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FETCH_UPCOMING.SUCCESS,
        meta: {},
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                title: 'test',
              },
            },
          },
          result: [2],
        },
      };
      const newState = events(prevState, action);
      expect(newState.ids).toEqual([1, 2]);
      expect(newState.entities).toEqual({
        1: {
          id: 1,
          title: 'evt',
        },
        2: {
          id: 2,
          title: 'test',
          isUsersUpcoming: true,
        },
      });
    });
  });
  describe('event reducer', () => {
    it('Event.SOCKET_EVENT_UPDATED', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_EVENT_UPDATED,
        payload: {
          id: 1,
          title: 'updated',
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        paginationNext: {},
        ids: [1],
        fetching: false,
        entities: {
          1: {
            id: 1,
            title: 'updated',
          },
        },
      });
    });
  });
  describe('event registrations', () => {
    it('Event.REQUEST_REGISTER.BEGIN', () => {
      const prevState = baseState;
      const action = {
        type: Event.REQUEST_REGISTER.BEGIN,
        meta: {
          id: 1,
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        paginationNext: {},
        ids: [1],
        fetching: false,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: true,
          },
        },
      });
    });
    it('Event.REQUEST_REGISTER.FAILURE', () => {
      const prevState = baseState;
      const action = {
        type: Event.REQUEST_REGISTER.FAILURE,
        meta: {
          id: 1,
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        paginationNext: {},
        ids: [1],
        fetching: false,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
          },
        },
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should not crash if event is not in state', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        meta: {
          eventId: 99,
        },
      };
      expect(events(prevState, action)).toEqual(prevState);
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should add registration to waitingRegistrations if it has no pool', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          } as unknown as UnknownEvent,
        },
      };
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 31,
        },
        meta: {
          eventId: 1,
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        loading: false,
        registrationCount: 0,
        waitingRegistrations: [31],
        waitingRegistrationCount: 1,
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should add registration to registrationCount if it has a pool', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          } as unknown as UnknownEvent,
        },
      };
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 31,
          pool: 91,
        },
        meta: {
          eventId: 1,
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        loading: false,
        registrationCount: 1,
        waitingRegistrations: [],
        waitingRegistrationCount: 0,
      });
    });
    it('Event.SOCKET_REGISTRATION.FAILURE', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.FAILURE,
        meta: {
          eventId: 1,
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        loading: false,
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should not crash if event does not exist', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        meta: {
          eventId: 2,
        },
      };
      expect(events(prevState, action)).toEqual(baseState);
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is not me and no pool is provided', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          } as unknown as UnknownEvent,
        },
      };
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        payload: {
          id: 99,
          user: {
            id: 9,
          },
        },
        meta: {
          eventId: 1,
          currentUser: {
            id: 8,
          },
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        paginationNext: {},
        ids: [1],
        fetching: false,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is me and no pool is provided', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          } as unknown as UnknownEvent,
        },
      };
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        payload: {
          id: 99,
          user: {
            id: 9,
          },
        },
        meta: {
          eventId: 1,
          currentUser: {
            id: 9,
          },
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        loading: false,
        registrationCount: 0,
        waitingRegistrationCount: 0,
        waitingRegistrations: [],
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is me and pool is provided', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 3,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
          } as unknown as UnknownEvent,
        },
      };
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        payload: {
          id: 99,
          user: {
            id: 9,
          },
        },
        meta: {
          fromPool: 33,
          eventId: 1,
          currentUser: {
            id: 9,
          },
        },
      };

      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        loading: false,
        registrationCount: 2,
        waitingRegistrationCount: 0,
        waitingRegistrations: [],
      });
    });
  });
  describe('event following', () => {
    it('Event.FOLLOW.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FOLLOW.SUCCESS,
        payload: {
          entities: {
            followerEvents: {
              3: {
                target: 1,
                follower: 2,
                id: 3,
              },
            },
          },
          result: 3,
        },
        meta: {
          body: {
            target: 1,
            follower: 2,
          },
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        following: 3,
        title: 'evt',
      });
    });
    it('Event.UNFOLLOW.SUCCESS', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            following: 3,
            title: 'evt',
          } as UnknownEvent,
        },
      };
      const action = {
        type: Event.UNFOLLOW.SUCCESS,
        meta: {
          eventId: 1,
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        following: false,
        title: 'evt',
      });
    });
    it('Event.IS_USER_FOLLOWING.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.IS_USER_FOLLOWING.SUCCESS,
        payload: {
          entities: {
            followersEvent: {
              4: {
                id: 4,
                target: 1,
                follower: 6,
              },
            },
          },
        },
        meta: {
          currentUserId: 6,
          eventId: 1,
        },
      };
      const newState = events(prevState, action);
      expect(newState.entities[1]).toEqual({
        id: 1,
        title: 'evt',
        following: 4,
      });
    });
  });
});
