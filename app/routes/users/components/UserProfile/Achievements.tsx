import { Button, Flex } from '@webkom/lego-bricks';
import { Trophy } from 'lucide-react';
import moment from 'moment-timezone';
import { useState, useMemo } from 'react';
import Tooltip from 'app/components/Tooltip';
import AchievementsInfo, {
  rarityToColorMap,
} from 'app/utils/achievementConstants';
import styles from './UserProfile.module.css';
import type { Achievement } from 'app/store/models/User';

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
      <Flex wrap gap="var(--spacing-lg)">
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
              </div>
            }
            positions="bottom"
          >
            <Flex column alignItems="center" gap="var(--spacing-xs)">
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
              <span style={{ textShadow: '#FC0 1px 0 10px' }}>
                {AchievementsInfo[e.identifier][e.level].name}
              </span>
            </Flex>
          </Tooltip>
        ))}
      </Flex>
      {achievements.length > MAX_ACHIEVEMENTS && (
        <Button
          onPress={() => {
            setShowAll((prev) => !prev);
          }}
          className={styles.showAllButton}
        >
          {showAll ? 'Vis færre' : 'Vis alle'}
        </Button>
      )}
    </div>
  );
};
