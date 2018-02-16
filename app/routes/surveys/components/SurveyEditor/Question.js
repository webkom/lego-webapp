// @flow

import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import {
  TextInput,
  TextArea,
  CheckBox,
  SelectInput,
  DatePicker,
  withSubmissionError,
  legoForm
} from 'app/components/Form';
import Option from './Option';
import Button from 'app/components/Button';
import styles from '../surveys.css';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import { mappings, QuestionTypes, PresentableQuestionType } from '../../utils';

type Props = {
  updateQuestion: (Object, number) => void,
  deleteQuestion: number => Promise<*>,
  question: Object,
  index: number
};

type State = {
  pickerOpen: boolean
};

type QuestionTypeSelectorProps = {
  questionType: string
};

function QuestionTypeSelector({ questionType }: QuestionTypeSelectorProps) {
  const questionTypeToIcon = {
    single_choice: 'radio-button-on',
    multiple_choice: 'checkbox',
    text_field: 'more'
  };
  return (
    <Link className={styles.questionTypeSelector}>
      <span style={{ width: '170px', display: 'inline-block' }}>
        <Icon
          name={questionTypeToIcon[questionType]}
          style={{ marginRight: '15px' }}
        />
        {PresentableQuestionType(questionType)}
      </span>
      <Icon name="arrow-down" size={24} className={styles.typeIcon} />
    </Link>
  );
}

type DropdownItemsProps = {
  setQuestionType: string => void,
  currentlySelected: string
};

function DropdownItems({
  setQuestionType,
  currentlySelected
}: DropdownItemsProps) {
  return (
    <Dropdown.List>
      <Dropdown.ListItem>
        <Link
          onClick={() => setQuestionType(QuestionTypes('single'))}
          style={
            currentlySelected === QuestionTypes('single')
              ? {
                  fontWeight: 'bold'
                }
              : {}
          }
        >
          Multiple Choice
          <Icon name="radio-button-on" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link
          onClick={() => setQuestionType(QuestionTypes('multiple'))}
          style={
            currentlySelected === QuestionTypes('multiple')
              ? {
                  fontWeight: 'bold'
                }
              : {}
          }
        >
          Sjekkboks
          <Icon name="checkbox" size={24} />
        </Link>
      </Dropdown.ListItem>
      <Dropdown.ListItem>
        <Link
          onClick={() => setQuestionType(QuestionTypes('text'))}
          style={
            currentlySelected === QuestionTypes('text')
              ? {
                  fontWeight: 'bold'
                }
              : {}
          }
        >
          Fritekst
          <Icon name="more" size={24} />
        </Link>
      </Dropdown.ListItem>
    </Dropdown.List>
  );
}

const Question = ({
  updateQuestion,
  index,
  question,
  question_data = {},
  deleteQuestion
}: Props) => {
  return (
    <div className={styles.question}>
      <div className={styles.left}>
        <div className={styles.questionTop}>
          <Field
            name={`${question}.questionText`}
            className={styles.questionTitle}
            placeholder="Spørsmål"
            component={TextInput.Field}
          />
        </div>
        {question_data.questionType === QuestionTypes('text') ? (
          <TextArea
            className={styles.freeText}
            placeholder="Fritekst - sånn vil den se ut :smile:"
            value=""
          />
        ) : (
          <FieldArray
            name={`${question}.options`}
            questionType={question_data.questionType}
            component={renderOptions}
          />
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.questionType}>
          <Field
            name={`${question}.questionType`}
            simpleValue
            component={SelectInput.Field}
            options={mappings}
            required
          />
          {/*
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
              <DropdownItems
                setQuestionType={this.setQuestionType}
                currentlySelected={question.questionType}
              />
            </Dropdown>
            */}
        </div>

        <div className={styles.bottom}>
          <div className={styles.required}>
            <Field
              name={`${question}.mandatory`}
              label="Obligatorisk"
              component={CheckBox.Field}
              normalize={v => !!v}
            />
          </div>

          <ConfirmModalWithParent
            title="Slett spørsmål"
            message="Er du sikker på at du vil slette dette spørsmålet?"
            onConfirm={() => deleteQuestion(index)}
            closeOnConfirm
            className={styles.deleteQuestion}
          >
            <Icon name="trash" />
          </ConfirmModalWithParent>
        </div>
      </div>
    </div>
  );
};

const renderOptions = ({ fields, meta: { error }, questionType }) => (
  <ul className={styles.options}>
    {fields.map((option, index) => {
      const isLast = fields.length - 1 === index;
      return (
        <Option
          onChange={
            isLast &&
            (value => {
              if (value) fields.push({ optionText: '' });
            })
          }
          key={index}
          questionType={questionType}
          option={option}
        />
      );
    })}
  </ul>
);
export default Question;
