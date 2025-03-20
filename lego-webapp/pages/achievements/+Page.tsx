import { Card, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Ghost } from 'lucide-react';
import { useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { ContentMain } from '~/components/Content';
import Tooltip from '~/components/Tooltip';
import { postKeypress } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { CurrentUser } from '~/redux/models/User';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectUserByUsername } from '~/redux/slices/users';
import {
  AchievementGroupInfo,
  GroupedAchievementsInfo,
} from '~/utils/achievementConstants';
import useQuery from '~/utils/useQuery';
import styles from './Overview.module.css';

const AchievementGroup = ({
  achievementGroup,
}: {
  achievementGroup: AchievementGroupInfo & { userAchievedLevel: number };
}) => {
  const userLevel = achievementGroup.userAchievedLevel;
  return (
    <Card>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="var(--spacing-md)"
        className={styles.achievementGroup}
      >
        <Flex
          alignItems="center"
          gap="var(--spacing-md)"
          className={styles.currentContainer}
        >
          <img
            src={
              userLevel < 0
                ? achievementGroup.achievements[0].image
                : achievementGroup.achievements[userLevel].image
            }
            alt="Trofe"
            className={cx(
              styles.achievement,
              styles.current,
              userLevel < 0 && styles.unachieved,
            )}
          />
          <Flex
            column
            gap="var(--spacing-sm)"
            className={cx(userLevel < 0 && styles.unachieved)}
          >
            <h4>{achievementGroup.name}</h4>
            <span>{achievementGroup.description}</span>
          </Flex>
        </Flex>
        <Flex
          wrap
          gap="var(--spacing-sm)"
          justifyContent="flex-end"
          className={styles.allAchievements}
        >
          {achievementGroup.achievements.length > 1 &&
            achievementGroup.achievements.map((achievement: any, i: number) => (
              <Tooltip
                key={i}
                positions={['top', 'bottom', 'right', 'left']}
                content={
                  <Flex
                    column
                    gap="var(--spacing-sm)"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <h4>{achievement.name}</h4>
                    {achievement.description && (
                      <span>{achievement.description}</span>
                    )}
                  </Flex>
                }
              >
                <Card className={styles.achievementImageCard}>
                  <img
                    src={achievement.image ?? ''}
                    alt="Trofe"
                    className={cx(
                      styles.achievement,
                      userLevel < achievement.level && styles.unachieved,
                    )}
                  />
                </Card>
              </Tooltip>
            ))}
        </Flex>
      </Flex>
    </Card>
  );
};

const Overview = () => {
  const { query } = useQuery({
    min_rarity: 'any',
    max_rarity: 'any',
    sort: 'rarity',
    sort_order: 'desc',
    completed: 'all',
  });

  const currentUser = useCurrentUser();
  const username = currentUser?.username;
  const user = useAppSelector((state) =>
    selectUserByUsername<CurrentUser>(state, username),
  );
  const userAchievements = user?.achievements;

  const getAchievedLevel = (group: AchievementGroupInfo) => {
    return !userAchievements
      ? -1
      : userAchievements
          .filter((achievement) => achievement.identifier === group.identifier)
          .reduce(
            (max, achievement) =>
              max.level > achievement.level ? max : achievement,
            { level: -1 },
          ).level;
  };

  // Map group fields to achieved level or use default values
  const groupedAchievements = GroupedAchievementsInfo.map((group) => {
    const achievedLevel = getAchievedLevel(group);
    const achieved = achievedLevel >= 0;
    return {
      ...group,
      userAchievedLevel: achievedLevel,
      name: achieved ? group.achievements[achievedLevel].name : group.name,
      description: achieved
        ? group.achievements[achievedLevel].description
        : group.description,
      achievements: group.achievements.map((achievement, index) => ({
        ...achievement,
        level: index,
        identifier: group.identifier,
      })),
    };
  });

  const filteredAchievementsGrouped = groupedAchievements.filter((group) => {
    if (query.completed === 'all') return true;
    if (query.completed === 'true') return group.userAchievedLevel >= 0;
    if (query.completed === 'false') return group.userAchievedLevel < 0;
    return true;
  });

  const sortedAchievementsGrouped = filteredAchievementsGrouped.sort((a, b) => {
    let comparison = 0;
    if (query.sort === 'none') comparison = 0;
    if (query.sort === 'alphabetical')
      comparison = b.name.localeCompare(a.name);
    if (query.sort === 'hidden')
      comparison = (a.description ? -1 : 1) - (b.description ? -1 : 1);
    if (query.sort === 'rarity') {
      // Give priority to achieved
      const aAchievedRarity =
        a.userAchievedLevel < 0
          ? undefined
          : a.achievements[a.userAchievedLevel].rarity + 10;
      const bAchievedRarity =
        b.userAchievedLevel < 0
          ? undefined
          : b.achievements[b.userAchievedLevel].rarity + 10;

      const aRarity = aAchievedRarity ?? a.achievements[0].rarity;
      const bRarity = bAchievedRarity ?? b.achievements[0].rarity;

      comparison = aRarity - bRarity;
    }

    return query.sort_order === 'desc' ? -comparison : comparison;
  });

  const dispatch = useAppDispatch();
  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);

  useEffect(() => {
    let count = 0;
    const codeArr: number[] = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const keyHandler = (event: KeyboardEvent) => {
      if (event.keyCode === codeArr[count]) {
        count++;
        if (count === codeArr.length) {
          dispatch(postKeypress({ code: codeArr.slice(0, count) }));
          if (sudoAdminAccess) {
            navigate('/sudo');
          }
          count = 0;
        }
      } else {
        count = 0;
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [dispatch, sudoAdminAccess]);

  return (
    <ContentMain>
      <Flex column gap="var(--spacing-md)">
        {sortedAchievementsGrouped.length > 0 ? (
          sortedAchievementsGrouped.map((group, index) => (
            <AchievementGroup key={index} achievementGroup={group} />
          ))
        ) : (
          <Flex
            alignItems="center"
            justifyContent="center"
            gap="var(--spacing-md)"
          >
            <Icon iconNode={<Ghost />} />
            <span>Ingen resultat..</span>
          </Flex>
        )}
      </Flex>
    </ContentMain>
  );
};

export default Overview;
