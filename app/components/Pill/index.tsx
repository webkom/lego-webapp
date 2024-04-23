import cx from 'classnames';
import styles from './Pill.css';
import type { HTMLAttributes } from 'react';

type Props = {
  /** background color of pill */
  color?: string;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Basic `Pill` component to wrap extra content inside
 */
function Pill({ color, style, className, ...props }: Props) {
  return (
    <span
      className={cx(styles.pill, className)}
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    />
  );
}

export default Pill;
