import { describe, it, expect } from 'vitest';
import { Event } from '../../actions/ActionTypes';
import pools from '../pools';

describe('reducers', () => {
  describe('pool', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
      items: [3],
      byId: {
        3: {
          id: 3,
          registrations: [],
          registrationCount: 0,
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
              id: 3,
              registrations: [],
              registrationCount: 0,
            },
            {
              id: 4,
              registrations: [],
              registrationCount: 0,
            },
          ],
        },
      };
      expect(pools(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3, 4],
        byId: {
          3: {
            id: 3,
            registrations: [],
            registrationCount: 0,
          },
          4: {
            id: 4,
            registrations: [],
            registrationCount: 0,
          },
        },
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 9,
          pool: 3,
        },
      };
      expect(pools(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            registrations: [9],
            registrationCount: 1,
          },
        },
      });
    });
    it('Event.SOCKET_UNREGISTRATION.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            registrations: [9, 10],
            registrationCount: 2,
          },
        },
      };
      const action = {
        type: Event.SOCKET_UNREGISTRATION.SUCCESS,
        meta: {
          fromPool: 3,
        },
        payload: {
          id: 10,
        },
      };
      expect(pools(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            registrations: [9],
            registrationCount: 1,
          },
        },
      });
    });
  });
});
