// @flow

import React from 'react';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  suffix?: string,
  className?: string,
  inputRef?: any,
  disabled?: boolean,
  readOnly?: boolean
};

function TextInput({
  type = 'text',
  className,
  disabled,
  inputRef,
  suffix,
  readOnly,
  ...props
}: Props) {
  return (
    <span className={cx(suffix && styles.inputGroup)}>
      <input
        ref={inputRef}
        type={type}
        disabled={disabled}
        className={cx(
          styles.input,
          disabled && styles.disabled,
          suffix && styles.suffix,
          className
        )}
        {...props}
      />
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  );
}

TextInput.Field = createField(TextInput);
export default TextInput;
