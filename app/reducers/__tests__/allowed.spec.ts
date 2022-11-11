import { fetchMeta, IsAllowedMap } from 'app/actions/MetaActions';
import allowed from '../allowed';

describe('reducers', () => {
  describe('allowed', () => {
    it('should set allowed on fetchMeta.success', () => {
      const prevState = undefined;
      const isAllowed: IsAllowedMap = {
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
        polls: true,
        penalties: true,
        surveys: true,
        groups: true,
        email: true,
        users: true,
      };
      const action = fetchMeta.success({
        payload: {
          site: {
            name: 'LEGO',
            slogan: 'LEGO Er Ganske Oppdelt',
            contactEmail: 'webkom@abakus.no',
            documentationUrl: '/docs/',
            domain: 'abakus.no',
            owner: 'Abakus',
          },
          isAllowed: isAllowed,
        },
        meta: undefined as any,
      });
      expect(allowed(prevState, action)).toEqual(isAllowed);
    });
  });
});
