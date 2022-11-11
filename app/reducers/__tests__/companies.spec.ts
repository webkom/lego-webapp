// Hack because we have circular dependencies
// (companies -> events -> index -> frontpage -> events)
// This import resolves dependencies properly..
import 'app/store/rootReducer';
import {
  addCompanyContact,
  addSemesterStatus,
  deleteCompanyContact,
  deleteSemesterStatus,
  editCompanyContact,
  editSemesterStatus,
} from 'app/actions/CompanyActions';
import type Company from 'app/store/models/Company';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import companies, { CompaniesState } from '../companies';

describe('reducers', () => {
  describe('companies semester status', () => {
    it('Company.ADD_SEMESTER_STATUS.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [2, 3],
        byId: {
          2: {
            id: 2,
          } as Company,
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
            ],
          } as Company,
        },
      };
      const actions = [
        addSemesterStatus.success({
          meta: {
            companyId: 3,
          } as any,
          payload: {
            id: 12,
            semester: 2,
            contactedStatus: ['course'],
          },
        }),
        addSemesterStatus.success({
          meta: {
            companyId: 2,
          } as any,
          payload: {
            id: 13,
            semester: 1,
            contactedStatus: ['course'],
          },
        }),
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        ...getInitialEntityReducerState(),
        items: [2, 3],
        byId: {
          2: {
            id: 2,
            semesterStatuses: [
              {
                id: 13,
                semester: 1,
                contactedStatus: ['course'],
              },
            ],
          },
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
              {
                id: 12,
                semester: 2,
                contactedStatus: ['course'],
              },
            ],
          },
        },
      });
    });
    it('Company.EDIT_SEMESTER_STATUS.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
              {
                id: 2,
                semester: 2,
                contactedStatus: ['not_interested'],
              },
            ],
          } as Company,
        },
      };
      const action = editSemesterStatus.success({
        meta: {
          companyId: 3,
          semesterStatusId: 1,
        } as any,
        payload: {
          id: 1,
          semester: 1,
          contactedStatus: ['course'],
        },
      });
      expect(companies(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['course'],
              },
              {
                id: 2,
                semester: 2,
                contactedStatus: ['not_interested'],
              },
            ],
          },
        },
      });
    });
    it('Company.DELETE_SEMESTER_STATUS.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 2,
                contactedStatus: ['course'],
              },
              {
                id: 2,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
            ],
          } as Company,
        },
      };
      const action = deleteSemesterStatus.success({
        payload: null,
        meta: {
          companyId: 3,
          semesterStatusId: 1,
        } as any,
      });
      expect(companies(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 2,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
            ],
          },
        },
      });
    });
  });
  describe('companies company contact', () => {
    it('Company.ADD_COMPANY_CONTACT.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [2, 3],
        byId: {
          2: {
            id: 2,
          } as Company,
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
              },
            ],
          } as Company,
        },
      };
      const actions = [
        addCompanyContact.success({
          meta: {
            companyId: 3,
          } as any,
          payload: {
            id: 2,
            name: 'Jane',
          },
        }),
        addCompanyContact.success({
          meta: {
            companyId: 2,
          } as any,
          payload: {
            id: 3,
            name: 'Jake',
          },
        }),
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        ...getInitialEntityReducerState(),
        items: [2, 3],
        byId: {
          2: {
            id: 2,
            companyContacts: [
              {
                id: 3,
                name: 'Jake',
              },
            ],
          },
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
              },
              {
                id: 2,
                name: 'Jane',
              },
            ],
          },
        },
      });
    });
    it('Company.EDIT_COMPANY_CONTACT.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
                phone: '1234',
              },
              {
                id: 2,
                name: 'Test',
              },
            ],
          } as Company,
        },
      };
      const action = editCompanyContact.success({
        meta: {
          companyId: 3,
        } as any,
        payload: {
          id: 1,
          name: 'Johnny',
        },
      });
      expect(companies(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'Johnny',
              },
              {
                id: 2,
                name: 'Test',
              },
            ],
          },
        },
      });
    });
    it('Company.DELETE_COMPANY_CONTACT.SUCCESS', () => {
      const prevState: CompaniesState = {
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
              },
              {
                id: 2,
                name: 'Test',
              },
            ],
          } as Company,
        },
      };
      const action = deleteCompanyContact.success({
        payload: null,
        meta: {
          companyId: 3,
          companyContactId: 1,
        } as any,
      });
      expect(companies(prevState, action)).toEqual({
        ...getInitialEntityReducerState(),
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 2,
                name: 'Test',
              },
            ],
          },
        },
      });
    });
  });
});
