import { Button, Flex, LinkButton } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState, useMemo } from 'react';
import Tooltip from '~/components/Tooltip';
import { TitleWithRarity } from '~/pages/achievements/+Page';
import AchievementsInfo from '~/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from '~/redux/models/User';

const MAX_ACHIEVEMENTS = 5;

export const Achievements = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const [showAll, setShowAll] = useState(false);

  const sortedAchievements = useMemo(() => {
    return [...achievements].sort(
      (a, b) =>
        AchievementsInfo[b.identifier][b.level].rarity -
        AchievementsInfo[a.identifier][a.level].rarity,
    );
  }, [achievements]);

  const topAchievements = showAll
    ? sortedAchievements
    : sortedAchievements.slice(0, MAX_ACHIEVEMENTS);

  return (
    <div className={styles.achievements}>
      <h3>Trofeer</h3>
      <Flex wrap gap="var(--spacing-sm) var(--spacing-md)">
        {topAchievements.map((e) => (
          <Tooltip
            key={AchievementsInfo[e.identifier][e.level].name}
            className={styles.trophy}
            content={
              <div className={styles.trophyDetailTooltip}>
                <p>
                  <i>
                    {AchievementsInfo[e.identifier][e.level].hidden
                      ? '???????'
                      : AchievementsInfo[e.identifier][e.level].description}
                  </i>
                </p>
                <p>Oppnådd {moment(e.updatedAt).format('D. MMMM YYYY')}</p>
                <p>{e.percentage.toFixed(1)}% har denne!</p>
                <TitleWithRarity
                  rarity={AchievementsInfo[e.identifier][e.level].rarity}
                />
              </div>
            }
            positions="bottom"
          >
            <Flex column alignItems="center" gap="var(--spacing-xs)">
              <img
                src={AchievementsInfo[e.identifier][e.level].image ?? ''}
                alt="Trofe"
                height="7vh"
                className={styles.trophyImage}
              />
              <span>{AchievementsInfo[e.identifier][e.level].name}</span>
            </Flex>
          </Tooltip>
        ))}
      </Flex>
      <Flex gap="var(--spacing-md)" className={styles.trophyLinks}>
        {achievements.length > MAX_ACHIEVEMENTS && (
          <Button
            onPress={() => {
              setShowAll((prev) => !prev);
            }}
          >
            {showAll ? 'Vis færre' : 'Vis alle'}
          </Button>
        )}
        <LinkButton href="/achievements/leaderboard">Topplister</LinkButton>
      </Flex>
    </div>
  );
};
