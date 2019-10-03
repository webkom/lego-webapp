// Hack because we have circular dependencies
// (companies -> events -> index -> frontpage -> events)
// This import resolves dependencies properly..
import 'app/reducers';

import companies from '../companies';
import { Company } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('companies semester status', () => {
    it('Company.ADD_SEMESTER_STATUS.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [2, 3],
        byId: {
          2: {
            id: 2
          },
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested']
              }
            ]
          }
        }
      };
      const actions = [
        {
          type: Company.ADD_SEMESTER_STATUS.SUCCESS,
          meta: {
            companyId: 3
          },
          payload: {
            id: 12,
            semester: 2,
            contactedStatus: ['course']
          }
        },
        {
          type: Company.ADD_SEMESTER_STATUS.SUCCESS,
          meta: {
            companyId: 2
          },
          payload: {
            id: 13,
            semester: 1,
            contactedStatus: ['course']
          }
        }
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        actionGrant: [],
        pagination: {},
        items: [2, 3],
        byId: {
          2: {
            id: 2,
            semesterStatuses: [
              {
                id: 13,
                semester: 1,
                contactedStatus: ['course']
              }
            ]
          },
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested']
              },
              {
                id: 12,
                semester: 2,
                contactedStatus: ['course']
              }
            ]
          }
        }
      });
    });

    it('Company.EDIT_SEMESTER_STATUS.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['not_interested']
              },
              {
                id: 2,
                semester: 2,
                contactedStatus: ['not_interested']
              }
            ]
          }
        }
      };
      const action = {
        type: Company.EDIT_SEMESTER_STATUS.SUCCESS,
        meta: {
          companyId: 3,
          semesterStatusId: 1
        },
        payload: {
          id: 1,
          semester: 1,
          contactedStatus: ['course']
        }
      };
      expect(companies(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 1,
                contactedStatus: ['course']
              },
              {
                id: 2,
                semester: 2,
                contactedStatus: ['not_interested']
              }
            ]
          }
        }
      });
    });

    it('Company.DELETE_SEMESTER_STATUS.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 1,
                semester: 2,
                contactedStatus: ['course']
              },
              {
                id: 2,
                semester: 1,
                contactedStatus: ['not_interested']
              }
            ]
          }
        }
      };
      const action = {
        type: Company.DELETE_SEMESTER_STATUS.SUCCESS,
        meta: {
          companyId: 3,
          semesterStatusId: 1
        }
      };
      expect(companies(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            semesterStatuses: [
              {
                id: 2,
                semester: 1,
                contactedStatus: ['not_interested']
              }
            ]
          }
        }
      });
    });
  });

  describe('companies company contact', () => {
    it('Company.ADD_COMPANY_CONTACT.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [2, 3],
        byId: {
          2: {
            id: 2
          },
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John'
              }
            ]
          }
        }
      };
      const actions = [
        {
          type: Company.ADD_COMPANY_CONTACT.SUCCESS,
          meta: {
            companyId: 3
          },
          payload: {
            id: 2,
            name: 'Jane'
          }
        },
        {
          type: Company.ADD_COMPANY_CONTACT.SUCCESS,
          meta: {
            companyId: 2
          },
          payload: {
            id: 3,
            name: 'Jake'
          }
        }
      ];
      let newState = companies(prevState, actions[0]);
      newState = companies(newState, actions[1]);
      expect(newState).toEqual({
        actionGrant: [],
        pagination: {},
        items: [2, 3],
        byId: {
          2: {
            id: 2,
            companyContacts: [
              {
                id: 3,
                name: 'Jake'
              }
            ]
          },
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John'
              },
              {
                id: 2,
                name: 'Jane'
              }
            ]
          }
        }
      });
    });

    it('Company.EDIT_COMPANY_CONTACT.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John',
                phone: '1234'
              },
              {
                id: 2,
                name: 'Test'
              }
            ]
          }
        }
      };
      const action = {
        type: Company.EDIT_COMPANY_CONTACT.SUCCESS,
        meta: {
          companyId: 3
        },
        payload: {
          id: 1,
          name: 'Johnny'
        }
      };

      expect(companies(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'Johnny'
              },
              {
                id: 2,
                name: 'Test'
              }
            ]
          }
        }
      });
    });

    it('Company.DELETE_COMPANY_CONTACT.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 1,
                name: 'John'
              },
              {
                id: 2,
                name: 'Test'
              }
            ]
          }
        }
      };
      const action = {
        type: Company.DELETE_COMPANY_CONTACT.SUCCESS,
        meta: {
          companyId: 3,
          companyContactId: 1
        }
      };

      expect(companies(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            companyContacts: [
              {
                id: 2,
                name: 'Test'
              }
            ]
          }
        }
      });
    });
  });
});
