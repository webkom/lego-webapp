import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { HelpCircle } from 'lucide-react';
import Tooltip from 'app/components/Tooltip';
import styles from './Label.module.css';
import type { HTMLProps, ReactNode } from 'react';

type LabelTextProps = {
  label: ReactNode;
  description?: string;
  required?: boolean;
  className?: string;
};

const LabelText = ({
  label,
  description,
  required,
  className,
}: LabelTextProps) => (
  <div className={cx(styles.label, className)}>
    {label}
    {required && <span className={styles.required}>*</span>}
    {description && (
      <Tooltip content={description} className={styles.description}>
        <Icon size={20} iconNode={<HelpCircle />} />
      </Tooltip>
    )}
  </div>
);

type LabelProps = HTMLProps<HTMLLabelElement> & {
  label: ReactNode;
  noLabel?: boolean;
  description?: string;
  required?: boolean;
  inline?: boolean;
};

export const Label = ({
  label,
  noLabel,
  description,
  required,
  inline,
  children,
  ...labelProps
}: LabelProps) => {
  const LabelComponent = noLabel ? 'span' : 'label';
  const labelElement = (
    <LabelText label={label} description={description} required={required} />
  );
  return (
    <LabelComponent {...labelProps}>
      {inline ? (
        <Flex
          alignItems="center"
          gap="var(--spacing-xs)"
          className={styles.inline}
        >
          {children}
          {labelElement}
        </Flex>
      ) : (
        <>
          {labelElement}
          {children}
        </>
      )}
    </LabelComponent>
  );
};

type FieldSetProps = HTMLProps<HTMLFieldSetElement> & {
  legend: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
};
export const FieldSet = ({
  legend,
  description,
  required,
  children,
  ...fieldSetProps
}: FieldSetProps) => (
  <fieldset
    className={cx(styles.fieldSet, fieldSetProps.className)}
    {...fieldSetProps}
  >
    <legend className={styles.fieldSetLegend}>
      <LabelText label={legend} description={description} required={required} />
    </legend>
    {children}
  </fieldset>
);
