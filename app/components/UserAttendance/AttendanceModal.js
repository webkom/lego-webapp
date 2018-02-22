// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { ProfilePicture } from 'app/components/Image';
import styles from './AttendanceModal.css';
import { flatMap } from 'lodash';

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
          {activePool.registrations.map((registration, i) => (
            <li key={i}>
              <div className={styles.row}>
                {activePool.name === 'Venteliste' && (
                  <span className={styles.waitingListPosition}>{i + 1}. </span>
                )}
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
