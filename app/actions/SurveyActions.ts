import moment from 'moment-timezone';
import callAPI from 'app/actions/callAPI';
import { surveySchema } from 'app/reducers';
import { Survey } from './ActionTypes';
import type { ID } from 'app/store/models';
import type { CreateSurvey } from 'app/store/models/Survey';
import type { Thunk } from 'app/types';

export function fetchSurvey(surveyId: number): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Survey.FETCH,
        endpoint: `/surveys/${surveyId}/`,
        schema: surveySchema,
        meta: {
          errorMessage: 'Henting av spørreundersøkelse feilet',
        },
        propagateError: true,
      })
    );
}
export function fetchWithToken(surveyId: number, token: string): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Survey.FETCH,
        endpoint: `/survey-results/${surveyId}/`,
        schema: surveySchema,
        requiresAuthentication: false,
        headers: {
          Authorization: `Token ${token}`,
        },
        meta: {
          errorMessage: 'Henting av spørreundersøkelse feilet',
        },
        propagateError: true,
      })
    );
}
export function fetchAll({
  next = false,
}: {
  next?: boolean;
} = {}): Thunk<any> {
  return (dispatch, getState) => {
    const cursor = next ? getState().surveys.pagination.next : {};
    return dispatch(
      callAPI({
        types: Survey.FETCH,
        endpoint: '/surveys/',
        schema: [surveySchema],
        query: cursor,
        meta: {
          errorMessage: 'Henting av spørreundersøkelser feilet',
        },
        propagateError: true,
      })
    );
  };
}
export function addSurvey(data: CreateSurvey): Thunk<any> {
  return callAPI({
    types: Survey.ADD,
    endpoint: '/surveys/',
    method: 'POST',
    body: { ...data, activeFrom: moment(data.activeFrom).toISOString() },
    schema: surveySchema,
    meta: {
      errorMessage: 'Legg til spørreundersøkelse feilet',
      successMessage: 'Spørreundersøkelse lagt til.',
    },
  });
}
export function editSurvey({
  surveyId,
  ...data
}: Partial<CreateSurvey> & { surveyId: ID }): Thunk<any> {
  return callAPI({
    types: Survey.EDIT,
    endpoint: `/surveys/${surveyId}/`,
    method: 'PATCH',
    body: {
      ...data,
      activeFrom: data.activeFrom
        ? moment(data.activeFrom).toISOString()
        : undefined,
    },
    schema: surveySchema,
    meta: {
      errorMessage: 'Endring av spørreundersøkelse feilet',
      successMessage: 'Spørreundersøkelse endret.',
    },
  });
}
export function fetchTemplates(): Thunk<any> {
  return callAPI({
    types: Survey.FETCH,
    endpoint: `/survey-templates/`,
    schema: [surveySchema],
    meta: {
      errorMessage: 'Henting av spørreundersøkelse maler feilet',
    },
    propagateError: true,
  });
}
export function fetchTemplate(template: string): Thunk<any> {
  return callAPI({
    types: Survey.FETCH,
    endpoint: `/survey-templates/${template}/`,
    schema: surveySchema,
    meta: {
      errorMessage: 'Henting av spørreundersøkelse mal feilet',
    },
    propagateError: true,
  });
}
export function shareSurvey(surveyId: number): Thunk<any> {
  return callAPI({
    types: Survey.SHARE,
    endpoint: `/surveys/${surveyId}/share/`,
    schema: surveySchema,
    method: 'POST',
    meta: {
      errorMessage: 'Deling av spørreundersøkelse feilet',
    },
    propagateError: true,
  });
}
export function hideSurvey(surveyId: number): Thunk<any> {
  return callAPI({
    types: Survey.HIDE,
    endpoint: `/surveys/${surveyId}/hide/`,
    schema: surveySchema,
    method: 'POST',
    meta: {
      errorMessage: 'Skjuling av spørreundersøkelse feilet',
    },
    propagateError: true,
  });
}
