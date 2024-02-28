import cx from 'classnames';
import styles from './Skeleton.module.css';
import type { CSSProperties } from 'react';

type Props = {
  array?: number;
  flicker?: boolean;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  className?: string;
};

export const Skeleton = ({
  array = 1,
  flicker = true,
  width,
  height,
  style,
  className,
}: Props) => {
  return (
    <>
      {Array.from({ length: array }).map((_, index) => (
        <div
          key={index}
          style={{
            width,
            height,
            ...style,
          }}
          className={cx(styles.skeleton, flicker && styles.flicker, className)}
        />
      ))}
    </>
  );
};
