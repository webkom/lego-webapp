import { produce } from 'immer';
import moment from 'moment';
import timekeeper from 'timekeeper';
import { sendAnnouncement } from 'app/actions/AnnouncementsActions';
import type Announcement from 'app/store/models/Announcement';
import announcements, { AnnouncementsState } from '../announcements';

describe('reducers', () => {
  describe('announcements', () => {
    const time = Date.now();
    timekeeper.freeze(time);
    it('sets sent time after sending announcement', () => {
      const prevState: AnnouncementsState = {
        actionGrant: [],
        pagination: {},
        paginationNext: {},
        hasMore: false,
        fetching: true,
        items: [99],
        byId: {
          99: {
            id: 99,
            sent: null,
          } as Announcement,
        },
      };
      const action = sendAnnouncement.success({
        payload: {
          status: 'message queued for sending',
        },
        meta: {
          announcementId: 99,
        } as any,
      });
      expect(announcements(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.byId[99].sent = moment();
        })
      );
    });
  });
});
