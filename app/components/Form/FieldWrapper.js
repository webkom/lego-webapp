import React from 'react';
import styles from './Field.css';

export const FieldError = ({ error }) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>
);

const FieldWrapper = ({
  input,
  meta,
  label,
  type = 'text',
  inputComponent = 'input',
  ...props
}) => (
  <div className={styles.field}>
    {label && <label>{label}</label>}
    {React.createElement(inputComponent, {
      type,
      ...props,
      ...input
    })}
    {meta.error && meta.touched ? <FieldError error={meta.error} /> : null}
  </div>
);

export default FieldWrapper;
