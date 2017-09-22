import React from 'react';
import cx from 'classnames';
import styles from './Tooltip.css';

export type Props = {
  isActive: boolean,
  type: string,
  icon: string,
  onClick: e => 'string'
};

export default (props: Props) => (
  <span
    className={cx(styles.tooltipButton, props.isActive && styles.activeTooltipButton)}
    onMouseDown={e => {
      e.stopPropagation();
      e.preventDefault();
      props.onClick(props.type);
    }}
  >
    <span className={`icon-${props.icon}`} />
  </span>
);
