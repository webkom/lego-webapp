import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from '~/components/Form/FieldSet.module.css';
import { FieldDescription, LabelText } from '~/components/Form/Label';
import type { HTMLProps, ReactNode } from 'react';
import type { DescriptionPosition } from '~/components/Form/Label';

type FieldSetProps = HTMLProps<HTMLFieldSetElement> & {
  legend: string;
  description?: string;
  descriptionId?: string;
  descriptionPosition?: DescriptionPosition;
  required?: boolean;
  children: ReactNode;
};
export const FieldSet = ({
  legend,
  description,
  descriptionId,
  descriptionPosition = 'tooltip',
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
        {description && descriptionPosition === 'tooltip' && (
          <FieldDescription description={description} id={descriptionId} />
        )}
      </Flex>
    </legend>
    {description && descriptionPosition === 'inline' && (
      <p id={descriptionId} className={styles.description}>
        {description}
      </p>
    )}
    {children}
  </fieldset>
);
