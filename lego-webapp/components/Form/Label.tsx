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

  /* Visible text carries the id itself, so aria-describedby resolves to what
     is on screen rather than to a copy kept for assistive technology. */
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

  /* The control sits beside a column holding the label, its description and
     whatever the field reveals, so all three line up under the label text
     whatever the control's width. The revealed content is a sibling of the
     <label> rather than a child: interactive content inside a label toggles
     the control it belongs to. The control keeps its association through
     htmlFor, so nothing has to be nested for the two to stay bound. */
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
