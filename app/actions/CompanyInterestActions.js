import { CompanyInterestForm } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { addNotification } from 'app/actions/NotificationActions';
import { companyInterestSchema } from 'app/reducers';
import { CompanyInterest } from './ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type CompanyInterestEntity = {
  id: number,
  name: string,
  mail: string,
  contactPerson: string
};

export default createEntityReducer({
  key: 'companyInterestList',
  types: {
    fetch: CompanyInterest.FETCH_ALL
  },
  mutate(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
});

export function fetchAll() {
  return callAPI({
    types: CompanyInterest.FETCH_ALL,
    endpoint: '/companyInterestList/',
    schema: [companyInterestSchema],
    meta: {
      errorMessage: 'Fetching companyInterest failed'
    }
  });
}

export function createCompanyInterest({
  companyName,
  contactPerson,
  mail,
  comment,
  semester0,
  semester1,
  semester2,
  semester3,
  companyPresentation,
  course,
  lunchPresentation,
  readme,
  collaboration,
  bedex,
  itdagene
}) {
  return dispatch => {
    dispatch(
      callAPI({
        types: CompanyInterestForm.CREATE,
        endpoint: '/company-interests/',
        method: 'POST',
        schema: [companyInterestSchema],
        body: {
          companyName,
          contactPerson,
          mail,
          comment,
          semester0,
          semester1,
          semester2,
          semester3,
          companyPresentation,
          course,
          lunchPresentation,
          readme,
          collaboration,
          bedex,
          itdagene
        },
        meta: {
          errorMessage: 'Creating CompanyInterestForm failed'
        }
      })
    ).then(() => {
      dispatch(addNotification('SUCCESS'));
    });
  };
}
