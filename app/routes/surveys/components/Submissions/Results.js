// @flow

import React from 'react';

import styles from '../surveys.css';

import type { SurveyEntity, QuestionEntity } from 'app/reducers/surveys';
import {
  QuestionTypes,
  CHART_COLORS,
  QuestionTypeValue,
  QuestionTypeOption,
} from '../../utils';
import InfoBubble from 'app/components/InfoBubble';
import {
  VictoryPie,
  VictoryTheme,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
} from 'victory';
import Select from 'react-select';

type Props = {
  survey: SurveyEntity,
  graphData: Object,
  numberOfSubmissions: number,
  generateTextAnswers: (QuestionEntity) => any,
  editSurvey: (Object) => Promise<*>,
  option: string,
  value: string,
};

type EventDataProps = {
  info: Array<Info>,
};

type Info = {
  icon: string,
  data: number,
  meta: string,
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
  numberOfSubmissions,
  editSurvey,
}: Props) => {
  const info = [
    {
      icon: 'person',
      data: survey.event.registrationCount,
      meta: 'Påmeldte',
    },
    {
      icon: 'checkmark',
      data: survey.event.attendedCount,
      meta: 'Møtte opp',
    },
    {
      icon: 'list',
      data: survey.event.waitingRegistrationCount,
      meta: 'På venteliste',
    },
    {
      icon: 'chatboxes',
      data: numberOfSubmissions,
      meta: 'Har svart',
    },
  ];

  const graphOptions = [
    { value: 'pie_chart', label: 'Kakediagram' },
    { value: 'bar_chart', label: 'Stolpediagram' },
  ];

  const switchGraph = (id, index, selectedType) => {
    const newQuestions = survey.questions;
    const questionToUpdate = newQuestions.find(
      (question) => question.id === id
    );
    if (
      !questionToUpdate ||
      questionToUpdate.displayType === selectedType.value
    ) {
      return;
    }
    questionToUpdate.displayType =
      questionToUpdate.displayType === 'pie_chart' ? 'bar_chart' : 'pie_chart';
    const qIndex = newQuestions.indexOf(
      newQuestions.find((question) => question.id === id)
    );
    newQuestions[qIndex] = questionToUpdate;
    const newSurvey = { ...survey, questions: newQuestions };
    editSurvey({ ...newSurvey, surveyId: survey.id, event: survey.event.id });
  };

  const graphTypeToIcon = {
    bar_chart: 'bar-chart',
    pie_chart: 'pie-chart',
  };

  return (
    <div>
      <div className={styles.eventSummary}>
        <h3>Arrangementet</h3>
        <div className={styles.infoBubbles}>
          <EventData info={info} />
        </div>
      </div>
      <ul className={styles.summary}>
        {survey.questions.map((question, index) => {
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
          const graphType = graphOptions.find(
            (a) => a.value === question.displayType
          );
          const barData = graphData[question.id];
          const labelRadius = pieData.length === 1 ? -10 : 60;
          const highestSubmissionsCount = barData.reduce(
            (a, b) => Math.max(a, b.selections),
            0
          );

          return (
            <li key={question.id}>
              <h3>{question.questionText}</h3>

              {question.questionType === QuestionTypes('text') ? (
                <ul className={styles.textAnswers}>
                  {generateTextAnswers(question)}
                </ul>
              ) : (
                <div className={styles.graphContainer}>
                  <div className={styles.questionResults}>
                    <div style={{ width: '375px' }}>
                      {question.displayType !== 'bar_chart' ? (
                        <div className={styles.pieChart}>
                          <VictoryPie
                            data={pieData}
                            x="option"
                            y="selections"
                            theme={VictoryTheme.material}
                            colorScale={pieColors}
                            labels={({ datum }) => datum.selections}
                            labelRadius={labelRadius}
                            padding={{
                              left: 0,
                              top: 40,
                              right: 30,
                              bottom: 30,
                            }}
                            style={{
                              labels: { fill: 'white', fontSize: 20 },
                            }}
                          />
                        </div>
                      ) : (
                        <div className={styles.barChart}>
                          <VictoryChart
                            theme={VictoryTheme.material}
                            domain={{
                              x: [0, barData.length],
                              y: [0, highestSubmissionsCount + 2],
                            }}
                            style={{ grid: { stroke: 'none' } }}
                            domainPadding={{ x: 50, y: 20 }}
                          >
                            <VictoryAxis
                              dependentAxis={true}
                              style={{
                                grid: { stroke: 'none' },
                              }}
                            />
                            <VictoryBar
                              style={{
                                data: {
                                  fill: ({ index }) => CHART_COLORS[index],
                                },
                                labels: { fill: 'white', fontSize: 20 },
                              }}
                              labels={({ datum }) => datum.selections}
                              labelComponent={<VictoryLabel dy={30} />}
                              data={barData}
                              x="option"
                              y="selections"
                              alignment={'middle'}
                              barRatio={0.8}
                              samples={100}
                            />
                            <VictoryAxis
                              style={{
                                grid: { stroke: 'none' },
                              }}
                              tickFormat={() => ''}
                            />
                          </VictoryChart>
                        </div>
                      )}
                    </div>

                    <div>
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
                  </div>
                  <div className={styles.selectGraphContainer}>
                    <Select
                      className={styles.selectGraph}
                      value={{
                        value: question.displayType,
                        label: graphType && graphType.label,
                      }}
                      placeholder="Graf"
                      name="displayType"
                      options={graphOptions}
                      onChange={(selectedType) =>
                        switchGraph(question.id, index, selectedType)
                      }
                      optionComponent={(props) => {
                        return QuestionTypeOption(
                          props,
                          graphTypeToIcon[props.option && props.option.value],
                          'fa fa-'
                        );
                      }}
                      valueComponent={(props) =>
                        QuestionTypeValue(
                          props,
                          graphTypeToIcon[props.value && props.value.value],
                          'fa fa-'
                        )
                      }
                      clearable={false}
                      backspaceRemoves={false}
                      searchable={false}
                      onBlur={() => null}
                      style={{ paddingTop: '7px' }}
                    />
                  </div>
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
