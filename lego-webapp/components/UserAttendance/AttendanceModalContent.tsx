import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { flatMap } from 'lodash-es';
import { Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TextInput } from '~/components/Form';
import { ProfilePicture } from '~/components/Image';
import { GroupFilter } from '~/components/UserAttendance/GroupFilter';
import { useAppSelector } from '~/redux/hooks';
import { selectGroupEntities } from '~/redux/slices/groups';
import EmptyState from '../EmptyState';
import styles from './AttendanceModalContent.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type {
  PublicUser,
  PublicUserWithAbakusGroups,
} from '~/redux/models/User';

export type AttendanceModalRegistration = {
  id: EntityId;
  user: PublicUser | PublicUserWithAbakusGroups;
  pool?: EntityId;
};

export type AttendanceModalPool = {
  name: string;
  registrations: AttendanceModalRegistration[];
};

type Props = {
  pools: AttendanceModalPool[];
  togglePool: (index: number) => void;
  selectedPool: number;
  isMeeting?: boolean;
};

type TabProps = {
  name: string;
  index: number;
  activePoolIndex: number;
  togglePool: (pool: number) => void;
};

const Tab = ({ name, index, activePoolIndex, togglePool }: TabProps) => (
  <button
    onClick={() => togglePool(index)}
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem,
    )}
  >
    {name}
  </button>
);

const generateAmendedPools = (pools: AttendanceModalPool[]) => {
  if (pools.length === 1) return pools;

  const registrations = flatMap(pools, (pool) => pool.registrations);
  const summaryPool = {
    id: 'all',
    name: 'Alle',
    registrations,
  };
  return [summaryPool, ...pools];
};

const normalizeSearchValue = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, ' ');

const AttendanceModalContent = ({
  pools,
  togglePool,
  selectedPool,
  isMeeting,
}: Props) => {
  const [search, setSearch] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<EntityId[] | null>(null);
  const groupEntities = useAppSelector(selectGroupEntities);

  const amendedPools = useMemo(() => generateAmendedPools(pools), [pools]);

  const registrations = useMemo(
    () => amendedPools[selectedPool]?.registrations,
    [amendedPools, selectedPool],
  );

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(search);

    return (registrations ?? []).filter((registration) => {
      const nameMatch = normalizeSearchValue(
        registration.user.fullName,
      ).includes(normalizedSearch);

      const groupSearchMatch =
        'abakusGroups' in registration.user &&
        registration.user.abakusGroups.some(
          (groupId) =>
            normalizeSearchValue(groupEntities[groupId]?.name ?? '') ===
            normalizedSearch,
        );

      const groupFilterMatch =
        !groupFilter ||
        ('abakusGroups' in registration.user &&
          registration.user.abakusGroups.some((groupId) =>
            groupFilter.includes(groupId),
          ));

      if (!normalizedSearch) return groupFilterMatch;
      return (nameMatch || groupSearchMatch) && groupFilterMatch;
    });
  }, [registrations, search, groupFilter, groupEntities]);

  return (
    <Flex
      column
      gap="var(--spacing-md)"
      className={styles.modalContent}
      data-test-id="attendance-modal-content"
    >
      <TextInput
        type="text"
        prefix="search"
        placeholder="Søk etter navn"
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {!isMeeting && (
        <GroupFilter
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
        />
      )}

      <ul className={styles.list}>
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations?.map((registration) => (
            <li key={registration.id}>
              <Flex
                alignItems="center"
                className={cx(
                  styles.row,
                  !isMeeting &&
                    !registration.pool &&
                    amendedPools[selectedPool].name === 'Alle' &&
                    styles.opacity,
                )}
              >
                <ProfilePicture size={30} user={registration.user} />
                <a href={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </a>
              </Flex>
            </li>
          ))
        ) : (
          <EmptyState
            iconNode={<Send />}
            header={!isMeeting ? 'Ingen påmeldte ...' : undefined}
            body={!isMeeting ? 'Meld deg på da vel!' : 'Ingen brukere her ...'}
            className={styles.emptyState}
          />
        )}
      </ul>

      <Flex alignItems="stretch" className={styles.nav}>
        {amendedPools.map((pool, i) => (
          <Tab
            name={pool.name}
            key={pool.name} // TODO: Once typed better it shouldn't be too hard to change this into an id
            index={i}
            activePoolIndex={selectedPool}
            togglePool={togglePool}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default AttendanceModalContent;
