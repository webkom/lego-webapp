import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './CheckBox.css';
import { createField } from './Field';
import type { FormProps } from './Field';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';

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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const inputElement = event.target as HTMLInputElement;
      inputElement.click();
    }
  };

  return (
    <Flex wrap alignItems="center" gap={7}>
      <div className={cx(styles.checkbox, styles.bounce, className)}>
        <input
          {...props}
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
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </Flex>
  );
};

const RawField = createField(CheckBox, { inlineLabel: true });

const StyledField = ({ fieldClassName, ...props }: FormProps) => (
  <RawField fieldClassName={fieldClassName} {...props} />
);

CheckBox.Field = StyledField;
export default CheckBox;
