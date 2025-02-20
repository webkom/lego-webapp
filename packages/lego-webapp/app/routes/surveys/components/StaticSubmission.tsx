import EmptyState from 'app/components/EmptyState';
import { RadioButton, CheckBox, TextArea } from 'app/components/Form';
import { SurveyQuestionType } from '~/redux/models/SurveyQuestion';
import styles from './surveys.module.css';
import type { DetailedSurvey } from '~/redux/models/Survey';
import type { SurveyAnswer } from '~/redux/models/SurveyAnswer';
import type { SurveyQuestion } from '~/redux/models/SurveyQuestion';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';

type Props = {
  survey: DetailedSurvey;
  submission?: SurveySubmission;
};

const StaticSubmission = ({ survey, submission }: Props) => {
  return (
    <ul className={styles.staticSubmission}>
      {survey.questions.map((question) => {
        const answer = submission?.answers.find(
          (answer) => answer.question.id === question.id,
        );
        return (
          <li key={question.id}>
            <h3>
              {question.questionText}{' '}
              {question.mandatory && (
                <span className={styles.mandatory}> *</span>
              )}
            </h3>

            {question.questionType === SurveyQuestionType.TextField ? (
              <TextAnswer
                question={question}
                answer={answer}
                submission={submission}
              />
            ) : (
              <ul className={styles.detailOptions}>
                {question.options.map((option) => {
                  const selected =
                    answer &&
                    typeof (answer.selectedOptions || []).find(
                      (o) => o === option.id,
                    ) !== 'undefined';
                  return (
                    <li key={option.id}>
                      {question.questionType ===
                      SurveyQuestionType.SingleChoice ? (
                        <RadioButton
                          id={String(option.id)}
                          checked={selected}
                          label={option.optionText}
                          className={styles.option}
                          disabled
                        />
                      ) : (
                        <CheckBox
                          checked={selected}
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

const TextAnswer = ({
  answer,
  submission,
  question,
}: {
  answer?: SurveyAnswer;
  submission?: SurveySubmission;
  question: SurveyQuestion;
}) => {
  if (answer) {
    return answer.answerText || <EmptyState body={<i>Tomt svar</i>} />;
  }

  if (
    submission &&
    !submission.answers
      .map((answer) => answer.question.id)
      .includes(question.id)
  ) {
    return <EmptyState body={<i>Tomt svar</i>} />;
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

export default StaticSubmission;
