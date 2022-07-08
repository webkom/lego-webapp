// @flow

import type { ComponentType, Node } from 'react';
import cx from 'classnames';

import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';

import styles from './Field.css';

const FieldError = ({
  error,
  fieldName,
}: {
  error?: string,
  fieldName?: string,
}) =>
  error ? (
    <div className={styles.fieldError} data-error-field-name={fieldName}>
      {typeof error === 'object' ? JSON.stringify(error) : error}
    </div>
  ) : null;

const FieldWarning = ({ warning }: { warning?: string }) =>
  warning ? (
    <div className={styles.fieldWarning}>
      {typeof warning === 'object' ? JSON.stringify(warning) : warning}
    </div>
  ) : null;

export const RenderErrorMessage = ({
  error,
  fieldName,
}: {
  error: Array<string> | string,
  fieldName?: string,
}) => {
  if (Array.isArray(error)) {
    return (error.map((error) => (
      <RenderErrorMessage key={error} error={error} fieldName={fieldName} />
    )): Array<Node>);
  }

  return <FieldError error={error} fieldName={fieldName} />;
};

export const RenderWarningMessage = ({
  warning,
}: {
  warning: Array<string> | string,
}) => {
  if (Array.isArray(warning)) {
    return (warning.map((warning) => (
      <RenderWarningMessage key={warning} warning={warning} />
    )): Array<Node>);
  }

  return <FieldWarning warning={warning} key={warning} />;
};

export type FormProps = {
  className: string,
  input: Object,
  meta: Object,
  required: boolean,
  label: string,
  description?: string,
  fieldStyle: any,
  fieldClassName: string,
  labelClassName: string,
  showErrors: boolean,
};

type Options = {
  // Removes the html <label> around the component
  noLabel?: boolean,
};

/**
 * Wraps Component, so it works with redux-form/react-final-form and add some
 * default field behaviour.
 *
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 * https://final-form.org/docs/react-final-form/api/Field
 */
export function createField(Component: ComponentType<*>, options?: Options) {
  const Field = (field: FormProps) => {
    const {
      input,
      meta,
      required,
      label,
      fieldStyle,
      description,
      fieldClassName,
      labelClassName,
      showErrors = true,
      className = null,
      ...props
    } = field;
    const { error, submitError, warning, touched } = meta;

    const anyError = error || submitError;

    const hasError = showErrors && touched && anyError && anyError.length > 0;
    const hasWarning = showErrors && touched && warning && warning.length > 0;
    const fieldName = input && input.name;

    const content = (
      <>
        <Flex>
          {label && (
            <div className={cx(styles.label, labelClassName)}>{label}</div>
          )}
          {description && (
            <Tooltip style={{ display: 'inline-block' }} content={description}>
              <div style={{ marginLeft: '10px' }}>
                <Icon size={32} name="help" />
              </div>
            </Tooltip>
          )}
          {required && <span className={styles.required}>*</span>}
        </Flex>
        <Component
          {...input}
          {...props}
          className={cx(
            className,
            hasWarning && styles.inputWithWarning,
            hasError && styles.inputWithError
          )}
        />
      </>
    );
    return (
      <div className={cx(styles.field, fieldClassName)} style={fieldStyle}>
        {options && options.noLabel ? content : <label>{content}</label>}
        {hasError && (
          <RenderErrorMessage error={anyError} fieldName={fieldName} />
        )}
        {hasWarning && <RenderWarningMessage warning={meta.warning} />}
      </div>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
