import React from 'react';
import { Field as ReduxFormField } from 'redux-form';
import cx from 'classnames';
import styles from './Field.css';

export const FieldError = ({ error }) => (
  <span style={{ color: 'red', fontWeight: 'bold' }}>{error}</span>
);

function Field({ component: Component, ...props }) {
  const renderField = (field) => (
    <div className={styles.field}>
      <Component {...field.input} />
      <pre>{JSON.stringify(field, null, 2)}</pre>
    </div>
  );

  return (
    <ReduxFormField
      component={renderField}
      {...props}
    />
  );
}

/**
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 */
export function createField(Component) {
  return (field) => {
    const { input, meta, fieldStyle, fieldClassName, ...props } = field;
    return (
      <div className={cx(styles.field, fieldClassName)} style={fieldStyle}>
        <Component {...input} {...props} />
        {meta.touched && meta.error && <FieldError error={meta.error} />}
      </div>
    );
  };
}

export default Field;
