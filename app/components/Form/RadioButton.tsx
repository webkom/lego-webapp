import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { createField } from './Field';
import styles from './RadioButton.css';
import type { FormProps } from './Field';
import type { InputHTMLAttributes } from 'react';

type Props = {
  id: string;
  type?: string;
  label?: string;
  className?: string;
  inputValue?: string;
  checked?: boolean;
  value?: string | number;
} & InputHTMLAttributes<HTMLInputElement>;

function RadioButton({
  id,
  label,
  inputValue,
  checked,
  className,
  value,
  ...props
}: Props) {
  // TODO: Remove this when redux-form is gone
  checked = inputValue ? inputValue === value : checked;
  value = inputValue ?? value;
  return (
    <Flex wrap alignItems="center" gap={7}>
      <div className={cx(styles.radioButton, styles.bounce, className)}>
        <input
          {...props}
          className={styles.input}
          checked={checked}
          type="radio"
          id={id}
          value={value}
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
