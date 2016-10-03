// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import ProfilePicture from 'app/components/ProfilePicture';
import styles from './RegistrationModal.css';

export type Props = {
  pools: Array<Object>
};

class RegistrationModal extends Component {
  props: Props;

  state = {
    activePoolIndex: 0
  };

  togglePool = (index: number) => {
    this.setState({
      activePoolIndex: index
    });
  };

  render() {
    const { pools } = this.props;

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
    return (
      <div className={styles.overlay}>
        <div className={styles.container}>
        <div className={styles.registrationBox}>
          <strong>Påmeldte:</strong>
          <ul className={styles.list}>
            {activePool.registrations.map((registration, i) => (
              <li key={i}>
                <div className={styles.row}>
                  <ProfilePicture
                    size={30}
                    user={registration.user.id}
                  />
                  <span>
                    <Link to={`/users/${registration.user.username}`}>
                      {registration.user.fullName}
                    </Link>
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.nav}>
            {tabs}
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default RegistrationModal;
