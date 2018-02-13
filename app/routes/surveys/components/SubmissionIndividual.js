// @flow

import React from 'react';
import styles from './surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { RadioButton, CheckBox } from 'app/components/Form';
import cx from 'classnames';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  survey: SurveyEntity
};

const SubmissionPage = ({ submissions, deleteSurvey, survey }: Props) => {
  return (
    <ul className={styles.submissions}>
      {submissions.map((submission, i) => (
        <li key={submission.id}>
          <h3>Svar {i}</h3>

          <ul className={cx(styles.answers, styles.detailQuestions)}>
            {survey.questions && (
              <AnswerList survey={survey} submission={submission} />
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
};

type AnswerListProps = {
  submission: SubmissionEntity,
  survey: SurveyEntity
};

const AnswerList = ({ survey, submission }: AnswerListProps) => {
  if (!survey.questions[0].options || !submission.answers[0].selectedOptions) {
    return <LoadingIndicator loading />;
  }

  return survey.questions.map(question => {
    const answer =
      submission.answers.find(answer => answer.question.id === question.id) ||
      {};

    return (
      <li key={question.id}>
        <h4>{question.questionText}</h4>
        {question.questionType === 3 ? (
          answer.answerText || <i>Tomt svar</i>
        ) : (
          <ul className={styles.detailOptions}>
            {question.options.map(option => {
              const selected =
                typeof (answer.selectedOptions || []).find(
                  o => o === option.id
                ) !== 'undefined';

              return (
                <li key={option.id}>
                  {question.questionType === 1 ? (
                    <RadioButton
                      inputValue={selected}
                      value={true}
                      className={styles.option}
                    />
                  ) : (
                    <CheckBox value={selected} className={styles.option} />
                  )}
                  {option.optionText}
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  });
};

export default SubmissionPage;
