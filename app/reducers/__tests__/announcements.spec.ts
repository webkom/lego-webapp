import { describe, it, expect, vi } from 'vitest';
import { sendAnnouncement } from 'app/actions/AnnouncementsActions';
import announcements from '../announcements';
import type { UnknownAnnouncement } from 'app/store/models/Announcement';

describe('reducers', () => {
  describe('announcements', () => {
    vi.useFakeTimers().setSystemTime(new Date());

    it('sendAnnouncement.fulfilled', () => {
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
      const action = sendAnnouncement.fulfilled(undefined, '', 99);
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
