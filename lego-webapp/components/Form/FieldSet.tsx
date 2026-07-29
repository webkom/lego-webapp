import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from '~/components/Form/FieldSet.module.css';
import { FieldDescription, LabelText } from '~/components/Form/Label';
import type { HTMLProps, ReactNode } from 'react';

type FieldSetProps = HTMLProps<HTMLFieldSetElement> & {
  legend: string;
  description?: string;
  descriptionId?: string;
  required?: boolean;
  children: ReactNode;
};
export const FieldSet = ({
  legend,
  description,
  descriptionId,
  required,
  children,
  ...fieldSetProps
}: FieldSetProps) => (
  <fieldset
    className={cx(styles.fieldSet, fieldSetProps.className)}
    {...fieldSetProps}
  >
    <legend>
      <Flex alignItems="center" gap="var(--spacing-xs)">
        <LabelText label={legend} required={required} />
        {description && (
          <FieldDescription description={description} id={descriptionId} />
        )}
      </Flex>
    </legend>
    {children}
  </fieldset>
);
