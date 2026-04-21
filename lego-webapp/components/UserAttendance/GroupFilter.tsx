import cx from 'classnames';
import styles from './AttendanceModalContent.module.css';
import type { EntityId } from '@reduxjs/toolkit';

type Props = {
  groupFilter: EntityId[] | null;
  setGroupFilter: (group: EntityId[] | null) => void;
};

export const filterableGroups = [
  {
    name: '1. Klasse',
    ids: [16, 22],
  },
  {
    name: '2. Klasse',
    ids: [17, 23],
  },
  {
    name: '3. Klasse',
    ids: [18, 24],
  },
  {
    name: '4. Klasse',
    ids: [19, 25],
  },
  {
    name: '5. Klasse',
    ids: [20, 26],
  },
];

export const GroupFilter = ({ groupFilter, setGroupFilter }: Props) => {
  return (
    <div className={styles.groupFilterBar}>
      <span className={styles.groupFilterLabel}>Kull</span>

      <div
        className={styles.groupFilters}
        role="group"
        aria-label="Filtrer på kull"
      >
        {filterableGroups.map((group) => {
          const active = groupFilter === group.ids;

          return (
            <button
              key={group.name}
              type="button"
              aria-pressed={active}
              className={cx(
                styles.groupFilterButton,
                active && styles.groupFilterButtonActive,
              )}
              onClick={() =>
                active ? setGroupFilter(null) : setGroupFilter(group.ids)
              }
            >
              {group.name}
            </button>
          );
        })}
      </div>

      {groupFilter !== null && (
        <button
          type="button"
          className={styles.groupFilterClear}
          onClick={() => setGroupFilter(null)}
        >
          Nullstill
        </button>
      )}
    </div>
  );
};
