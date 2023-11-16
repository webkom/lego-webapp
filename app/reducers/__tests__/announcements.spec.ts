import moment from 'moment';
import timekeeper from 'timekeeper';
import { describe, it, expect } from 'vitest';
import { Announcements } from 'app/actions/ActionTypes';
import announcements from '../announcements';
import type { UnknownAnnouncement } from 'app/store/models/Announcement';

describe('reducers', () => {
  describe('announcements', () => {
    const time = Date.now();
    timekeeper.freeze(time);
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
            sent: moment().toISOString(),
          },
        },
      });
    });
  });
});
