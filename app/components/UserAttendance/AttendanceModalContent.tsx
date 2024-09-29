import { Button, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { flatMap } from 'lodash';
import { Send } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TextInput } from 'app/components/Form';
import { ProfilePicture } from 'app/components/Image';
import EmptyState from '../EmptyState';
import styles from './AttendanceModalContent.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicUser } from 'app/store/models/User';

export type Registration = {
  id: EntityId;
  user: PublicUser;
  pool?: Pool;
};

export type Pool = {
  name: string;
  registrations: Registration[];
};

type Props = {
  pools: Pool[];
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
  <Button
    flat
    onPress={() => togglePool(index)}
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem,
    )}
  >
    {name}
  </Button>
);

const generateAmendedPools = (pools: Pool[]) => {
  if (pools.length === 1) return pools;

  const registrations = flatMap(pools, (pool) => pool.registrations);
  const summaryPool = {
    id: 'all',
    name: 'Alle',
    registrations,
  };
  return [summaryPool, ...pools];
};

const AttendanceModalContent = ({
  pools,
  togglePool,
  selectedPool,
  isMeeting,
}: Props) => {
  const [filter, setFilter] = useState<string>('');

  const amendedPools = useMemo(() => generateAmendedPools(pools), [pools]);

  const registrations = useMemo(
    () =>
      amendedPools[selectedPool]?.registrations.filter((registration) => {
        return registration.user.fullName
          .toLowerCase()
          .includes(filter.toLowerCase());
      }),
    [filter, amendedPools, selectedPool],
  );

  return (
    <Flex column gap="var(--spacing-md)" className={styles.modalContent}>
      <TextInput
        type="text"
        prefix="search"
        placeholder="Søk etter navn"
        onChange={(e) => setFilter(e.target.value)}
        className={styles.searchInput}
      />

      <ul className={styles.list}>
        {registrations.length > 0 ? (
          registrations?.map((registration) => (
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
                <Link to={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </Link>
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

      <Flex justifyContent="space-between" className={styles.nav}>
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
