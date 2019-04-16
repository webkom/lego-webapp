import React from 'react';
import styles from './RadioButtonGroup.css';
import RadioButton from './RadioButton';

interface Props {
  name: string;
  label: string;
  children: Array<RadioButton>;
}

const RadioButtonGroup = ({ name, label, children }: Props) => {
  return (
    <div>
      <label className={styles.groupLabel}>{label}</label>
      <div className={styles.group}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            name,
            fieldClassName: styles.radioField,
            labelClassName: styles.radioLabel
          })
        )}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
