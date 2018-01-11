// @flow

import React from 'react';
import type { OptionEntity } from 'app/reducers/surveys';
import { RadioButton, SelectInput } from 'app/components/Form';
import { Field } from 'redux-form';
import styles from './surveys.css';

type Props = {
  questionType: number
};

const Option = (props: Props) => {
  const { questionType } = props;

  return questionType === 1 ? (
    <Field
      name="option"
      component={RadioButton.Field}
      className={styles.option}
    />
  ) : (
    <Field
      name="option"
      component={SelectInput.Field}
      className={styles.option}
    />
  );
};

export default Option;
