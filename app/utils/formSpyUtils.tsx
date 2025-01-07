import { FormSpy } from 'react-final-form';
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
    {({ pristine, submitting }) => (
      <>
        <div>
          <p>Real pristine: {pristine ? 'true' : 'false'}</p>
          <p>Real submitting: {submitting ? 'true' : 'false'}</p>
          <p>Real allowPristine: {allowPristine ? 'true' : 'false'}</p>
          <p>
            Real submittable:{' '}
            {(!pristine || allowPristine) && !submitting ? 'true' : 'false'}
          </p>
        </div>
        {render((!pristine || allowPristine) && !submitting)}
      </>
    )}
  </FormSpy>
);
