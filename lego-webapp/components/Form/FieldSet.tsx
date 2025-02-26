import cx from 'classnames';
import styles from '~/components/Form/FieldSet.module.css';
import { LabelText } from '~/components/Form/Label';
import type { HTMLProps, ReactNode } from 'react';

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
    <legend>
      <LabelText label={legend} description={description} required={required} />
    </legend>
    {children}
  </fieldset>
);
