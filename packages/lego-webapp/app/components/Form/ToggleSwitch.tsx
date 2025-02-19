import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ToggleButton } from 'react-aria-components';
import { createField } from './Field';
import styles from './ToggleSwitch.module.css';
import type { ComponentProps } from 'react';
import type { ToggleButtonProps } from 'react-aria-components';

type Props = {
  className?: string;
  value?: string | boolean;
  name?: string;
  checked?: boolean;
} & ToggleButtonProps;

const ToggleSwitch = ({
  id,
  name,
  value,
  checked,
  className,
  onChange,
  ...props
}: Props) => {
  const isInFormContext = value !== undefined;
  // Supporting both string and boolean values
  const isSelected = isInFormContext
    ? typeof value === 'string'
      ? value === 'true'
      : !!value
    : checked;

  return (
    <Flex wrap alignItems="center" gap="var(--spacing-sm)">
      {/* A hidden input used in the e2e specs to find the field through the name attribute */}
      <input type="hidden" name={name} value={isSelected ? 'true' : 'false'} />
      <ToggleButton
        {...props}
        id={id}
        isSelected={isSelected}
        onChange={onChange}
        className={cx(styles.toggleSwitch, className)}
      >
        <span className={styles.slider} />
      </ToggleButton>
    </Flex>
  );
};

const RawField = createField(ToggleSwitch);

const StyledField = (props: ComponentProps<typeof RawField>) => (
  <RawField {...props} />
);

ToggleSwitch.Field = StyledField;
export default ToggleSwitch;
