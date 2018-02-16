// @flow

import React from 'react';
import { type FieldArrayProps, Field, FieldArray } from 'redux-form';
import {
  TextInput,
  TextArea,
  CheckBox,
  SelectInput
} from 'app/components/Form';
import Option from './Option';
import styles from '../surveys.css';
import Icon from 'app/components/Icon';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import { mappings, QuestionTypes } from '../../utils';

type Props = {
  deleteQuestion: number => Promise<*>,
  questionData: Object,
  question: string,
  index: number
};

const questionTypeToIcon = {
  single_choice: 'radio-button-on',
  multiple_choice: 'checkbox',
  text_field: 'more'
};

const QuestionTypeOption = (props: Object) => (
  <div
    className={props.className}
    onMouseDown={() => {
      event.preventDefault();
      event.stopPropagation();
      props.onSelect(props.option, event);
    }}
    onMouseEnter={() => props.onFocus(props.option, event)}
    onMouseMove={() => {
      if (props.isFocused) return;
      props.onFocus(props.option, event);
    }}
  >
    <Icon
      name={questionTypeToIcon[props.option && props.option.value]}
      style={{ marginRight: '15px' }}
    />
    {props.children}
  </div>
);

const QuestionTypeValue = (props: Object) => (
  <div
    className="Select-value"
    onMouseDown={() => {
      event.preventDefault();
      event.stopPropagation();
      props.onSelect(props.option, event);
    }}
    onMouseEnter={() => props.onFocus(props.option, event)}
    onMouseMove={() => {
      if (props.isFocused) return;
      props.onFocus(props.option, event);
    }}
  >
    <span className="Select-value-label">
      <Icon
        name={questionTypeToIcon[props.value && props.value.value]}
        style={{ marginRight: '15px' }}
      />
      {props.children}
    </span>
  </div>
);

const Question = ({ index, question, questionData, deleteQuestion }: Props) => {
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
        {questionData.questionType === QuestionTypes('text') ? (
          <TextArea
            className={styles.freeText}
            placeholder="Fritekst - sånn vil den se ut :smile:"
            value=""
          />
        ) : (
          <FieldArray
            name={`${question}.options`}
            questionType={questionData.questionType}
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
            optionComponent={QuestionTypeOption}
            options={mappings}
            valueComponent={QuestionTypeValue}
          />
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

const renderOptions = ({
  fields,
  questionType
}: {
  fields: FieldArrayProps,
  questionType: string
}) => (
  <ul className={styles.options}>
    {fields.map((option, index) => {
      const isLast = fields.length - 1 === index;
      return (
        <Option
          index={index}
          onChange={
            isLast
              ? value => {
                  if (value) fields.push({ optionText: '' });
                }
              : undefined
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
