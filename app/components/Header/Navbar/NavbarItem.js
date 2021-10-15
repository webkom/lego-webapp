// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import styles from '../Header.css';
import { NavLink } from 'react-router-dom';

type Props = {
  onMouseEnter: (number) => void,
  title: any,
  destination: string,
  index: number,
  children: Node,
};

export default class NavbarItem extends Component<Props> {
  onMouseEnter = () => {
    this.props.onMouseEnter(this.props.index);
  };

  render() {
    const { title, destination, children } = this.props;
    return (
      <div
        className={styles.navbarItemEl}
        onMouseEnter={this.onMouseEnter}
        onFocus={this.onMouseEnter}
      >
        <NavLink
          className={styles.navbarItemTitle}
          activeClassName={styles.activeNavbarItemTitle}
          to={destination}
        >
          {title}
        </NavLink>
        <div className={styles.dropdownSlot}>{children}</div>
      </div>
    );
  }
}
