import React, { ReactNode } from 'react';
import { Flex } from 'app/components/Layout';

interface Props {
  className?: string;
  children: Node;
}

function ContentSection({ children, className }: Props) {
  return (
    <Flex wrap className={className}>
      {children}
    </Flex>
  );
}

export default ContentSection;
