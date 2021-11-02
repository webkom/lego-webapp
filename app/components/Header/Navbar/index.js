// @flow

import type { Node } from 'react';
import styles from '../Header.css';

type Props = {
  children: Node,
  onMouseLeave: () => void,
};

const Navbar = ({ children, onMouseLeave }: Props) => (
  <div className={styles.navbarEl} onMouseLeave={onMouseLeave}>
    <div className={styles.navbarList}>{children}</div>
  </div>
);

export default Navbar;
