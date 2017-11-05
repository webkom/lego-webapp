//@flow
import React, { type Node } from 'react';
import cx from 'classnames';
import styles from './SideButton.css';

type Props = {
  onClick: () => void,
  icon: string,
  children?: Node,
  active: boolean
};

const SideButton = ({ children, icon, active, onClick }: Props) => (
  <span
    className={cx(styles.sideButton, active && styles.active)}
    onMouseDown={(e: SyntheticMouseEvent<*>) => {
      e.preventDefault();
      onClick();
    }}
  >
    <i className={`fa fa-${icon}`} />
    {children}
  </span>
);

export default SideButton;
