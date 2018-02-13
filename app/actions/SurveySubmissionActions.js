// @flow

import { SurveySubmission } from './ActionTypes';
import callAPI from 'app/actions/callAPI';
import { surveySubmissionSchema } from 'app/reducers';
import type { Thunk } from 'app/types';

export function fetchSubmissions(surveyId: number): Thunk<*> {
  return callAPI({
    types: SurveySubmission.FETCH,
    endpoint: `/surveys/${surveyId}/submissions`,
    schema: [surveySubmissionSchema],
    meta: {
      errorMessage: 'Henting av svar på spørreundersøkelse feilet'
    },
    propagateError: true
  });
}

export function addSubmission({ surveyId, ...data }: Object): Thunk<*> {
  return callAPI({
    types: SurveySubmission.ADD,
    endpoint: `/surveys/${surveyId}/submissions/`,
    method: 'POST',
    body: data,
    meta: {
      errorMessage: 'Legg til svar feilet',
      successMessage: 'Undersøkelse besvart!',
      surveyId
    }
  });
}

export function deleteSubmission(surveyId: number, submissionId: number) {
  return callAPI({
    types: SurveySubmission.DELETE,
    endpoint: `/surveys/${surveyId}/submissions/${submissionId}/`,
    method: 'DELETE',
    meta: {
      surveyId,
      submissionId,
      errorMessage: 'Sletting av svar feilet',
      successMessage: 'Svar slettet.'
    }
  });
}
