// Hack because we have circular dependencies
// (companies -> events -> index -> frontpage -> events)
// This import resolves dependencies properly..
import 'app/reducers';
import { describe, it, expect } from 'vitest';
import { Event } from 'app/actions/ActionTypes';
import events from '../events';

describe('reducers', () => {
  const baseState = {
    actionGrant: [],
    pagination: {},
    items: [1],
    fetching: false,
    byId: {
      1: {
        id: 1,
        name: 'evt',
      },
    },
  };
  describe('previous and upcoming events', () => {
    it('Event.FETCH_PREVIOUS.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.FETCH_PREVIOUS.SUCCESS,
        meta: {},
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                name: 'test',
              },
            },
          },
          result: [2],
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
          },
          2: {
            id: 2,
            name: 'test',
            isUsersUpcoming: false,
          },
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
                name: 'test',
              },
            },
          },
          result: [2],
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
          },
          2: {
            id: 2,
            name: 'test',
            isUsersUpcoming: true,
          },
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
          name: 'updated',
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'updated',
          },
        },
      });
    });
    it('Event.CLEAR', () => {
      const prevState = baseState;
      const action = {
        type: Event.CLEAR,
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
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
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
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
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          },
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrations: [31],
            waitingRegistrationCount: 1,
          },
        },
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should add registration to registrationCount if it has a pool', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          },
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 1,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          },
        },
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
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          },
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
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          },
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is me and pool is provided', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 3,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
          },
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
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
            loading: false,
            registrationCount: 2,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
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
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            following: 3,
            name: 'evt',
          },
        },
      });
    });
    it('Event.UNFOLLOW.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            following: 3,
            name: 'evt',
          },
        },
      };
      const action = {
        type: Event.UNFOLLOW.SUCCESS,
        meta: {
          eventId: 1,
        },
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            following: false,
            name: 'evt',
          },
        },
      });
    });
    it('Event.IS_USER_FOLLOWING.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.IS_USER_FOLLOWING.SUCCESS,
        payload: [
          {
            id: 4,
            target: 1,
          },
        ],
      };
      expect(events(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            name: 'evt',
          },
        },
      });
    });
  });
});
