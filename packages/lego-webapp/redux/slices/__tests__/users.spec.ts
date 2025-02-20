import { describe, it, expect } from 'vitest';
import { Event } from '~/redux/actionTypes';
import users from '../users';

describe('reducers', () => {
  describe('users', () => {
    const baseState: ReturnType<typeof users> = {
      actionGrant: [],
      paginationNext: {},
      fetching: false,
      ids: [3],
      entities: {
        3: {
          id: 3,
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
                  user: {
                    id: 49,
                  },
                },
              ],
            },
          ],
          waitingRegistrations: [
            {
              id: 33,
              user: {
                id: 50,
                pic: '123',
              },
            },
          ],
        },
      };
      expect(users(prevState, action)).toEqual({
        ...baseState,
        ids: [3, 49, 50],
        entities: {
          3: {
            id: 3,
          },
          49: {
            id: 49,
          },
          50: {
            id: 50,
            pic: '123',
          },
        },
      });
    });
    it('Event.SOCKET_REGISTRATION.SUCCESS and ADMIN_REGISTER.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Event.SOCKET_REGISTRATION.SUCCESS,
        payload: {
          id: 31,
          user: {
            id: 49,
          },
        },
      };
      expect(users(prevState, action)).toEqual({
        ...baseState,
        ids: [3, 49],
        entities: {
          3: {
            id: 3,
          },
          49: {
            id: 49,
          },
        },
      });
    });
  });
});
