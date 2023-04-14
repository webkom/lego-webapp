import cx from 'classnames';
import Flex from 'app/components/Layout/Flex';
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
    <Flex gap={7} className={cx(styles.box, className)}>
      <input
        {...props}
        className={styles.input}
        checked={checked}
        type="radio"
        id={id}
        value={value}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </Flex>
  );
}

const RawField = createField(RadioButton, { inlineLabel: true });

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField fieldClassName={cx(fieldClassName, styles.radioField)} {...props} />
);

RadioButton.Field = StyledField;
export default RadioButton;
