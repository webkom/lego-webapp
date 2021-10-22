// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import styles from '../Header.css';
import { NavLink } from 'react-router-dom';

type Props = {
  onMouseEnter: (number) => void,
  onMouseLeave: () => void,
  title: any,
  to: string,
  index: number,
  children: Node,
};

export default class NavbarItem extends Component<Props> {
  onMouseEnter = () => {
    this.props.onMouseEnter(this.props.index);
  };

  render() {
    const { title, to, children } = this.props;
    return (
      <div
        className={styles.navbarItemEl}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onFocus={this.onMouseEnter}
      >
        <NavLink
          className={styles.navbarItemTitle}
          activeClassName={styles.activeNavbarItemTitle}
          to={to}
        >
          {title}
        </NavLink>
        <div className={styles.dropdownSlot}>{children}</div>
      </div>
    );
  }
}
