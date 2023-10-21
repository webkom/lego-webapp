import { Button } from '@webkom/lego-bricks';
import { spySubmittable } from 'app/utils/formSpyUtils';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const SubmitButton = ({ children }: Props) =>
  spySubmittable((submittable) => (
    <Button submit disabled={!submittable}>
      {children}
    </Button>
  ));
