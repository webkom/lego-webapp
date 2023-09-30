import Dropdown from 'app/components/Dropdown';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.css';
import { ReactElement, useState } from 'react';
import EventsDropdown from './EventsDropwdown';
import CareerDropdown from './CareerDropdown';
import AboutDropdown from './AboutDropdown';

type Props = {
  loggedIn: boolean;
};

type NavbarLink = {
  title: string;
  to: string;
  visibility: 'logged-in-only' | 'logged-out-only' | 'always';
  dropdown?: ReactElement;
};

const Navbar = ({ loggedIn }: Props) => {
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(0);

  const links: NavbarLink[] = [
    {
      title: 'For bedrifter',
      to: '/pages/bedrifter/for-bedrifter',
      visibility: 'logged-out-only',
    },
    {
      title: 'Arrangementer',
      to: '/events',
      dropdown: <EventsDropdown />,
      visibility: 'always',
    },
    {
      title: 'Karriere',
      to: '/joblistings',
      dropdown: <CareerDropdown />,
      visibility: 'logged-in-only',
    },
    {
      title: 'Om Abakus',
      to: '/pages/info-om-abakus',
      dropdown: <AboutDropdown />,
      visibility: 'always',
    },
  ];

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
            to={link.to}
            activeClassName={styles.activeItem}
            onMouseEnter={() => setHoverIndex(i)}
          >
            {link.title}
          </NavLink>
        );

        if (link.dropdown == null) return navLinkItem;

        return (
          <Dropdown
            show={visibleDropdown && hoverIndex == i}
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
