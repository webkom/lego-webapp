import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import Tooltip from 'app/components/Tooltip';
import styles from './Field.css';
import type { ComponentType } from 'react';
import type { FieldInputProps, FieldRenderProps } from 'react-final-form';

const FieldError = ({
  error,
  fieldName,
}: {
  error?: string;
  fieldName?: string;
}) =>
  error ? (
    <div className={styles.fieldError} data-error-field-name={fieldName}>
      {typeof error === 'object' ? JSON.stringify(error) : error}
    </div>
  ) : null;

export const RenderErrorMessage = ({
  error,
  fieldName,
}: {
  error: Array<string> | string;
  fieldName?: string;
}) => {
  if (Array.isArray(error)) {
    return (
      <>
        {error.map((error) => (
          <RenderErrorMessage key={error} error={error} fieldName={fieldName} />
        ))}
      </>
    );
  }

  return <FieldError error={error} fieldName={fieldName} />;
};

type Options = {
  // Removes the html <label> around the component
  noLabel?: boolean;
  // Sets the label to be inline with the component
  inlineLabel?: boolean;
};

/**
 * Wraps the Field component
 * https://final-form.org/docs/react-final-form/api/Field
 */
export function createField<T, ExtraProps extends object>(
  Component: ComponentType<FieldInputProps<T> & ExtraProps>,
  options?: Options,
) {
  const Field = (fieldProps: FieldRenderProps<T> & ExtraProps) => {
    const {
      input,
      meta,
      required,
      label,
      fieldStyle,
      description,
      fieldClassName,
      labelClassName,
      labelContentClassName,
      onChange,
      showErrors = true,
      className = null,
      withoutMargin = false,
      ...props
    } = fieldProps;
    const { error, submitError, touched } = meta;
    const anyError = error || submitError;
    const hasError = showErrors && touched && anyError && anyError.length > 0;
    const fieldName = input?.name;
    const { noLabel, inlineLabel } = options || {};

    const labelComponent = (
      <Flex alignItems="center">
        {label && (
          <div
            style={{
              cursor: inlineLabel && !props.disabled ? 'pointer' : 'default',
              fontSize: !inlineLabel ? 'var(--font-size-lg)' : 'inherit',
            }}
            className={cx(labelContentClassName, styles.labelContent)}
          >
            {label}
          </div>
        )}
        {description && (
          <Flex className={styles.description}>
            <Tooltip content={description}>
              <Icon size={18} name="help-circle-outline" />
            </Tooltip>
          </Flex>
        )}
        {required && <span className={styles.required}>*</span>}
      </Flex>
    );

    const component = (
      <Component
        {...(input as FieldInputProps<T>)}
        {...(props as ExtraProps)}
        label={!noLabel && !inlineLabel && label}
        onChange={(value) => {
          input.onChange?.(value);
          onChange?.(value);
        }}
        className={cx(className, hasError && styles.inputWithError)}
      />
    );

    const content = inlineLabel ? (
      <Flex gap="var(--spacing-sm)">
        {component}
        {labelComponent}
      </Flex>
    ) : (
      <>
        {labelComponent}
        {component}
      </>
    );

    return (
      <div
        className={cx(
          styles.field,
          withoutMargin && styles.withoutMargin,
          fieldClassName,
        )}
        style={fieldStyle}
      >
        {noLabel ? (
          content
        ) : (
          <label className={labelClassName}>{content}</label>
        )}
        {hasError && (
          <RenderErrorMessage error={anyError} fieldName={fieldName} />
        )}
      </div>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
