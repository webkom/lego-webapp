import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { CircleHelp } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { ExclusifyUnion } from 'app/types';
import { ContentMain } from '~/components/Content';
import Tooltip from '~/components/Tooltip';
import { postKeypress } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  AchievementData,
  CurrentUser,
  PublicUserWithGroups,
} from '~/redux/models/User';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectUserById, selectUserByUsername } from '~/redux/slices/users';
import AchievementsInfo from '~/utils/achievementConstants';
import useQuery from '~/utils/useQuery';
import { useIsCurrentUser } from '../users/utils';
import styles from './Overview.module.css';

const AchievementTooltip = ({
  achievement,
  children,
}: {
  achievement: any;
  children: ReactNode;
}) => {
  return (
    <Tooltip
      content={
        <Flex column gap="var(--spacing-sm)">
          <h3>{achievement.name}</h3>
          {achievement.description && (
            <span>
              {achievement.hidden ? '?????????' : achievement.description}
            </span>
          )}
          {achievement.rarity && (
            <span>Sjeldenhet: {achievement.rarity + 1}</span>
          )}
        </Flex>
      }
      positions={['bottom', 'top', 'right', 'left']}
      style={{ height: 'auto' }}
    >
      {children}
    </Tooltip>
  );
};

const AchievementGroup = ({
  achievementGroup,
  userLevel,
}: {
  achievementGroup: any;
  userLevel: number;
}) => {
  return (
    <Card hideOverflow className={styles.listItem}>
      <Flex
        gap="var(--spacing-sm)"
        alignItems="baseline"
        margin="0 0 var(--spacing-md) 0"
      >
        <h3>{achievementGroup[0].identifier}</h3>
        <span>deltatt på x arrangementer</span>
      </Flex>
      <Flex justifyContent="space-between" alignItems="baseline">
        <Flex alignItems="center" justifyContent="center">
          {userLevel === -1 ? (
            <AchievementTooltip
              achievement={{
                name: 'Uoppnådd trofe',
              }}
            >
              <span style={{ fontSize: 100 }}>?</span>
            </AchievementTooltip>
          ) : (
            <AchievementTooltip achievement={achievementGroup[userLevel]}>
              <img
                src={achievementGroup[userLevel].image ?? ''}
                alt="Current trophy"
                className={styles.currentAchievementImage}
              />
            </AchievementTooltip>
          )}
        </Flex>
        <Flex gap="var(--spacing-sm)">
          {achievementGroup.map((achievement: any, i: number) => (
            <AchievementTooltip key={i} achievement={achievement}>
              <Card className={styles.achievementImageCard}>
                <img
                  src={achievement.image ?? ''}
                  alt="Trofe"
                  className={styles.trophyImage}
                />
              </Card>
            </AchievementTooltip>
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
    sort: 'none',
    sort_order: 'asc',
  });

  const currentUser = useCurrentUser();
  const username = currentUser?.username;
  const user = useAppSelector((state) =>
    selectUserByUsername<CurrentUser>(state, username),
  );
  const userAchievements = user?.achievements ?? [];

  const achievementsGrouped = Object.entries(AchievementsInfo).map(
    ([key, achievements]) =>
      achievements.map((achievement, index) => ({
        ...achievement,
        identifier: key,
        level: index,
      })),
  );

  const filteredAchievementsGrouped = achievementsGrouped.map((group) =>
    group.filter((achievement) => {
      const rarity = achievement.rarity;
      const minRarity =
        query.min_rarity !== 'any' ? parseInt(query.min_rarity, 10) : 0;
      const maxRarity =
        query.max_rarity !== 'any' ? parseInt(query.max_rarity, 10) : Infinity;
      return rarity >= minRarity && rarity <= maxRarity;
    }),
  );

  // needed ?
  const sortedAchievementsGrouped = filteredAchievementsGrouped.map((group) =>
    [...group].sort((a, b) => {
      let comparison = 0;
      if (query.sort === 'rarity') comparison = a.rarity - b.rarity;
      if (query.sort === 'alphabetical')
        comparison = a.name.localeCompare(b.name);
      if (query.sort === 'hidden')
        comparison = a.hidden === b.hidden ? 0 : a.hidden ? -1 : 1;

      return query.sort_order === 'desc' ? -comparison : comparison;
    }),
  );

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

  const hasAchievementGroup = (group: any) => {
    return userAchievements
      .filter((achievement) => achievement.identifier === group[0].identifier)
      .reduce(
        (max, achievement) =>
          max.level > achievement.level ? max : achievement,
        { level: -1 },
      );
  };

  return (
    <ContentMain>
      <Flex column gap="var(--spacing-md)">
        {sortedAchievementsGrouped.map((group, index) => (
          <AchievementGroup
            key={index}
            achievementGroup={group}
            userLevel={hasAchievementGroup(group).level}
          />
        ))}
      </Flex>
    </ContentMain>
  );
};

export default Overview;
