import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Modal } from 'react-overlays';
import { Link, NavLink, useHistory } from 'react-router-dom';
import logoLightMode from 'app/assets/logo-dark.png';
import logoDarkMode from 'app/assets/logo.png';
import AuthSection from 'app/components/AuthSection/AuthSection';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { UserEntity } from 'app/reducers/users';
import type { ID } from 'app/store/models';
import utilStyles from 'app/styles/utilities.css';
import { applySelectedTheme, getOSTheme, getTheme } from 'app/utils/themeUtils';
import Dropdown from '../Dropdown';
import NotificationsDropdown from '../HeaderNotifications';
import Icon from '../Icon';
import { ProfilePicture, Image } from '../Image';
import Search from '../Search';
import FancyNodesCanvas from './FancyNodesCanvas';
import styles from './Header.css';
import ToggleTheme from './ToggleTheme';

type Props = {
  searchOpen: boolean;
  toggleSearch: () => any;
  currentUser: UserEntity;
  loggedIn: boolean;
  login: () => Promise<any>;
  logout: () => void;
  notificationsData: Record<string, any>;
  fetchNotifications: () => void;
  notifications: Array<Record<string, any>>;
  markAllNotifications: () => Promise<void>;
  fetchNotificationData: () => Promise<void>;
  upcomingMeeting: string;
  loading: boolean;
  updateUserTheme: (username: string, theme: string) => Promise<void>;
};

type AccountDropdownItemsProps = {
  logout: () => void;
  onClose: () => void;
  username: string;
  updateUserTheme: (username: string, theme: string) => Promise<void>;
};

function AccountDropdownItems({
  logout,
  onClose,
  username,
  updateUserTheme,
}: AccountDropdownItemsProps) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <NavLink to="/users/me" onClick={onClose}>
          <strong>{username}</strong>
          <Icon name="person-circle-outline" size={24} />
        </NavLink>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to="/users/me/settings/profile" onClick={onClose}>
          Innstillinger
          <Icon name="settings-outline" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to="/meetings/" onClick={onClose}>
          Møteinnkallinger
          <Icon name="people-outline" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <ToggleTheme
          loggedIn={true}
          updateUserTheme={updateUserTheme}
          username={username}
          className={styles.themeChange}
          isButton={false}
        >
          Endre tema
        </ToggleTheme>
      </Dropdown.ListItem>

      <Dropdown.Divider />

      <Dropdown.ListItem danger>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Logg ut
          <Icon name="log-out-outline" size={24} />
        </button>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

const MeetingButton = ({ upcomingMeeting }: { upcomingMeeting: ID }) => {
  const history = useHistory();
  return (
    <button
      type="button"
      onClick={() => {
        history.push(`/meetings/${upcomingMeeting}`);
      }}
    >
      <Icon name="people" />
    </button>
  );
};

const Header = ({ loggedIn, currentUser, loading, ...props }: Props) => {
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (
      __CLIENT__ &&
      loggedIn &&
      (currentUser?.selectedTheme === 'auto'
        ? getTheme() !== getOSTheme()
        : getTheme() !== currentUser.selectedTheme)
    ) {
      applySelectedTheme(currentUser.selectedTheme || 'light');
    }
  }, [loggedIn, currentUser]);

  return (
    <header>
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
            <ToggleTheme
              loggedIn={loggedIn}
              updateUserTheme={props.updateUserTheme}
              username={currentUser?.username}
              className={cx(loggedIn && utilStyles.hiddenOnMobile)}
            />

            {loggedIn && (
              <NotificationsDropdown
                notificationsData={props.notificationsData}
                fetchNotifications={props.fetchNotifications}
                notifications={props.notifications}
                markAllNotifications={props.markAllNotifications}
                fetchNotificationData={props.fetchNotificationData}
              />
            )}

            {loggedIn && props.upcomingMeeting && (
              <MeetingButton upcomingMeeting={props.upcomingMeeting} />
            )}

            {loggedIn && (
              <Dropdown
                show={accountOpen}
                toggle={() => setAccountOpen(!accountOpen)}
                triggerComponent={
                  <ProfilePicture
                    size={24}
                    alt="user"
                    user={currentUser}
                    style={{
                      verticalAlign: 'middle',
                    }}
                  />
                }
              >
                <AccountDropdownItems
                  onClose={() => setAccountOpen(false)}
                  username={currentUser.username}
                  logout={props.logout}
                  updateUserTheme={props.updateUserTheme}
                />
              </Dropdown>
            )}

            {!loggedIn && (
              <Dropdown
                show={accountOpen}
                toggle={() => setAccountOpen(!accountOpen)}
                closeOnContentClick
                contentClassName={styles.dropdown}
                triggerComponent={<Icon name="person-circle-outline" />}
              >
                <AuthSection />
              </Dropdown>
            )}

            <button onClick={props.toggleSearch}>
              <Icon name="menu" className={styles.searchIcon} />
            </button>
          </div>
        </div>

        <Modal
          show={props.searchOpen}
          onHide={props.toggleSearch}
          renderBackdrop={(props) => (
            <div {...props} className={styles.backdrop} />
          )}
          className={styles.modal}
        >
          <Search
            loggedIn={loggedIn}
            onCloseSearch={props.toggleSearch}
            updateUserTheme={props.updateUserTheme}
            username={currentUser?.username}
          />
        </Modal>
      </div>
    </header>
  );
};

export default Header;
