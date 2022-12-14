import { Flex } from 'app/components/Layout';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

function ContentSection({ children, className }: Props) {
  return (
    <Flex wrap className={className}>
      {children}
    </Flex>
  );
}

export default ContentSection;
