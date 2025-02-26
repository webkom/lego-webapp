import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Keyboard } from '~/utils/constants';
import { createField } from './Field';
import styles from './RadioButton.module.css';
import type { ComponentProps, InputHTMLAttributes, KeyboardEvent } from 'react';

type Props = {
  label?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function RadioButton({
  id,
  label,
  checked,
  className,
  value,
  ...props
}: Props) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keyboard.ENTER) {
      event.preventDefault();

      const inputElement = event.target as HTMLInputElement;
      if (!inputElement.checked) {
        inputElement.click();
      }
    }
  };

  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      <div className={cx(styles.radioButton, styles.bounce, className)}>
        <input
          {...props}
          checked={checked}
          type="radio"
          id={id}
          value={value}
          onKeyDown={handleKeyDown}
        />
        <svg viewBox="0 0 21 21">
          <circle cx="10.5" cy="10.5" r="7" />
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
}

const RawField = createField(RadioButton, { inlineLabel: true });

const StyledField = ({
  fieldClassName,
  ...props
}: ComponentProps<typeof RawField> & { fieldClassName?: string }) => (
  <RawField fieldClassName={cx(fieldClassName, styles.radioField)} {...props} />
);

RadioButton.Field = StyledField;
export default RadioButton;
