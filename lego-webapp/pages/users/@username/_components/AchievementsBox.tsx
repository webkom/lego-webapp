import { Button, Flex, Tooltip } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Trophy } from 'lucide-react';
import moment from 'moment-timezone';
import { useState, useMemo } from 'react';
import { navigate } from 'vike/client/router';
import { getAchievementInfo, rarityMap } from '~/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from '~/redux/models/User';

export const AchievementsBox = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const [showAll, setShowAll] = useState(false);

  const sortedAchievements = useMemo(() => {
    return achievements
      .filter((achievement) => getAchievementInfo(achievement))
      .sort((a, b) => {
        const aInfo = getAchievementInfo(a);
        const bInfo = getAchievementInfo(b);
        if (!aInfo || !bInfo) {
          return 0;
        }

        return bInfo.rarity - aInfo.rarity;
      });
  }, [achievements]);

  const topAchievements = showAll
    ? sortedAchievements
    : sortedAchievements.slice(0, 5);

  return (
    <Flex
      column
      alignItems="flex-start"
      justifyContent="space-between"
      className={cx(styles.trophyCaseWrapper, styles.contentRight)}
    >
      <h2>Trofeer</h2>
      <Button
        onPress={() => {
          navigate('/achievements/leaderboard');
        }}
      >
        Mer info
      </Button>
      <Flex
        column
        alignItems="center"
        justifyContent="space-between"
        className={styles.trophyCaseWrapper}
      >
        <div className={styles.trophyCaseBox}>
          {topAchievements.map((e) => {
            const achievementInfo = getAchievementInfo(e);
            if (!achievementInfo) {
              return null;
            }

            return (
              <Flex
                column
                key={achievementInfo.name}
                alignItems="center"
                className={styles.trophyElementBox}
              >
                <Tooltip
                  content={
                    <div className={styles.trophyDetailTooltip}>
                      <p>
                        <i>
                          {achievementInfo.hidden
                            ? '?????????'
                            : achievementInfo.description}
                        </i>
                      </p>
                      <p>
                        Opnådd den {moment(e.updatedAt).format('D. MMMM YYYY')}
                      </p>
                      <p>{e.percentage.toFixed(1)}% har denne!</p>
                    </div>
                  }
                  positions="bottom"
                >
                  <Trophy
                    size={40}
                    color={rarityMap[achievementInfo.rarity].color ?? 'Gold'}
                    style={
                      achievementInfo.rarity >= 4
                        ? {
                            filter: `drop-shadow(0px 0px ${
                              achievementInfo.rarity - 1
                            }px ${rarityMap[achievementInfo.rarity].color})`,
                          }
                        : {}
                    }
                  />

                  <p style={{ textShadow: '#FC0 1px 0 10px;' }}>
                    {achievementInfo.name}
                  </p>
                </Tooltip>
              </Flex>
            );
          })}
        </div>
        {achievements.length > 5 && (
          <Button
            onPress={() => {
              setShowAll(!showAll);
            }}
            className={styles.showAllButton}
          >
            {showAll ? 'Vis færre' : 'Vis alle'}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
