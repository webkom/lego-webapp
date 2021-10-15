// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import styles from '../Header.css';

type Props = {
  children: Node,
  onMouseLeave: () => void,
};

class Navbar extends Component<Props> {
  render() {
    const { children, onMouseLeave } = this.props;
    return (
      <div className={styles.navbarEl} onMouseLeave={onMouseLeave}>
        <div className={styles.navbarList}>{children}</div>
      </div>
    );
  }
}

export default Navbar;
