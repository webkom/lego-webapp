import { Filter, FilterX } from 'lucide-react';
import { useClearSearchParams, useLocation } from '../../../RouterContext';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
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
  title = 'Filtrering',
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
        <ClearFiltersButton />
      </Flex>
    ),
  };
};

const ClearFiltersButton = () => {
  const { search } = useLocation();
  const clearSearchParams = useClearSearchParams();

  return (
    <Button onPress={clearSearchParams} disabled={!search}>
      <Icon iconNode={<FilterX />} size={19} />
      Fjern filtrering
    </Button>
  );
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
