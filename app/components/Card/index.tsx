import cx from 'classnames';
import styles from './Card.css';
import type { HTMLAttributes } from 'react';

type Props = {
  className?: string;
  tight?: boolean;
  shadow?: boolean;
  hideOverflow?: boolean;
  isHoverable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  tight = false,
  shadow = true,
  hideOverflow = false,
  isHoverable = false,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        className,
        styles.card,
        tight && styles.tight,
        shadow && styles.shadow,
        isHoverable && styles.isHoverable
      )}
      style={{
        overflow: hideOverflow ? 'hidden' : 'initial',
      }}
      {...htmlAttributes}
    >
      {children}
    </div>
  );
}

export default Card;
