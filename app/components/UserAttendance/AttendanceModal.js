// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './AttendanceModal.css';

export type Props = {
  pools: Array<Object>
};

class AttendanceModal extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      activePoolIndex: props.selectedPool ? props.selectedPool : 0
    };
  }

  state = {
    activePoolIndex: 0
  };


  togglePool = (index: number) => {
    this.setState({
      activePoolIndex: index
    });
  };

  render() {
    const { pools, title } = this.props;

    const tabs = pools.map((pool, i) => (
      <a
        key={i}
        className={cx(
          styles.navButton,
          this.state.activePoolIndex === i && styles.activeItem
        )}
        onClick={() => this.togglePool(i)}
      >
        {pool.name}
      </a>
    ));

    const activePool = pools[this.state.activePoolIndex];
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
          {tabs}
        </div>
      </div>
    );
  }
}

export default AttendanceModal;
