import { RadioButton, CheckBox, TextArea } from 'app/components/Form';
import { QuestionTypes } from '../utils';
import styles from './surveys.css';
import type {
  SubmissionEntity,
  AnswerEntity,
} from 'app/reducers/surveySubmissions';
import type { SurveyEntity, QuestionEntity } from 'app/reducers/surveys';

type Props = {
  survey: SurveyEntity;
  submission?: SubmissionEntity;
};

const StaticSubmission = ({ survey, submission }: Props) => {
  const textAnswer = (
    answer: AnswerEntity | null | undefined,
    submission: SubmissionEntity | null | undefined,
    question: QuestionEntity
  ) => {
    if (answer) {
      return (
        answer.answerText || <i className="secondaryFontColor">Tomt svar</i>
      );
    }

    if (
      submission &&
      !submission.answers.map((answer) => answer.question).includes(question.id)
    ) {
      return <i className="secondaryFontColor">Tomt svar</i>;
    }

    return (
      <TextArea
        value=""
        placeholder="Fritekst..."
        className={styles.freeText}
        disabled={true}
      />
    );
  };

  return (
    <ul className={styles.staticSubmission}>
      {survey.questions.map((question) => {
        const answer =
          submission &&
          submission.answers.find(
            (answer) => answer.question.id === question.id
          );
        return (
          <li key={question.id}>
            <h3>
              {question.questionText}{' '}
              {question.mandatory && (
                <span className={styles.mandatory}> *</span>
              )}
            </h3>

            {question.questionType === QuestionTypes('text') ? (
              textAnswer(answer, submission, question)
            ) : (
              <ul className={styles.detailOptions}>
                {question.options.map((option) => {
                  const selected =
                    answer &&
                    typeof (answer.selectedOptions || []).find(
                      (o) => o === option.id
                    ) !== 'undefined';
                  return (
                    <li key={option.id}>
                      {question.questionType === QuestionTypes('single') ? (
                        <RadioButton
                          inputValue={selected}
                          value={true}
                          label={option.optionText}
                          className={styles.option}
                          disabled
                        />
                      ) : (
                        <CheckBox
                          value={selected}
                          label={option.optionText}
                          className={styles.option}
                          disabled
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default StaticSubmission;
