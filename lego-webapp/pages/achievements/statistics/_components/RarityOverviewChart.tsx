import { Flex, Skeleton, Tooltip } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { fetchAchievementRarity } from '~/redux/actions/AchievementActions';
import { useAppDispatch } from '~/redux/hooks';
import {
  AchievementsInfo,
  getAchievementGroupInfo,
  rarityMap,
} from '~/utils/achievementConstants';
import styles from './RarityOverviewChart.module.css';
import type { AchievementRarity } from '~/redux/actions/AchievementActions';
import type { AchievementIdentifier } from '~/utils/achievementConstants';

type LevelSegment = {
  percentage: number;
  color: string;
  levelName: string;
};

type RarityRow = {
  name: string;
  levels: LevelSegment[];
};

const buildRows = (rarities: AchievementRarity[]): RarityRow[] => {
  const byIdentifier = new Map<AchievementIdentifier, AchievementRarity[]>();
  for (const row of rarities) {
    byIdentifier.set(row.identifier, [
      ...(byIdentifier.get(row.identifier) ?? []),
      row,
    ]);
  }

  return Array.from(byIdentifier.entries()).map(([identifier, rows]) => ({
    name: getAchievementGroupInfo(identifier)?.name ?? identifier,
    // Ascending by level: index 0 (widest, most common) is drawn first, so
    // each rarer/narrower level after it paints on top and stays visible.
    levels: rows
      .sort((a, b) => a.level - b.level)
      .map((row) => {
        const info = AchievementsInfo[identifier]?.[row.level];
        return {
          percentage: row.percentage,
          color: info ? rarityMap[info.rarity].color : 'var(--color-blue-6)',
          levelName: info?.name ?? `Nivå ${row.level + 1}`,
        };
      }),
  }));
};

const RarityBar = ({ row }: { row: RarityRow }) => (
  <Tooltip
    content={
      <div className={styles.tooltipContent}>
        {row.levels.map((level) => (
          <span key={level.levelName}>
            {level.levelName}: {level.percentage}%
          </span>
        ))}
      </div>
    }
    positions={['top', 'bottom']}
  >
    <div className={styles.track}>
      {row.levels.map((level) => (
        <div
          key={level.levelName}
          className={styles.segment}
          style={{
            width: `${level.percentage}%`,
            backgroundColor: level.color,
          }}
        />
      ))}
    </div>
  </Tooltip>
);

const RarityOverviewChart = () => {
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<RarityRow[]>();

  usePreparedEffect(
    'fetchAchievementRarity',
    async () => {
      const res = await dispatch(fetchAchievementRarity());
      setRows(buildRows(res.payload));
    },
    [dispatch],
  );

  return (
    <div>
      <h2>Sjeldenhet blant trofeer</h2>
      {rows === undefined ? (
        <Skeleton height={400} />
      ) : (
        <Flex column gap="var(--spacing-sm)">
          {rows.map((row) => (
            <div key={row.name} className={styles.row}>
              <span className={styles.name}>{row.name}</span>
              <RarityBar row={row} />
            </div>
          ))}
        </Flex>
      )}
    </div>
  );
};

export default RarityOverviewChart;
