// @flow

import React from 'react';
import styles from '../surveys.css';
import type { SurveyEntity, QuestionEntity } from 'app/reducers/surveys';
import { QuestionTypes, CHART_COLORS } from '../../utils';
import InfoBubble from 'app/components/InfoBubble';
import { VictoryPie, VictoryTheme } from 'victory';

type Props = {
  survey: SurveyEntity,
  graphData: Object,
  numberOfSubmissions: number,
  generateTextAnswers: QuestionEntity => any
};

const Results = ({
  graphData,
  generateTextAnswers,
  survey,
  numberOfSubmissions
}: Props) => {
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
            data={String(numberOfSubmissions)}
            meta="Har svart"
            style={{ order: 3 }}
          />
        </div>
      </div>

      <ul className={styles.summary}>
        {survey.questions.map(question => {
          const colorsToRemove = [];
          const pieData = graphData[question.id].filter((dataPoint, i) => {
            if (dataPoint.selections === 0) {
              colorsToRemove.push(i);
              return false;
            }
            return true;
          });
          const pieColors = CHART_COLORS.filter(
            (color, i) => !colorsToRemove.includes(i)
          );
          const labelRadius = pieData.length === 1 ? -10 : 60;

          return (
            <li key={question.id}>
              <h3>{question.questionText}</h3>

              {question.questionType === QuestionTypes('text') ? (
                <ul className={styles.textAnswers}>
                  {generateTextAnswers(question)}
                </ul>
              ) : (
                <div className={styles.questionResults}>
                  <div style={{ width: '300px' }}>
                    <VictoryPie
                      data={pieColors}
                      x="option"
                      y="selections"
                      theme={VictoryTheme.material}
                      colorScale={pieColors}
                      labels={d => d.y}
                      labelRadius={labelRadius}
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
          );
        })}
      </ul>
    </div>
  );
};

export default Results;
