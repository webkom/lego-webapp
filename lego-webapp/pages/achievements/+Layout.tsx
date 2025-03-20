import { FilterSection, filterSidebar, Flex, Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { RadioButton, TextInput } from '~/components/Form';
import { filterableGroups } from '~/components/UserAttendance/GroupFilter';
import useQuery from '~/utils/useQuery';
import {
  overviewDefaultSearch,
  AchievementTabs,
  leaderboardDefaultSearch,
} from './utils';

const AchievementsPageWrapper = ({ children }: PropsWithChildren) => {
  const pageContext = usePageContext();

  const isLeaderboardPage = pageContext.urlPathname.startsWith(
    '/achievements/leaderboard',
  );
  const isOverviewPage = !isLeaderboardPage;

  const { query, setQueryValue } = useQuery({
    ...leaderboardDefaultSearch,
    ...overviewDefaultSearch,
  });

  const sidebarContent = isOverviewPage
    ? filterSidebar({
        children: (
          <>
            <FilterSection title="Fremdrift">
              <RadioButton
                name="filter"
                id="all"
                label="Alle"
                onChange={() => setQueryValue('completed')('all')}
                checked={query.completed === 'all'}
              />
              <RadioButton
                name="filter"
                id="completed"
                label="Oppnådde"
                onChange={() => setQueryValue('completed')('true')}
                checked={query.completed === 'true'}
              />
              <RadioButton
                name="filter"
                id="not_completed"
                label="Uoppnådde"
                onChange={() => setQueryValue('completed')('false')}
                checked={query.completed === 'false'}
              />
            </FilterSection>

            <FilterSection title="Sortering">
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
                id="order_desc"
                label="Synkende"
                onChange={() => setQueryValue('sort_order')('desc')}
                checked={query.sort_order === 'desc'}
              />
              <RadioButton
                name="sort_order"
                id="order_asc"
                label="Stigende"
                onChange={() => setQueryValue('sort_order')('asc')}
                checked={query.sort_order === 'asc'}
              />
            </FilterSection>
          </>
        ),
      })
    : isLeaderboardPage
      ? filterSidebar({
          children: (
            <FilterSection title="Toppliste-filter">
              <TextInput
                name="usernameFilter"
                prefix="search"
                placeholder="Søk etter navn"
                value={query.userFullName}
                onChange={(e) => setQueryValue('userFullName')(e.target.value)}
              />
              <FilterSection title="Klasse">
                {filterableGroups.map((group) => {
                  const groupValue = group.ids.join(',');
                  return (
                    <RadioButton
                      key={groupValue}
                      name="gradeLevel"
                      id={groupValue}
                      label={group.name}
                      onChange={() =>
                        setQueryValue('abakusGroupIds')(groupValue)
                      }
                      checked={query.abakusGroupIds === groupValue}
                    />
                  );
                })}
              </FilterSection>
            </FilterSection>
          ),
        })
      : undefined;

  return (
    <Page
      back={{ href: '/users/me' }}
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Trofeer
        </Flex>
      }
      sidebar={sidebarContent}
    >
      {children}
    </Page>
  );
};

export default AchievementsPageWrapper;
