import { FORM_ERROR } from 'final-form';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

/*
 * Simple utility that handles submission errors
 *
 * Usage:
 * onSubmit(data).catch(handleSubmissionError)
 * or
 * onSubmit(data).then(result=>{...}, handleSubmissionError)
 */
export const handleSubmissionError = (error: any) => {
  const errPayload = get(error, ['payload', 'response', 'jsonData']);

  if (!errPayload) {
    throw error;
  }

  const { detail } = errPayload;

  const _error = typeof detail === 'object' ? JSON.stringify(detail) : detail;

  throw new SubmissionError({ ...errPayload, _error });
};

/*
 * Simple utility that handles submission errors
 *
 * Usage:
 * onSubmit(data).catch(handleSubmissionError)
 * or
 * onSubmit(data).then(result=>{...}, handleSubmissionError)
 */
export const handleSubmissionErrorFinalForm = (error: any) => {
  const errPayload = error?.payload?.response?.jsonData;

  if (!errPayload) {
    return {
      [FORM_ERROR]: error?.payload?.response?.textString,
    };
  }

  const { detail } = errPayload;
  const form_error = detail
    ? typeof detail === 'object'
      ? JSON.stringify(errPayload.detail)
      : errPayload.detail
    : errPayload.error;
  return { ...errPayload, [FORM_ERROR]: form_error };
};

/*
 * Simple utility that handles submission errors
 *
 * Usage:
 * withSubmissionError(onSubmit)
 */
export const withSubmissionError = (func: (arg0: any) => Promise<any>) => {
  return (data: any) => func(data).catch(handleSubmissionError);
};
