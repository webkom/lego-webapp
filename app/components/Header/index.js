/** @flow */


import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import ProfilePicture from '../ProfilePicture';
import FancyNodesCanvas from './FancyNodesCanvas';
import logoImage from 'app/assets/logo_dark.png';
import styles from './Header.css';

type Props = {
  searchOpen: boolean;
  toggleSearch: () => any;
};

type State = {
  accountOpen: boolean;
  notificationsOpen: boolean
};


function AccountDropdownItems({ logout, onClose }) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link to='/users/me' onClick={onClose}>
          <span style={{ color: '#333' }}>Logget inn som <strong>Hanse</strong></span>
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
    return (
      <header className={styles.header}>
        <FancyNodesCanvas height={96} />
        <div className={styles.content}>
          <IndexLink to='/' className={styles.logo}>
            <img src={logoImage} />
          </IndexLink>

          <div className={styles.navigation}>
            <Link to='/events' activeClassName={styles.activeItem}>Arrangementer</Link>
            <Link to='/career' activeClassName={styles.activeItem}>Karriere</Link>
            <Link to='/readme' activeClassName={styles.activeItem}>README</Link>
            <Link to='/quotes' activeClassName={styles.activeItem}>Sitater</Link>
          </div>

          <div className={styles.buttonGroup}>
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

            <Dropdown
              show={this.state.accountOpen}
              toggle={() => this.setState({ accountOpen: !this.state.accountOpen })}
              triggerComponent={(
                <ProfilePicture
                  size={24}
                  username='default'
                  style={{ verticalAlign: 'middle', marginTop: -8 }}
                />
              )}
            >
              <AccountDropdownItems
                onClose={() => this.setState({ accountOpen: false })}
              />
            </Dropdown>

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
