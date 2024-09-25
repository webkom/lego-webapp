import { describe, it, expect } from 'vitest';
import { Event } from 'app/actions/ActionTypes';
import events from '../events';
import type { UnknownEvent } from 'app/store/models/Event';

describe('reducers', () => {
  const baseState: ReturnType<typeof events> = {
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
        ...prevState,
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
          } as UnknownEvent,
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
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrations: [31],
            waitingRegistrationCount: 1,
          },
        },
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
          } as UnknownEvent,
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
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 1,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          },
        },
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
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
            following: 14,
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
        ...prevState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
            following: false,
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
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
            following: 14,
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
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
            following: false,
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is me and pool is provided', () => {
      const prevState = {
        ...baseState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 3,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
            following: 14,
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
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 2,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
            following: false,
          },
        },
      });
    });
  });
  describe('event following', () => {
    it('Event.FOLLOW.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FOLLOW.SUCCESS,
        payload: {
          target: 1,
          follower: 2,
          id: 3,
        },
        meta: {
          body: {
            target: 1,
            follower: 2,
          },
        },
      };
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            following: 3,
            title: 'evt',
          },
        },
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
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            id: 1,
            following: false,
            title: 'evt',
          },
        },
      });
    });
    it('Event.IS_USER_FOLLOWING.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FETCH_FOLLOWERS.SUCCESS,
        payload: {
          results: [
            {
              id: 4,
              follower: {
                id: 3,
              },
              target: 1,
            },
          ],
        },
        meta: {
          eventId: 1,
          currentUserId: 3,
        },
      };
      expect(events(prevState, action)).toEqual({
        ...prevState,
        entities: {
          1: {
            following: 4,
            id: 1,
            title: 'evt',
          },
        },
      });
    });
  });
});
