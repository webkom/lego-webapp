import { Button } from '@webkom/lego-bricks';
import { spySubmittable } from 'app/utils/formSpyUtils';
import type { MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const SubmitButton = ({ children, onClick }: Props) =>
  spySubmittable((submittable) => (
    <Button submit disabled={!submittable} onClick={onClick}>
      {children}
    </Button>
  ));
