import { describe, it, expect } from 'vitest';
import { Company } from '~/redux/actionTypes';
import companies from '../companies';
import type { UnknownCompany } from '~/redux/models/Company';

describe('reducers', () => {
  describe('companies semester status', () => {
    it('Company.ADD_SEMESTER_STATUS.SUCCESS', () => {
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [2, 3],
        entities: {
          2: {
            id: 2,
          } as UnknownCompany,
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested'],
              },
            ],
          } as UnknownCompany,
        },
      };
      const actions = [
        {
          type: Company.ADD_SEMESTER_STATUS.SUCCESS,
          meta: {
            companyId: 3,
          },
          payload: {
            id: 12,
            semester: 2,
            contactedStatus: ['course'],
          },
        },
        {
          type: Company.ADD_SEMESTER_STATUS.SUCCESS,
          meta: {
            companyId: 2,
          },
          payload: {
            id: 13,
            semester: 1,
            contactedStatus: ['course'],
          },
        },
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        ...prevState,
        entities: {
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
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [3],
        entities: {
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
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.EDIT_SEMESTER_STATUS.SUCCESS,
        meta: {
          companyId: 3,
          semesterStatusId: 1,
        },
        payload: {
          id: 1,
          semester: 1,
          contactedStatus: ['course'],
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
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
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [3],
        entities: {
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
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.DELETE_SEMESTER_STATUS.SUCCESS,
        meta: {
          companyId: 3,
          semesterStatusId: 1,
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
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
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [2, 3],
        entities: {
          2: {
            id: 2,
          } as UnknownCompany,
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
              },
            ],
          } as UnknownCompany,
        },
      };
      const actions = [
        {
          type: Company.ADD_COMPANY_CONTACT.SUCCESS,
          meta: {
            companyId: 3,
          },
          payload: {
            id: 2,
            name: 'Jane',
          },
        },
        {
          type: Company.ADD_COMPANY_CONTACT.SUCCESS,
          meta: {
            companyId: 2,
          },
          payload: {
            id: 3,
            name: 'Jake',
          },
        },
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        ...prevState,
        entities: {
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
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [3],
        entities: {
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
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.EDIT_COMPANY_CONTACT.SUCCESS,
        meta: {
          companyId: 3,
        },
        payload: {
          id: 1,
          name: 'Johnny',
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
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
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        ids: [3],
        entities: {
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
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.DELETE_COMPANY_CONTACT.SUCCESS,
        meta: {
          companyId: 3,
          companyContactId: 1,
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
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
