// @flow

import React from 'react';
import {
  RadioButton,
  TextInput,
  TextArea,
  CheckBox
} from 'app/components/Form';
import styles from './surveys.css';

type Props = {
  questionType: number,
  updateOptions: Object => void,
  option: Object,
  nr: number
};

function makeOption(text: string, nr: number) {
  return {
    optionText: text,
    nr
  };
}

const Option = (props: Props) => {
  return props.questionType === 1 ? (
    <MultipleChoice {...props} />
  ) : (
    <Checkbox {...props} />
  );
};

const MultipleChoice = (props: Props) => {
  return (
    <li>
      <RadioButton value={false} className={styles.option} />
      <TextInput
        onInput={e => props.updateOptions(makeOption(e.target.value, props.nr))}
        placeholder="Alternativ..."
        className={styles.optionInput}
        value={props.option.optionText}
      />
    </li>
  );
};

const Checkbox = (props: Props) => {
  return (
    <li>
      <CheckBox checked={false} className={styles.option} />
      <TextInput
        onInput={e => props.updateOptions(makeOption(e.target.value, props.nr))}
        placeholder="Alternativ..."
        className={styles.optionInput}
        value={props.option.optionText}
      />
    </li>
  );
};

export default Option;
