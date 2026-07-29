import { Flex, Icon, Tooltip } from '@webkom/lego-bricks';
import cx from 'classnames';
import { HelpCircle } from 'lucide-react';
import styles from './Label.module.css';
import type { HTMLProps, ReactNode } from 'react';

type LabelTextProps = {
  label: ReactNode;
  required?: boolean;
  className?: string;
};

export const LabelText = ({ label, required, className }: LabelTextProps) => (
  <Flex alignItems="center" className={cx(styles.label, className)}>
    {label}
    {required && <span className={styles.required}>*</span>}
  </Flex>
);

type FieldDescriptionProps = {
  description: string;
  id?: string;
};

/**
 * Sits next to the label rather than inside it. A tooltip nested in a <label>
 * activates the control it is meant to explain, so clicking the help icon used
 * to toggle the very checkbox or radio the user wanted to read about.
 *
 * The tooltip only renders its content while open, so the description is also
 * kept in the page for assistive technology to reference.
 */
export const FieldDescription = ({
  description,
  id,
}: FieldDescriptionProps) => (
  <>
    <Tooltip content={description} className={styles.description}>
      <Icon size={18} iconNode={<HelpCircle />} />
    </Tooltip>
    <span id={id} className={styles.screenReaderOnly}>
      {description}
    </span>
  </>
);

type LabelProps = HTMLProps<HTMLLabelElement> & {
  label: ReactNode;
  noLabel?: boolean;
  description?: string;
  descriptionId?: string;
  required?: boolean;
  inline?: boolean;
};

export const Label = ({
  label,
  noLabel,
  description,
  descriptionId,
  required,
  inline,
  children,
  ...labelProps
}: LabelProps) => {
  const LabelComponent = noLabel ? 'span' : 'label';

  const labelElement = (
    <LabelComponent {...labelProps}>
      {inline ? (
        <Flex
          alignItems="center"
          gap="var(--spacing-sm)"
          className={styles.inline}
        >
          {children}
          <LabelText label={label} required={required} />
        </Flex>
      ) : (
        <LabelText label={label} required={required} />
      )}
    </LabelComponent>
  );

  const row = (
    <Flex
      alignItems="center"
      gap="var(--spacing-xs)"
      className={cx(styles.labelRow, inline && styles.inlineRow)}
    >
      {labelElement}
      {description && (
        <FieldDescription description={description} id={descriptionId} />
      )}
    </Flex>
  );

  return inline ? (
    row
  ) : (
    <>
      {row}
      {children}
    </>
  );
};
