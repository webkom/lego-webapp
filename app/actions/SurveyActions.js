// @flow

import { Survey } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { surveySchema } from 'app/reducers';
import type { Thunk } from 'app/types';
import { startSubmit, stopSubmit } from 'redux-form';
import { push } from 'react-router-redux';
import { addNotification } from 'app/actions/NotificationActions';

export function fetchAll() {
  return callAPI({
    types: Survey.FETCH,
    endpoint: '/surveys/',
    schema: [surveySchema],
    meta: {
      errorMessage: 'Henting av spørreundersøkelser feilet',
      queryString: ''
    },
    propagateError: true
  });
}

export function fetch(surveyId: number): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Survey.FETCH,
        endpoint: `/surveys/${surveyId}/`,
        schema: surveySchema,
        meta: {
          errorMessage: 'Henting av spørreundersøkelse feilet'
        },
        propagateError: true
      })
    );
}

export function addSurvey(data: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('survey'));
    return dispatch(
      callAPI({
        types: Survey.ADD,
        endpoint: '/surveys/',
        method: 'POST',
        body: data,
        schema: surveySchema,
        meta: {
          errorMessage: 'Legg til spørreundersøkelse feilet'
        }
      })
    )
      .then(action => {
        if (!action || !action.payload) return;
        const id = action.payload.result;
        dispatch(stopSubmit('survey'));
        dispatch(addNotification({ message: 'Spørreundersøkelse lagt til.' }));
        dispatch(push(`/surveys/${id}`));
      })
      .catch();
  };
}

export function editSurvey({ surveyId, ...data }: Object): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('survey'));

    return dispatch(
      callAPI({
        types: Survey.EDIT,
        endpoint: `/surveys/${surveyId}/`,
        method: 'PATCH',
        body: data,
        schema: surveySchema,
        meta: {
          errorMessage: 'Endring av spørreundersøkelse feilet'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('survey'));
      dispatch(addNotification({ message: 'Spørreundersøkelse endret.' }));
      dispatch(push(`/surveys/${surveyId}/`));
    });
  };
}

export function deleteSurvey(surveyId: number): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Survey.DELETE,
        endpoint: `/surveys/${surveyId}/`,
        method: 'DELETE',
        meta: {
          id: Number(surveyId),
          errorMessage: 'Sletting av spørreundersøkelse feilet'
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Spørreundersøkelse slettet.' }));
      dispatch(push('/surveys/'));
    });
  };
}

export function addSubmission({ surveyId, ...data }: Object): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Survey.ADD_SUBMISSION,
        endpoint: `/surveys/${surveyId}/submissions/`,
        method: 'POST',
        body: data,
        meta: {
          errorMessage: 'Legg til svar feilet',
          surveyId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Semester status lagt til.' }));
      dispatch(push('/surveys/'));
    });
  };
}

export function editSubmission({
  surveyId,
  submissionId,
  ...data
}: Object): Thunk<*> {
  return dispatch => {
    return dispatch(
      callAPI({
        types: Survey.EDIT_SUBMISSION,
        endpoint: `/surveys/${surveyId}/submissions/${submissionId}/`,
        method: 'PATCH',
        body: data,
        meta: {
          errorMessage: 'Endring av submission status feilet',
          surveyId,
          submissionId
        }
      })
    ).then(() => {
      dispatch(addNotification({ message: 'Svar endret.' }));
      dispatch(push('/surveys/'));
    });
  };
}

export function deleteSubmission(surveyId: number, submissionId: number) {
  return callAPI({
    types: Survey.DELETE_SUBMISSION,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/`,
    method: 'DELETE',
    meta: {
      surveyId,
      submissionId,
      errorMessage: 'Sletting av svar feilet',
      successMessage: 'Svar slettet'
    }
  });
}
