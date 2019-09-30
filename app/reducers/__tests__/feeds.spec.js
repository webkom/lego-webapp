import feeds from '../feeds';
import { Feed } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('feeds', () => {
    it('Fetching feed populates state correctly', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: ['x'],
        byId: {
          x: {}
        }
      };
      const action = {
        type: Feed.FETCH.SUCCESS,
        meta: {
          feedId: 'myfeed'
        },
        payload: {
          result: [1, 2, 3]
        }
      };
      expect(feeds(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: ['x', 'myfeed'],
        byId: {
          x: {},
          myfeed: {
            type: 'myfeed',
            activities: [1, 2, 3]
          }
        }
      });
    });
  });
});
