import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import Tooltip from 'app/components/Tooltip';
import styles from './Field.css';
import type { ComponentType, CSSProperties, InputHTMLAttributes } from 'react';

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
export const RenderWarningMessage = ({
  warning,
}: {
  warning: Array<string> | string;
}) => {
  if (Array.isArray(warning)) {
    return (
      <>
        {warning.map((warning) => (
          <RenderWarningMessage key={warning} warning={warning} />
        ))}
      </>
    );
  }

  return <FieldWarning warning={warning} key={warning} />;
};
export type FormProps = {
  className?: string;
  input: InputHTMLAttributes<HTMLInputElement>;
  meta: Record<string, any>;
  required?: boolean;
  label?: string;
  description?: string;
  fieldStyle?: CSSProperties;
  fieldClassName?: string;
  labelClassName?: string;
  showErrors?: boolean;
  onChange?: (value: string) => void;
};
type Options = {
  // Removes the html <label> around the component
  noLabel?: boolean;
  // Sets the label to be inline with the component
  inlineLabel?: boolean;
};

/**
 * Wraps field component
 * http://redux-form.com/6.0.5/docs/api/Field.md/
 * https://final-form.org/docs/react-final-form/api/Field
 */
export function createField(Component: ComponentType<any>, options?: Options) {
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
      onChange,
      showErrors = true,
      className = null,
      ...props
    } = field;
    const { error, submitError, warning, touched } = meta;
    const anyError = error || submitError;
    const hasError = showErrors && touched && anyError?.length > 0;
    const hasWarning = showErrors && touched && warning?.length > 0;
    const fieldName = input?.name;
    const inlineLabel = options?.inlineLabel;

    const labelComponent = (
      <Flex>
        {label && (
          <div
            style={{
              cursor: inlineLabel ? 'pointer' : 'default',
              fontSize: !inlineLabel ? 'var(--font-size-lg)' : 'inherit',
            }}
            className={labelClassName}
          >
            {label}
          </div>
        )}
        {description && (
          <Tooltip
            style={{
              display: 'inline-block',
            }}
            content={description}
          >
            <div
              style={{
                marginLeft: '10px',
              }}
            >
              <Icon size={32} name="help" />
            </div>
          </Tooltip>
        )}
        {required && <span className={styles.required}>*</span>}
      </Flex>
    );

    const component = (
      <Component
        {...input}
        {...props}
        onChange={(value) => {
          input.onChange?.(value);
          onChange?.(value);
        }}
        className={cx(
          className,
          hasWarning && styles.inputWithWarning,
          hasError && styles.inputWithError
        )}
      />
    );

    const content = inlineLabel ? (
      <Flex gap={7}>
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
      <div className={cx(styles.field, fieldClassName)} style={fieldStyle}>
        {options?.noLabel ? content : <label>{content}</label>}
        {hasError && (
          <RenderErrorMessage error={anyError} fieldName={fieldName} />
        )}
        {hasWarning && <RenderWarningMessage warning={warning} />}
      </div>
    );
  };

  const name = Component && (Component.displayName || Component.name);
  Field.displayName = `Field(${typeof name === 'string' ? name : 'Unknown'})`;
  return Field;
}
