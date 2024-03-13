import { Button } from '@webkom/lego-bricks';
import { hideAnswer, showAnswer } from 'app/actions/SurveySubmissionActions';
import { useAppDispatch } from 'app/store/hooks';
import { isNotNullish } from 'app/utils';
import styles from '../surveys.css';
import Results from './Results';
import type { GraphData } from './Results';
import type { SelectedSurvey } from 'app/reducers/surveys';
import type { ID } from 'app/store/models';
import type { AdminSurveyAnswer } from 'app/store/models/SurveyAnswer';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';
import type { ReactNode } from 'react';

type Props = {
  submissions: SurveySubmission[];
  survey: SelectedSurvey;
};

const SubmissionsSummary = ({ submissions, survey }: Props) => {
  const dispatch = useAppDispatch();

  const generateTextAnswers = (question: SurveyQuestion): ReactNode => {
    const texts: ReactNode[] = submissions
      .map((submission) => {
        const answer = submission.answers.find(
          (answer) => answer.question.id === question.id
        ) as AdminSurveyAnswer;
        return (
          answer && (
            <li
              key={answer.id}
              className={styles.adminAnswer}
              style={{
                backgroundColor: answer.hideFromPublic
                  ? 'var(--additive-background)'
                  : undefined,
                padding: answer.hideFromPublic ? '5px' : undefined,
              }}
            >
              <span>{answer.answerText}</span>
              {answer.hideFromPublic ? (
                <Button
                  flat
                  onClick={() =>
                    dispatch(showAnswer(survey.id, submission.id, answer.id))
                  }
                >
                  vis
                </Button>
              ) : (
                <Button
                  flat
                  onClick={() =>
                    dispatch(hideAnswer(survey.id, submission.id, answer.id))
                  }
                >
                  skjul
                </Button>
              )}
            </li>
          )
        );
      })
      .filter(isNotNullish);
    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  const generateQuestionData = (question: SurveyQuestion) => {
    const questionData: GraphData[ID] = [];
    question.options.forEach((option) => {
      const selectedCount = submissions
        .map((submission) =>
          submission.answers.find(
            (answer) => answer.question.id === question.id
          )
        )
        .filter((answer) =>
          (answer?.selectedOptions || []).find((o) => o === option.id)
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
