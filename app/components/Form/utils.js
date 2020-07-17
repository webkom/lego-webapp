// @flow
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';

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

  throw new SubmissionError({
    ...errPayload,
    _error,
  });
};

/*
 * Simple utility that handles submission errors
 *
 * Usage:
 * withSubmissionError(onSubmit)
 */

export const withSubmissionError = (func: (any) => Promise<any>) => {
  return (data: any) => func(data).catch(handleSubmissionError);
};
