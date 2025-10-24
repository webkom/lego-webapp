import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import {
  useRef,
  useState,
  type ComponentProps,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Keyboard } from '~/utils/constants';
import styles from './ComponentAsCheckBox.module.css';
import { createField } from './Field';
import type { Overwrite } from 'utility-types';

type _Component =
  | ReactNode
  | ((props: { checked: Props['checked']; focused: boolean }) => ReactNode);

type Props = {
  type?: 'radio' | 'checkbox';
  component?: _Component;
  children?: _Component;
  label?: string;
  inverted?: boolean;
} & Overwrite<
  InputHTMLAttributes<HTMLInputElement>,
  { onChange?: (checked: boolean) => void }
>;

/*
When using this component as a Field in form, you have to include
type="checkbox", so that react-final-form knows to send the "checked" prop.
*/
const ComponentAsCheckbox = ({
  id,
  component,
  children,
  label,
  checked,
  inverted,
  ...props
}: Props) => {
  const [focused, setFocused] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);

  const normalizedValue = inverted ? !checked : checked;
  const _component = children || component;

  const eventHandlers = {
    onClick: () => inputElement?.current?.click(),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === Keyboard.ENTER) {
        event.preventDefault();
        inputElement?.current?.click();
      }
    },
  };

  return (
    <Flex
      column
      alignItems="center"
      gap="var(--spacing-sm)"
      className={cx(
        styles.interactable,
        checked && styles.checked,
        focused && styles.focused,
        props.disabled && styles.disabled,
      )}
      role="checkbox"
      data-focused={focused}
      aria-checked={checked}
      aria-disabled={props.disabled}
      {...eventHandlers}
    >
      <input
        {...props}
        id={id}
        ref={inputElement}
        type="checkbox"
        className={styles.screenReaderOnly}
        value={undefined}
        onChange={() => props.onChange?.(!checked)}
        checked={normalizedValue}
      />

      {typeof _component === 'function'
        ? _component({ checked, focused })
        : _component}

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

const RawField = createField(ComponentAsCheckbox, { inlineLabel: true });

const StyledField = (props: ComponentProps<typeof RawField>) => (
  <RawField labelClassName={styles.fieldLabel} {...props} />
);

ComponentAsCheckbox.Field = StyledField;
export default ComponentAsCheckbox;
