// @flow

import { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Modal } from 'react-overlays';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Search from '../Search';
import { ProfilePicture, Image } from '../Image';
import FancyNodesCanvas from './FancyNodesCanvas';
import styles from './Header.css';
import Navbar from './Navbar';
import NavbarItem from './Navbar/NavbarItem';
import { Flipper } from 'react-flip-toolkit';
import DropdownContainer from './DropdownContainer';
import EventsDropdown from './DropdownContents/EventsDropdown';
import InfoDropdown from './DropdownContents/InfoDropdown';
import NotificationsDropdown from './DropdownContents/NotificationsDropdown';
import ProfileDropdown from './DropdownContents/ProfileDropdown';
import LoginDropdown from './DropdownContents/LoginDropdown';
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
  currentUser: UserEntity,
};

type State = {
  shake: boolean,
  mode: 'login' | 'register' | 'forgotPassword',
  activeIndices: Array<number>,
  animatingOut: boolean,
};

class Header extends Component<Props, State> {
  animatingOutTimeout: ?TimeoutID;

  state = {
    shake: false,
    mode: 'login',
    activeIndices: [],
    animatingOut: false,
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

  resetDropdownState = (i: any) => {
    this.setState({
      activeIndices: typeof i === 'number' ? [i] : [],
      animatingOut: false,
    });
    delete this.animatingOutTimeout;
  };

  handleFetchNotifications = (i: number) => {
    this.props.fetchNotifications();
    this.onMouseEnter(i);
  };

  handleMarkAllNotifications = () => {
    console.log("mark")
    this.props.markAllNotifications();
  };

  onMouseEnter = (i: number) => {
    if (this.animatingOutTimeout) {
      clearTimeout(this.animatingOutTimeout);
      this.resetDropdownState(i);
      return;
    }
    if (this.state.activeIndices[this.state.activeIndices.length - 1] === i)
      return;

    this.setState((prevState) => ({
      activeIndices: prevState.activeIndices.concat(i),
      animatingOut: false,
    }));
  };

  onMouseLeave = () => {
    this.setState({
      animatingOut: true,
    });
    this.animatingOutTimeout = setTimeout(() => this.resetDropdownState(), 300);
  };

  render() {
    const { loggedIn, currentUser, loading, notificationsData } = this.props;
    const { unreadCount } = notificationsData;
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

    const navbarConfig = [
      {
        dropdown: <EventsDropdown />,
        key: 'events',
        show: true,
        title: 'Arrangementer',
        to: '/events',
      },
      {
        dropdown: <InfoDropdown />,
        key: 'info',
        show: true,
        title: 'Om abakus',
        to: '/pages/info-om-abakus',
      },
      {
        dropdown: (
          <NotificationsDropdown
            notificationsData={this.props.notificationsData}
            fetchNotifications={this.props.fetchNotifications}
            notifications={this.props.notifications}
            markAllNotifications={this.props.markAllNotifications}
          />
        ),
        key: 'notifications',
        onMouseEnter: this.handleFetchNotifications,
        onMouseLeave: this.handleMarkAllNotifications,
        show: loggedIn,
        title: (
          <Icon.Badge name="notifications" size={30} badgeCount={unreadCount} />
        ),
        to: '/timeline',
      },
      // {
      //   dropdown: <MeetingButton />,
      //   key: 'meetings',
      //   show: loggedIn && this.props.upcomingMeeting,
      //   title: <Icon name="calendar" className={styles.meetingIcon} />,
      //   to: `/meetings/${this.props.upcomingMeeting}`,
      // },
      {
        dropdown: <ProfileDropdown />,
        key: 'profile',
        show: loggedIn,
        title: <ProfilePicture size={30} alt="user" user={currentUser} />,
        to: '/users/me',
      },
      {
        dropdown: <LoginDropdown />,
        key: 'login',
        show: !loggedIn,
        title: <Icon name="contact" size={30} />,
        to: '/',
      },
    ];

    let CurrentDropdown, PrevDropdown, direction;

    const currentIndex = this.state.activeIndices[
      this.state.activeIndices.length - 1
    ];
    const prevIndex =
      this.state.activeIndices.length > 1 &&
      this.state.activeIndices[this.state.activeIndices.length - 2];

    if (typeof currentIndex === 'number')
      CurrentDropdown = navbarConfig[currentIndex].dropdown;
    if (typeof prevIndex === 'number') {
      PrevDropdown = navbarConfig[prevIndex].dropdown;
      direction = currentIndex > prevIndex ? 'right' : 'left';
    }

    return (
      <header className={styles.header}>
        <FancyNodesCanvas height={300} />
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
              {!loggedIn ? (
                <NavLink
                  to="/pages/bedrifter/for-bedrifter"
                  activeClassName={styles.activeNavbarItemTitle}
                >
                  For bedrifter
                </NavLink>
              ) : (
                <NavLink
                  className={styles.navbarItemTitle}
                  activeClassName={styles.activeNavbarItemTitle}
                  to={'/joblistings'}
                >
                  Karriere
                </NavLink>
              )}

              <Flipper flipKey={currentIndex} spring={'veryGentle'}>
                <Navbar onMouseLeave={this.onMouseLeave}>
                  {navbarConfig
                    .filter((n) => n.show)
                    .map((n, index) => {
                      return (
                        <NavbarItem
                          key={n.key}
                          title={n.title}
                          to={n.to}
                          index={index}
                          onMouseEnter={n.onMouseEnter || this.onMouseEnter}
                          onMouseLeave={n.onMouseLeave}
                        >
                          {currentIndex === index && (
                            <DropdownContainer
                              direction={direction}
                              animatingOut={this.state.animatingOut}
                            >
                              {CurrentDropdown}
                              {PrevDropdown}
                            </DropdownContainer>
                          )}
                        </NavbarItem>
                      );
                    })}
                </Navbar>
              </Flipper>
            </div>

            <div className={styles.buttonGroup}>
              {/* {loggedIn && this.props.upcomingMeeting && <MeetingButton />} */}

              {/* {loggedIn && (
                <Dropdown
                  show={this.state.accountOpen}
                  toggle={() =>
                    this.setState((state) => ({
                      accountOpen: !state.accountOpen,
                    }))
                  }
                  closeOnContentClick
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
              )} */}

              {!loggedIn && (
                <Dropdown
                  show={true} // this.state.accountOpen
                  toggle={() =>
                    this.setState((state) => ({
                      // accountOpen: !state.accountOpen,
                      shake: false,
                    }))
                  }
                  closeOnContentClick
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
            renderBackdrop={(props) => (
              <div {...props} className={styles.backdrop} />
            )}
            className={styles.modal}
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
