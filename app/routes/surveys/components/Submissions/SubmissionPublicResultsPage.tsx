import { LoadingIndicator } from '@webkom/lego-bricks';
import { useParams } from 'react-router-dom';
import { Content, ContentMain, ContentSection } from 'app/components/Content';
import { useFetchedSurvey } from 'app/reducers/surveys';
import { SurveyQuestionType } from 'app/store/models/SurveyQuestion';
import useQuery from 'app/utils/useQuery';
import { TokenNavigation } from '../../utils';
import Results from './Results';
import type { GraphData } from './Results';
import type { EntityId } from '@reduxjs/toolkit';
import type { SurveyQuestion } from 'app/store/models/SurveyQuestion';
import type { ReactNode } from 'react';

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

  if (!survey || !results) {
    return <LoadingIndicator loading />;
  }

  const generateTextAnswers = (question: SurveyQuestion): ReactNode => {
    const result = results[question.id];
    if (result.questionType !== SurveyQuestionType.TextField) {
      return [];
    }
    if (result.answers.length === 0) {
      return <span className="secondaryFontColor">Ingen svar</span>;
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
    <Content banner={event?.cover}>
      <TokenNavigation title={survey.title} surveyId={survey.id} />

      <ContentSection>
        <ContentMain>
          <Results
            survey={{ ...survey, token: null, actionGrant: [] }}
            graphData={graphData}
            numberOfSubmissions={survey.submissionCount}
            generateTextAnswers={generateTextAnswers}
          />
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default SubmissionPublicResultsPage;
