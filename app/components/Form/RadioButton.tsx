import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { createField } from './Field';
import styles from './RadioButton.css';
import type { FormProps } from './Field';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';

type Props = {
  id: string;
  type?: string;
  label?: string;
  className?: string;
  checked?: boolean;
  value?: string | number;
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
    if (event.key === 'Enter') {
      event.preventDefault();

      const inputElement = event.target as HTMLInputElement;
      if (!inputElement.checked) {
        inputElement.click();
      }
    }
  };

  return (
    <Flex wrap alignItems="center" gap={7}>
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
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </Flex>
  );
}

const RawField = createField(RadioButton, { inlineLabel: true });

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField fieldClassName={cx(fieldClassName, styles.radioField)} {...props} />
);

RadioButton.Field = StyledField;
export default RadioButton;
