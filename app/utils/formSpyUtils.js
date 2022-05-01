// @flow

import { FormSpy } from 'react-final-form';

export const spyValues = (render: (values: Object) => React$Node) => (
  <FormSpy subscription={{ values: true }}>
    {({ values }) => render(values)}
  </FormSpy>
);

export const spyFormError = (render: (error: any) => React$Node) => (
  <FormSpy subscription={{ error: true, submitError: true }}>
    {({ error, submitError }) => render(error || submitError)}
  </FormSpy>
);

export const spySubmittable = (
  render: (submittable: boolean) => React$Node
) => (
  <FormSpy subscription={{ pristine: true, submitting: true }}>
    {({ pristine, submitting }) => render(!pristine && !submitting)}
  </FormSpy>
);
