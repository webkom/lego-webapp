import styles from './Pill.module.css';
import type { HTMLAttributes } from 'react';

type Props = {
  /** background color of pill */
  color?: string;
} & HTMLAttributes<HTMLSpanElement>;

/**
 * Basic `Pill` component to wrap extra content inside
 */
function Pill({ color, style, ...props }: Props) {
  return (
    <span
      className={styles.pill}
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    />
  );
}

export default Pill;
