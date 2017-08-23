import { CompanyInterestForm } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { addNotification } from 'app/actions/NotificationActions';
import { companyInterestSchema } from 'app/reducers';
import { push } from 'react-router-redux';

export function fetchAll() {
  return callAPI({
    types: CompanyInterestForm.FETCH_ALL,
    endpoint: '/company-interests/',
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Fetching companyInterest failed'
    }
  });
}

export function fetchCompanyInterest(companyInterestId) {
  return callAPI({
    types: CompanyInterestForm.FETCH,
    endpoint: `/company-interests/${companyInterestId}/`,
    schema: companyInterestSchema,
    meta: {
      errorMessage: 'Fetching companyInterest failed'
    }
  });
}

export type CompanyInterestEntity = {
  id: number,
  companyName: string,
  contactPerson: string,
  mail: string,
  semesters: array,
  events: array,
  readme: boolean,
  collaboration: boolean,
  bedex: boolean,
  itdagene: boolean,
  comment: string
};

export function createCompanyInterest({
  companyName,
  contactPerson,
  mail,
  semesters,
  events,
  readme,
  collaboration,
  bedex,
  itdagene,
  comment
}) {
  return dispatch => {
    return dispatch(
      callAPI({
        types: CompanyInterestForm.CREATE,
        endpoint: '/company-interests/',
        method: 'POST',
        schema: [companyInterestSchema],
        body: {
          companyName,
          contactPerson,
          mail,
          semesters,
          events,
          readme,
          collaboration,
          bedex,
          itdagene,
          comment
        },
        meta: {
          errorMessage: 'Creating CompanyInterestForm failed'
        }
      })
    ).then(() => {
      dispatch(
        addNotification({ message: 'Company interest successfully created!' })
      );
    });
  };
}

export function removeCompanyInterest(id) {
  return dispatch => {
    dispatch(
      callAPI({
        types: CompanyInterestForm.REMOVE,
        endpoint: `/company-interests/${id}/`,
        method: 'DELETE',
        meta: {
          companyInterestId: id,
          errorMessage: 'Removing companyInterest failed'
        }
      })
    ).then(() => {
      dispatch(
        addNotification({ message: 'Company interest successfully removed!' })
      );
      dispatch(push('/companyInterest/'));
    });
  };
}

export function updateCompanyInterest({
  id,
  companyName,
  contactPerson,
  mail,
  semesters,
  events,
  readme,
  collaboration,
  bedex,
  itdagene,
  comment
}) {
  return dispatch => {
    dispatch(
      callAPI({
        types: CompanyInterestForm.UPDATE,
        endpoint: `/company-interests/${id}/`,
        method: 'PATCH',
        body: {
          id,
          companyName,
          contactPerson,
          mail,
          semesters,
          events,
          readme,
          collaboration,
          bedex,
          itdagene,
          comment
        },
        meta: {
          interestGroupId: id,
          errorMessage: 'Editing companyInterest failed'
        }
      })
    ).then(() => {
      dispatch(
        addNotification({ message: 'Company interest successfully updated!' })
      );
      dispatch(push('/companyInterest/'));
    });
  };
}
