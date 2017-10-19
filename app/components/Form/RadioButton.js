// @flow

import React from 'react';
import { createField } from './Field';
import styles from './RadioButton.css';

type Props = {
  id: string,
  type?: string,
  label?: string,
  className?: string,
  inputValue?: string,
  value?: string
};

function RadioButton({
  id,
  label,
  inputValue,
  value,
  className,
  ...props
}: Props) {
  return (
    <div className={styles.box}>
      <input
        {...props}
        checked={inputValue === value}
        type="radio"
        id={id}
        value={inputValue}
      />
      <span>{label}</span>
    </div>
  );
}

RadioButton.Field = createField(RadioButton);
export default RadioButton;
