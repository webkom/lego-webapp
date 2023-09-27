import { Button } from '@webkom/lego-bricks';
import { spySubmittable } from 'app/utils/formSpyUtils';
import type { MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  allowPristine?: boolean;
};

export const SubmitButton = ({
  children,
  onClick,
  className,
  allowPristine,
}: Props) =>
  spySubmittable(
    (submittable) => (
      <Button
        submit
        disabled={!submittable}
        onClick={onClick}
        className={className}
      >
        {children}
      </Button>
    ),
    { allowPristine }
  );
