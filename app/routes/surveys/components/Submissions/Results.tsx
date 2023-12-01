import { produce } from 'immer';
import Select from 'react-select';
import { editSurvey } from 'app/actions/SurveyActions';
import DistributionBarChart from 'app/components/Chart/BarChart';
import ChartLabel from 'app/components/Chart/ChartLabel';
import DistributionPieChart from 'app/components/Chart/PieChart';
import { CHART_COLORS } from 'app/components/Chart/utils';
import { selectTheme, selectStyles } from 'app/components/Form/SelectInput';
import InfoBubble from 'app/components/InfoBubble';
import AveragePill from 'app/routes/surveys/components/Submissions/AveragePill';
import { useAppDispatch } from 'app/store/hooks';
import {
  SurveyQuestionDisplayType,
  SurveyQuestionType,
} from 'app/store/models/SurveyQuestion';
import { QuestionTypeValue, QuestionTypeOption } from '../../utils';
import styles from '../surveys.css';
import type { DistributionDataPoint } from 'app/components/Chart/utils';
import type { SelectedSurvey } from 'app/reducers/surveys';
import type { ID } from 'app/store/models';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';

export type GraphData = {
  [questionId: ID]: DistributionDataPoint[];
};
type Props = {
  survey: SelectedSurvey;
  graphData: GraphData;
  numberOfSubmissions: number;
  generateTextAnswers: (question: SurveyQuestion) => any;
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

  const info: Info[] = [
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
      data: survey.event.waitingRegistrationCount ?? 0,
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
        id: ID,
        selectedType: { value: SurveyQuestionDisplayType; label: string }
      ) => {
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

        dispatch(
          editSurvey({
            ...newSurvey,
            surveyId: survey.id,
            event: survey.event.id,
          })
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
      <ul className={styles.summary}>
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
              {question.questionType === SurveyQuestionType.TextField ? (
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
                        />
                      ) : (
                        <DistributionBarChart
                          distributionData={pieData}
                          chartColors={chartColors}
                        />
                      )}
                      {questionIsNumeric && (
                        <span
                          style={{
                            marginLeft: '15px',
                          }}
                        >
                          Gjennomsnittet er{' '}
                          <AveragePill
                            options={question.options}
                            data={graphData[question.id]}
                          />
                        </span>
                      )}
                    </div>
                    <ChartLabel distributionData={graphData[question.id]} />
                  </div>
                  {switchGraph && (
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
                          switchGraph(question.id, selectedType)
                        }
                        components={{
                          Option: (props: any) => {
                            const value = props.data.value;
                            return (
                              <QuestionTypeOption
                                iconName={graphTypeIcon[value]}
                                {...props}
                              />
                            );
                          },
                          SingleValue: (props: any) => {
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
                        onBlur={() => null}
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
