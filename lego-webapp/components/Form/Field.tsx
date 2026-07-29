import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useId } from 'react';
import { Label } from '~/components/Form/Label';
import styles from './Field.module.css';
import type { ComponentType } from 'react';
import type { FieldInputProps, FieldRenderProps } from 'react-final-form';

const FieldError = ({
  error,
  fieldName,
}: {
  error: string;
  fieldName?: string;
}) => (
  <Flex
    alignItems="center"
    className={styles.fieldError}
    data-error-field-name={fieldName}
  >
    {error}
  </Flex>
);

/**
 * Flattens an error into the messages to display. Validation errors reach us as
 * a string, an array (one entry per item of an array field) or an object keyed
 * by subfield, so anything but a string was previously dropped without a trace.
 */
export const toErrorMessages = (error: unknown): string[] => {
  if (error === null || error === undefined || error === false) {
    return [];
  }
  if (typeof error === 'string') {
    return error.trim() ? [error] : [];
  }
  if (Array.isArray(error)) {
    return error.flatMap(toErrorMessages);
  }
  if (typeof error === 'object') {
    return Object.values(error).flatMap(toErrorMessages);
  }
  return [String(error)];
};

/**
 * Renders validation errors over the content below by default, so showing one
 * does not shift the surrounding layout. Pass `inline` where the message owns
 * its space in the flow, such as form level submission errors.
 */
export const RenderErrorMessage = ({
  error,
  fieldName,
  inline = false,
  id,
}: {
  error: unknown;
  fieldName?: string;
  inline?: boolean;
  id?: string;
}) => {
  const errors = [...new Set(toErrorMessages(error))];

  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      className={inline ? styles.fieldErrorFlow : styles.fieldErrorOverlay}
      role="alert"
    >
      {errors.map((error, index) => (
        <FieldError key={index} error={error} fieldName={fieldName} />
      ))}
    </div>
  );
};

type Options = {
  // Removes the html <label> around the component
  noLabel?: boolean;
  // Sets the label to be inline with the component
  inlineLabel?: boolean;
  // The component renders the label itself, so no wrapper is added around it
  ownLabel?: boolean;
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
      id,
      ...props
    } = fieldProps;
    const { error, submitError, touched } = meta;
    const anyError = error || submitError;
    const hasError =
      !!showErrors && !!touched && toErrorMessages(anyError).length > 0;
    const fieldName = input?.name;
    const { noLabel, inlineLabel, ownLabel } = options || {};

    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const descriptionId = `${fieldId}-description`;
    const describedBy =
      cx(description && descriptionId, hasError && errorId) || undefined;

    const component = (
      <Component
        id={fieldId}
        {...(props as ExtraProps)}
        {...(input as FieldInputProps<T>)}
        label={ownLabel ? label : !noLabel && !inlineLabel && label}
        required={ownLabel ? required : undefined}
        onChange={(value) => {
          input.onChange?.(value);
          onChange?.(value);
        }}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={cx(className, hasError && styles.inputWithError)}
      />
    );

    return (
      <Flex
        column
        className={cx(styles.field, fieldClassName)}
        style={fieldStyle}
      >
        {ownLabel ? (
          component
        ) : (
          <Label
            className={labelClassName}
            htmlFor={noLabel ? undefined : fieldId}
            label={label}
            noLabel={noLabel}
            description={description}
            descriptionId={descriptionId}
            inline={inlineLabel}
            required={required}
          >
            {component}
          </Label>
        )}
        {hasError && (
          <RenderErrorMessage
            id={errorId}
            error={anyError}
            fieldName={fieldName}
          />
        )}
      </Flex>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
