// @flow

import React from 'react';
import styles from '../surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import { QuestionTypes, CHART_COLORS } from '../../utils';
import InfoBubble from 'app/components/InfoBubble';
import { VictoryPie, VictoryTheme } from 'victory';
import type { QuestionEntity } from 'app/reducers/surveys';

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
    <div>
      <div className={styles.eventSummary}>
        <h3>Arrangementet</h3>
        <div className={styles.infoBubbles}>
          <InfoBubble
            icon="person"
            data={String(survey.event.registrationCount)}
            meta="Påmeldte"
            style={{ order: 0 }}
          />
          <InfoBubble
            icon="checkmark"
            data={String(survey.event.attendedCount)}
            meta="Møtte opp"
            style={{ order: 1 }}
          />
          <InfoBubble
            icon="list"
            data={String(survey.event.waitingRegistrationCount)}
            meta="På venteliste"
            style={{ order: 2 }}
          />
          <InfoBubble
            icon="chatboxes"
            data={String(submissions.length)}
            meta="Har svart"
            style={{ order: 3 }}
          />
        </div>
      </div>

      <ul className={styles.summary}>
        {survey.questions.map(question => (
          <li key={question.id}>
            <h3>{question.questionText}</h3>

            {question.questionType === QuestionTypes('text') ? (
              <ul className={styles.textAnswers}>
                {textAnswers(submissions, question)}
              </ul>
            ) : (
              <div className={styles.questionResults}>
                <div style={{ width: '300px' }}>
                  <VictoryPie
                    data={graphData[question.id]}
                    x="option"
                    y="selections"
                    theme={VictoryTheme.material}
                    colorScale={CHART_COLORS}
                    labels={d => d.y}
                    labelRadius={60}
                    padding={{ left: 0, top: 40, right: 30, bottom: 30 }}
                    style={{
                      labels: { fill: 'white', fontSize: 20 }
                    }}
                  />
                </div>

                <ul className={styles.graphData}>
                  {graphData[question.id].map((dataPoint, i) => (
                    <li key={i}>
                      <span
                        className={styles.colorBox}
                        style={{ backgroundColor: CHART_COLORS[i] }}
                      >
                        &nbsp;
                      </span>
                      <span style={{ marginTop: '-5px' }}>
                        {dataPoint.option}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionSummary;
