import Flex from '../Flex';
import type Page from './Page';
import type { ComponentProps, ReactNode } from 'react';

type Args = {
  title?: string;
  side?: 'right' | 'left';
  icon?: string;
  children: ReactNode;
};
export const filterSidebar = ({
  title = 'Filter',
  side = 'right',
  icon = 'filter',
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
    <h4>{title}</h4>
    <Flex column gap="var(--spacing-sm)">
      {children}
    </Flex>
  </Flex>
);
