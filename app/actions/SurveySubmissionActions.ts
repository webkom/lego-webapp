import callAPI from 'app/actions/callAPI';
import { surveySubmissionSchema } from 'app/reducers';
import { SurveySubmission } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  FormSurveySubmission,
  SurveySubmission as SurveySubmissionType,
} from 'app/store/models/SurveySubmission';

export function fetchSubmissions(surveyId: EntityId) {
  return callAPI<SurveySubmissionType>({
    types: SurveySubmission.FETCH_ALL,
    endpoint: `/surveys/${surveyId}/submissions/`,
    schema: [surveySubmissionSchema],
    meta: {
      errorMessage: 'Henting av svar på spørreundersøkelse feilet',
    },
    propagateError: true,
  });
}
export function fetchUserSubmission(surveyId: EntityId, user: EntityId) {
  return callAPI<SurveySubmissionType>({
    types: SurveySubmission.FETCH,
    endpoint: `/surveys/${surveyId}/submissions/?user=${user}`,
    method: 'GET',
    schema: [surveySubmissionSchema],
    meta: {
      surveyId: Number(surveyId),
      user: Number(user),
      errorMessage:
        'Noe gikk galt i sjekking av hvorvidt brukeren allerede har svart',
    },
  });
}
export function addSubmission({
  surveyId,
  ...data
}: FormSurveySubmission & { surveyId: EntityId }) {
  return callAPI<SurveySubmissionType>({
    types: SurveySubmission.ADD,
    endpoint: `/surveys/${surveyId}/submissions/`,
    method: 'POST',
    body: data,
    schema: surveySubmissionSchema,
    meta: {
      errorMessage: 'Legg til svar feilet',
      successMessage: 'Undersøkelse besvart!',
      surveyId: Number(surveyId),
    },
  });
}
export function deleteSubmission(surveyId: EntityId, submissionId: EntityId) {
  return callAPI({
    types: SurveySubmission.DELETE,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/`,
    method: 'DELETE',
    meta: {
      surveyId: Number(surveyId),
      id: Number(submissionId),
      errorMessage: 'Sletting av svar feilet',
      successMessage: 'Svar slettet',
    },
  });
}
export function hideAnswer(
  surveyId: EntityId,
  submissionId: EntityId,
  answerId: EntityId,
) {
  return callAPI({
    types: SurveySubmission.HIDE_ANSWER,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/hide/?answer=${answerId}`,
    schema: surveySubmissionSchema,
    method: 'POST',
    meta: {
      surveyId: Number(surveyId),
      submissionId: Number(submissionId),
      answerId: Number(answerId),
      errorMessage: 'Skjuling av kommentar feilet',
      successMessage: 'Kommentar skjult',
    },
  });
}
export function showAnswer(
  surveyId: EntityId,
  submissionId: EntityId,
  answerId: EntityId,
) {
  return callAPI({
    types: SurveySubmission.SHOW_ANSWER,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/show/?answer=${answerId}`,
    schema: surveySubmissionSchema,
    method: 'POST',
    meta: {
      surveyId: Number(surveyId),
      submissionId: Number(submissionId),
      answerId: Number(answerId),
      errorMessage: 'Avslutning av skjuling feilet',
      successMessage: 'Skjuling av kommentar avsluttet',
    },
  });
}
