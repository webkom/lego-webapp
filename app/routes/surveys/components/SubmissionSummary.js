// @flow

import React from 'react';
import styles from './surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  survey: SurveyEntity
};

const SubmissionSummary = ({ submissions, deleteSurvey, survey }: Props) => {
  return (
    <ul className={styles.summary}>
      {survey.questions
        .filter(question => question.questionType !== 3)
        .map(question => {
          return (
            <li key={question.id}>
              <h3>{question.questionText}</h3>

              <ul className={styles.detailOptions}>
                {question.options.map(option => {
                  const selectedCount = submissions
                    .map(
                      submission =>
                        submission.answers.find(
                          answer => answer.question.id === question.id
                        ) || {}
                    )
                    .filter(answer =>
                      (answer.selectedOptions || []).find(o => o === option.id)
                    ).length;

                  return (
                    <li key={option.id}>
                      {option.optionText}: {String(selectedCount)}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
    </ul>
  );
};

export default SubmissionSummary;
