import { Button } from '@webkom/lego-bricks';
import { spySubmittable } from 'app/utils/formSpyUtils';
import type { MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  allowPristine?: boolean;
  danger?: boolean;
  disabled?: boolean;
};

export const SubmitButton = ({
  children,
  onClick,
  className,
  allowPristine,
  danger = false,
  disabled = false,
}: Props) =>
  spySubmittable(
    (submittable) => (
      <Button
        submit
        disabled={!submittable || disabled}
        onClick={onClick}
        className={className}
        danger={danger}
      >
        {children}
      </Button>
    ),
    { allowPristine }
  );
