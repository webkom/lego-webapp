import * as Sentry from '@sentry/react';
import { isEmpty, isEqual } from 'lodash-es';
import { Form } from 'react-final-form';
import { handleSubmissionErrorFinalForm } from '~/components/Form/utils';
import type { FormProps } from 'react-final-form';

interface Props<FormValues> extends FormProps<FormValues> {
  /*
   * Automatic submission error handling
   * This will add a "generic" error message to the form's FORM_ERROR value if
   * the submission fails.
   */
  enableSubmissionError?: boolean;

  /* Only validate on submit, instead of giving real-time feedback on user input */
  validateOnSubmitOnly?: boolean;
}

const LegoFinalForm = <FormValues,>({
  children,
  onSubmit,
  enableSubmissionError = true,
  decorators = [],
  validateOnSubmitOnly = false,
  validate,
  ...rest
}: Props<FormValues>) => {
  return (
    <Form
      {...rest}
      validate={!validateOnSubmitOnly ? validate : undefined}
      initialValuesEqual={isEqual}
      decorators={decorators}
      onSubmit={(values, form) => {
        if (validateOnSubmitOnly) {
          const errors = validate ? validate(values) : {};
          if (!isEmpty(errors)) {
            return errors;
          }
        }

        const res = onSubmit(values, form);

        if (!res || !('then' in res)) {
          return res;
        }

        return res
          .then((result) => {
            return result;
          })
          .catch((error) => {
            Sentry.captureException(error);
            if (import.meta.env.DEV) console.error(error);

            if (!enableSubmissionError) {
              throw error;
            }

            return handleSubmissionErrorFinalForm(error);
          });
      }}
    >
      {children}
    </Form>
  );
};

export default LegoFinalForm;
