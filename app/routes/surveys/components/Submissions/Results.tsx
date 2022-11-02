// @flow

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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Select from 'react-select';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';

type Props = {
  survey: SurveyEntity,
  graphData: Object,
  numberOfSubmissions: number,
  generateTextAnswers: (QuestionEntity) => any,
  editSurvey?: (Object) => Promise<*>,
  option: string,
  value: string,
};

type Info = {
  icon: string,
  data: number,
  meta: string,
};

type EventDataProps = {
  info: Array<Info>,
};

type GraphProps = {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  index: number,
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: GraphProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
    editSurvey &&
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
                          <PieChart width={400} height={350}>
                            <Pie
                              data={pieData}
                              cx={200}
                              cy={150}
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={110}
                              dataKey="selections"
                              isAnimationActive={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={pieColors[index % pieColors.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </div>
                      ) : (
                        <div className={styles.barChart}>
                          <BarChart
                            width={375}
                            height={350}
                            data={pieData}
                            margin={{
                              top: 50,
                              right: 30,
                              left: 20,
                              bottom: 10,
                            }}
                          >
                            <XAxis dataKey=" " />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar
                              dataKey="selections"
                              label={{ position: 'top' }}
                              background={{ fill: 'var(--color-mono-gray-5)' }}
                              isAnimationActive={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={pieColors[index % pieColors.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
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
                  {editSurvey && (
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
                        components={{
                          Option: (props: any) => {
                            const value = props.data.value;
                            return (
                              <QuestionTypeOption
                                iconName={graphTypeToIcon[value]}
                                {...props}
                              />
                            );
                          },
                          SingleValue: (props: any) => {
                            const value = props.data.value;
                            return (
                              <QuestionTypeValue
                                iconName={graphTypeToIcon[value]}
                                {...props}
                              />
                            );
                          },
                        }}
                        isClearable={false}
                        backspaceRemoves={false}
                        isSearchable={false}
                        onBlur={() => null}
                        style={{ paddingTop: '7px' }}
                        theme={selectTheme}
                        styles={selectStyles}
                      />
                    </div>
                  )}
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
