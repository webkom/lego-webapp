import { BaseCard, CardFooter, Flex, Tooltip } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import Collapsible from '~/components/Collapsible/Collapsible';
import { TitleWithRarity } from '~/pages/achievements/+Page';
import { getAchievementInfo } from '~/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from '~/redux/models/User';

export const Achievements = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const sortedAchievements = useMemo(() => {
    return achievements
      .filter((achievement) => getAchievementInfo(achievement))
      .sort((a, b) => {
        const aInfo = getAchievementInfo(a);
        const bInfo = getAchievementInfo(b);
        if (!aInfo || !bInfo) {
          return 0;
        }

        if (bInfo.rarity === aInfo.rarity) {
          // Keep the rank trophy ahead when rarities match.
          if (b.identifier === 'event_rank') {
            return 1;
          }

          if (a.identifier === 'event_rank') {
            return -1;
          }

          return 0;
        }

        return bInfo.rarity - aInfo.rarity;
      });
  }, [achievements]);

  return (
    <div className={styles.achievements}>
      <h3>Trofeer</h3>
      <Collapsible className={styles.trophyContainer} collapsedHeight={230}>
        {sortedAchievements.map((e) => {
          const achievementInfo = getAchievementInfo(e);
          if (!achievementInfo) {
            return null;
          }

          return (
            <Tooltip
              key={achievementInfo.name}
              className={styles.trophy}
              content={
                <div className={styles.trophyDetailTooltip}>
                  <p>
                    <i>
                      {achievementInfo.hidden
                        ? '???????'
                        : achievementInfo.description}
                    </i>
                  </p>
                  <p>Oppnådd {moment(e.updatedAt).format('D. MMMM YYYY')}</p>
                  <p>{e.percentage.toFixed(1)}% har denne!</p>
                  <TitleWithRarity rarity={achievementInfo.rarity} />
                </div>
              }
              positions="bottom"
            >
              <BaseCard className={styles.trophyCard}>
                <Flex
                  justifyContent="center"
                  className={styles.trophyCardImage}
                >
                  <img
                    src={achievementInfo.image ?? ''}
                    alt="Trofe"
                    height="7vh"
                    className={styles.trophyImage}
                  />
                </Flex>
                <CardFooter justifyContent="center" alignItems="center">
                  {achievementInfo.name}
                </CardFooter>
              </BaseCard>
            </Tooltip>
          );
        })}
      </Collapsible>
    </div>
  );
};
