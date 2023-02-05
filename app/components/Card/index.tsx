import cx from 'classnames';
import styles from './Card.css';
import type { HTMLAttributes } from 'react';

type Props = {
  className?: string;

  /** Small */
  tight?: boolean;

  /** Shadow */
  shadow?: boolean;

  /** Hidden overflow */
  overflow?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  tight = false,
  shadow = true,
  overflow = false,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        className,
        styles.card,
        tight && styles.tight,
        shadow && styles.shadow
      )}
      style={{
        overflow: overflow && 'hidden',
      }}
      {...htmlAttributes}
    >
      {children}
    </div>
  );
}

export default Card;
