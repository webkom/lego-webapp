// @flow

import * as React from 'react';
import styles from '../surveys.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import Results from './Results';
import { TokenNavigation } from '../../utils';

type Props = {
  survey: SurveyEntity,
  actionGrant: ActionGrant,
  results: Object,
  option: string,
  value: string,
  editSurvey: Object => Promise<*>
};

const SubmissionPublicResultsPage = ({
  survey,
  actionGrant,
  option,
  editSurvey,
  value
}: Props) => {
  const { results = {} } = survey;

  const generateTextAnswers = question => {
    let texts = [];
    Object.keys(results[question.id])
      .map(name => {
        if (name !== 'questionType') {
          texts = results[question.id][name].map((answer, i) => (
            <li key={i}>{answer}</li>
          ));
        }
      })
      .filter(Boolean);

    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  const generateQuestionData = questionId => {
    const questionData = [];
    const question =
      survey.questions.find(q => q.id === Number(questionId)) || {};

    Object.keys(results[questionId]).map(optionId => {
      const optionText = (
        question.options.find(o => o.id === Number(optionId)) || {}
      ).optionText;
      if (optionText) {
        questionData.push({
          option: (question.options.find(o => o.id === Number(optionId)) || {})
            .optionText,
          selections: Number(results[questionId][optionId])
        });
      }
    });
    return questionData;
  };

  const graphData = {};
  Object.keys(results).map(questionId => {
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
            editSurvey={editSurvey}
          />
        </ContentMain>
      </ContentSection>
    </Content>
  );
};

export default SubmissionPublicResultsPage;
