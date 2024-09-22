import { Flex } from '@webkom/lego-bricks';
import { produce } from 'immer';
import { editSurvey } from 'app/actions/SurveyActions';
import DistributionBarChart from 'app/components/Chart/BarChart';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import { CHART_COLORS } from 'app/components/Chart/utils';
import SelectInput from 'app/components/Form/SelectInput';
import InfoBubble from 'app/components/InfoBubble';
import { selectTransformedEventById } from 'app/reducers/events';
import AveragePill from 'app/routes/surveys/components/Submissions/AveragePill';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
  SurveyQuestionDisplayType,
  SurveyQuestionType,
} from 'app/store/models/SurveyQuestion';
import { QuestionTypeValue, QuestionTypeOption } from '../../utils';
import styles from '../surveys.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import type { EventForSurvey } from 'app/store/models/Event';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { ReactNode } from 'react';

export type GraphData = {
  [questionId: EntityId]: DistributionDataPoint[];
};
type Props = {
  survey: DetailedSurvey;
  graphData: GraphData;
  numberOfSubmissions: number;
  generateTextAnswers: (question: SurveyQuestion) => ReactNode;
};
type Info = {
  icon: string;
  data: number;
  meta: string;
};
type EventDataProps = {
  info: Info[];
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

const graphOptions = [
  {
    value: SurveyQuestionDisplayType.PieChart,
    label: 'Kakediagram',
  },
  {
    value: SurveyQuestionDisplayType.BarChart,
    label: 'Stolpediagram',
  },
];

const graphTypeIcon: Record<SurveyQuestionDisplayType, string> = {
  bar_chart: 'bar-chart',
  pie_chart: 'pie-chart',
};

const Results = ({
  graphData,
  generateTextAnswers,
  survey,
  numberOfSubmissions,
}: Props) => {
  const dispatch = useAppDispatch();
  const event = useAppSelector((state) =>
    selectTransformedEventById(state, { eventId: survey.event }),
  ) as EventForSurvey;

  const info: Info[] = [
    {
      icon: 'person',
      data: event.registrationCount,
      meta: 'Påmeldte',
    },
    {
      icon: 'checkmark',
      data: event.attendedCount,
      meta: 'Møtte opp',
    },
    {
      icon: 'list',
      data: event.waitingRegistrationCount ?? 0,
      meta: 'På venteliste',
    },
    {
      icon: 'chatbox-ellipses',
      data: numberOfSubmissions,
      meta: 'Har svart',
    },
  ];

  const switchGraph = survey.actionGrant.includes('edit')
    ? (
        id: EntityId,
        selectedType: { value: SurveyQuestionDisplayType; label: string },
      ) => {
        const questionToUpdate = survey.questions.find(
          (question) => question.id === id,
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

        dispatch(
          editSurvey({
            ...newSurvey,
            surveyId: survey.id,
            event: event.id,
          }),
        );
      }
    : undefined;

  return (
    <div>
      <div className={styles.eventSummary}>
        <h3>Arrangementet</h3>
        <div className={styles.infoBubbles}>
          <EventData info={info} />
        </div>
      </div>

      <Flex column gap="var(--spacing-md)">
        {survey.questions.map((question) => {
          const colorsToRemove: number[] = [];
          const pieData = graphData[question.id].filter((dataPoint, i) => {
            if (dataPoint.count === 0) {
              colorsToRemove.push(i);
              return false;
            }

            return true;
          });
          const chartColors = CHART_COLORS.filter(
            (_, i) => !colorsToRemove.includes(i),
          );
          const graphType = graphOptions.find(
            (a) => a.value === question.displayType,
          );
          const questionIsNumeric =
            question.questionType !== SurveyQuestionType.TextField &&
            question.options.reduce(
              (result, option) => result && /^\d+/.test(option.optionText),
              true,
            );

          return (
            <div key={question.id}>
              <h3>{question.questionText}</h3>
              {question.questionType === SurveyQuestionType.TextField ? (
                <Flex column gap="var(--spacing-xs)">
                  {generateTextAnswers(question)}
                </Flex>
              ) : (
                <div className={styles.graphContainer}>
                  <div className={styles.questionResults}>
                    {question.displayType !==
                    SurveyQuestionDisplayType.BarChart ? (
                      <DistributionPieChart
                        distributionData={pieData}
                        chartColors={chartColors}
                      />
                    ) : (
                      <DistributionBarChart
                        distributionData={pieData}
                        chartColors={chartColors}
                      />
                    )}

                    <Flex column gap="1.5rem">
                      {switchGraph && (
                        <SelectInput
                          className={styles.selectGraph}
                          value={{
                            value: question.displayType,
                            label: graphType && graphType.label,
                          }}
                          placeholder="Graf"
                          name="displayType"
                          options={graphOptions}
                          onChange={(selectedType) =>
                            switchGraph(question.id, selectedType)
                          }
                          components={{
                            Option: (props) => {
                              const value = props.data.value;
                              return (
                                <QuestionTypeOption
                                  iconName={graphTypeIcon[value]}
                                  {...props}
                                />
                              );
                            },
                            SingleValue: (props) => {
                              const value = props.data.value;
                              return (
                                <QuestionTypeValue
                                  iconName={graphTypeIcon[value]}
                                  {...props}
                                />
                              );
                            },
                          }}
                          isClearable={false}
                          isSearchable={false}
                        />
                      )}

                      <ChartLabel distributionData={graphData[question.id]} />
                    </Flex>
                  </div>
                </div>
              )}

              {questionIsNumeric && (
                <Flex alignItems="center" gap="5px" className={styles.average}>
                  Gjennomsnittet er
                  <AveragePill
                    options={question.options}
                    data={graphData[question.id]}
                  />
                </Flex>
              )}
            </div>
          );
        })}
      </Flex>
    </div>
  );
};

export default Results;
