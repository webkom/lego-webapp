import { Icon, LoadingIndicator, Image } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { Menu, CircleUser, LogOut, Settings, Users } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Modal } from 'react-overlays';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchAll as fetchMeetings } from 'app/actions/MeetingActions';
import { toggleSearch } from 'app/actions/SearchActions';
import { logout } from 'app/actions/UserActions';
import logoLightMode from 'app/assets/logo-dark.png';
import logoDarkMode from 'app/assets/logo.png';
import AuthSection from 'app/components/AuthSection/AuthSection';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectUpcomingMeetingId } from 'app/reducers/meetings';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import utilStyles from 'app/styles/utilities.css';
import { applySelectedTheme, getOSTheme, getTheme } from 'app/utils/themeUtils';
import Dropdown from '../Dropdown';
import NotificationsDropdown from '../HeaderNotifications';
import { ProfilePicture } from '../Image';
import Search from '../Search';
import FancyNodesCanvas from './FancyNodesCanvas';
import styles from './Header.module.css';
import Navbar from './Navbar/Navbar';
import ToggleTheme from './ToggleTheme';

type AccountDropdownItemsProps = {
  onClose: () => void;
};
const AccountDropdownItems = ({ onClose }: AccountDropdownItemsProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const username = useCurrentUser()?.username;

  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <NavLink to="/users/me" onClick={onClose}>
          <strong>{username}</strong>
          <Icon iconNode={<CircleUser />} />
        </NavLink>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <Link to="/users/me/settings/profile" onClick={onClose}>
          Innstillinger
          <Icon iconNode={<Settings />} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link to="/meetings/" onClick={onClose}>
          Møteinnkallinger
          <Icon iconNode={<Users />} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.Divider />
      <Dropdown.ListItem>
        <ToggleTheme className={styles.themeChange} isButton={false}>
          Endre tema
        </ToggleTheme>
      </Dropdown.ListItem>

      <Dropdown.Divider />

      <Dropdown.ListItem danger>
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/');
            onClose();
          }}
        >
          Logg ut
          <Icon iconNode={<LogOut />} />
        </button>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
};

const UpcomingMeetingButton = () => {
  const upcomingMeetingId = useAppSelector(selectUpcomingMeetingId);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUpcomingMeeting',
    () =>
      dispatch(
        fetchMeetings({
          query: {
            date_after: moment().format('YYYY-MM-DD'),
          },
        }),
      ),
    [],
  );

  if (!upcomingMeetingId) return;

  return (
    <button
      type="button"
      onClick={() => {
        navigate(`/meetings/${upcomingMeetingId}`);
      }}
    >
      <Icon iconNode={<Users />} />
    </button>
  );
};

const HeaderLogo = () => {
  const loading = useAppSelector((state) => state.frontpage.fetching);
  return (
    <Link to="/">
      <LoadingIndicator loading={loading}>
        <div className={styles.logo}>
          <Image
            src={logoLightMode}
            className={styles.logoLightMode}
            alt="Abakus sin logo"
          />
          <Image
            src={logoDarkMode}
            className={styles.logoDarkMode}
            alt="Abakus sin logo"
          />
        </div>
      </LoadingIndicator>
    </Link>
  );
};

const AccountDropdown = () => {
  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();
  const [accountOpen, setAccountOpen] = useState(false);

  return loggedIn ? (
    <Dropdown
      show={accountOpen}
      toggle={() => setAccountOpen(!accountOpen)}
      triggerComponent={
        currentUser ? (
          <ProfilePicture size={24} user={currentUser} />
        ) : (
          <Icon iconNode={<CircleUser />} />
        )
      }
    >
      <AccountDropdownItems onClose={() => setAccountOpen(false)} />
    </Dropdown>
  ) : (
    <Dropdown
      show={accountOpen}
      toggle={() => setAccountOpen(!accountOpen)}
      contentClassName={styles.dropdown}
      triggerComponent={<Icon iconNode={<CircleUser />} />}
    >
      <AuthSection />
    </Dropdown>
  );
};

const SearchModal = () => {
  const dispatch = useAppDispatch();
  const searchOpen = useAppSelector((state) => state.search.open);
  return (
    <Modal
      show={searchOpen}
      onHide={() => dispatch(toggleSearch())}
      renderBackdrop={(props) => <div {...props} className={styles.backdrop} />}
      className={styles.modal}
    >
      <Search />
    </Modal>
  );
};

const Header = () => {
  const dispatch = useAppDispatch();
  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();

  useEffect(() => {
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
  }, [loggedIn, currentUser]);

  return (
    <header>
      <FancyNodesCanvas height={300} />
      <div className={styles.content}>
        <HeaderLogo />

        <div className={styles.menu}>
          <Navbar />
          <div className={styles.buttonGroup}>
            <ToggleTheme
              className={cx(loggedIn && utilStyles.hiddenOnMobile)}
            />

            {loggedIn && <NotificationsDropdown />}
            {loggedIn && <UpcomingMeetingButton />}

            <AccountDropdown />

            <button onClick={() => dispatch(toggleSearch())}>
              <Icon iconNode={<Menu />} data-test-id="search-menu-icon" />
            </button>
          </div>
        </div>

        <SearchModal />
      </div>
    </header>
  );
};

export default Header;
