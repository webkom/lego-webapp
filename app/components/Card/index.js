// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Card.css';

type Props = {
  /** Children compontents */
  children?: any,
  /** Dark background  */
  dark?: boolean,
  /** Small */
  tight?: boolean,
  /** Shadow */
  shadow?: boolean
};

function Card({
  children,
  dark = false,
  tight = false,
  shadow = true,
  ...htmlAttributes
}: Props) {
  return (
    <div
      className={cx(
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
