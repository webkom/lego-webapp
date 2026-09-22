import { FilterSection, filterSidebar, Flex, Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { RadioButton, TextInput } from '~/components/Form';
import {
  filterableGroups,
  programFilterGroups,
} from '~/components/UserAttendance/GroupFilter';
import useQuery from '~/utils/useQuery';
import {
  overviewDefaultSearch,
  AchievementTabs,
  leaderboardDefaultSearch,
} from './utils';

const GroupRadioSection = ({
  title,
  groups,
  radioName,
  value,
  onSelect,
}: {
  title: string;
  groups: { name: string; ids: number[] }[];
  radioName: string;
  value: string;
  onSelect: (groupValue: string) => void;
}) => (
  <FilterSection title={title}>
    {groups.map((group) => {
      const groupValue = group.ids.join(',');
      return (
        <RadioButton
          key={groupValue}
          name={radioName}
          id={groupValue}
          label={group.name}
          onChange={() => onSelect(groupValue)}
          checked={value === groupValue}
        />
      );
    })}
  </FilterSection>
);

const AchievementsPageWrapper = ({ children }: PropsWithChildren) => {
  const pageContext = usePageContext();

  const isLeaderboardPage = pageContext.urlPathname.startsWith(
    '/achievements/leaderboard',
  );
  const isStatisticsPage = pageContext.urlPathname.startsWith(
    '/achievements/statistics',
  );
  const isOverviewPage = !isLeaderboardPage && !isStatisticsPage;

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
              <GroupRadioSection
                title="Klasse"
                groups={filterableGroups}
                radioName="gradeLevel"
                value={query.abakusGroupIds}
                onSelect={setQueryValue('abakusGroupIds')}
              />

              <GroupRadioSection
                title="Linje"
                groups={programFilterGroups}
                radioName="program"
                value={query.programGroupIds}
                onSelect={setQueryValue('programGroupIds')}
              />
            </FilterSection>
          ),
        })
      : undefined;

  return (
    <Page
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
