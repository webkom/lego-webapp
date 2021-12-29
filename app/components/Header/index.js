// @flow

import { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Modal } from 'react-overlays';
import { Flipper } from 'react-flip-toolkit';
import Icon from '../Icon';
import Search from '../Search';
import { ProfilePicture, Image } from '../Image';
import logoLightMode from 'app/assets/logo-dark.png';
import logoDarkMode from 'app/assets/logo.png';
import LoadingIndicator from 'app/components/LoadingIndicator';
import FancyNodesCanvas from './FancyNodesCanvas';

import styles from './Header.css';
import Navbar from './Navbar';
import NavbarItem from './Navbar/NavbarItem';
import DropdownContainer from './DropdownContainer';
import EventsDropdown from './DropdownContents/EventsDropdown';
import InfoDropdown from './DropdownContents/InfoDropdown';
import NotificationsDropdown from './DropdownContents/NotificationsDropdown';
import ProfileDropdown from './DropdownContents/ProfileDropdown';
import LoginDropdown from './DropdownContents/LoginDropdown';

import { applySelectedTheme, getOSTheme, getTheme } from 'app/utils/themeUtils';
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
  markAllNotifications: () => Promise<void>,
  fetchNotificationData: () => Promise<void>,
  upcomingMeeting: string,
  loading: boolean,
};

type State = {
  mode: 'login' | 'register' | 'forgotPassword',
  activeIndices: Array<number>,
  animatingOut: boolean,
};

class Header extends Component<Props, State> {
  state = {
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

  animatingOutTimeout: ?TimeoutID;

  // onMouseLeave does not pass an input into resetDropdownState
  resetDropdownState = (i?: number) => {
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
        title: 'Om Abakus',
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
          <Icon.Badge name="notifications" size={25} badgeCount={unreadCount} />
        ),
        to: '/timeline',
      },
      /*{
        dropdown: <MeetingButton />,
        key: 'meetings',
        show: loggedIn && this.props.upcomingMeeting,
        title: <Icon name="calendar" className={styles.meetingIcon} />,
        to: `/meetings/${this.props.upcomingMeeting}`,
      },*/
      {
        dropdown: (
          <ProfileDropdown
            username={this.props.currentUser.username}
            logout={this.props.logout}
          />
        ),
        key: 'profile',
        show: loggedIn,
        title: <ProfilePicture size={25} alt="user" user={currentUser} />,
        to: '/users/me',
      },
      {
        dropdown: <LoginDropdown />,
        key: 'login',
        show: !loggedIn,
        title: <Icon name="contact" size={25} />,
        to: '/',
      },
    ];

    let CurrentDropdown, PrevDropdown, direction;

    const currentIndex =
      this.state.activeIndices[this.state.activeIndices.length - 1];
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
                  alt="Abakus"
                />
                <Image
                  src={logoDarkMode}
                  className={styles.logoDarkMode}
                  alt="Abakus"
                />
              </div>
            </LoadingIndicator>
          </Link>

          <div className={styles.menu}>
            <div className={styles.navigation}>
              {loggedIn ? (
                <NavLink
                  className={styles.navbarItemTitle}
                  activeClassName={styles.activeNavbarItemTitle}
                  to={'/joblistings'}
                >
                  Karriere
                </NavLink>
              ) : (
                <NavLink
                  className={styles.navbarItemTitle}
                  activeClassName={styles.activeNavbarItemTitle}
                  to="/pages/bedrifter/for-bedrifter"
                >
                  For bedrifter
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
