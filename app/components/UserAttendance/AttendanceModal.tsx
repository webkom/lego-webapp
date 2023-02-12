import cx from 'classnames';
import { flatMap } from 'lodash-es';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import Icon from 'app/components/Icon';
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
  pools: Array<Pool>;
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

type State = {
  pools: Pool[];
  filter: string;
};

class AttendanceModal extends Component<Props, State> {
  state = {
    pools: [],
    filter: '',
  };
  static defaultProps = {
    title: 'Status',
  };

  UNSAFE_componentWillMount() {
    this.generateAmendedPools(this.props.pools);
  }

  generateAmendedPools = (pools: Pool[]) => {
    if (pools.length === 1)
      return this.setState({
        pools,
      });

    const registrations = flatMap(pools, (pool) => pool.registrations);
    const summaryPool = {
      name: 'Alle',
      registrations,
    };
    return this.setState({
      pools: [summaryPool, ...pools],
    });
  };

  render() {
    const { title, togglePool, selectedPool, isMeeting } = this.props;
    const { pools, filter } = this.state;

    const registrations = pools[selectedPool].registrations.filter(
      (registration) => {
        return registration.user.fullName
          .toLowerCase()
          .includes(filter.toLowerCase());
      }
    );

    return (
      <Flex
        column
        justifyContent="space-between"
        gap={15}
        className={styles.modal}
      >
        <h2>{title}</h2>
        <Flex alignItems="center" className={styles.search}>
          <Icon name="search" size={16} />
          <TextInput
            type="text"
            placeholder="Søk etter navn"
            onChange={(e) => this.setState({ filter: e.target.value })}
          />
        </Flex>

        <ul className={styles.list}>
          {registrations.map((registration) => (
            <li key={registration.id}>
              <Flex
                alignItems="center"
                className={cx(
                  styles.row,
                  !isMeeting &&
                    !registration.pool &&
                    pools[selectedPool].name === 'Alle' &&
                    styles.opacity
                )}
              >
                <ProfilePicture
                  size={30}
                  user={registration.user}
                  alt={`${registration.user.name}'s profile picture`}
                />
                <Link to={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </Link>
              </Flex>
            </li>
          ))}
        </ul>

        <Flex justifyContent="space-between" className={styles.nav}>
          {pools.map((pool, i) => (
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
  }
}

export default AttendanceModal;
