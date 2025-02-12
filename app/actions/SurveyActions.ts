import moment from 'moment-timezone';
import callAPI from 'app/actions/callAPI';
import { surveySchema } from 'app/reducers';
import { Survey } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  DetailedSurvey,
  FormSubmitSurvey,
  PublicResultsSurvey,
  PublicSurvey,
} from 'app/store/models/Survey';

export function fetchSurvey(surveyId: EntityId) {
  return callAPI<DetailedSurvey>({
    types: Survey.FETCH,
    endpoint: `/surveys/${surveyId}/`,
    schema: surveySchema,
    meta: {
      errorMessage: 'Henting av spørreundersøkelse feilet',
    },
    propagateError: true,
  });
}
export function fetchWithToken(surveyId: EntityId, token: string) {
  return callAPI<PublicResultsSurvey>({
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
  });
}
export function fetchAll({ next = false }: { next?: boolean } = {}) {
  return callAPI<PublicSurvey[]>({
    types: Survey.FETCH,
    endpoint: '/surveys/',
    schema: [surveySchema],
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av spørreundersøkelser feilet',
    },
    propagateError: true,
  });
}
export function addSurvey(data: FormSubmitSurvey) {
  return callAPI<DetailedSurvey>({
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
}: Partial<FormSubmitSurvey> & { surveyId: EntityId }) {
  return callAPI<DetailedSurvey>({
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
export function fetchTemplates({ next = false }: { next?: boolean } = {}) {
  return callAPI<PublicSurvey[]>({
    types: Survey.FETCH,
    endpoint: `/survey-templates/`,
    schema: [surveySchema],
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av spørreundersøkelse maler feilet',
    },
    propagateError: true,
  });
}
export function fetchTemplate(title: string) {
  return callAPI<DetailedSurvey>({
    types: Survey.FETCH,
    endpoint: `/survey-templates/${title}/`,
    schema: surveySchema,
    meta: {
      errorMessage: 'Henting av spørreundersøkelse mal feilet',
    },
    propagateError: true,
  });
}
export function shareSurvey(surveyId: EntityId) {
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
export function hideSurvey(surveyId: EntityId) {
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
