// @flow

import { Survey } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { surveySchema } from 'app/reducers';
import type { Thunk } from 'app/types';
import { startSubmit, stopSubmit } from 'redux-form';

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
          errorMessage: 'Legg til spørreundersøkelse feilet',
          successMessage: 'Spørreundersøkelse lagt til.'
        }
      })
    ).then(action => {
      dispatch(stopSubmit('survey'));
    });
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
          errorMessage: 'Endring av spørreundersøkelse feilet',
          successMessage: 'Spørreundersøkelse endret.'
        }
      })
    ).then(() => {
      dispatch(stopSubmit('survey'));
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
          errorMessage: 'Sletting av spørreundersøkelse feilet',
          successMessage: 'Spørreundersøkelse slettet.'
        }
      })
    );
  };
}
