// @flow

import React from 'react';
// $FlowFixMe
import { type FieldArrayProps, Field, FieldArray } from 'redux-form';
import {
  TextInput,
  TextArea,
  CheckBox,
  SelectInput,
} from 'app/components/Form';
import Option from './Option';
import styles from '../surveys.css';
import Icon from 'app/components/Icon';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import {
  mappings,
  QuestionTypes,
  QuestionTypeOption,
  QuestionTypeValue,
} from '../../utils';

type Fields = typeof FieldArrayProps.Field;

type Props = {
  deleteQuestion: (number) => Promise<*>,
  questionData: Object,
  question: string,
  relativeIndex: number,
  numberOfQuestions: number,
  updateRelativeIndexes: (number, number, Fields) => void,
  fields: Fields,
  option?: string,
  value?: string,
};

const questionTypeToIcon = {
  single_choice: 'radio-button-on',
  multiple_choice: 'checkbox',
  text_field: 'more',
};

const questionIndexMappings = (indexNumbers: number) =>
  [...Array(indexNumbers).keys()].map((relativeIndex) => ({
    value: relativeIndex,
    label: `Spørsmålsnummer: ${relativeIndex + 1}`,
  }));

const Question = ({
  relativeIndex,
  numberOfQuestions,
  question,
  questionData,
  deleteQuestion,
  updateRelativeIndexes,
  fields,
}: Props) => {
  const indexOptions = questionIndexMappings(numberOfQuestions);
  return (
    <div className={styles.question}>
      <div className={styles.left}>
        <div className={styles.questionTop}>
          <Field
            name={`${question}.questionText`}
            className={styles.questionTitle}
            placeholder="Spørsmål"
            component={TextInput.Field}
            fieldStyle={{ marginBottom: 0 }}
          />
        </div>
        {questionData.questionType === QuestionTypes('text') ? (
          <TextArea
            className={styles.freeText}
            placeholder="Fritekst - sånn vil den se ut :smile:"
            value=""
            disabled
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
        <div className="top">
          <div className={styles.questionType}>
            <Field
              name={`${question}.questionType`}
              simpleValue
              component={SelectInput.Field}
              optionComponent={(props) =>
                QuestionTypeOption(
                  props,
                  questionTypeToIcon[props.option && props.option.value]
                )
              }
              options={mappings}
              valueComponent={(props) =>
                QuestionTypeValue(
                  props,
                  questionTypeToIcon[props.value && props.value.value]
                )
              }
              className={styles.questionType}
              clearable={false}
              backspaceRemoves={false}
              searchable={false}
            />
          </div>

          <div>
            <SelectInput
              value={{
                value: relativeIndex,
                label: `Spørsmålsnummer: ${relativeIndex + 1}`,
              }}
              placeholder="0"
              name="relativeIndex"
              options={indexOptions}
              optionComponent={(props) =>
                QuestionTypeOption(props, 'sort', 'fa fa-')
              }
              valueComponent={(props) =>
                QuestionTypeValue(props, 'sort', 'fa fa-')
              }
              onChange={(user) =>
                updateRelativeIndexes(relativeIndex, user.value, fields)
              }
              onBlur={() => null}
              className={styles.reorderQuestion}
              clearable={false}
              backspaceRemoves={false}
              searchable={false}
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.required}>
            <Field
              name={`${question}.mandatory`}
              label="Obligatorisk"
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
          </div>

          <ConfirmModalWithParent
            title="Slett spørsmål"
            message="Er du sikker på at du vil slette dette spørsmålet?"
            onConfirm={() => deleteQuestion(relativeIndex)}
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
  questionType,
}: {
  fields: Fields,
  questionType: string,
}) => (
  <ul className={styles.options}>
    {fields.map((option, relativeIndex) => {
      const isLast = fields.length - 1 === relativeIndex;
      const removeFunction = () => fields.remove(relativeIndex);
      return (
        <Option
          index={relativeIndex}
          onChange={
            isLast
              ? (value) => {
                  if (value) fields.push({ optionText: '' });
                }
              : undefined
          }
          key={relativeIndex}
          questionType={questionType}
          option={option}
          remove={isLast ? undefined : removeFunction}
        />
      );
    })}
  </ul>
);
export default Question;
