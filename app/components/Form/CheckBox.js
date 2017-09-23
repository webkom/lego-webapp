// @flow

import React from 'react';
import { Field } from 'redux-form';
import { createField } from './Field';
import styles from './CheckBox.css';
import cx from 'classnames';

type Props = {
  id: string,
  type?: string,
  label?: string,
  labelStyle?: string,
  value?: boolean,
  className?: string
};

function CheckBox({
  id,
  label,
  value,
  labelStyle,
  className,
  ...props
}: Props) {
  return (
    <div className={styles.box}>
      <Field
        {...props}
        className={cx(value ? styles.checked : styles.unchecked)}
        component="input"
        type="checkbox"
        normalize={v => !!v}
      />
      <label htmlFor={id} style={labelStyle} className={styles.label}>
        {label}
      </label>
    </div>
  );
}

CheckBox.Field = createField(CheckBox);
export default CheckBox;
