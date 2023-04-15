import * as Sentry from '@sentry/browser';
import createFocusOnErrorDecorator from 'final-form-focus';
import { isEqual } from 'lodash';
import { Form } from 'react-final-form';
import { handleSubmissionErrorFinalForm } from 'app/components/Form/utils';
import type { FormProps } from 'react-final-form';

const focusOnError = createFocusOnErrorDecorator();
interface Props<FormValues> extends FormProps<FormValues> {
  /*
   * Automatic submission error handling
   * This will add a "generic" error message to the form's FORM_ERROR value if
   * the submission fails.
   */
  enableSubmissionError?: boolean;

  /* Move the screen to the first error in the list on SubmissionError */
  enableFocusOnError?: boolean;
}

const LegoFinalForm = <FormValues,>({
  children,
  onSubmit,
  enableSubmissionError = true,
  enableFocusOnError = true,
  decorators = [],
  ...rest
}: Props<FormValues>) => {
  if (enableFocusOnError) {
    decorators = [focusOnError, ...decorators];
  }

  return (
    <Form
      {...rest}
      initialValuesEqual={isEqual}
      decorators={decorators}
      onSubmit={(values, form) => {
        const res = onSubmit(values, form);

        if (!res || !('then' in res)) {
          return res;
        }

        return res.catch((error) => {
          Sentry.captureException(error);
          if (__DEV__) console.error(error);

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
