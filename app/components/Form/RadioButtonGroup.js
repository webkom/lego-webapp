// @flow
import * as React from 'react';
import styles from './RadioButtonGroup.css';

type Props = {
  name: string,
  label: string,
  children: React.Node,
};

const RadioButtonGroup = ({ name, label, children }: Props) => {
  return (
    <div>
      <label className={styles.groupLabel}>{label}</label>
      <div className={styles.group}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
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
