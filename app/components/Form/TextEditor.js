// @flow

import React from 'react';
import cx from 'classnames';
import styles from './TextEditor.css';

type Props = {
  className: string
};

function TextInput({ className, ...props }: Props) {
  return (
    <textarea
      className={cx(styles.input, className)}
      {...props}
    />
  );
}

export default TextInput;
