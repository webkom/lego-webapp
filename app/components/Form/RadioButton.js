// @flow

import React from 'react';
import { createField } from './Field';
import styles from './RadioButton.css';

type Props = {
  type?: string,
  label?: string,
  className?: string,
  inputValue?: string,
  value?: string,
  checked?: boolean
};

function RadioButton({
  id,
  label,
  inputValue,
  value,
  checked,
  className,
  ...props
}: Props) {
  return (
    <div className={styles.box}>
      <input
        {...props}
        checked={inputValue === value || checked}
        type="radio"
        id={id}
        value={inputValue}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

RadioButton.Field = createField(RadioButton);
export default RadioButton;
