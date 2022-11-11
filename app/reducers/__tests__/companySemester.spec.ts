import { addSemester } from 'app/actions/CompanyActions';
import { Semester } from 'app/store/models';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import companySemesters, { CompanySemestersState } from '../companySemesters';

describe('reducers', () => {
  describe('company semester', () => {
    it('Company.ADD_SEMESTER.SUCCESS', () => {
      const prevState: CompanySemestersState = {
        ...getInitialEntityReducerState(),
        items: [1],
        byId: {
          1: {
            id: 1,
            year: 2001,
            semester: Semester.Spring,
            activeInterestForm: false,
          },
        },
      };
      const action = addSemester.success({
        payload: {
          id: 2,
          year: 2001,
          semester: Semester.Autumn,
          activeInterestForm: false,
        },
        meta: {} as any,
      });
      expect(companySemesters(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [1, 2],
        byId: {
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
