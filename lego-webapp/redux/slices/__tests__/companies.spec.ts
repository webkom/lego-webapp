import { describe, it, expect } from 'vitest';
import { Company } from '~/redux/actionTypes';
import companies from '../companies';
import type { UnknownCompany } from '~/redux/models/Company';

describe('reducers', () => {
  describe('companies semester files', () => {
    it('Company.ADD_SEMESTER_FILES.SUCCESS', () => {
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        eventStatistics: {},
        ids: [2, 3],
        entities: {
          2: {
            id: 2,
          } as UnknownCompany,
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 1,
                semester: 1,
              },
            ],
          } as UnknownCompany,
        },
      };
      const actions = [
        {
          type: Company.ADD_SEMESTER_FILES.SUCCESS,
          meta: {
            companyId: 3,
          },
          payload: {
            id: 12,
            semester: 2,
          },
        },
        {
          type: Company.ADD_SEMESTER_FILES.SUCCESS,
          meta: {
            companyId: 2,
          },
          payload: {
            id: 13,
            semester: 1,
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
            semesterFiles: [
              {
                id: 13,
                semester: 1,
              },
            ],
          },
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 1,
                semester: 1,
              },
              {
                id: 12,
                semester: 2,
              },
            ],
          },
        },
      });
    });
    it('Company.EDIT_SEMESTER_FILES.SUCCESS', () => {
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        eventStatistics: {},
        ids: [3],
        entities: {
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 1,
                semester: 1,
              },
              {
                id: 2,
                semester: 2,
              },
            ],
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.EDIT_SEMESTER_FILES.SUCCESS,
        meta: {
          companyId: 3,
          semesterFilesId: 1,
        },
        payload: {
          id: 1,
          semester: 1,
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 1,
                semester: 1,
              },
              {
                id: 2,
                semester: 2,
              },
            ],
          },
        },
      });
    });
    it('Company.DELETE_SEMESTER_FILES.SUCCESS', () => {
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        eventStatistics: {},
        ids: [3],
        entities: {
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 1,
                semester: 2,
              },
              {
                id: 2,
                semester: 1,
              },
            ],
          } as UnknownCompany,
        },
      };
      const action = {
        type: Company.DELETE_SEMESTER_FILES.SUCCESS,
        meta: {
          companyId: 3,
          semesterFilesId: 1,
        },
      };
      expect(companies(prevState, action)).toEqual({
        ...prevState,
        entities: {
          3: {
            id: 3,
            semesterFiles: [
              {
                id: 2,
                semester: 1,
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
        eventStatistics: {},
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
        eventStatistics: {},
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
        eventStatistics: {},
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

  describe('company event statistics', () => {
    it('Company.FETCH_EVENT_STATISTICS.SUCCESS', () => {
      const prevState: ReturnType<typeof companies> = {
        actionGrant: [],
        paginationNext: {},
        fetching: false,
        eventStatistics: {},
        ids: [],
        entities: {},
      };
      const statistics = {
        eventCount: 2,
        averageParticipants: 30,
        averageWaitingList: 4.5,
        averageFill: 0.75,
      };
      const newState = companies(prevState, {
        type: Company.FETCH_EVENT_STATISTICS.SUCCESS,
        meta: {
          companyId: 1,
          fromSemesterId: 2,
          toSemesterId: 3,
        },
        payload: statistics,
      });
      expect(newState).toEqual({
        ...prevState,
        eventStatistics: {
          '1-2-3': statistics,
        },
      });
    });
  });
});
