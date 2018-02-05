// @flow

import React from 'react';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import styles from './surveys.css';
import { QuestionTypes } from '../utils';

type Props = {
  questionType: string,
  updateOptions: (Object, number) => void,
  option: Object,
  index: number
};

function makeOption(optionText: string, option: Object) {
  return {
    ...option,
    optionText
  };
}

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
      <TextInput
        onInput={e =>
          props.updateOptions(
            makeOption(e.target.value, props.option),
            props.index
          )
        }
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
        onInput={e =>
          props.updateOptions(
            makeOption(e.target.value, props.option),
            props.index
          )
        }
        placeholder="Alternativ..."
        className={styles.optionInput}
        value={props.option.optionText}
      />
    </li>
  );
};

export default Option;
