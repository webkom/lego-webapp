import { Children, cloneElement } from 'react';
import styles from './RadioButtonGroup.module.css';
import type { ReactElement } from 'react';

type Props = {
  name: string;
  label: string;
  children: ReactElement | ReactElement[];
};

const RadioButtonGroup = ({ name, label, children }: Props) => {
  return (
    <div>
      <label className={styles.groupLabel}>{label}</label>
      <div className={styles.group}>
        {Children.map(children, (child) =>
          cloneElement(child, {
            name,
            fieldClassName: styles.radioField,
            labelClassName: styles.radioLabel,
          })
        )}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
