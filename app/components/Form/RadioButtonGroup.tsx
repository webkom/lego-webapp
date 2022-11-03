import type { Node } from 'react';
import { Children, cloneElement } from 'react';
import styles from './RadioButtonGroup.css';
type Props = {
  name: string;
  label: string;
  children: Node;
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
