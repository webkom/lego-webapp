import arrayMutators from 'final-form-arrays';
import { useField } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  CheckBox,
  LegoFinalForm,
  RadioButton,
  TextArea,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import styles from 'app/routes/surveys/components/surveys.css';
import { SurveyQuestionType } from 'app/store/models/SurveyQuestion';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { FormSurveyAnswer } from 'app/store/models/SurveyAnswer';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { FormSurveySubmission } from 'app/store/models/SurveySubmission';
import type { FieldArrayRenderProps } from 'react-final-form-arrays';

type Props = {
  survey: DetailedSurvey;
  initialValues: FormSurveySubmission;
  onSubmit: (values: FormSurveySubmission) => Promise<unknown>;
};

const SurveySubmissionForm = ({ survey, initialValues, onSubmit }: Props) => {
  return (
    <LegoFinalForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={createSubmissionValidator(survey)}
      mutators={{ ...arrayMutators }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FieldArray name="answers">
            {(props) => (
              <AnswerFields {...props} questions={survey.questions} />
            )}
          </FieldArray>

          <SubmitButton>Send svar</SubmitButton>
        </form>
      )}
    </LegoFinalForm>
  );
};

type AnswerFieldsProps = FieldArrayRenderProps<
  FormSurveyAnswer,
  HTMLElement
> & {
  questions: SurveyQuestion[];
};
const AnswerFields = ({ fields, questions }: AnswerFieldsProps) => (
  <ul className={styles.detailQuestions}>
    {fields.map((name, index) => (
      <AnswerField key={name} name={name} question={questions[index]} />
    ))}
  </ul>
);

type AnswerFieldProps = {
  name: string;
  question: SurveyQuestion;
};
const AnswerField = ({ name, question }: AnswerFieldProps) => {
  const { meta, input } = useField<FormSurveyAnswer>(name);
  const error = meta.touched ? meta.error || meta.submitError : undefined;

  const toggleOption = (optionId: EntityId, isSingle: boolean) => {
    let selectedOptions = input.value.selectedOptions;
    if (isSingle) {
      selectedOptions = [optionId];
    } else {
      if (selectedOptions.includes(optionId)) {
        selectedOptions = selectedOptions.filter((id) => id !== optionId);
      } else {
        selectedOptions = [...selectedOptions, optionId];
      }
    }

    input.onChange({
      ...input.value,
      selectedOptions,
    });
  };

  return (
    <li key={question.id}>
      <h3>
        {question.questionText}
        {question.mandatory && <span className={styles.mandatory}> *</span>}
        {error ? (
          <span
            style={{
              color: 'var(--danger-color)',
              marginLeft: '20px',
            }}
          >
            {error}
          </span>
        ) : (
          ''
        )}
      </h3>

      {question.questionType === SurveyQuestionType.TextField ? (
        <TextArea
          placeholder="Skriv her..."
          onChange={(e) =>
            input.onChange({ ...input.value, answerText: e.target.value })
          }
          className={styles.freeText}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
        />
      ) : (
        <ul className={styles.detailOptions}>
          {question.options.map((option) => (
            <li key={option.id} className={styles.submissionOptions}>
              {question.questionType === SurveyQuestionType.SingleChoice ? (
                <RadioButton
                  id={String(option.id)}
                  checked={input.value.selectedOptions.includes(option.id)}
                  label={option.optionText}
                  className={styles.formOption}
                  onChange={() => toggleOption(option.id, true)}
                  onBlur={input.onBlur}
                  onFocus={input.onFocus}
                />
              ) : (
                <CheckBox
                  id={String(option.id)}
                  checked={input.value.selectedOptions.includes(option.id)}
                  label={option.optionText}
                  className={styles.formOption}
                  onChange={() => toggleOption(option.id, false)}
                  onBlur={input.onBlur}
                  onFocus={input.onFocus}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const createSubmissionValidator =
  (survey: DetailedSurvey) => (values: FormSurveySubmission) => {
    const errors: { answers: string[][] } = {
      answers: [],
    };
    const answeredQuestionIds = values.answers
      .filter(
        (answer) =>
          answer.selectedOptions.length > 0 || answer.answerText !== '',
      )
      .map((answer) => answer.question);
    survey.questions.forEach((question, index) => {
      if (question.mandatory && !answeredQuestionIds.includes(question.id)) {
        errors.answers[index] = ['Dette feltet er obligatorisk'];
      }
    });

    return errors;
  };

export default SurveySubmissionForm;
