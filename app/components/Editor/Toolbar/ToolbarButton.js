import React from 'react';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

export default props => (
  <span
    className={cx(
      styles.toolbarButton,
      styles.toolbarButtonActive && props.active
    )}
    onMouseDown={e => {
      e.preventDefault();
      e.stopPropagation();
      props.onClick();
    }}
  >
    <Icon name={props.icon} />
  </span>
);
