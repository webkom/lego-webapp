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

/* Sits next to the label, not inside it: a tooltip nested in a <label>
   toggles the very control it explains. */
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
  trailing?: boolean;
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
  trailing,
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

  /* The control sits beside a column of label, description and revealed
     content. The revealed content stays outside the <label>: interactive
     content inside one toggles the control it belongs to. */
  const inlineLayout = (
    <Flex
      alignItems={
        !trailing && (descriptionText || inlineContent)
          ? 'flex-start'
          : 'center'
      }
      justifyContent={trailing ? 'space-between' : undefined}
      gap="var(--spacing-sm)"
      className={cx(styles.inline, trailing && styles.inlineTrailing)}
    >
      {!trailing && children}
      <Flex column className={styles.inlineColumn}>
        {labelElement}
        {inlineContent}
      </Flex>
      {trailing && children}
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
