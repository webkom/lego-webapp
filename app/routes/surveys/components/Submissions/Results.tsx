import { produce } from 'immer';
import Select from 'react-select';
import DistributionBarChart from 'app/components/Chart/BarChart';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import { CHART_COLORS } from 'app/components/Chart/utils';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import InfoBubble from 'app/components/InfoBubble';
import Tag, { type TagColors } from 'app/components/Tags/Tag';
import type { SurveyEntity, QuestionEntity } from 'app/reducers/surveys';
import {
  QuestionTypes,
  QuestionTypeValue,
  QuestionTypeOption,
} from '../../utils';
import styles from '../surveys.module.css';

type Props = {
  survey: SurveyEntity;
  graphData: Record<string, any>;
  numberOfSubmissions: number;
  generateTextAnswers: (arg0: QuestionEntity) => any;
  editSurvey?: (arg0: Record<string, any>) => Promise<any>;
  option: string;
  value: string;
};
type Info = {
  icon: string;
  data: number;
  meta: string;
};
type EventDataProps = {
  info: Array<Info>;
};

const EventData = ({ info }: EventDataProps) => {
  return info.map((dataPoint, i) => (
    <InfoBubble
      key={i}
      icon={dataPoint.icon}
      data={String(dataPoint.data)}
      meta={dataPoint.meta}
      style={{
        order: i,
      }}
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
    {
      value: 'pie_chart',
      label: 'Kakediagram',
    },
    {
      value: 'bar_chart',
      label: 'Stolpediagram',
    },
  ];

  const switchGraph = (id, index, selectedType) => {
    const questionToUpdate = survey.questions.find(
      (question) => question.id === id
    );

    if (
      !questionToUpdate ||
      questionToUpdate.displayType === selectedType.value
    ) {
      return;
    }

    const newQuestion = produce(questionToUpdate, (draft) => {
      draft.displayType = selectedType.value;
    });
    const qIndex = survey.questions.indexOf(questionToUpdate);
    const newQuestions = produce(survey.questions, (draft) => {
      draft[qIndex] = newQuestion;
    });
    const newSurvey = { ...survey, questions: newQuestions };
    editSurvey &&
      editSurvey({ ...newSurvey, surveyId: survey.id, event: survey.event.id });
  };

  const getAverage = (data) => {
    const [sum, numberOfAnswers] = data.reduce(
      (accumulator, optionData) => {
        const optionNumber = Number(optionData.option.match(/^\d+/)[0]);
        return [
          accumulator[0] + optionData.selections * optionNumber,
          accumulator[1] + optionData.selections,
        ];
      },
      [0, 0]
    );
    return Number((sum / numberOfAnswers).toFixed(2));
  };

  // Returns the lowest and highest number that an option starts with
  const getMinMaxOption = (options) => {
    return options.reduce(
      (result, option) => {
        const optionNumber = Number(option.optionText.match(/^\d+/)[0]);
        return [
          Math.min(result[0], optionNumber),
          Math.max(result[1], optionNumber),
        ];
      },
      [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    );
  };

  // Linear transform used to map the average from the interval of the alternatives to the interval of number of colors used for the pill
  const mapValueToNewInterval = (value, start, end, newStart, newEnd) => {
    return ((value - start) * (newEnd - newStart)) / (end - start) + newStart;
  };

  const averageTagColors: TagColors[] = ['red', 'orange', 'yellow', 'green'];

  const averagePill = (options, data) => {
    const average = getAverage(data);
    const [optionMin, optionMax] = getMinMaxOption(options);
    const mappedAverage = mapValueToNewInterval(
      average,
      optionMin,
      optionMax,
      0,
      averageTagColors.length - 1
    );

    return (
      <Tag
        color={averageTagColors[Math.round(mappedAverage)]}
        tag={Number.isNaN(average) ? '?' : String(average)}
      />
    );
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
          const chartColors = CHART_COLORS.filter(
            (_, i) => !colorsToRemove.includes(i)
          );
          const graphType = graphOptions.find(
            (a) => a.value === question.displayType
          );
          const questionIsNumeric = question.options.reduce(
            (result, option) => result && /^\d+/.test(option.optionText),
            true
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
                    <div
                      style={{
                        width: '375px',
                      }}
                    >
                      {question.displayType !== 'bar_chart' ? (
                        <DistributionPieChart
                          distributionData={pieData}
                          chartColors={chartColors}
                          dataKey="selections"
                        />
                      ) : (
                        <DistributionBarChart
                          distributionData={pieData}
                          chartColors={chartColors}
                          dataKey="selections"
                        />
                      )}
                      {questionIsNumeric && (
                        <span
                          style={{
                            marginLeft: '15px',
                          }}
                        >
                          Gjennomsnittet er{' '}
                          {averagePill(
                            question.options,
                            graphData[question.id]
                          )}
                        </span>
                      )}
                    </div>
                    <ChartLabel
                      distributionData={graphData[question.id].map((data) => ({
                        name: data.option,
                        count: data.selections,
                      }))}
                    />
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
                        style={{
                          paddingTop: '7px',
                        }}
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
