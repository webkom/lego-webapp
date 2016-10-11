// @flow

import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type: string,
  className: string
};

function TextInput({ type = 'text', className, ...props }: Props) {
  return (
    <input
      type={type}
      className={cx(styles.input, className)}
      {...props}
    />
  );
}

TextInput.Field = createField(TextInput);
export default TextInput;
