import { Flex } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import moment from 'moment-timezone';
import Tooltip from 'app/components/Tooltip';
import AchievementsInfo from 'app/utils/achievementConstants';
import styles from './UserProfile.css';
import type { Achievement } from 'app/store/models/User';

export const rarityToColorMap = {
  0: 'Sienna',
  1: 'Silver',
  2: 'Gold',
  3: 'SteelBlue',
  4: 'DarkTurquoise',
  5: 'MediumSeaGreen',
  7: 'FireBrick',
  8: 'DarkOrchid',
  9: 'DarkMagenta',
};

export const AchievementsBox = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const topAchievements = [...achievements]
    .sort((a, b) => b.rarity - a.rarity)
    .slice(0, 5);
  return (
    <Flex
      column
      width={'100%'}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex width={'100%'} alignItems="center" justifyContent="center">
        <h2>Trofeer</h2>
      </Flex>
      <div className={styles.trophyCaseBox}>
        {topAchievements.map((e) => {
          return (
            <Flex
              column
              key={AchievementsInfo[e.identifier][e.level].name}
              alignItems="center"
              className={styles.trophyDisplayBox}
            >
              <Tooltip
                content={
                  <div className={styles.trophyDetailTooltip}>
                    <p>
                      <i>
                        {e.hidden
                          ? '?????????'
                          : AchievementsInfo[e.identifier][e.level].description}
                      </i>
                    </p>
                    <p>
                      <p>
                        Opnådd den {moment(e.createdAt).format('YYYY-MM-DD')}
                      </p>
                    </p>
                    <p>{e.percentage.toFixed(1)}% har denne!</p>
                  </div>
                }
                positions="bottom"
              >
                <Trophy
                  size={40}
                  color={rarityToColorMap[e.rarity] ?? 'Gold'}
                  style={
                    e.rarity >= 4
                      ? {
                          filter: `drop-shadow(0px 0px 6px ${rarityToColorMap[e.rarity]})`,
                        }
                      : {}
                  }
                />

                <p style={{ textShadow: '#FC0 1px 0 10px;' }}>
                  {AchievementsInfo[e.identifier][e.level].name}
                </p>
              </Tooltip>
            </Flex>
          );
        })}
      </div>
    </Flex>
  );
};
