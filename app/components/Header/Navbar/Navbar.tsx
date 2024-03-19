import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Dropdown from 'app/components/Dropdown';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { useAppSelector } from 'app/store/hooks';
import AboutDropdown from './AboutDropdown';
import CareerDropdown from './CareerDropdown';
import EventsDropdown from './EventsDropwdown';
import styles from './Navbar.css';
import type { ReactElement } from 'react';

type NavbarLink = {
  title: string;
  to: string;
  visibility: 'logged-in-only' | 'logged-out-only' | 'always';
  dropdown?: ReactElement;
};

const Navbar = () => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);

  const links: NavbarLink[] = [
    {
      title: 'For bedrifter',
      to: '/pages/bedrifter/for-bedrifter',
      visibility: 'logged-out-only',
    },
    {
      title: 'Orgier',
      to: '/events',
      dropdown: <EventsDropdown />,
      visibility: 'always',
    },
    {
      title: 'Castinger',
      to: '/joblistings',
      dropdown: <CareerDropdown />,
      visibility: 'logged-in-only',
    },
    {
      title: 'Om Abahub',
      to: '/pages/info-om-abakus',
      dropdown: <AboutDropdown />,
      visibility: 'always',
    },
  ];

  const focusLinkAtIndex = (index: number) => {
    setHoverIndex(index);
    setVisibleDropdown(true);
  };

  return (
    <div
      className={styles.navigation}
      onMouseEnter={() => setVisibleDropdown(true)}
      onMouseLeave={() => setVisibleDropdown(false)}
    >
      {links.map((link, i) => {
        if (
          (link.visibility == 'logged-in-only' && !loggedIn) ||
          (link.visibility == 'logged-out-only' && loggedIn)
        )
          return;

        const navLinkItem = (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? styles.activeItem : '')}
            onMouseEnter={() => focusLinkAtIndex(i)}
          >
            {link.title}
          </NavLink>
        );

        if (link.dropdown === undefined) return navLinkItem;

        return (
          <Dropdown
            key={link.to}
            show={visibleDropdown && hoverIndex === i}
            toggle={() => setVisibleDropdown(false)}
            triggerComponent={navLinkItem}
            contentClassName={styles.navbarDropdown}
            closeOnContentClick={true}
          >
            {link.dropdown}
          </Dropdown>
        );
      })}
    </div>
  );
};

export default Navbar;
