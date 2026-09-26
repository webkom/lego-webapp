import { Filter } from 'lucide-react';
import Flex from '../Flex';
import type Page from './Page';
import type { ComponentProps, ReactNode } from 'react';

type Args = {
  title?: string;
  side?: 'right' | 'left';
  icon?: ReactNode;
  children: ReactNode;
};
export const filterSidebar = ({
  title = 'Filter',
  side = 'right',
  icon = <Filter />,
  children,
}: Args): ComponentProps<typeof Page>['sidebar'] => {
  return {
    title,
    side,
    icon,
    content: (
      <Flex column gap="var(--spacing-lg)">
        {children}
      </Flex>
    ),
  };
};

type SectionProps = {
  title: string;
  children: ReactNode;
};
export const FilterSection = ({ title, children }: SectionProps) => (
  <Flex column gap="var(--spacing-sm)">
    {title && <h4>{title}</h4>}
    <Flex column gap="var(--spacing-sm)">
      {children}
    </Flex>
  </Flex>
);
