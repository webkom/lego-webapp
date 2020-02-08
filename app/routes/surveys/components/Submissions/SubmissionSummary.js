// @flow

import React from 'react';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { QuestionEntity } from 'app/reducers/surveys';
import Results from './Results';
import styles from '../surveys.css';
import Button from 'app/components/Button';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  survey: SurveyEntity,
  hideAnswer: (number, number, number) => Promise<*>,
  showAnswer: (number, number, number) => Promise<*>,
  editSurvey: Object => Promise<*>,
  value: string,
  option: string
};

const SubmissionSummary = ({
  submissions,
  survey,
  hideAnswer,
  showAnswer,
  editSurvey,
  option,
  value
}: Props) => {
  const generateTextAnswers = question => {
    const texts = submissions
      .map(submission => {
        const answer = submission.answers.find(
          answer => answer.question.id === question.id
        );
        return (
          answer && (
            <li
              key={answer.id}
              className={styles.adminAnswer}
              style={{
                backgroundColor: answer.hideFromPublic && 'var(--lego-color-gray-light)',
                padding: answer.hideFromPublic && '5px'
              }}
            >
              <span>{answer.answerText}</span>
              {answer.hideFromPublic ? (
                <Button
                  flat
                  onClick={() =>
                    showAnswer(survey.id, submission.id, answer.id)
                  }
                >
                  vis
                </Button>
              ) : (
                <Button
                  flat
                  onClick={() =>
                    hideAnswer(survey.id, submission.id, answer.id)
                  }
                >
                  skjul
                </Button>
              )}
            </li>
          )
        );
      })
      .filter(Boolean);

    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  const generateQuestionData = (question: QuestionEntity) => {
    const questionData = [];

    question.options.map(option => {
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

      questionData.push({
        option: option.optionText,
        selections: selectedCount
      });
    });
    return questionData;
  };

  const graphData = {};
  survey.questions.map(question => {
    graphData[question.id] = generateQuestionData(question);
  });

  return (
    <Results
      survey={survey}
      graphData={graphData}
      generateTextAnswers={generateTextAnswers}
      numberOfSubmissions={submissions.length}
      editSurvey={editSurvey}
      option={option}
      value={value}
    />
  );
};

export default SubmissionSummary;
