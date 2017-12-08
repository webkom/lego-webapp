// @flow

import React, { type ComponentType } from 'react';
import cx from 'classnames';
import styles from './Field.css';

function FieldError({ error }: { error: string }) {
  return <div className={styles.fieldError}>{error}</div>;
}

function renderErrorMessage(error: Array<string> | string) {
  if (Array.isArray(error)) {
    return error.map(renderErrorMessage);
  }

  return <FieldError error={error} key={error} />;
}

type FieldProps = {
  className: string,
  input: Object,
  meta: Object,
  required: boolean,
  label: string,
  fieldStyle: any,
  fieldClassName: string,
  labelClassName: string,
  showErrors: boolean
};

/**
 * Wraps Component so it works with redux-form and add some default
 * field behaviour.
 *
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 */
export function createField(Component: ComponentType<*>) {
  const Field = (field: FieldProps) => {
    const {
      input,
      meta,
      required,
      label,
      fieldStyle,
      fieldClassName,
      labelClassName,
      showErrors = true,
      className = null,
      ...props
    } = field;
    const { error, touched } = meta;
    const hasError = showErrors && touched && error && error.length > 0;
    return (
      <div className={cx(styles.field, fieldClassName)} style={fieldStyle}>
        <label className={cx(styles.label, labelClassName)}>
          {label && <span>{label}</span>}
          {required && <span className={styles.required}>*</span>}
          <Component
            {...input}
            {...props}
            className={cx(className, hasError && styles.inputWithError)}
          />
        </label>
        {hasError && renderErrorMessage(meta.error)}
      </div>
    );
  };

  Field.displayName = `Field(${
    Component ? Component.displayName || Component.name : 'Unknown'
  })`;
  return Field;
}
