import { describe, it, expect, vi } from 'vitest';
import { Announcements } from 'app/actions/ActionTypes';
import announcements from '../announcements';

describe('reducers', () => {
  describe('announcements', () => {
    vi.useFakeTimers().setSystemTime(new Date());

    it('Announcements.SEND.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [99],
        byId: {
          99: {
            id: 99,
            sent: null,
          },
        },
      };
      const action = {
        type: Announcements.SEND.SUCCESS,
        meta: {
          announcementId: 99,
        },
      };
      expect(announcements(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [99],
        byId: {
          99: {
            id: 99,
            sent: new Date().toISOString(),
          },
        },
      });
    });
  });
});
