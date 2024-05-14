import { Flex } from '../Layout';
import type { ReactNode } from 'react';

type Props = {
  vertical?: boolean;
  centered?: boolean;
  className?: string;
  children: ReactNode;
};

export const ButtonGroup = ({
  vertical = false,
  centered = false,
  className,
  children,
}: Props) => (
  <Flex
    wrap
    alignItems={centered ? 'center' : 'flex-start'}
    style={{
      columnGap: 'var(--spacing-md)',
      rowGap: 'var(--spacing-sm)',
    }}
    column={vertical}
    className={className}
  >
    {children}
  </Flex>
);
