import React from 'react';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Tooltip.css';

export type Props = {
  isActive: boolean,
  type: string,
  icon: string,
  onClick: (e) => 'string'
};

export default (props: Props) => (
  <span
    className={cx(
      styles.tooltipButton,
      props.isActive && styles.activeTooltipButton
    )}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
      props.onClick(props.type);
    }}
  >
    <Icon name={props.icon} />
  </span>
  );
