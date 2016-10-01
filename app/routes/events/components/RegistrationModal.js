import styles from './RegistrationModal.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

export type Props = {
  pools: Array
}

class RegistrationModal extends Component {
  props: Props;

  state = {
    activePool: this.props.pools[0].id
  }

  togglePool = (id) => {
    this.setState({
      activePool: id
    });
  }

  render() {
    console.log(this.props);
    const { pools } = this.props;

    const nav = pools.map((pool) => {
      const active = this.state.activePool === pool.id ? styles.activeItem : '';
      return (
        <a
          className={cx(styles.navButton, active)}
          onClick={() => this.togglePool(pool.id)}
        >
          {pool.name}
        </a>);
    }
    );

    const liste = pools.map((pool) => {
      if (pool.id === this.state.activePool) {
        return (
          <ul className={styles.list}>
            {pool.registrations.map((registration) => (
                <li>
                  <div className={styles.row}>
                    <img
                      className={styles.thumbnail}
                      src={`http://api.adorable.io/avatars/${registration.user.username}.png`}
                    />
                    <span>
                      <Link to={`/users/${registration.user.username}`}>
                        {registration.user.fullName}
                      </Link>
                    </span>
                  </div>
                </li>
              )
            )}
          </ul>
        );
      }
      return null;
    });

    return (
      <div className={styles.overlay}>
        <div className={styles.container}>
        <div className={styles.registrationBox}>
          <strong>Påmeldte:</strong>
          {liste}
          <div className={styles.nav}>
            {nav}
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default RegistrationModal;
