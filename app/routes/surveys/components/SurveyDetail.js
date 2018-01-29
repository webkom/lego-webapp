// @flow

import React from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import styles from './surveyDetail.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { DetailNavigation } from '../utils.js';
import { Content } from 'app/components/Content';
import { TextArea, CheckBox, RadioButton } from 'app/components/Form';

type Props = {
  survey: SurveyEntity,
  deleteSurvey: number => Promise<*>
};

const SurveyDetail = (props: Props) => {
  const { survey, deleteSurvey } = props;

  if (!survey.event) return <LoadingIndicator />;

  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <DetailNavigation
        title={survey.title}
        surveyId={Number(survey.id)}
        deleteFunction={deleteSurvey}
      />

      <div className={styles.surveyTime}>
        Spørreundersøkelse for{' '}
        <Link to={`/surveys/${survey.event}`}>{survey.event.title}</Link>
      </div>

      <div className={styles.surveyTime}>
        Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
      </div>

      <ul className={styles.detailQuestions}>
        {survey.questions.map(question => (
          <li key={question.id}>
            <h3 className={styles.questionTextDetail}>
              {question.questionText}
              {question.mandatory && (
                <span className={styles.mandatory}> *</span>
              )}
            </h3>

            {question.questionType === 3 ? (
              <TextArea
                value=""
                placeholder="Fritekst..."
                className={styles.freeText}
              />
            ) : (
              <ul className={styles.detailOptions}>
                {question.options.map(option => (
                  <li key={option.id}>
                    {question.questionType === 1 ? (
                      <RadioButton value={false} className={styles.option} />
                    ) : (
                      <CheckBox checked={false} className={styles.option} />
                    )}
                    {option.optionText}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Content>
  );
};

export default SurveyDetail;
