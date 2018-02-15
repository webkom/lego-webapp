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
  const textAnswers = (submissions, question) => {
    const texts = submissions
      .map(submission => {
        const answer = submission.answers.find(
          answer => answer.question.id === question.id
        );
        return answer && <li key={answer.id}>{answer.answerText}</li>;
      })
      .filter(Boolean);

    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  return (
    <ul className={styles.summary}>
      {survey.questions.map(question => {
        return (
          <li key={question.id}>
            <h3>{question.questionText}</h3>

            {question.questionType === QuestionTypes('text') ? (
              <ul className={styles.textAnswers}>
                {textAnswers(submissions, question)}
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
                      (answer.selectedOptions || []).find(o => o === option.id)
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
