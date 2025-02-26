import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { HelpCircle } from 'lucide-react';
import Tooltip from '~/components/Tooltip';
import styles from './Label.module.css';
import type { HTMLProps, ReactNode } from 'react';

type LabelTextProps = {
  label: ReactNode;
  description?: string;
  required?: boolean;
  className?: string;
};

export const LabelText = ({
  label,
  description,
  required,
  className,
}: LabelTextProps) => (
  <Flex alignItems="center" className={cx(styles.label, className)}>
    {label}
    {required && <span className={styles.required}>*</span>}
    {description && (
      <Tooltip content={description} className={styles.description}>
        <Icon size={18} iconNode={<HelpCircle />} />
      </Tooltip>
    )}
  </Flex>
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
  return (
    <LabelComponent {...labelProps}>
      {inline ? (
        <Flex
          alignItems="center"
          gap="var(--spacing-sm)"
          className={styles.inline}
        >
          {children}
          <LabelText
            label={label}
            description={description}
            required={required}
          />
        </Flex>
      ) : (
        <>
          <LabelText
            label={label}
            description={description}
            required={required}
          />
          {children}
        </>
      )}
    </LabelComponent>
  );
};
