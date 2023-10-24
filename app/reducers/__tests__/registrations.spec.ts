import moment from 'moment';
import { describe, it, expect } from 'vitest';
import { Event } from 'app/actions/ActionTypes';
import registrations from '../registrations';

describe('reducers', () => {
  describe('registrations', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
      items: [3, 4],
      byId: {
        3: {
          id: 3,
        },
        4: {
          id: 4,
        },
      },
    };
    it('Event.SOCKET_EVENT_UPDATED', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_EVENT_UPDATED,
        payload: {
          id: 1,
          pools: [
            {
              registrations: [
                {
                  id: 31,
                },
                {
                  id: 32,
                },
              ],
            },
          ],
          waitingRegistrations: [
            {
              id: 33,
            },
          ],
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4, 31, 32, 33],
        byId: {
          3: {
            id: 3,
          },
          4: {
            id: 4,
          },
          31: {
            id: 31,
          },
          32: {
            id: 32,
          },
          33: {
            id: 33,
          },
        },
      });
    });
    it('Registration change events adds registration to state', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 35,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4, 35],
        byId: {
          3: {
            id: 3,
          },
          4: {
            id: 4,
          },
          35: {
            id: 35,
          },
        },
      });
    });
    it('Registration change events updates registration in state', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 3,
          test: 1,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            test: 1,
          },
          4: {
            id: 4,
          },
        },
      });
    });
    it('Registration change events removes existing unregistrationDate', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            unregistrationDate: 'xyz',
          },
        },
      };
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 3,
          test: 1,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            test: 1,
          },
        },
      });
    });
    it('Event.REQUEST_UNREGISTER.BEGIN', () => {
      const prevState = baseState;
      const action = {
        type: Event.REQUEST_UNREGISTER.BEGIN,
        meta: {
          id: 3,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            fetching: true,
          },
          4: {
            id: 4,
          },
        },
      });
    });
    it('Event.REQUEST_UNREGISTER.FAILURE', () => {
      const prevState = baseState;
      const action = {
        type: Event.REQUEST_UNREGISTER.FAILURE,
        meta: {
          id: 3,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            fetching: false,
          },
          4: {
            id: 4,
          },
        },
      });
    });
    it('Event.UPDATE_REGISTRATION.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.UPDATE_REGISTRATION.SUCCESS,
        payload: {
          id: 3,
          test: 1,
        },
      };
      expect(registrations(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            test: 1,
          },
          4: {
            id: 4,
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        payload: {
          id: 3,
        },
      };
      const newState = registrations(prevState, action);
      expect(newState.items).toEqual([3, 4]);
      expect(newState.byId[3].fetching).toBe(false);
      // unregistrationDate should be approximately now
      expect(
        Math.abs(moment(newState.byId[3].unregistrationDate) - moment())
      ).toBeLessThan(1000);
    });
  });
});
