import { Flex, Page } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import styles from './Overview.module.css';
import { AchievementTabs } from './utils';

const Overview = () => {
  const allTrophies = Object.entries(AchievementsInfo).flatMap(
    ([key, achievements]) =>
      achievements.map((achievement, index) => ({
        ...achievement,
        identifier: key,
        level: index,
      })),
  );
  return (
    <Page
      tabs={<AchievementTabs />}
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          Oversikt
        </Flex>
      }
    >
      <Flex className={styles.listWrapper}>
        {allTrophies.map((e) => (
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
