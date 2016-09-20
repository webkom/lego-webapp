import React from 'react';
import styles from './Field.css';

export const FieldError = ({ error }) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>
);

const Field = ({
  field,
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
      ...field
    })}
    {field.error && field.touched ? <FieldError error={field.error} /> : null}
  </div>
);

export default Field;
