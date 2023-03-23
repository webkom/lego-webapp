import cx from 'classnames';
import { flatMap } from 'lodash';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import { ProfilePicture } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import type { ID, User } from 'app/models';
import styles from './AttendanceModal.css';

export type Registration = {
  id: ID;
  user: User;
};

export type Pool = {
  name: string;
  registrations: Registration[];
};

type Props = {
  pools: Pool[];
  title: string;
  togglePool: (arg0: number) => void;
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
    onClick={() => togglePool(index)}
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem
    )}
  >
    {name}
  </Button>
);

const AttendanceModal = ({
  title = 'Status',
  pools,
  togglePool,
  selectedPool,
  isMeeting,
}: Props) => {
  const [amendedPools, setAmendedPools] = useState<Pool[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    generateAmendedPools(pools);
  }, [pools]);

  const generateAmendedPools = (pools: Pool[]) => {
    if (pools.length === 1) return setAmendedPools(pools);

    const registrations = flatMap(pools, (pool) => pool.registrations);
    const summaryPool = {
      name: 'Alle',
      registrations,
    };
    return setAmendedPools([summaryPool, ...pools]);
  };

  useEffect(() => {
    const registrations = amendedPools[selectedPool]?.registrations.filter(
      (registration) => {
        return registration.user.fullName
          .toLowerCase()
          .includes(filter.toLowerCase());
      }
    );
    setRegistrations(registrations);
  }, [filter, amendedPools, selectedPool]);

  return (
    <Flex
      column
      justifyContent="space-between"
      gap={15}
      className={styles.modal}
    >
      <h2>{title}</h2>
      <TextInput
        type="text"
        prefix="search"
        placeholder="Søk etter navn"
        onChange={(e) => setFilter(e.target.value)}
      />

      <ul className={styles.list}>
        {registrations?.map((registration) => (
          <li key={registration.id}>
            <Flex
              alignItems="center"
              className={cx(
                styles.row,
                !isMeeting &&
                  !registration.pool &&
                  amendedPools[selectedPool].name === 'Alle' &&
                  styles.opacity
              )}
            >
              <ProfilePicture
                size={30}
                user={registration.user}
                alt={`${registration.user.fullName}'s profile picture`}
              />
              <Link to={`/users/${registration.user.username}`}>
                {registration.user.fullName}
              </Link>
            </Flex>
          </li>
        ))}
      </ul>

      <Flex justifyContent="space-between" className={styles.nav}>
        {amendedPools.map((pool, i) => (
          <Tab
            name={pool.name}
            key={i}
            index={i}
            activePoolIndex={selectedPool}
            togglePool={togglePool}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default AttendanceModal;
