import { FORM_ERROR } from 'final-form';
import type { AppDispatch } from 'app/store/createStore';
import type { Thunk } from 'app/types';

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
 * Simple utility that handles submission errors (for final-form)
 *
 * Usage:
 * withSubmissionErrorFinalForm(onSubmit)
 */
export const withSubmissionErrorFinalForm = <Args extends unknown[], Return>(
  dispatch: AppDispatch,
  onSubmit: (...args: Args) => Thunk<Promise<Return>>
) => {
  return (...args: Args) =>
    dispatch(onSubmit(...args)).catch(handleSubmissionErrorFinalForm);
};
