import * as Sentry from '@sentry/browser';
import { pick } from 'lodash';
import { reduxForm, SubmissionError } from 'redux-form';
import { handleSubmissionError } from './utils';

type Props = any & {
  onSubmitFail: (arg0: any) => any;
  onSubmit: (arg0: any) => Promise<any>;

  /* Enable auto submissionError
   * This only works if 'onSubmit' is passed into legoForm,
   * and not if it is passed into 'handleSubmit()
   *
   * This will add a "generic" error message to the "_error" value that can
   * be ectracted from the form props as "props.error"
   */
  enableSubmissionError?: boolean;

  /* Move the screen to the first error in the list on SubmissionError */
  enableFocusOnError?: boolean;

  /* This will pick the values assosiated with only the visible
   * fields at the time of submitting. This makes it possible to add
   * default values to the `initialValues` to redux form, and only send
   * them if a field is registered/visible. It therefore also allows you to
   * do object spreading into initialValues, without sending all the values
   * into the onSubmit action.
   *
   * about picking: https://lodash.com/docs/4.17.4#pick
   */
  enableValuePicking?: boolean;

  /* Also pick these values based on the keys given on the array
   * Should be used when there isn't a visible field for the value,
   * at the time of submitting
   *
   * The id is always picked, together with all registered fields
   */
  pickAdditionalValues?: Array<string>;
};

const legoForm = ({
  onSubmitFail = () => {},
  onSubmit = () => {},
  enableSubmissionError = true,
  enableFocusOnError = true,
  enableValuePicking = false,
  pickAdditionalValues = [],
  ...rest
}: Props) =>
  reduxForm({
    ...rest,
    onSubmitFail: (errors) => {
      if (!enableFocusOnError) {
        return onSubmitFail(errors);
      }

      try {
        // We should instead check if error is SubmissionError. Does not work now
        let [firstErrorField] = Object.keys(errors);

        if (firstErrorField === '_error') {
          // This is because of the stange usage of SubmissionError in
          // app/routes/surveys/components/SubmissionEditor/SubmissionEditor.js
          // That code should instead use redux-form FieldArray :smile:
          [firstErrorField] = Object.keys(errors._error.questions);
          firstErrorField = `question[${firstErrorField}]`;
        }

        const field = document.querySelector(`[name="${firstErrorField}"]`);

        if (field && field.scrollIntoView) {
          field.scrollIntoView();
        }

        if (field && field.focus) {
          field.focus();
        }
      } catch (e) {
        //
      }

      return onSubmitFail(errors);
    },
    onSubmit: (values, dispatch, props) => {
      const pickedValues = enableValuePicking
        ? pick(
            values,
            Object.keys(props.registeredFields)
              .concat('id')
              .concat(pickAdditionalValues),
          )
        : values;
      return onSubmit(pickedValues, dispatch, props).catch((error) => {
        Sentry.captureException(error);

        /* eslint no-console: 0 */
        if (__DEV__) console.error(error);

        if (error instanceof SubmissionError || !enableSubmissionError) {
          throw error;
        }

        return handleSubmissionError(error);
      });
    },
  });

export default legoForm;
