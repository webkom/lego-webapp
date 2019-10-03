import allowed from '../allowed';
import { Meta } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('allowed', () => {
    it('should set allowed on Meta.FETCH.SUCCESS', () => {
      const prevState = undefined;
      const isAllowed = {
        events: true,
        articles: true,
        joblistings: true,
        companies: true,
        meetings: true,
        quotes: true,
        galleries: true,
        interestGroups: true,
        bdb: true,
        announcements: true,
        penalties: true,
        surveys: true,
        groups: true,
        email: true,
        users: true
      };
      const action = {
        type: Meta.FETCH.SUCCESS,
        payload: {
          site: {
            name: 'LEGO',
            slogan: 'LEGO Er Ganske Oppdelt',
            contactEmail: 'webkom@abakus.no',
            documentationUrl: '/docs/',
            domain: 'abakus.no',
            owner: 'Abakus'
          },
          isAllowed: isAllowed
        }
      };
      expect(allowed(prevState, action)).toEqual(isAllowed);
    });
  });
});
