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
  dark?: boolean;
};

const SubmitButton = ({
  children,
  onClick,
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
        onClick={onClick}
        className={className}
        danger={danger}
        dark={dark}
      >
        {children}
      </Button>
    ),
    { allowPristine }
  );

export default SubmitButton;
