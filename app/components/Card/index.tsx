import React from 'react';
import cx from 'classnames';
import styles from './Card.css';

interface Props {
  className?: string;
  /** Children compontents */
  children?: any;
  /** Dark background  */
  dark?: boolean;
  /** Small */
  tight?: boolean;
  /** Shadow */
  shadow?: boolean;
}

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
