// @flow

import React from 'react';
import styles from '../surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import { QuestionTypes } from '../../utils';

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

              {question.questionType === QuestionTypes('text') ? (
                <ul className={styles.textAnswers}>
                  {submissions
                    .map(submission => {
                      const answer = submission.answers.find(
                        answer => answer.question.id === question.id
                      );
                      return (
                        answer && <li key={answer.id}>{answer.answerText}</li>
                      );
                    })
                    .filter(answer => answer)}
                </ul>
              ) : (
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
                        (answer.selectedOptions || []).find(
                          o => o === option.id
                        )
                      ).length;

                    return (
                      <li key={option.id}>
                        {option.optionText}: {String(selectedCount)}
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

export default SubmissionSummary;
