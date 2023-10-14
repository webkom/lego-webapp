import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  TextInput,
  TextArea,
  CheckBox,
  SelectInput,
} from 'app/components/Form';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import {
  mappings,
  QuestionTypes,
  QuestionTypeOption,
  QuestionTypeValue,
} from '../../utils';
import styles from '../surveys.css';
import Option from './Option';
import type { ReactNode } from 'react';

type Props = {
  deleteQuestion: (arg0: number) => Promise<any>;
  questionData: Record<string, any>;
  question: string;
  relativeIndex: number;
  numberOfQuestions: number;
  updateRelativeIndexes: (arg0: number, arg1: number, arg2: any) => void;
  fields: any;
  option?: string;
  value?: string;
};
const questionTypeToIcon = {
  single_choice: 'radio-button-on',
  multiple_choice: 'checkbox',
  text_field: 'text',
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
            fieldStyle={{
              marginBottom: 0,
            }}
          />
        </div>
        {questionData.questionType?.value === QuestionTypes('text') ? (
          <TextArea
            className={styles.freeText}
            placeholder="Fritekst - sånn her vil den se ut :smile:"
            value=""
            disabled
          />
        ) : (
          <FieldArray
            name={`${question}.options`}
            questionType={questionData.questionType?.value}
            component={renderOptions}
          />
        )}
      </div>
      <div className={styles.right}>
        <div className="top">
          <div>
            <Field
              name={`${question}.questionType`}
              placeholder="Velg type"
              component={SelectInput.Field}
              components={{
                Option: (props: any) => {
                  const value = props.data.value;
                  return (
                    <QuestionTypeOption
                      iconName={questionTypeToIcon[value]}
                      {...props}
                    />
                  );
                },
                SingleValue: (props: any) => {
                  const value = props.data.value;
                  return (
                    <QuestionTypeValue
                      iconName={questionTypeToIcon[value]}
                      {...props}
                    />
                  );
                },
              }}
              options={mappings}
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
              components={{
                Option: (props: any) => {
                  return <QuestionTypeOption iconName="list" {...props} />;
                },
                SingleValue: (props: any) => {
                  return <QuestionTypeValue iconName="list" {...props} />;
                },
              }}
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

        <Flex alignItems="center" className={styles.bottom}>
          <Field
            name={`${question}.mandatory`}
            label="Obligatorisk"
            type="checkbox"
            component={CheckBox.Field}
            normalize={(v) => !!v}
          />

          <ConfirmModal
            title="Slett spørsmål"
            message="Er du sikker på at du vil slette dette spørsmålet?"
            onConfirm={() => deleteQuestion(relativeIndex)}
            closeOnConfirm
          >
            {({ openConfirmModal }) => (
              <Icon onClick={openConfirmModal} name="trash" danger />
            )}
          </ConfirmModal>
        </Flex>
      </div>
    </div>
  );
};

const renderOptions = ({
  fields,
  questionType,
}: {
  fields: any;
  questionType: string;
}): ReactNode => (
  <Flex column gap="1rem" className={styles.options}>
    {fields.map((option, relativeIndex) => {
      const isLast = fields.length - 1 === relativeIndex;

      const removeFunction = () => fields.remove(relativeIndex);

      return (
        <Option
          index={relativeIndex}
          onChange={
            isLast
              ? (value) => {
                  if (value)
                    fields.push({
                      optionText: '',
                    });
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
  </Flex>
);

export default Question;
