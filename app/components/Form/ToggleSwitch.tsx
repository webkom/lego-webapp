import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Keyboard } from 'app/utils/constants';
import { createField } from './Field';
import styles from './ToggleSwitch.module.css';
import type {
  ComponentProps,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import type { Overwrite } from 'utility-types';

type Props = {
  className?: string;
} & Overwrite<
  InputHTMLAttributes<HTMLInputElement>,
  { onChange?: (checked: boolean) => void }
>;

const ToggleSwitch = ({
  id,
  checked,
  value,
  className,
  disabled,
  ...props
}: Props) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Keyboard.ENTER) {
      event.preventDefault();
      const inputElement = event.target as HTMLInputElement;
      inputElement.click();
    }
  };

  const handleClick = (e: MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!disabled) {
      props.onChange?.(!isChecked);
    }
  };

  const isInFormContext = value !== undefined;
  // Supporting both string and boolean values
  const isChecked = isInFormContext
    ? typeof value === 'string'
      ? value === 'true'
      : !!value
    : typeof checked === 'string'
      ? checked === 'true'
      : !!checked;

  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      <div className={cx(styles.toggleSwitch, className)} onClick={handleClick}>
        <input
          {...props}
          type="checkbox"
          role="switch"
          id={id}
          {...(isInFormContext
            ? { value: value, checked: isChecked }
            : { checked: isChecked })}
          aria-checked={isChecked}
          disabled={disabled}
          onChange={(e) => {
            props.onChange?.(e.target.checked);
          }}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.slider} />
      </div>
    </Flex>
  );
};

const RawField = createField(ToggleSwitch);

const StyledField = (props: ComponentProps<typeof RawField>) => (
  <RawField {...props} />
);

ToggleSwitch.Field = StyledField;
export default ToggleSwitch;
