import { Flex } from 'app/components/Layout';
import type { Node } from 'react';

type Props = {
  className?: string;
  children: Node;
};

function ContentSection({ children, className }: Props) {
  return (
    <Flex wrap className={className}>
      {children}
    </Flex>
  );
}

export default ContentSection;
