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

type EventDataProps = {
  info: Array<Info>
};

type Info = {
  icon: string,
  data: number,
  meta: string
};

const EventData = ({ info }: EventDataProps) => {
  return info.map((dataPoint, i) => (
    <InfoBubble
      key={i}
      icon={dataPoint.icon}
      data={String(dataPoint.data)}
      meta={dataPoint.meta}
      style={{ order: i }}
    />
  ));
};

const Results = ({
  graphData,
  generateTextAnswers,
  survey,
  numberOfSubmissions
}: Props) => {
  const info = [
    {
      icon: 'person',
      data: survey.event.registrationCount,
      meta: 'Påmeldte'
    },
    {
      icon: 'checkmark',
      data: survey.event.attendedCount,
      meta: 'Møtte opp'
    },
    {
      icon: 'list',
      data: survey.event.waitingRegistrationCount,
      meta: 'På venteliste'
    },
    {
      icon: 'chatboxes',
      data: numberOfSubmissions,
      meta: 'Har svart'
    }
  ];

  return (
    <div>
      <div className={styles.eventSummary}>
        <h3>Arrangementet</h3>
        <div className={styles.infoBubbles}>
          <EventData info={info} />
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
                      data={pieData}
                      x="option"
                      y="selections"
                      theme={VictoryTheme.material}
                      colorScale={pieColors}
                      labels={d => d.y}
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
