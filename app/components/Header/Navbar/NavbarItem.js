// @flow

import type { Node } from 'react';
import styles from '../Header.css';
import { NavLink } from 'react-router-dom';

type Props = {
  onMouseEnter: (number) => void,
  onMouseLeave: () => void,
  index: number,
  title: any,
  to: string,
  children: Node,
};

const NavbarItem = (props: Props) => (
  <div
    className={styles.navbarItemEl}
    onMouseEnter={() => props.onMouseEnter(props.index)}
    onMouseLeave={props.onMouseLeave}
    onFocus={() => props.onMouseEnter(props.index)}
  >
    <NavLink
      className={styles.navbarItemTitle}
      activeClassName={styles.activeNavbarItemTitle}
      to={props.to}
    >
      {props.title}
    </NavLink>
    <div className={styles.dropdownSlot}>{props.children}</div>
  </div>
);

export default NavbarItem;
