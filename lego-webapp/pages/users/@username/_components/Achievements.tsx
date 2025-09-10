import {
  BaseCard,
  Button,
  CardFooter,
  Flex,
  LinkButton,
  Tooltip,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState, useMemo } from 'react';
import { TitleWithRarity } from '~/pages/achievements/+Page';
import AchievementsInfo from '~/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from '~/redux/models/User';

const MAX_ACHIEVEMENTS = 4;

export const Achievements = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const [showAll, setShowAll] = useState(false);

  const sortedAchievements = useMemo(() => {
    return [...achievements].sort((a, b) => {
      if (
        AchievementsInfo[b.identifier][b.level].rarity ===
        AchievementsInfo[a.identifier][a.level].rarity
      ) {
        return b.identifier === 'event_rank' ? 1 : 0;
      }

      return (
        AchievementsInfo[b.identifier][b.level].rarity -
        AchievementsInfo[a.identifier][a.level].rarity
      );
    });
  }, [achievements]);

  const topAchievements = showAll
    ? sortedAchievements
    : sortedAchievements.slice(0, MAX_ACHIEVEMENTS);

  return (
    <div className={styles.achievements}>
      <h3>Trofeer</h3>
      <div className={styles.trophyContainer}>
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
            <BaseCard className={styles.trophyCard}>
              <Flex justifyContent="center" className={styles.trophyCardImage}>
                <img
                  src={AchievementsInfo[e.identifier][e.level].image ?? ''}
                  alt="Trofe"
                  height="7vh"
                  className={styles.trophyImage}
                />
              </Flex>
              <CardFooter justifyContent="center" alignItems="center">
                {AchievementsInfo[e.identifier][e.level].name}
              </CardFooter>
            </BaseCard>
          </Tooltip>
        ))}
      </div>
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
