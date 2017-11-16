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

  throw new SubmissionError({
    ...errPayload,
    _error: errPayload.detail
  });
};

/*
 * Simple utility that handles submission errors
 *
 * Usage:
 * withSubmissionError(onSubmit)
 */

export const withSubmissionError = (func: any => Promise<any>) => {
  return (data: any) => func(data).catch(handleSubmissionError);
};
