// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './AttendanceModal.css';
import { flatMap } from 'lodash';

export type Props = {
  pools: Array<Object>,
  title: string,
  togglePool: number => void,
  selectedPool: Number
};

const Tab = ({ name, index, activePoolIndex, togglePool }) => (
  <a
    className={cx(styles.navButton, activePoolIndex === index && styles.activeItem)}
    onClick={() => togglePool(index)}
  >
    {name}
  </a>
);

class AttendanceModal extends Component {
  props: Props;

  state = {
    pools: []
  };

  componentWillMount() {
    this.generateAmendedPools(this.props.pools);
  }

  generateAmendedPools = pools => {
    if (pools.length === 1) return this.setState({ pools });

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
    const statusTitle = title || 'Status';
    return (
      <div>
        <h2>{statusTitle}</h2>
        <ul className={styles.list}>
          {activePool.registrations.map((registration, i) => (
            <li key={i}>
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
