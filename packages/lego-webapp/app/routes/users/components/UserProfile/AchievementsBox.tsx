import { Button, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Trophy } from 'lucide-react';
import moment from 'moment-timezone';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from '~/redux/models/User';

export const AchievementsBox = ({
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
    : sortedAchievements.slice(0, 5);

  const navigate = useNavigate();

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
          {topAchievements.map((e) => (
            <Flex
              column
              key={AchievementsInfo[e.identifier][e.level].name}
              alignItems="center"
              className={styles.trophyElementBox}
            >
              <Tooltip
                content={
                  <div className={styles.trophyDetailTooltip}>
                    <p>
                      <i>
                        {AchievementsInfo[e.identifier][e.level].hidden
                          ? '?????????'
                          : AchievementsInfo[e.identifier][e.level].description}
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

                <p style={{ textShadow: '#FC0 1px 0 10px;' }}>
                  {AchievementsInfo[e.identifier][e.level].name}
                </p>
              </Tooltip>
            </Flex>
          ))}
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
