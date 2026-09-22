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

/** Where a field's description is shown: behind a help icon, or as text. */
export type DescriptionPosition = 'tooltip' | 'inline';

type LabelProps = HTMLProps<HTMLLabelElement> & {
  label: ReactNode;
  noLabel?: boolean;
  description?: string;
  descriptionId?: string;
  descriptionPosition?: DescriptionPosition;
  inlineContent?: ReactNode;
  required?: boolean;
  inline?: boolean;
};

export const Label = ({
  label,
  noLabel,
  description,
  descriptionId,
  descriptionPosition = 'tooltip',
  inlineContent,
  required,
  inline,
  children,
  ...labelProps
}: LabelProps) => {
  const LabelComponent = noLabel ? 'span' : 'label';

  const descriptionText = description && descriptionPosition === 'inline' && (
    <p id={descriptionId} className={styles.descriptionText}>
      {description}
    </p>
  );

  const labelElement = (
    <LabelComponent
      {...labelProps}
      className={cx(labelProps.className, inline && styles.inlineLabel)}
    >
      <LabelText label={label} required={required} />
      {inline && descriptionText}
    </LabelComponent>
  );

  const inlineLayout = (
    <Flex
      alignItems={descriptionText || inlineContent ? 'flex-start' : 'center'}
      gap="var(--spacing-sm)"
      className={styles.inline}
    >
      {children}
      <Flex column className={styles.inlineColumn}>
        {labelElement}
        {inlineContent}
      </Flex>
    </Flex>
  );

  const row = (
    <Flex
      alignItems="center"
      gap="var(--spacing-xs)"
      className={cx(styles.labelRow, inline && styles.inlineRow)}
    >
      {inline ? inlineLayout : labelElement}
      {description && descriptionPosition === 'tooltip' && (
        <FieldDescription description={description} id={descriptionId} />
      )}
    </Flex>
  );

  return inline ? (
    row
  ) : (
    <>
      {row}
      {descriptionText}
      {children}
    </>
  );
};
