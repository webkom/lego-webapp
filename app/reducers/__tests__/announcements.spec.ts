import moment from 'moment';
import timekeeper from 'timekeeper';
import { Announcements } from 'app/actions/ActionTypes';
import type { ListAnnouncement } from 'app/store/models/Announcement';
import announcements from '../announcements';

describe('reducers', () => {
  describe('announcements', () => {
    const time = Date.now();
    timekeeper.freeze(time);
    it('Announcements.SEND.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        fetching: false,
        pagination: {},
        items: [99],
        byId: {
          99: {
            id: 99,
            sent: null,
          } as ListAnnouncement,
        },
      };
      const action = {
        type: Announcements.SEND.SUCCESS,
        payload: {
          status: 'message queued for sending',
        },
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
            sent: moment(),
          },
        },
      });
    });
  });
});
