import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useMemo, useState } from 'react';
import Pill from 'app/components/Pill';
import styles from 'app/components/UserAttendance/AttendanceModalContent.module.css';
import { selectCurrentUser } from 'app/reducers/auth';
import { selectAllGroups } from 'app/reducers/groups';
import { useAppSelector } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type { AttendanceModalRegistration } from 'app/components/UserAttendance/AttendanceModalContent';

const excludeFilterGroups: EntityId[] = [
  1, // Users
  2, // Abakus
  47, // Formaterte
  227, // Baksida-Komite
  228, // Baksida-Revy
  92, // Kasserere
  242, // Klassetillitsvalgt
];

type Props = {
  registrations: AttendanceModalRegistration[];
  groupFilter: EntityId | null;
  setGroupFilter: (group: EntityId | null) => void;
};

export const GroupFilter = ({
  registrations,
  groupFilter,
  setGroupFilter,
}: Props) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const allGroups = useAppSelector(selectAllGroups);
  const [hovered, setHovered] = useState(false);
  const expanded = hovered || groupFilter !== null;

  const topGroups = useMemo(
    () =>
      allGroups
        .filter(
          (group) =>
            currentUser?.abakusGroups.includes(group.id) &&
            !excludeFilterGroups.includes(group.id),
        )
        .map(
          (group) =>
            [
              group,
              registrations.filter(
                (reg) =>
                  'abakusGroups' in reg.user &&
                  reg.user.abakusGroups.includes(group.id),
              ).length,
            ] as const,
        )
        .sort((a, b) => b[1] - a[1]),
    [allGroups, currentUser?.abakusGroups, registrations],
  );

  return (
    <Flex
      wrap
      gap="var(--spacing-sm)"
      style={{ maxHeight: expanded ? undefined : '3rem' }}
      className={styles.groupFilters}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {topGroups.map(([group]) => (
        <Pill
          key={group.id}
          onClick={() =>
            groupFilter === group.id
              ? setGroupFilter(null)
              : setGroupFilter(group.id)
          }
          className={cx(
            styles.groupFilterButton,
            groupFilter === group.id && styles.selected,
          )}
        >
          {group.name}
        </Pill>
      ))}
      {!expanded && <div className={styles.collapsedIndicator} />}
    </Flex>
  );
};
