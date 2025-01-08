import { Flex } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import useQuery from 'app/utils/useQuery';
import styles from './Overview.module.css';
import { ContentMain } from 'app/components/Content';

const Overview = () => {
  const { query } = useQuery({
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
    <ContentMain>
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
    </ContentMain>
  );
};

export default Overview;
