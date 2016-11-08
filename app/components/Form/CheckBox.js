// @flow

import React from 'react';
import { createField } from './Field';
import './CheckBox.css';

type Props = {
  type?: string,
  label?: string,
  className?: string
};

function CheckBox({ label, className, ...props }: Props) {
  return (
    <div className={className}>
      <input
        type='checkbox'
        id={label}
        {...props}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
