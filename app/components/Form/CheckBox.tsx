import cx from 'classnames';
import { Flex } from '../Layout';
import styles from './CheckBox.css';
import { createField } from './Field';
import type { FormProps } from './Field';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  type?: string;
  label?: string;
  value?: boolean;
  checked?: boolean;
  inverted?: boolean;
  className?: string;
};

/*
When using this component as a Field in form, you have to include
type="checkbox", so that react-final-form knows to send the "checked" prop.
*/
const CheckBox = ({
  id,
  label,
  value,
  // TODO: remove "value" once migration to react-final-form is complete
  checked,
  inverted,
  className,
  ...props
}: Props) => {
  checked = checked ?? value;
  const normalizedValue = inverted ? !checked : checked;
  return (
    <Flex wrap alignItems="center" gap={5}>
      <div className={cx(styles.checkbox, styles.bounce, className)}>
        <input {...props} id={id} checked={normalizedValue} type="checkbox" />
        <svg viewBox="0 0 21 21">
          <polyline points="5 10.75 8.5 14.25 16 6" />
        </svg>
      </div>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </Flex>
  );
};

const RawField = createField(CheckBox);

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField
    fieldClassName={cx(fieldClassName, styles.checkboxField)}
    {...props}
  />
);

CheckBox.Field = StyledField;
export default CheckBox;
