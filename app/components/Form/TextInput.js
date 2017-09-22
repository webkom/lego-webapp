// @flow

import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  className?: string,
  inputRef?: any,
  readOnly?: boolean
};

function TextInput({ type = 'text', className, inputRef, readOnly, ...props }: Props) {
  return (
    <input
      ref={inputRef}
      type={type}
      className={cx(styles.input, readOnly && styles.disabled, className)}
      {...props}
    />
  );
}

TextInput.Field = createField(TextInput);
export default TextInput;
