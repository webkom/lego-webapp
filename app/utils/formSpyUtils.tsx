import { FormSpy } from 'react-final-form';
import type { ReactNode } from 'react';
import type { FormSpyRenderProps } from 'react-final-form';

export const spyValues = <FormValues,>(
  render: (values: FormValues) => ReactNode
) => (
  <FormSpy
    subscription={{
      values: true,
    }}
  >
    {({ values }: FormSpyRenderProps<FormValues>) => render(values)}
  </FormSpy>
);

export const spyFormError = (render: (error: any) => ReactNode) => (
  <FormSpy
    subscription={{
      error: true,
      submitError: true,
    }}
  >
    {({ error, submitError }) => render(error || submitError)}
  </FormSpy>
);

export const spySubmittable = (render: (submittable: boolean) => ReactNode) => (
  <FormSpy
    subscription={{
      pristine: true,
      submitting: true,
    }}
  >
    {({ pristine, submitting }) => render(!pristine && !submitting)}
  </FormSpy>
);
