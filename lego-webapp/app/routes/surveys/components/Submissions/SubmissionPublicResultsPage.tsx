import {
  LinkButton,
  LoadingIndicator,
  Page,
  PageCover,
} from '@webkom/lego-bricks';
import { useParams } from 'react-router';
import EmptyState from '~/components/EmptyState';
import { useAppSelector } from '~/redux/hooks';
import { SurveyQuestionType } from '~/redux/models/SurveyQuestion';
import { useFetchedSurvey } from '~/redux/slices/surveys';
import useQuery from '~/utils/useQuery';
import Results from './Results';
import type { GraphData } from './Results';
import type { EntityId } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import type { SurveyQuestion } from '~/redux/models/SurveyQuestion';

type SubmissionsPublicResultsParams = {
  surveyId: string;
};
const SubmissionPublicResultsPage = () => {
  const { surveyId } =
    useParams<SubmissionsPublicResultsParams>() as SubmissionsPublicResultsParams;
  const { query } = useQuery({ token: '' });
  const { survey, event } = useFetchedSurvey(
    'submissionPublicResults',
    surveyId,
    query.token,
  );
  const results = survey?.results;
  const actionGrant = useAppSelector((state) => state.surveys.actionGrant);

  if (!survey || !results) {
    return <LoadingIndicator loading />;
  }

  const generateTextAnswers = (question: SurveyQuestion): ReactNode => {
    const result = results[question.id];
    if (result.questionType !== SurveyQuestionType.TextField) {
      return [];
    }
    if (result.answers.length === 0) {
      return <EmptyState body="Ingen svar" />;
    }
    return result.answers.map((answer, i) => <li key={i}>{answer}</li>);
  };

  const generateQuestionData = (questionId: EntityId) => {
    const questionData: GraphData[EntityId] = [];
    const question = survey.questions.find((q) => q.id === Number(questionId));
    if (!question) {
      return questionData;
    }
    Object.keys(results[questionId]).forEach((optionId) => {
      const optionText = question.options.find(
        (o) => o.id === Number(optionId),
      )?.optionText;

      if (optionText) {
        questionData.push({
          name: optionText,
          count: Number(results[questionId][optionId]),
        });
      }
    });
    return questionData;
  };

  const graphData: GraphData = {};
  Object.keys(results).forEach((questionId) => {
    graphData[Number(questionId)] = generateQuestionData(questionId);
  });
  return (
    <Page
      cover={
        <PageCover
          image={event?.cover}
          imagePlaceholder={event?.coverPlaceholder}
        />
      }
      title={survey.title}
      actionButtons={
        actionGrant.includes('edit') && (
          <LinkButton href={`/surveys/${surveyId}/submissions/summary`}>
            Adminversjon
          </LinkButton>
        )
      }
    >
      <Results
        survey={{ ...survey, token: null, actionGrant: [] }}
        graphData={graphData}
        numberOfSubmissions={survey.submissionCount}
        generateTextAnswers={generateTextAnswers}
      />
    </Page>
  );
};

export default SubmissionPublicResultsPage;
