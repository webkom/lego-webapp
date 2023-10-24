import moment from 'moment';
import timekeeper from 'timekeeper';
import { describe, it, expect } from 'vitest';
import { Announcements } from '../../actions/ActionTypes';
import announcements from '../announcements';

describe('reducers', () => {
  describe('announcements', () => {
    const time = Date.now();
    timekeeper.freeze(time);
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
            sent: moment(),
          },
        },
      });
    });
  });
});
