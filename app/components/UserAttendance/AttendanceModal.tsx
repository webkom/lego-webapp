import cx from 'classnames';
import { flatMap } from 'lodash';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { ProfilePicture } from 'app/components/Image';
import type { ID, User } from 'app/models';
import Button from '../Button';
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
  allRegistrations?: Registration[];
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
};

class AttendanceModal extends Component<Props, State> {
  state = {
    pools: [],
  };
  static defaultProps = {
    title: 'Status',
  };

  UNSAFE_componentWillMount() {
    this.generateAmendedPools(this.props.pools, this.props.allRegistrations);
  }

  generateAmendedPools = (
    pools: Array<Pool>,
    allRegistrations?: Registration[]
  ) => {
    if (pools.length === 1)
      return this.setState({
        pools,
      });
    const registrations =
      allRegistrations || flatMap(pools, (pool) => pool.registrations);
    const summaryPool = {
      name: 'Alle',
      registrations,
    };
    return this.setState({
      pools: [summaryPool, ...pools],
    });
  };

  render() {
    const { title, togglePool, selectedPool } = this.props;
    const { pools } = this.state;
    const activePool = pools[selectedPool];
    return (
      <div>
        <h2>{title}</h2>
        <ul className={styles.list}>
          {activePool.registrations.map((registration) => (
            <li key={registration.id}>
              <div className={styles.row}>
                <ProfilePicture size={30} user={registration.user} />
                <Link to={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.nav}>
          {pools.map((pool, i) => (
            <Tab
              name={pool.name}
              key={i}
              index={i}
              activePoolIndex={selectedPool}
              togglePool={togglePool}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AttendanceModal;
