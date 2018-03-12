// @flow

import React from 'react';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import { Field } from 'redux-form';
import styles from '../surveys.css';
import { QuestionTypes } from '../../utils';

type Props = {
  questionType: string,
  option: string,
  onChange?: any => void,
  index: number,
  remove?: () => void
};

const removeOption = (remove?) => {
  return remove ? (
    <a onClick={remove} className={styles.removeOption}>
      <span>x</span>
    </a>
  ) : (
    ''
  );
};

const Option = (props: Props) => {
  return props.questionType === QuestionTypes('single') ? (
    <MultipleChoice {...props} />
  ) : (
    <Checkbox {...props} />
  );
};

const MultipleChoice = (props: Props) => {
  return (
    <li>
      <RadioButton value={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
        className={styles.optionInput}
        placeholder="Alternativ"
        fieldClassName={styles.optionField}
      />
      {removeOption(props.remove)}
    </li>
  );
};

const Checkbox = (props: Props) => {
  return (
    <li>
      <CheckBox checked={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
        className={styles.optionInput}
        placeholder="Alternativ"
        fieldClassName={styles.optionField}
      />
      {removeOption(props.remove)}
    </li>
  );
};

export default Option;
