import { FormSpy } from 'react-final-form';
import type { FormApi } from 'final-form';
import type { ReactNode } from 'react';
import type { FormSpyRenderProps } from 'react-final-form';

export const spyValues = <FormValues,>(
  render: (values: FormValues) => ReactNode,
) => (
  <FormSpy
    subscription={{
      values: true,
    }}
  >
    {({ values }: FormSpyRenderProps<FormValues>) => render(values)}
  </FormSpy>
);

export const spyForm = <FormValues,>(
  render: (form: FormApi<FormValues>) => ReactNode,
) => (
  <FormSpy>
    {({ form }: FormSpyRenderProps<FormValues>) => render(form)}
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

type SpySubmittableOptions = {
  allowPristine?: boolean;
};
export const spySubmittable = (
  render: (submittable: boolean) => ReactNode,
  { allowPristine = false }: SpySubmittableOptions = {},
) => (
  <FormSpy
    subscription={{
      pristine: true,
      submitting: true,
    }}
  >
    {({ pristine, submitting }) =>
      render((!pristine || allowPristine) && !submitting)
    }
  </FormSpy>
);
