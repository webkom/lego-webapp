import { Flex } from '@webkom/lego-bricks';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Used next to ContentSidebar, usually nested below a ContentMain.
 * See Content for an example.
 */
function ContentMain({ children, className }: Props) {
  return (
    <Flex
      column
      style={{
        flex: 2,
      }}
      className={className}
    >
      {children}
    </Flex>
  );
}

export default ContentMain;
