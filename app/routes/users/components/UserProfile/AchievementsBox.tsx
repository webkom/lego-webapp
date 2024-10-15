import { Button, Flex } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import Tooltip from 'app/components/Tooltip';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import styles from './UserProfile.css';
import type { Achievement } from 'app/store/models/User';

export const AchievementsBox = ({
  achievements,
}: {
  achievements: Achievement[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const topAchievements = [...achievements]
    .sort(
      (a, b) =>
        AchievementsInfo[b.identifier][b.level].rarity -
        AchievementsInfo[a.identifier][a.level].rarity,
    )
    .slice(0, showAll ? 999 : 5);
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
              className={styles.trophyElementBox}
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
                      Opnådd den {moment(e.createdAt).format('D. MMMM YYYY')}
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
                          filter: `drop-shadow(0px 0px 6px ${rarityToColorMap[AchievementsInfo[e.identifier][e.level].rarity]})`,
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
  );
};
