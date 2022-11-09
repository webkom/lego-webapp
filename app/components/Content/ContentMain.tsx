import { Flex } from 'app/components/Layout';
import type { Node } from 'react';

type Props = {
  className?: string;
  children: Node;
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
