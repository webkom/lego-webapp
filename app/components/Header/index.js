// @flow

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import logoImage from 'app/assets/logo-dark.png';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import ProfilePicture from '../ProfilePicture';
import FancyNodesCanvas from './FancyNodesCanvas';
import styles from './Header.css';

import type { UserEntity } from 'app/reducers/users';

type Props = {
  searchOpen: boolean,
  toggleSearch: () => any,
  currentUser: UserEntity,
  loggedIn: boolean,
  logout: () => void
};

type State = {
  accountOpen: boolean;
  notificationsOpen: boolean
};

function AccountDropdownItems({ logout, onClose, username }) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link to='/users/me' onClick={onClose}>
          <strong style={{ color: '#333' }}>{username}</strong>
          <Icon name='user' />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to='/users/me/settings' onClick={onClose}>
          Innstillinger
          <Icon name='cog' />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to='/users/me/settings' onClick={onClose}>
          Abacash
          <Icon name='money' />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to='/users/me/settings' onClick={onClose}>
          Møteinnkallinger
          <Icon name='calendar' />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <a onClick={() => (logout(), onClose())}>
          Logg ut
          <Icon name='sign-out' />
        </a>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    notificationsOpen: false
  };

  render() {
    const { loggedIn } = this.props;

    return (
      <header className={styles.header}>
        <FancyNodesCanvas height={96} />
        <div className={styles.content}>
          <IndexLink to='/' className={styles.logo}>
            <img src={logoImage} role='presentation' />
          </IndexLink>

          <div className={styles.navigation}>
            <Link to='/events' activeClassName={styles.activeItem}>Arrangementer</Link>
            <Link to='/career' activeClassName={styles.activeItem}>Karriere</Link>
            <Link
              to='/readme'
              activeClassName={styles.activeItem}
              className={styles.readmeLink}
            >
              readme
            </Link>
            <Link to='/quotes' activeClassName={styles.activeItem}>Sitater</Link>
          </div>

          <div className={styles.buttonGroup}>
            {loggedIn && (
              <Dropdown
                iconName='bell'
                show={this.state.notificationsOpen}
                toggle={() => this.setState({ notificationsOpen: !this.state.notificationsOpen })}
                triggerComponent={(
                  <Icon.Badge name='bell' badgeCount={1} />
                )}
              >
                <div style={{ padding: 15 }}>
                  <h2>Ingen nye varslinger</h2>
                </div>
              </Dropdown>
            )}

            {loggedIn && (
              <Dropdown
                show={this.state.accountOpen}
                toggle={() => this.setState({ accountOpen: !this.state.accountOpen })}
                triggerComponent={(
                  <ProfilePicture
                    size={24}
                    user={this.props.currentUser}
                    style={{ verticalAlign: 'middle', marginTop: -8 }}
                  />
                )}
              >
                <AccountDropdownItems
                  onClose={() => this.setState({ accountOpen: false })}
                  username={this.props.currentUser.username}
                  logout={this.props.logout}
                />
              </Dropdown>
            )}

            <button
              onClick={this.props.toggleSearch}
            >
              <Icon name='search' style={{ color: '#C24538' }} />
            </button>
          </div>

          <Modal
            show={this.props.searchOpen}
            onHide={this.props.toggleSearch}
            backdropClassName={styles.backdrop}
            backdrop
          >
            <Search
              isOpen={this.props.searchOpen}
              onCloseSearch={this.props.toggleSearch}
            />
          </Modal>
        </div>
      </header>
    );
  }
}
