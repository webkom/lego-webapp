import { Flex } from '@webkom/lego-bricks';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A basic tag component for displaying tags
 */
const Tags = ({ children, className }: Props) => {
  return (
    <Flex wrap gap="var(--spacing-sm)" className={className}>
      {children}
    </Flex>
  );
};

export default Tags;
export { default as Tag } from './Tag';
