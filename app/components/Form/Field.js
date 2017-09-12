// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Field.css';

function FieldError({ error }) {
  return <div className={styles.fieldError}>{error}</div>;
}

function renderErrorMessage(error: Array<string> | string) {
  if (Array.isArray(error)) {
    return error.map(renderErrorMessage);
  }

  return <FieldError error={error} key={error} />;
}

/**
 * Wraps Component so it works with redux-form and add some default
 * field behaviour.
 *
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 */
export function createField(Component: any) {
  return (field: any) => {
    const {
      input,
      meta,
      required,
      label,
      fieldStyle,
      fieldClassName,
      ...props
    } = field;
    const hasError = meta.touched && meta.error && meta.error.length > 0;
    return (
      <div className={cx(styles.field, fieldClassName)} style={fieldStyle}>
        <div className={styles.label}>
          {label || field.placeholder}
          {required && <span className={styles.required}>*</span>}
        </div>
        <Component
          {...input}
          {...props}
          className={cx(props.className, hasError && styles.inputWithError)}
        />
        {hasError && renderErrorMessage(meta.error)}
      </div>
    );
  };
}
