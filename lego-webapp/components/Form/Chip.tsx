import cx from 'classnames';
import { Keyboard } from '~/utils/constants';
import styles from './Chip.module.css';
import { createField } from './Field';
import type {
  ComponentProps,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from 'react';

type Props = {
  label?: ReactNode;
  required?: boolean;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

/* A pill shaped alternative to RadioButton (type="radio") and CheckBox
   (type="checkbox"). */
const Chip = ({ id, label, required, checked, className, ...props }: Props) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keyboard.ENTER) {
      event.preventDefault();

      const inputElement = event.target as HTMLInputElement;
      if (!inputElement.checked || inputElement.type === 'checkbox') {
        inputElement.click();
      }
    }
  };

  return (
    <label className={cx(styles.chip, className)} htmlFor={id}>
      <input
        {...props}
        id={id}
        checked={checked}
        className={styles.input}
        onKeyDown={handleKeyDown}
      />
      <span>{label}</span>
      {required && <span className={styles.required}>*</span>}
    </label>
  );
};

const RawField = createField(Chip, { ownLabel: true });

const StyledField = ({
  fieldClassName,
  ...props
}: ComponentProps<typeof RawField> & { fieldClassName?: string }) => (
  <RawField fieldClassName={cx(fieldClassName, styles.chipField)} {...props} />
);

Chip.Field = StyledField;
export default Chip;
