// @flow

import React, { Component } from 'react';
import Option from './Option';
import { TextArea, TextInput, RadioButton } from 'app/components/Form';
import { Field } from 'redux-form';
import styles from './surveys.css';

type Props = {
  updateQuestion: Object => void
};

type State = {
  options: Array<any>,
  questionType: number
};

class Question extends Component<Props, State> {
  state = {
    options: [],
    questionType: -1
  };

  updateOptions = (option: Object) => {
    const options = this.state.options.slice();
    const oldOption = options.find(o => o && o.id === option.id);
    const changedOptionIndex = options.indexOf(oldOption);
    if (changedOptionIndex) {
      options[changedOptionIndex] = option;
    } else {
      options.push(option);
    }

    this.setState({ options });
  };

  render() {
    return (
      <div>
        <Field
          name="questionTitle"
          component={TextInput.Field}
          placeholder={'Hva syntes du?'}
          className={styles.title}
          label="Spørsmålstekst"
        />

        <Field
          label="Radio button"
          component={RadioButton.Field}
          inputValue="1"
          name="questionType"
        />
        <Field
          label="Multiple Choice"
          component={RadioButton.Field}
          inputValue="2"
          name="questionType"
        />
        <Field
          label="Fritekst"
          component={RadioButton.Field}
          inputValue="3"
          name="questionType"
        />

        <Option questionType={this.state.questionType} />
      </div>
    );
  }
}

export default Question;
