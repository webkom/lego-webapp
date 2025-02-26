import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import Pill from 'app/components/Pill';
import styles from 'app/components/UserAttendance/AttendanceModalContent.module.css';
import type { EntityId } from '@reduxjs/toolkit';

type Props = {
  groupFilter: EntityId[] | null;
  setGroupFilter: (group: EntityId[] | null) => void;
};

const filterableGroups = [
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
  const [hovered, setHovered] = useState(false);
  const expanded = hovered || groupFilter !== null;

  return (
    <Flex
      wrap
      gap="var(--spacing-sm)"
      style={{ maxHeight: expanded ? undefined : '3rem' }}
      className={styles.groupFilters}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {filterableGroups.map((group) => (
        <Pill
          key={group.name}
          onClick={() =>
            groupFilter === group.ids
              ? setGroupFilter(null)
              : setGroupFilter(group.ids)
          }
          className={cx(
            styles.groupFilterButton,
            groupFilter === group.ids && styles.selected,
          )}
        >
          {group.name}
        </Pill>
      ))}
      {!expanded && <div className={styles.collapsedIndicator} />}
    </Flex>
  );
};
