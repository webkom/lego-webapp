import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Label } from '~/components/Form/Label';
import styles from './Field.module.css';
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
    <Flex
      alignItems="center"
      className={styles.fieldError}
      data-error-field-name={fieldName}
    >
      {typeof error === 'object' ? JSON.stringify(error) : error}
    </Flex>
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
      onChange,
      showErrors = true,
      className = null,
      ...props
    } = fieldProps;
    const { error, submitError, touched } = meta;
    const anyError = error || submitError;
    const hasError = showErrors && touched && anyError && anyError.length > 0;
    const fieldName = input?.name;
    const { noLabel, inlineLabel } = options || {};

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

    return (
      <Flex
        column
        className={cx(styles.field, fieldClassName)}
        style={fieldStyle}
      >
        <Label
          className={labelClassName}
          label={label}
          noLabel={noLabel}
          description={description}
          inline={inlineLabel}
          required={required}
        >
          {component}
        </Label>
        {hasError && (
          <RenderErrorMessage error={anyError} fieldName={fieldName} />
        )}
      </Flex>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
