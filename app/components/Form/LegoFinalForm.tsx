import type { FormProps } from "react-final-form";
import type { FormApi } from "final-form";
import { Form } from "react-final-form";
import createFocusOnErrorDecorator from "final-form-focus";
import * as Sentry from "@sentry/browser";
import { handleSubmissionErrorFinalForm } from "app/components/Form/utils";
import { isEqual } from "lodash";
const focusOnError = createFocusOnErrorDecorator();
type LegoFormProps = {
  onSubmit: (values: Record<string, any>, form: FormApi<Record<string, any>>) => Promise<Record<string, any> | null | undefined>;

  /*
   * Automatic submission error handling
   * This will add a "generic" error message to the form's FORM_ERROR value if
   * the submission fails.
   */
  enableSubmissionError?: boolean;

  /* Move the screen to the first error in the list on SubmissionError */
  enableFocusOnError?: boolean;
};
type Props = LegoFormProps & FormProps<Record<string, any>>;

const LegoFinalForm = ({
  children,
  onSubmit,
  enableSubmissionError = true,
  enableFocusOnError = true,
  decorators = [],
  ...rest
}: Props) => {
  if (enableFocusOnError) {
    decorators = [focusOnError, ...decorators];
  }

  return <Form {...rest} initialValuesEqual={isEqual} decorators={decorators} onSubmit={(values, form) => onSubmit(values, form).catch(error => {
    Sentry.captureException(error);
    if (__DEV__) console.error(error);

    if (!enableSubmissionError) {
      throw error;
    }

    return handleSubmissionErrorFinalForm(error);
  })}>
      {children}
    </Form>;
};

export default LegoFinalForm;