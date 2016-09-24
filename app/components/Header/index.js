/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import ProfilePicture from '../ProfilePicture';
import FancyNodesCanvas from './FancyNodesCanvas';
import logoImage from 'app/assets/logo_dark.png';

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
          Min profil
          <Icon name='user' />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to='/users/me/settings' onClick={onClose}>
          Innstillinger
          <Icon name='cog' />
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
            <Link to='/events'>Arrangementer</Link>
            <Link to=''>Karriere</Link>
            <Link to=''>README</Link>
            <Link to='/quotes'>Sitater</Link>
          </div>

          <div className={styles.buttonGroup}>
            <Dropdown
              iconName='ios-bell'
              show={this.state.notificationsOpen}
              toggle={() => this.setState({ notificationsOpen: !this.state.notificationsOpen })}
              triggerComponent={(
                <Icon.Badge name='bell' badgeCount={1} />
              )}
            >
              <div style={{ padding: 15 }}>
                <h2>No Notifications</h2>
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
              <i className='ion-search' style={{ color: '#C24538' }} />
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
