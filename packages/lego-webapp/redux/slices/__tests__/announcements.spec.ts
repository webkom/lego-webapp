import { describe, it, expect, vi } from 'vitest';
import { Announcements } from '~/redux/actionTypes';
import announcements from '../announcements';
import type { UnknownAnnouncement } from '~/redux/models/Announcement';

describe('reducers', () => {
  describe('announcements', () => {
    vi.useFakeTimers().setSystemTime(new Date());

    it('Announcements.SEND.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [99],
        entities: {
          99: {
            id: 99,
            sent: null,
          } as UnknownAnnouncement,
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
        paginationNext: {},
        fetching: false,
        ids: [99],
        entities: {
          99: {
            id: 99,
            sent: new Date().toISOString(),
          },
        },
      });
    });
  });
});
