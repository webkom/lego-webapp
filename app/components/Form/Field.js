import React from 'react';
import cx from 'classnames';
import styles from './Field.css';

/**
 * Wraps Component so it works with redux-form and add some default
 * field behaviour.
 *
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 */
export function createField(Component) {
  return (field) => {
    const { input, meta, label, fieldStyle, fieldClassName, ...props } = field;
    const hasError = meta.touched && meta.error;

    return (
      <div
        className={cx(
          styles.field,
          fieldClassName
        )}
        style={fieldStyle}
      >
        {label && <div>{label}</div>}
        <Component
          {...input}
          {...props}
          className={cx(
            props.className,
            hasError && styles.inputWithError
          )}
        />
      </div>
    );
  };
}
