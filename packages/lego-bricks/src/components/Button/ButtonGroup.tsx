import { Flex } from '../Layout';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  vertical?: boolean;
  centered?: boolean;
  justifyContent?: ComponentProps<typeof Flex>['justifyContent'];
  className?: string;
  children: ReactNode;
};

export const ButtonGroup = ({
  vertical = false,
  centered = false,
  justifyContent,
  className,
  children,
}: Props) => (
  <Flex
    wrap
    alignItems={centered ? 'center' : 'flex-start'}
    justifyContent={justifyContent}
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
