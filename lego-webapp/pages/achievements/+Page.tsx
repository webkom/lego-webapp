import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { navigate } from 'vike/client/router';
import { ContentMain } from '~/components/Content';
import { postKeypress } from '~/redux/actions/AchievementActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import AchievementsInfo, {
  rarityToColorMap,
} from '~/utils/achievementConstants';
import useQuery from '~/utils/useQuery';
import styles from './Overview.module.css';

const Overview = () => {
  const { query } = useQuery({
    min_rarity: 'any',
    max_rarity: 'any',
    sort: 'none',
    sort_order: 'asc',
  });

  const allTrophies = Object.entries(AchievementsInfo).flatMap(
    ([key, achievements]) =>
      achievements.map((achievement, index) => ({
        ...achievement,
        identifier: key,
        level: index,
      })),
  );

  const filteredTrophies = allTrophies.filter((trophy) => {
    const rarity = trophy.rarity;
    const minRarity =
      query.min_rarity !== 'any' ? parseInt(query.min_rarity, 10) : 0;
    const maxRarity =
      query.max_rarity !== 'any' ? parseInt(query.max_rarity, 10) : Infinity;
    return rarity >= minRarity && rarity <= maxRarity;
  });

  const sortedTrophies = [...filteredTrophies].sort((a, b) => {
    let comparison = 0;
    if (query.sort === 'rarity') comparison = a.rarity - b.rarity;
    if (query.sort === 'alphabetical')
      comparison = a.name.localeCompare(b.name);
    if (query.sort === 'hidden')
      comparison = a.hidden === b.hidden ? 0 : a.hidden ? -1 : 1;

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
      <Flex className={styles.listWrapper}>
        {sortedTrophies.map((e) => (
          <Flex className={cx(styles.listItem)} key={e.name + e.rarity}>
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
            <Flex column gap="var(--spacing-sm)" className="secondaryFontColor">
              <h3>{e.name}</h3>
              <span className={styles.description}>
                {e.hidden ? '?????????' : e.description}
              </span>
              <span className={styles.description}>
                Sjeldenhet: {e.rarity + 1}
              </span>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </ContentMain>
  );
};

export default Overview;
