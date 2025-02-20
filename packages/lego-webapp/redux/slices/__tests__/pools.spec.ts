import { describe, it, expect } from 'vitest';
import { Event } from '~/redux/actionTypes';
import pools from '../pools';
import type { AuthPool } from '~/redux/models/Pool';

describe('reducers', () => {
  describe('pool', () => {
    const baseState: ReturnType<typeof pools> = {
      actionGrant: [],
      paginationNext: {},
      fetching: false,
      ids: [3],
      entities: {
        3: {
          id: 3,
          registrations: [],
          registrationCount: 0,
        } as unknown as AuthPool,
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
        ...baseState,
        ids: [3, 4],
        entities: {
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
        ...baseState,
        ids: [3],
        entities: {
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
        ...baseState,
        ids: [3],
        entities: {
          3: {
            id: 3,
            registrations: [9, 10],
            registrationCount: 2,
          } as unknown as AuthPool,
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
        ...baseState,
        ids: [3],
        entities: {
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
