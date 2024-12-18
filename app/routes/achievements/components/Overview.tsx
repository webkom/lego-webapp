import { FilterSection, filterSidebar, Flex, Page } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import { RadioButton } from 'app/components/Form';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import useQuery from 'app/utils/useQuery';
import styles from './Overview.module.css';
import { AchievementTabs } from './utils';

const Overview = () => {
  const { query, setQueryValue, setQuery } = useQuery({
    min_rarity: 'any',
    max_rarity: 'any',
    sort: 'none',
    sort_order: 'asc',
  });

  const allTrophies = Object.entries(AchievementsInfo).flatMap(
    ([key, achievements]) =>
      achievements.map((achievement, index) => ({
        ...achievement,
        identifier: key,
        level: index,
      })),
  );

  const filteredTrophies = allTrophies.filter((trophy) => {
    const rarity = trophy.rarity;
    const minRarity =
      query.min_rarity !== 'any' ? parseInt(query.min_rarity, 10) : 0;
    const maxRarity =
      query.max_rarity !== 'any' ? parseInt(query.max_rarity, 10) : Infinity;
    return rarity >= minRarity && rarity <= maxRarity;
  });

  const sortedTrophies = [...filteredTrophies].sort((a, b) => {
    let comparison = 0;
    if (query.sort === 'rarity') comparison = a.rarity - b.rarity;
    if (query.sort === 'alphabetical')
      comparison = a.name.localeCompare(b.name);
    if (query.sort === 'hidden')
      comparison = a.hidden === b.hidden ? 0 : a.hidden ? -1 : 1;

    return query.sort_order === 'desc' ? -comparison : comparison;
  });

  return (
    <Page
      back={{ href: '/users/me' }}
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Oversikt
        </Flex>
      }
      sidebar={filterSidebar({
        children: (
          <>
            <FilterSection title="Sjeldenhet">
              <RadioButton
                name="filter"
                id="all"
                label="Alle"
                onChange={() =>
                  setQuery({ ...query, min_rarity: 'any', max_rarity: 'any' })
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
                checked={query.min_rarity === '0' && query.max_rarity === '3'}
              />
              <RadioButton
                name="filter"
                id="4_6"
                label="4-6"
                onChange={() =>
                  setQuery({ ...query, min_rarity: '4', max_rarity: '6' })
                }
                checked={query.min_rarity === '4' && query.max_rarity === '6'}
              />
              <RadioButton
                name="filter"
                id="7_plus"
                label="7+"
                onChange={() =>
                  setQuery({ ...query, min_rarity: '7', max_rarity: 'any' })
                }
                checked={query.min_rarity === '7' && query.max_rarity === 'any'}
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
      })}
    >
      <Flex className={styles.listWrapper}>
        {sortedTrophies.map((e) => (
          <Flex className={styles.listItem} key={e.name + e.rarity}>
            <Trophy
              size={40}
              color={
                rarityToColorMap[
                  AchievementsInfo[e.identifier][e.level].rarity
                ] ?? 'Gold'
              }
              style={
                AchievementsInfo[e.identifier][e.level].rarity >= 4
                  ? {
                      filter: `drop-shadow(0px 0px ${
                        AchievementsInfo[e.identifier][e.level].rarity - 1
                      }px ${
                        rarityToColorMap[
                          AchievementsInfo[e.identifier][e.level].rarity
                        ]
                      })`,
                    }
                  : {}
              }
            />
            <Flex column gap="var(--spacing-sm)" className="secondaryFontColor">
              <h2 className={styles.listItemName}>{e.name}</h2>
              <span>{e.hidden ? '?????????' : e.description}</span>
              <span>Sjeldenhet: {e.rarity + 1}</span>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Page>
  );
};

export default Overview;
