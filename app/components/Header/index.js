// @flow

import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import logoImage from 'app/assets/logo-dark.png';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import LoginForm from '../LoginForm/LoginForm';
import ProfilePicture from '../ProfilePicture';
import FancyNodesCanvas from './FancyNodesCanvas';
import NotificationsDropdown from '../HeaderNotifications';
import styles from './Header.css';

import type { UserEntity } from 'app/reducers/users';

type Props = {
  searchOpen: boolean,
  toggleSearch: () => any,
  currentUser: UserEntity,
  loggedIn: boolean,
  login: () => Promise<*>,
  logout: () => void,
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => void,
  markNotification: string => void,
  fetchNotificationData: () => void
};

type State = {
  accountOpen: boolean,
  shake: boolean
};

function AccountDropdownItems({ logout, onClose, username }) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link to="/users/me" onClick={onClose} style={{ color: '#333' }}>
          <strong>
            {username}
          </strong>
          <Icon name="contact" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to="/users/me/settings" onClick={onClose}>
          Innstillinger
          <Icon name="cog" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to="/users/me/settings" onClick={onClose}>
          Abacash
          <Icon name="card" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to="/meetings/" onClick={onClose}>
          Møteinnkallinger
          <Icon name="calendar" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <a onClick={() => (logout(), onClose())}>
          Logg ut
          <Icon name="log-out" size={24} />
        </a>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    shake: false
  };

  render() {
    const { loggedIn } = this.props;

    return (
      <header className={styles.header}>
        <FancyNodesCanvas height={300} />
        <div className={styles.content}>
          <IndexLink to="/" className={styles.logo}>
            <img src={logoImage} alt="" />
          </IndexLink>

          <div className={styles.navigation}>
            <Link to="/events" activeClassName={styles.activeItem}>
              Arrangementer
            </Link>
            <Link to="/joblistings" activeClassName={styles.activeItem}>
              Karriere
            </Link>
            <a
              href="http://readme.abakus.no"
              activeClassName={styles.activeItem}
              className={styles.readmeLink}
            >
              readme
            </a>
            <Link to="/about" activeClassName={styles.activeItem}>
              Om Abakus
            </Link>
            <Link onClick={this.props.toggleSearch}>
              <Icon name="menu" scaleOnHover style={{ fontSize: 30 }} />
            </Link>
          </div>

          <div className={styles.buttonGroup}>
            {loggedIn &&
              <NotificationsDropdown
                notificationsData={this.props.notificationsData}
                fetchNotifications={this.props.fetchNotifications}
                notifications={this.props.notifications}
                markAllNotifications={this.props.markAllNotifications}
                markNotification={this.props.markNotification}
                fetchNotificationData={this.props.fetchNotificationData}
              />}

            {loggedIn &&
              <Dropdown
                show={this.state.accountOpen}
                toggle={() =>
                  this.setState({ accountOpen: !this.state.accountOpen })}
                triggerComponent={
                  <ProfilePicture
                    size={24}
                    user={this.props.currentUser}
                    style={{ verticalAlign: 'middle', marginTop: -8 }}
                  />
                }
              >
                <AccountDropdownItems
                  onClose={() => this.setState({ accountOpen: false })}
                  username={this.props.currentUser.username}
                  logout={this.props.logout}
                />
              </Dropdown>}

            {!loggedIn &&
              <Dropdown
                show={this.state.accountOpen}
                toggle={() =>
                  this.setState({
                    accountOpen: !this.state.accountOpen,
                    shake: false
                  })}
                contentClassName={this.state.shake && 'animated shake'}
                triggerComponent={<Icon name="contact" />}
              >
                <div style={{ padding: 10 }}>
                  <LoginForm
                    login={(...creds) => {
                      this.setState({ shake: false });
                      return this.props.login(...creds).then(
                        res => {
                          this.setState({ shake: false, accountOpen: false });
                          return res;
                        },
                        error => {
                          this.setState({ shake: true });
                          throw error;
                        }
                      );
                    }}
                  />
                </div>
              </Dropdown>}

            <button onClick={this.props.toggleSearch}>
              <Icon name="search" style={{ color: '#C24538' }} />
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
export default Header;
