// @flow
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';

export const withSubmissionError = (func: any => Promise<any>) => {
  return (...data: Array<any>) =>
    func(...data).catch(error => {
      const errPayload = get(error, ['payload', 'response', 'jsonData']);
      if (!errPayload) {
        throw error;
      }

      throw new SubmissionError({
        ...errPayload,
        _error: errPayload.detail
      });
    });
};
