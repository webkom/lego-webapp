import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import type { SurveyEntity } from 'app/reducers/surveys';
import { TokenNavigation } from '../../utils';
import styles from '../surveys.css';
import Results from './Results';
import type { EntityId } from '@reduxjs/toolkit';

type Props = {
  survey: SurveyEntity;
  actionGrant: ActionGrant;
  results: Record<string, any>;
  option: string;
  value: string;
};

const SubmissionPublicResultsPage = ({
  survey,
  actionGrant,
  option,
  value,
}: Props) => {
  const { results = {} } = survey;

  const generateTextAnswers = (question) => {
    let texts = [];
    Object.keys(results[question.id]).forEach((name) => {
      if (name !== 'questionType') {
        texts = results[question.id][name].map((answer, i) => (
          <li key={i}>{answer}</li>
        ));
      }
    });
    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  const generateQuestionData = (questionId: EntityId) => {
    const questionData: { option: string; selections: number }[] = [];
    const question =
      survey.questions.find((q) => q.id === Number(questionId)) || {};
    Object.keys(results[questionId]).forEach((optionId) => {
      const optionText = (
        question.options.find((o) => o.id === Number(optionId)) || {}
      ).optionText;

      if (optionText) {
        questionData.push({
          option: (
            question.options.find((o) => o.id === Number(optionId)) || {}
          ).optionText,
          selections: Number(results[questionId][optionId]),
        });
      }
    });
    return questionData;
  };

  const graphData = {};
  Object.keys(results).forEach((questionId) => {
    graphData[Number(questionId)] = generateQuestionData(questionId);
  });
  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <TokenNavigation
        title={survey.title}
        actionGrant={actionGrant}
        surveyId={survey.id}
      />

      <ContentSection>
        <ContentMain>
          <Results
            survey={survey}
            graphData={graphData}
            numberOfSubmissions={survey.submissionCount || 0}
            generateTextAnswers={generateTextAnswers}
            option={option}
            value={value}
          />
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default SubmissionPublicResultsPage;
