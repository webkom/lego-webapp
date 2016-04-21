/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import cx from 'classnames';
import LoginForm from '../LoginForm';
import Search from '../Search';
import ButtonTriggeredDropdown from '../ButtonTriggeredDropdown';

type Props = {
  children: any;
  auth: any;
  login: () => any;
  logout: () => any;
  loggedIn: boolean;
  loginFailed: boolean;
};

type State = {
  accountOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
};

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    searchOpen: false,
    notificationsOpen: false
  };

  render() {
    const {
      auth,
      login, logout,
      loggedIn, loginFailed
    } = this.props;

    return (
      <header className={styles.root}>
        <div className={styles.content}>
          <IndexLink
            to='/'
            className={styles.logo}
          >
            Abakus
          </IndexLink>

          <div className={styles.navigation}>
            <Link to='/events' activeClassName={styles.activeLink}>Arrangementer</Link>
            <Link to='/career' activeClassName={styles.activeLink}>Karriere</Link>
            <Link to='/readme' activeClassName={styles.activeLink}>README</Link>
            <Link to='/quotes' activeClassName={styles.activeLink}>Sitater</Link>
          </div>

          <div>
            <ButtonTriggeredDropdown
              buttonClassName={styles.contentButton}
              contentClassName={styles.dropdown}
              iconName='bell'
              show={this.state.notificationsOpen}
              toggle={() => this.setState({
                notificationsOpen: !this.state.notificationsOpen
              })}
            >
              <h2>No Notifications</h2>
            </ButtonTriggeredDropdown>

            <ButtonTriggeredDropdown
              buttonClassName={styles.contentButton}
              contentClassName={cx(styles.dropdown, loginFailed && 'animated shake')}
              iconName='user'
              show={this.state.accountOpen}
              toggle={() => this.setState({ accountOpen: !this.state.accountOpen })}
            >
              {!loggedIn && (
                <LoginForm
                  login={login}
                  className={styles.loginForm}
                />
              )}

              {loggedIn && (
                <div>
                  <h2>{auth && auth.username}</h2>
                  <ul className={styles.dropdownMenu}>
                    <li><Link to='/users/me'>My Profile</Link></li>
                    <li><Link to='/users/me/settings'>Settings</Link></li>
                    <li><Link to='events'>Favorites</Link></li>
                    <li><a onClick={logout}>Log out</a></li>
                  </ul>
                </div>
              )}
            </ButtonTriggeredDropdown>

            <button
              className={styles.contentButton}
              onClick={() => this.setState({ searchOpen: !this.state.searchOpen })}
            >
              <i className='fa fa-search' />
            </button>

            <Modal
              show={this.state.searchOpen}
              onHide={() => this.setState({ searchOpen: false })}
              backdropClassName={styles.backdrop}
              backdrop
            >
              <Search
                isOpen={this.state.searchOpen}
                onCloseSearch={() => this.setState({ searchOpen: false })}
              />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}
