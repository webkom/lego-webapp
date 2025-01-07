import { Button } from '@webkom/lego-bricks';
import { FormSpy } from 'react-final-form';
import { spySubmittable } from 'app/utils/formSpyUtils';
import type { PressEvent } from '@webkom/lego-bricks';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onPress?: (e: PressEvent) => void;
  className?: string;
  allowPristine?: boolean;
  danger?: boolean;
  disabled?: boolean;
  dark?: boolean;
};

export const SubmitButton = ({
  children,
  onPress,
  className,
  allowPristine,
  danger = false,
  disabled = false,
  dark = false,
}: Props) =>
  spySubmittable(
    (submittable) => (
      <>
        <FormSpy
          subscription={{
            pristine: true,
            submitting: true,
          }}
        >
          {({ pristine, submitting }) => (
            <div>
              <p>Disabled: {disabled ? 'true' : 'false'}</p>
              <p>Received submittable: {submittable ? 'true' : 'false'}</p>
              <p>Pristine: {pristine ? 'true' : 'false'}</p>
              <p>Submitting: {submitting ? 'true' : 'false'}</p>
              <p>Allow pristine: {allowPristine ? 'true' : 'false'}</p>
              <p>
                Calculated submittable:{' '}
                {(!pristine || allowPristine) && !submitting ? 'true' : 'false'}
              </p>
              <p>
                Subcalculation: {!pristine || allowPristine ? 'true' : 'false'}
              </p>
            </div>
          )}
        </FormSpy>
        <Button
          submit
          disabled={!submittable || disabled}
          onPress={onPress}
          className={className}
          danger={danger}
          dark={dark}
        >
          {children}
        </Button>
      </>
    ),
    { allowPristine },
  );

export default SubmitButton;
