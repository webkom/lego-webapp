// Hack because we have circular dependencies
// (companies -> events -> index -> frontpage -> events)
// This import resolves dependencies properly..
import 'app/store/rootReducer';
import {
  fetchPrevious,
  fetchUpcoming,
  follow,
  isUserFollowing,
  register,
  unfollow,
} from 'app/actions/EventActions';
import {
  socketEventUpdated,
  socketRegistrationFailure,
  socketRegistrationSuccess,
  socketUnregistrationSuccess,
} from 'app/actions/WebsocketActions';
import type Event from 'app/store/models/Event';
import type User from 'app/store/models/User';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import events, { clear, EventsState } from '../events';

describe('reducers', () => {
  const baseState: EventsState = {
    ...getInitialEntityReducerState(),
    items: [1],
    fetching: false,
    byId: {
      1: {
        id: 1,
        title: 'evt',
      } as Event,
    },
  };
  describe('previous and upcoming events', () => {
    it('Event.FETCH_PREVIOUS.SUCCESS', () => {
      const prevState = baseState;
      const action = fetchPrevious.success({
        meta: {
          errorMessage: '',
        },
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                title: 'test',
              } as Event,
            },
          },
          result: [2],
        },
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
          2: {
            id: 2,
            title: 'test',
            isUsersUpcoming: false,
          },
        },
      });
    });
    it('Event.FETCH_UPCOMING.SUCCESS', () => {
      const prevState = baseState;
      const action = fetchUpcoming.success({
        meta: {
          errorMessage: '',
        },
        payload: {
          entities: {
            events: {
              2: {
                id: 2,
                title: 'test',
              } as Event,
            },
          },
          result: [2],
        },
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1, 2],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
          2: {
            id: 2,
            title: 'test',
            isUsersUpcoming: true,
          },
        },
      });
    });
  });
  describe('event reducer', () => {
    it('Event.SOCKET_EVENT_UPDATED', () => {
      const prevState = baseState;
      const action = socketEventUpdated({
        meta: {
          currentUser: null,
        },
        payload: {
          id: 1,
          title: 'updated',
        } as Event,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'updated',
          },
        },
      });
    });
    it('Event.CLEAR', () => {
      const prevState = baseState;
      const action = clear();
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
        },
      });
    });
  });
  describe('event registrations', () => {
    it('Event.REQUEST_REGISTER.BEGIN', () => {
      const prevState = baseState;
      const action = register.begin({
        meta: {
          id: 1,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
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
      const action = register.failure({
        meta: {
          id: 1,
        } as any,
        payload: {} as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
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
      const action = socketRegistrationSuccess({
        payload: {} as any,
        meta: {
          eventId: 99,
        } as any,
      });
      expect(events(prevState, action)).toEqual(prevState);
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should add registration to waitingRegistrations if it has no pool', () => {
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          } as Event,
        },
      };
      const action = socketRegistrationSuccess({
        payload: {
          id: 31,
        } as any,
        meta: {
          eventId: 1,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrations: [31],
            waitingRegistrationCount: 1,
          },
        },
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS should add registration to registrationCount if it has a pool', () => {
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            registrationCount: 0,
            waitingRegistrations: [],
            waitingRegistrationCount: 0,
          } as Event,
        },
      };
      const action = socketRegistrationSuccess({
        payload: {
          id: 31,
          pool: 91,
        } as any,
        meta: {
          eventId: 1,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
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
      const action = socketRegistrationFailure({
        meta: {
          eventId: 1,
        } as any,
        payload: {} as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should not crash if event does not exist', () => {
      const prevState = baseState;
      const action = socketUnregistrationSuccess({
        meta: {
          eventId: 2,
        } as any,
        payload: {} as any,
      });
      expect(events(prevState, action)).toEqual(baseState);
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is not me and no pool is provided', () => {
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          } as Event,
        },
      };
      const action = socketUnregistrationSuccess({
        payload: {
          id: 99,
          user: {
            id: 9,
          } as User,
        } as any,
        meta: {
          eventId: 1,
          currentUser: {
            id: 8,
          } as User,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
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
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 0,
            waitingRegistrationCount: 1,
            waitingRegistrations: [99],
          } as Event,
        },
      };
      const action = socketUnregistrationSuccess({
        payload: {
          id: 99,
          user: {
            id: 9,
          } as User,
        } as any,
        meta: {
          eventId: 1,
          currentUser: {
            id: 9,
          } as User,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
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
    it('Event.SOCKET_UNREGISTRATION.SUCCESS should update correctly if user is me and pool is provided', () => {
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
            loading: false,
            registrationCount: 3,
            waitingRegistrationCount: 0,
            waitingRegistrations: [],
          } as Event,
        },
      };
      const action = socketUnregistrationSuccess({
        payload: {
          id: 99,
          user: {
            id: 9,
          } as User,
        } as any,
        meta: {
          fromPool: 33,
          eventId: 1,
          currentUser: {
            id: 9,
          } as User,
        } as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
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
      const action = follow.success({
        meta: {
          errorMessage: '',
        },
        payload: {
          target: 1,
          id: 3,
        },
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
        },
      });
    });
    it('Event.UNFOLLOW.SUCCESS', () => {
      const prevState: EventsState = {
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          } as Event,
        },
      };
      const action = unfollow.success({
        meta: {
          eventId: 1,
        } as any,
        payload: {} as any,
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
        },
      });
    });
    it('Event.IS_USER_FOLLOWING.SUCCESS', () => {
      const prevState = baseState;
      const action = isUserFollowing.success({
        meta: {} as any,
        payload: [
          {
            id: 4,
            target: 1,
          },
        ],
      });
      expect(events(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1],
        fetching: false,
        byId: {
          1: {
            id: 1,
            title: 'evt',
          },
        },
      });
    });
  });
});
