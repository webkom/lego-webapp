import { describe, it, expect } from 'vitest';
import { Company } from 'app/actions/ActionTypes';
import companySemesters from '../companySemesters';

describe('reducers', () => {
  describe('company semester', () => {
    it('Company.ADD_SEMESTER.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        ids: [1],
        entities: {
          1: {
            id: 1,
            year: 2001,
            semester: 'spring',
            activeInterestForm: false,
          },
        },
      };
      const action = {
        type: Company.ADD_SEMESTER.SUCCESS,
        meta: {
          endpoint: '/companies/1/semesters/',
        },
        payload: {
          entities: {
            companySemesters: {
              2: {
                id: 2,
                year: 2001,
                semester: 'autumn',
                activeInterestForm: false,
              },
            },
          },
        },
      };
      expect(companySemesters(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        ids: [1, 2],
        entities: {
          1: {
            id: 1,
            year: 2001,
            semester: 'spring',
            activeInterestForm: false,
          },
          2: {
            id: 2,
            year: 2001,
            semester: 'autumn',
            activeInterestForm: false,
          },
        },
      });
    });
  });
});
