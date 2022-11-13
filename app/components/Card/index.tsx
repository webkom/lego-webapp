import cx from 'classnames';
import styles from './Card.css';
import type { HTMLAttributes } from 'react';

type Props = {
  className?: string;

  /** Dark background  */
  dark?: boolean;

  /** Small */
  tight?: boolean;

  /** Shadow */
  shadow?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Card({
  children,
  className,
  dark = false,
  tight = false,
  shadow = true,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
        className,
        styles.card,
        dark && styles.dark,
        tight && styles.tight,
        shadow && styles.shadow
      )}
      {...htmlAttributes}
    >
      {children}
    </div>
  );
}

export default Card;
