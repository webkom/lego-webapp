import { Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import { ReactNode, useContext } from 'react';
import EmptyState from '~/components/EmptyState';
import Tooltip from '~/components/Tooltip';
import { SurveysRouteContext } from '~/pages/surveys/@surveyId/(wrapper)/SurveysRouteContext';
import {
  hideAnswer,
  showAnswer,
} from '~/redux/actions/SurveySubmissionActions';
import { useAppDispatch } from '~/redux/hooks';
import { isNotNullish } from '~/utils';
import styles from '../../../../components/surveys.module.css';
import Results from '../Results';
import type { GraphData } from '../Results';
import type { EntityId } from '@reduxjs/toolkit';
import type { AdminSurveyAnswer } from '~/redux/models/SurveyAnswer';
import type { SurveyQuestion } from '~/redux/models/SurveyQuestion';

const SubmissionsSummary = () => {
  const { submissions, survey, fetchingSubmissions } =
    useContext(SurveysRouteContext);
  const dispatch = useAppDispatch();

  const generateTextAnswers = (question: SurveyQuestion): ReactNode => {
    const texts: ReactNode[] = submissions
      .map((submission) => {
        const answer = submission.answers.find(
          (answer) => answer.question.id === question.id,
        ) as AdminSurveyAnswer;
        return (
          answer &&
          answer.answerText && (
            <Flex
              key={answer.id}
              justifyContent="space-between"
              alignItems="center"
              gap="var(--spacing-sm)"
            >
              <span
                className={styles.answerText}
                style={{
                  backgroundColor: answer.hideFromPublic
                    ? 'rgba(255, 0, 0, var(--low-alpha)'
                    : undefined,
                }}
              >
                {answer.answerText}
              </span>
              <Tooltip
                content={
                  answer.hideFromPublic ? 'Vis kommentar' : 'Skjul kommentar'
                }
              >
                <Icon
                  onPress={() =>
                    dispatch(
                      answer.hideFromPublic
                        ? showAnswer(survey.id, submission.id, answer.id)
                        : hideAnswer(survey.id, submission.id, answer.id),
                    )
                  }
                  name={
                    answer.hideFromPublic ? 'eye-outline' : 'eye-off-outline'
                  }
                />
              </Tooltip>
            </Flex>
          )
        );
      })
      .filter(isNotNullish);

    if (fetchingSubmissions) {
      return <Skeleton array={5} className={styles.textAnswerSkeleton} />;
    }

    return texts.length === 0 ? <EmptyState body="Ingen svar" /> : texts;
  };

  const generateQuestionData = (question: SurveyQuestion) => {
    const questionData: GraphData[EntityId] = [];
    question.options.forEach((option) => {
      const selectedCount = submissions
        .map((submission) =>
          submission.answers.find(
            (answer) => answer.question.id === question.id,
          ),
        )
        .filter((answer) =>
          (answer?.selectedOptions || []).find((o) => o === option.id),
        ).length;
      questionData.push({
        name: option.optionText,
        count: selectedCount,
      });
    });
    return questionData;
  };

  const graphData: GraphData = {};
  survey.questions.forEach((question) => {
    graphData[question.id] = generateQuestionData(question);
  });

  return (
    <Results
      survey={survey}
      graphData={graphData}
      generateTextAnswers={generateTextAnswers}
      numberOfSubmissions={submissions.length}
    />
  );
};

export default SubmissionsSummary;
