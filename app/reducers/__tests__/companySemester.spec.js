import companySemesters from '../companySemesters';
import { Company } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('company semester', () => {
    it('Company.ADD_SEMESTER.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [1],
        byId: {
          1: {
            id: 1,
            year: 2001,
            semester: 'spring',
            activeInterestForm: false
          }
        }
      };
      const action = {
        type: Company.ADD_SEMESTER.SUCCESS,
        payload: {
          id: 2,
          year: 2001,
          semester: 'autumn',
          activeInterestForm: false
        }
      };
      expect(companySemesters(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1, 2],
        byId: {
          1: {
            id: 1,
            year: 2001,
            semester: 'spring',
            activeInterestForm: false
          },
          2: {
            id: 2,
            year: 2001,
            semester: 'autumn',
            activeInterestForm: false
          }
        }
      });
    });
  });
});
