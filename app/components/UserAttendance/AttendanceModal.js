// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { ProfilePicture } from 'app/components/Image';
import styles from './AttendanceModal.css';
import { flatMap } from 'lodash';
import moment from 'moment';

type Pool = {
  name: string,
  registrations: Array<Object>
};

export type Props = {
  pools: Array<Pool>,
  title: string,
  togglePool: number => void,
  selectedPool: number
};

const Tab = ({ name, index, activePoolIndex, togglePool }: any) => (
  <a
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem
    )}
    onClick={() => togglePool(index)}
  >
    {name}
  </a>
);

type State = {
  pools: Array</*TODO: Pool*/ Object>
};

const WaitingList = ({ pools, waitingPool }) => {
  const relevantPools = pools.filter(pool => pool.id);

  /*
    For testing until prospectivePools and registrationDate is added to
    registrations backend. Feel free to ignore
  */
  const testPool = {
    ...waitingPool,
    registrations: waitingPool.registrations.map(registration => ({
      ...registration,
      prospectivePools: [
        relevantPools[Math.floor(Math.random() * relevantPools.length)].id
      ],
      registrationDate: moment(
        `2018-02-20T11:${Math.floor(Math.random() * 24)}:00Z`
      )
    }))
  };

  const waitingPools = relevantPools
    .map(pool => ({
      name: `Venteliste for ${pool.name}`,
      registrations: testPool.registrations // testPool -> waitingPool when done
        .filter(registration => registration.prospectivePools.includes(pool.id))
        .sort((a, b) => b.registrationDate - a.registrationDate)
    }))
    .filter(pool => pool.registrations.length > 0);

  return waitingPools.map((waitingPool, i) => (
    <li key={i} className={styles.waitingList}>
      <h2>{waitingPool.name}</h2>
      <ul>
        {waitingPool.registrations.map((registration, j) => (
          <li key={j} className={styles.waitingListItem}>
            <div className={styles.row}>
              <span className={styles.waitingListPosition}>{j + 1}. </span>
              <ProfilePicture size={30} user={registration.user} />
              <Link to={`/users/${registration.user.username}`}>
                {registration.user.fullName}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </li>
  ));
};

class AttendanceModal extends Component<Props, State> {
  state = {
    pools: []
  };

  static defaultProps = {
    title: 'Status'
  };

  componentWillMount() {
    this.generateAmendedPools(this.props.pools);
  }

  generateAmendedPools = (pools: Array<Pool>) => {
    if (pools.length === 1) return this.setState({ pools });

    // $FlowFixMe
    const allRegistrations = flatMap(pools, pool => pool.registrations);
    const summaryPool = {
      name: 'Alle',
      registrations: allRegistrations
    };
    return this.setState({
      pools: [summaryPool, ...pools]
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
          {activePool.name === 'Venteliste' ? (
            <WaitingList pools={pools} waitingPool={activePool} />
          ) : (
            activePool.registrations.map((registration, i) => (
              <li key={i}>
                <div className={styles.row}>
                  <ProfilePicture size={30} user={registration.user} />
                  <Link to={`/users/${registration.user.username}`}>
                    {registration.user.fullName}
                  </Link>
                </div>
              </li>
            ))
          )}
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
