import { Flex, Icon } from '@webkom/lego-bricks';
import { useOutletContext } from 'react-router-dom';
import { hideAnswer, showAnswer } from 'app/actions/SurveySubmissionActions';
import Tooltip from 'app/components/Tooltip';
import { useAppDispatch } from 'app/store/hooks';
import { isNotNullish } from 'app/utils';
import styles from '../surveys.css';
import Results from './Results';
import type { GraphData } from './Results';
import type { EntityId } from '@reduxjs/toolkit';
import type { SurveysRouteContext } from 'app/routes/surveys';
import type { AdminSurveyAnswer } from 'app/store/models/SurveyAnswer';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { ReactNode } from 'react';

const SubmissionsSummary = () => {
  const { submissions, survey } = useOutletContext<SurveysRouteContext>();
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
              gap="0.5rem"
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
                  onClick={() =>
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

    return texts.length === 0 ? (
      <span className="secondaryFontColor">Ingen svar</span>
    ) : (
      texts
    );
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
