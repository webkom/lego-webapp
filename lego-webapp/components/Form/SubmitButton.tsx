import { Button } from '@webkom/lego-bricks';
import { spySubmittable } from '~/utils/formSpyUtils';
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
    ),
    { allowPristine },
  );

export default SubmitButton;
