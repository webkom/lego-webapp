import { FilterSection, filterSidebar, Flex, Page } from '@webkom/lego-bricks';
import { Outlet } from 'react-router-dom';
import { RadioButton } from 'app/components/Form';
import useQuery from 'app/utils/useQuery';
import { AchievementTabs } from './utils';

const showFilters = location.pathname === '/achievements/overview';

const AchievementsPageWrapper = () => {
  const { query, setQueryValue, setQuery } = useQuery({
    min_rarity: 'any',
    max_rarity: 'any',
    sort: 'none',
    sort_order: 'asc',
  });

  return (
    <Page
      back={{ href: '/users/me' }}
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Trofeer
        </Flex>
      }
      sidebar={
        showFilters
          ? filterSidebar({
              children: (
                <>
                  {' '}
                  <FilterSection title="Sjeldenhet">
                    <RadioButton
                      name="filter"
                      id="all"
                      label="Alle"
                      onChange={() =>
                        setQuery({
                          ...query,
                          min_rarity: 'any',
                          max_rarity: 'any',
                        })
                      }
                      checked={
                        query.min_rarity === 'any' && query.max_rarity === 'any'
                      }
                    />
                    <RadioButton
                      name="filter"
                      id="0_3"
                      label="0-3"
                      onChange={() =>
                        setQuery({ ...query, min_rarity: '0', max_rarity: '3' })
                      }
                      checked={
                        query.min_rarity === '0' && query.max_rarity === '3'
                      }
                    />
                    <RadioButton
                      name="filter"
                      id="4_6"
                      label="4-6"
                      onChange={() =>
                        setQuery({ ...query, min_rarity: '4', max_rarity: '6' })
                      }
                      checked={
                        query.min_rarity === '4' && query.max_rarity === '6'
                      }
                    />
                    <RadioButton
                      name="filter"
                      id="7_plus"
                      label="7+"
                      onChange={() =>
                        setQuery({
                          ...query,
                          min_rarity: '7',
                          max_rarity: 'any',
                        })
                      }
                      checked={
                        query.min_rarity === '7' && query.max_rarity === 'any'
                      }
                    />
                  </FilterSection>
                  <FilterSection title="Sortering">
                    <RadioButton
                      name="sort"
                      id="sort_none"
                      label="Ingen"
                      onChange={() => setQueryValue('sort')('none')}
                      checked={query.sort === 'none'}
                    />
                    <RadioButton
                      name="sort"
                      id="sort_rarity"
                      label="Sjeldenhet"
                      onChange={() => setQueryValue('sort')('rarity')}
                      checked={query.sort === 'rarity'}
                    />
                    <RadioButton
                      name="sort"
                      id="sort_alphabetical"
                      label="Alfabetisk"
                      onChange={() => setQueryValue('sort')('alphabetical')}
                      checked={query.sort === 'alphabetical'}
                    />
                    <RadioButton
                      name="sort"
                      id="sort_hidden"
                      label="Hemmelig"
                      onChange={() => setQueryValue('sort')('hidden')}
                      checked={query.sort === 'hidden'}
                    />
                  </FilterSection>
                  <FilterSection title="Sorteringsrekkefølge">
                    <RadioButton
                      name="sort_order"
                      id="order_asc"
                      label="Stigende"
                      onChange={() => setQueryValue('sort_order')('asc')}
                      checked={query.sort_order === 'asc'}
                    />
                    <RadioButton
                      name="sort_order"
                      id="order_desc"
                      label="Synkende"
                      onChange={() => setQueryValue('sort_order')('desc')}
                      checked={query.sort_order === 'desc'}
                    />
                  </FilterSection>
                </>
              ),
            })
          : undefined
      }
    >
      <Outlet
        context={{
          query,
        }}
      />
    </Page>
  );
};

export default AchievementsPageWrapper;
