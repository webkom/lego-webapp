import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './CheckBox.module.css';
import { createField } from './Field';
import type { ComponentProps, InputHTMLAttributes, KeyboardEvent } from 'react';
import type { Overwrite } from 'utility-types';

type Props = {
  label?: string;
  inverted?: boolean;
  className?: string;
} & Overwrite<
  InputHTMLAttributes<HTMLInputElement>,
  { onChange?: (checked: boolean) => void }
>;

/*
When using this component as a Field in form, you have to include
type="checkbox", so that react-final-form knows to send the "checked" prop.
*/
const CheckBox = ({
  id,
  label,
  checked,
  inverted,
  className,
  ...props
}: Props) => {
  const normalizedValue = inverted ? !checked : checked;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const inputElement = event.target as HTMLInputElement;
      inputElement.click();
    }
  };

  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      <div className={cx(styles.checkbox, styles.bounce, className)}>
        <input
          {...props}
          value={undefined}
          onChange={() => props.onChange?.(!checked)}
          id={id}
          checked={normalizedValue}
          type="checkbox"
          onKeyDown={handleKeyDown}
        />
        <svg viewBox="0 0 21 21">
          <polyline points="5 10.75 8.5 14.25 16 6" />
        </svg>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={cx(styles.label, props.disabled && styles.disabled)}
        >
          {label}
        </label>
      )}
    </Flex>
  );
};

const RawField = createField(CheckBox, { inlineLabel: true });

const StyledField = (props: ComponentProps<typeof RawField>) => (
  <RawField labelClassName={styles.fieldLabel} {...props} />
);

CheckBox.Field = StyledField;
export default CheckBox;
