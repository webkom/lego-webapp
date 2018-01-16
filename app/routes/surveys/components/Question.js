// @flow

import React, { Component } from 'react';
import Option from './Option';
import { TextInput, TextArea, CheckBox } from 'app/components/Form';
import Dropdown from 'app/components/Dropdown';
import styles from './surveys.css';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

type Props = {
  updateQuestion: Object => void,
  deleteQuestion: number => Promise<*>,
  question: Object,
  nr: number
};

type State = {
  shouldUpdate: boolean,
  options: Array<any>,
  pickerOpen: boolean
};

type QuestionTypeSelectorProps = {
  questionType: number
};

function QuestionTypeSelector({ questionType }: QuestionTypeSelectorProps) {
  const questionTypeIntToString = {
    '1': 'Multiple Choice',
    '2': 'Sjekkboks',
    '3': 'Fritekst'
  };
  const questionTypeIntToIcon = {
    '1': 'radio-button-on',
    '2': 'checkbox',
    '3': 'more'
  };
  return (
    <Link className={styles.questionTypeSelector}>
      <span style={{ width: '170px', display: 'inline-block' }}>
        <Icon
          name={questionTypeIntToIcon[String(questionType)]}
          style={{ marginRight: '15px' }}
        />
        {questionTypeIntToString[String(questionType)]}
      </span>
      <Icon name="arrow-down" size={24} className={styles.typeIcon} />
    </Link>
  );
}

type DropdownItemsProps = {
  setQuestionType: number => void
};

function DropdownItems({ setQuestionType }: DropdownItemsProps) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link onClick={() => setQuestionType(1)}>
          <strong>Multiple Choice</strong>
          <Icon name="radio-button-on" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link onClick={() => setQuestionType(2)}>
          Sjekkboks
          <Icon name="checkbox" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link onClick={() => setQuestionType(3)}>
          Fritekst
          <Icon name="more" size={24} />
        </Link>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

class Question extends Component<Props, State> {
  state = {
    shouldUpdate: false,
    options: [{ nr: 0, optionText: '' }],
    pickerOpen: false
  };

  componentDidUpdate() {
    if (this.state.shouldUpdate) {
      const { questionText, nr, questionType } = this.props.question;
      this.props.updateQuestion(
        this.makeQuestion(questionText, nr, questionType)
      );
      this.setState({ shouldUpdate: false });
    }
  }

  makeQuestion = (questionText: string, nr: number, questionType: number) => {
    const { options } = this.state;
    return {
      questionType,
      questionText,
      options,
      nr,
      mandatory: false // TODO
    };
  };

  updateOptions = (option: Object) => {
    const options = this.state.options.slice();

    const oldOption = options.find(o => o && o.nr === option.nr);
    const changedOptionIndex = options.indexOf(oldOption);

    if (changedOptionIndex !== -1) {
      // This inner "if" adds another empty option below the current one if
      // the current option is the last one, which is how several options
      // functionality is implemented.
      if (
        option.nr === options.length - 1 &&
        (oldOption || {}).optionText === ''
      ) {
        options.push({
          optionText: '',
          nr: this.state.options.length
        });
      }
      // Afterwards, outside that inner if, the current option is then updated.
      options[changedOptionIndex] = option;
    } else {
      options.push(option);
    }

    this.setState({ options, shouldUpdate: true });
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      pickerOpen: !prevState.pickerOpen
    }));
  };

  setQuestionType = (questionType: number) => {
    this.props.updateQuestion({ ...this.props.question, questionType });
  };

  render() {
    const { updateQuestion, nr, question, deleteQuestion } = this.props;
    return (
      <div className={styles.question}>
        <div className={styles.left}>
          <div className={styles.questionTop}>
            <TextInput
              value={question.questionText}
              className={styles.questionTitle}
              placeholder="Spørsmål"
              onInput={e =>
                updateQuestion({
                  ...this.props.question,
                  questionText: e.target.value,
                  nr
                })
              }
            />
          </div>
          {this.props.question.questionType === 3 ? (
            <TextArea
              className={styles.freeText}
              placeholder="Fritekst"
              value=""
            />
          ) : (
            <ul className={styles.options}>
              {this.state.options.map((option, i) => (
                <Option
                  key={i}
                  nr={i}
                  questionType={this.props.question.questionType}
                  option={option || {}}
                  updateOptions={this.updateOptions}
                />
              ))}
            </ul>
          )}
        </div>
        <div className={styles.right}>
          <div className={styles.questionType}>
            <Dropdown
              show={this.state.pickerOpen}
              toggle={this.toggleDropdown}
              triggerComponent={
                <QuestionTypeSelector
                  questionType={question.questionType}
                  toggleDropdown={this.toggleDropdown}
                />
              }
              componentClass="div"
              contentClassName={styles.dropdown}
              style={{ flex: 1 }}
            >
              <DropdownItems setQuestionType={this.setQuestionType} />
            </Dropdown>
          </div>

          <div className={styles.bottom}>
            <div className={styles.required}>
              Obligatorisk
              <CheckBox
                name="mandatory"
                value={question.mandatory}
                onChange={e =>
                  updateQuestion({
                    ...question,
                    mandatory: !question.mandatory
                  })
                }
              />
            </div>

            <ConfirmModalWithParent
              title="Slett spørsmål"
              message="Er du sikker på at du vil slette dette spørsmålet?"
              onConfirm={() => deleteQuestion(nr)}
              closeOnConfirm
              className={styles.deleteQuestion}
            >
              <Icon name="trash" />
            </ConfirmModalWithParent>
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
