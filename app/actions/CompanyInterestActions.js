import { CompanyInterestForm } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { addNotification } from 'app/actions/NotificationActions';

export default function createCompanyInterest(
  companyName,
  personName,
  mail,
  comment,
  semesterList,
  eventList
) {
  return dispatch => {
    dispatch(
      callAPI({
        types: CompanyInterestForm.CREATE,
        endpoint: '/company-interests/',
        method: 'POST',
        body: {
          companyName,
          personName,
          mail,
          comment,
          semesterList,
          eventList
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
