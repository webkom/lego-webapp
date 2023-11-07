import callAPI from 'app/actions/callAPI';
import { surveySubmissionSchema } from 'app/reducers';
import { SurveySubmission } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchSubmissions(surveyId: number): Thunk<any> {
  return callAPI({
    types: SurveySubmission.FETCH_ALL,
    endpoint: `/surveys/${surveyId}/submissions/`,
    schema: [surveySubmissionSchema],
    meta: {
      errorMessage: 'Henting av svar på spørreundersøkelse feilet',
    },
    propagateError: true,
  });
}
export function fetchUserSubmission(
  surveyId: number,
  user: number
): Thunk<any> {
  return callAPI({
    types: SurveySubmission.FETCH,
    endpoint: `/surveys/${surveyId}/submissions/?user=${user}`,
    method: 'GET',
    schema: [surveySubmissionSchema],
    meta: {
      surveyId,
      user,
      errorMessage:
        'Noe gikk galt i sjekking av hvorvidt brukeren allerede har svart',
    },
  });
}
export function addSubmission({
  surveyId,
  ...data
}: Record<string, any>): Thunk<any> {
  return callAPI({
    types: SurveySubmission.ADD,
    endpoint: `/surveys/${surveyId}/submissions/`,
    method: 'POST',
    body: data,
    schema: surveySubmissionSchema,
    meta: {
      errorMessage: 'Legg til svar feilet',
      successMessage: 'Undersøkelse besvart!',
      surveyId,
    },
  });
}
export function deleteSubmission(
  surveyId: number,
  submissionId: number
): Thunk<any> {
  return callAPI({
    types: SurveySubmission.DELETE,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/`,
    method: 'DELETE',
    meta: {
      surveyId,
      id: submissionId,
      errorMessage: 'Sletting av svar feilet',
      successMessage: 'Svar slettet.',
    },
  });
}
export function hideAnswer(
  surveyId: number,
  submissionId: number,
  answerId: number
): Thunk<any> {
  return callAPI({
    types: SurveySubmission.HIDE_ANSWER,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/hide/?answer=${answerId}`,
    schema: surveySubmissionSchema,
    method: 'POST',
    meta: {
      surveyId,
      submissionId,
      answerId,
      errorMessage: 'Skjuling av kommentar feilet',
      successMessage: 'Kommentar skjult.',
    },
  });
}
export function showAnswer(
  surveyId: number,
  submissionId: number,
  answerId: number
): Thunk<any> {
  return callAPI({
    types: SurveySubmission.SHOW_ANSWER,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/show/?answer=${answerId}`,
    schema: surveySubmissionSchema,
    method: 'POST',
    meta: {
      surveyId,
      submissionId,
      answerId,
      errorMessage: 'Avslutning av skjuling feilet',
      successMessage: 'Skjuling av kommentar avsluttet.',
    },
  });
}
