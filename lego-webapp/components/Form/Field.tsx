import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { CircleAlert } from 'lucide-react';
import { useId } from 'react';
import { Label } from '~/components/Form/Label';
import styles from './Field.module.css';
import type { ComponentType } from 'react';
import type { FieldInputProps, FieldRenderProps } from 'react-final-form';

/* inline owns its place in the flow, text is a quiet note without the red
   block, and overlay floats below the field for the rare layout with room
   under it to spare, since it paints over whatever follows. */
export type ErrorVariant = 'overlay' | 'inline' | 'text';

const FieldError = ({
  error,
  fieldName,
  variant,
}: {
  error: string;
  fieldName?: string;
  variant: ErrorVariant;
}) => (
  <Flex
    alignItems="center"
    gap="var(--spacing-xs)"
    className={cx(
      styles.fieldError,
      variant === 'text' && styles.fieldErrorQuiet,
    )}
    data-error-field-name={fieldName}
  >
    {variant === 'text' && (
      <Icon
        iconNode={<CircleAlert />}
        size={16}
        className={styles.fieldErrorIcon}
      />
    )}
    {error}
  </Flex>
);

/* Validation errors arrive as a string, an array or an object per subfield. */
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

const ERROR_CONTAINER: Record<ErrorVariant, string> = {
  overlay: styles.fieldErrorOverlay,
  inline: styles.fieldErrorFlow,
  text: styles.fieldErrorText,
};

export const RenderErrorMessage = ({
  error,
  fieldName,
  variant = 'inline',
  id,
}: {
  error: unknown;
  fieldName?: string;
  variant?: ErrorVariant;
  id?: string;
}) => {
  const errors = [...new Set(toErrorMessages(error))];

  if (errors.length === 0) {
    return null;
  }

  return (
    <div id={id} className={ERROR_CONTAINER[variant]} role="alert">
      {errors.map((error, index) => (
        <FieldError
          key={index}
          error={error}
          fieldName={fieldName}
          variant={variant}
        />
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
  // How validation errors are shown, see ErrorVariant
  errorVariant?: ErrorVariant;
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
      descriptionPosition,
      inlineContent,
      fieldClassName,
      labelClassName,
      onChange,
      onBlur,
      onFocus,
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
    const { noLabel, inlineLabel, ownLabel, errorVariant } = options || {};

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
        onBlur={(value) => {
          input.onBlur?.(value);
          onBlur?.(value);
        }}
        onFocus={(value) => {
          input.onFocus?.(value);
          onFocus?.(value);
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
            descriptionPosition={descriptionPosition}
            inlineContent={inlineContent}
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
            variant={errorVariant}
          />
        )}
      </Flex>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
