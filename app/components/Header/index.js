// @flow

import { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Modal } from 'react-overlays';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import { ProfilePicture, Image } from '../Image';
import FancyNodesCanvas from './FancyNodesCanvas';
import NotificationsDropdown from '../HeaderNotifications';
import Button from '../Button';
import styles from './Header.css';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from 'app/components/LoginForm';
import { Flex } from 'app/components/Layout';
import cx from 'classnames';
import { applySelectedTheme, getOSTheme, getTheme } from 'app/utils/themeUtils';

import type { UserEntity } from 'app/reducers/users';
import logoLightMode from 'app/assets/logo-dark.png';
import logoDarkMode from 'app/assets/logo.png';
import LoadingIndicator from 'app/components/LoadingIndicator';

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
  markAllNotifications: () => Promise<void>,
  fetchNotificationData: () => Promise<void>,
  upcomingMeeting: string,
  loading: boolean,
};

type State = {
  accountOpen: boolean,
  shake: boolean,
  mode: 'login' | 'register' | 'forgotPassword',
};

type AccountDropdownItemsProps = {
  logout: () => void,
  onClose: () => void,
  username: string,
};

function AccountDropdownItems({
  logout,
  onClose,
  username,
}: AccountDropdownItemsProps) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <NavLink
          to="/users/me"
          onClick={onClose}
          style={{ color: 'var(--lego-color-gray)' }}
        >
          <strong>{username}</strong>
          <Icon name="contact" size={24} />
        </NavLink>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to="/users/me/settings/profile" onClick={onClose}>
          Innstillinger
          <Icon name="cog" size={24} />
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
        <Button
          flat
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Logg ut
          <Icon name="log-out" size={24} />
        </Button>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

class Header extends Component<Props, State> {
  state = {
    accountOpen: false,
    shake: false,
    mode: 'login',
  };

  toggleRegisterUser = (e: Event) => {
    this.setState({ mode: 'register' });
    e.stopPropagation();
  };

  toggleForgotPassword = (e: Event) => {
    this.setState({ mode: 'forgotPassword' });
    e.stopPropagation();
  };

  toggleBack = (e: Event) => {
    this.setState({ mode: 'login' });
    e.stopPropagation();
  };

  render() {
    const { loggedIn, currentUser, loading } = this.props;
    const isLogin = this.state.mode === 'login';
    let title, form;

    if (
      __CLIENT__ &&
      loggedIn &&
      currentUser &&
      (currentUser.selectedTheme === 'auto'
        ? getTheme() !== getOSTheme()
        : getTheme() !== currentUser.selectedTheme)
    ) {
      applySelectedTheme(currentUser.selectedTheme || 'light');
    }

    switch (this.state.mode) {
      case 'login':
        title = 'Logg inn';
        form = <LoginForm />;
        break;
      case 'register':
        title = 'Register';
        form = <RegisterForm />;
        break;
      case 'forgotPassword':
        title = 'Glemt passord';
        form = <ForgotPasswordForm />;
        break;
      default:
        break;
    }

    const MeetingButton = withRouter(({ history }) => (
      <button
        type="button"
        onClick={() => {
          history.push(`/meetings/${this.props.upcomingMeeting}`);
        }}
      >
        <Icon name="calendar" className={styles.meetingIcon} />
      </button>
    ));

    return (
      <header className={styles.header}>
        {/* <FancyNodesCanvas height={300} /> */}
        <div className={styles.content}>
          <Link to="/">
            <LoadingIndicator loading={loading}>
              <div className={styles.logo}>
                <Image
                  src={logoLightMode}
                  className={styles.logoLightMode}
                  alt=""
                />
                <Image
                  src={logoDarkMode}
                  className={styles.logoDarkMode}
                  alt=""
                />
              </div>
            </LoadingIndicator>
          </Link>

          <div className={styles.menu}>
            <div className={styles.navigation}>
              <NavLink to="/events" activeClassName={styles.activeItem}>
                Arrangementer
              </NavLink>
              {!loggedIn ? (
                <NavLink
                  to="/pages/bedrifter/for-bedrifter"
                  activeClassName={styles.activeItem}
                >
                  For bedrifter
                </NavLink>
              ) : (
                <NavLink to="/joblistings" activeClassName={styles.activeItem}>
                  Karriere
                </NavLink>
              )}
              <NavLink
                to="/pages/info-om-abakus"
                activeClassName={styles.activeItem}
              >
                Om Abakus
              </NavLink>
            </div>

            <div className={styles.buttonGroup}>
              {loggedIn && (
                <NotificationsDropdown
                  notificationsData={this.props.notificationsData}
                  fetchNotifications={this.props.fetchNotifications}
                  notifications={this.props.notifications}
                  markAllNotifications={this.props.markAllNotifications}
                  fetchNotificationData={this.props.fetchNotificationData}
                />
              )}

              {loggedIn && this.props.upcomingMeeting && <MeetingButton />}

              {loggedIn && (
                <Dropdown
                  show={this.state.accountOpen}
                  toggle={() =>
                    this.setState((state) => ({
                      accountOpen: !state.accountOpen,
                    }))
                  }
                  triggerComponent={
                    <ProfilePicture
                      size={30}
                      alt="user"
                      user={this.props.currentUser}
                      style={{ verticalAlign: 'middle' }}
                    />
                  }
                >
                  <AccountDropdownItems
                    onClose={() => {}}
                    username={this.props.currentUser.username}
                    logout={this.props.logout}
                  />
                </Dropdown>
              )}

              {!loggedIn && (
                <Dropdown
                  show={this.state.accountOpen}
                  toggle={() =>
                    this.setState((state) => ({
                      accountOpen: !state.accountOpen,
                      shake: false,
                    }))
                  }
                  contentClassName={cx(
                    this.state.shake ? 'animated shake' : '',
                    styles.dropdown
                  )}
                  triggerComponent={<Icon name="contact" size={30} />}
                >
                  <div style={{ padding: 10 }}>
                    <Flex
                      component="h2"
                      justifyContent="space-between"
                      allignItems="center"
                      className="u-mb"
                      style={{ whitespace: 'nowrap' }}
                    >
                      {title}
                      {isLogin && (
                        <div>
                          <button
                            onClick={this.toggleForgotPassword}
                            className={styles.toggleButton}
                          >
                            Glemt passord
                          </button>
                          <span className={styles.toggleButton}>&bull;</span>
                          <button
                            onClick={this.toggleRegisterUser}
                            className={styles.toggleButton}
                          >
                            Jeg er ny
                          </button>
                        </div>
                      )}

                      {!isLogin && (
                        <button
                          onClick={this.toggleBack}
                          className={styles.toggleButton}
                        >
                          Tilbake
                        </button>
                      )}
                    </Flex>
                    {form}
                  </div>
                </Dropdown>
              )}

              <button onClick={this.props.toggleSearch}>
                <Icon name="menu" size={30} className={styles.searchIcon} />
              </button>
            </div>
          </div>

          <Modal
            show={this.props.searchOpen}
            onHide={this.props.toggleSearch}
            backdropClassName={styles.backdrop}
            backdrop
            autoFocus={false}
          >
            <Search
              loggedIn={loggedIn}
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
