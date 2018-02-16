// @flow

import React from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import styles from './surveyDetail.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import { DetailNavigation, QuestionTypes } from '../utils.js';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import AdminSideBar from './AdminSideBar';
import { TextArea, CheckBox, RadioButton } from 'app/components/Form';
import Button from 'app/components/Button';

type Props = {
  survey: SurveyEntity,
  deleteSurvey: number => Promise<*>,
  actionGrant: ActionGrant,
  push: string => void
};

const SurveyDetail = (props: Props) => {
  const { survey, deleteSurvey, actionGrant, push } = props;

  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <DetailNavigation
        title={survey.title}
        surveyId={Number(survey.id)}
        deleteFunction={deleteSurvey}
      />

      <ContentSection>
        <ContentMain>
          <div className={styles.surveyTime}>
            Spørreundersøkelse for{' '}
            <Link to={`/surveys/${survey.event}`}>{survey.event.title}</Link>
          </div>

          <div className={styles.surveyTime}>
            Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
          </div>

          <Button style={{ marginTop: '30px' }}>
            <Link to={`/surveys/${survey.id}/answer`}>
              Begynn å svare på undersøkelsen
            </Link>
          </Button>

          <ul className={styles.detailQuestions}>
            {survey.questions.map(question => (
              <li key={question.id}>
                <h3 className={styles.questionTextDetail}>
                  {question.questionText}
                  {question.mandatory && (
                    <span className={styles.mandatory}> *</span>
                  )}
                </h3>

                {question.questionType === QuestionTypes('text') ? (
                  <TextArea
                    value=""
                    placeholder="Fritekst..."
                    className={styles.freeText}
                  />
                ) : (
                  <ul className={styles.detailOptions}>
                    {question.options.map(option => (
                      <li key={option.id}>
                        {question.questionType === QuestionTypes('single') ? (
                          <RadioButton value={false} />
                        ) : (
                          <CheckBox checked={false} />
                        )}
                        {option.optionText}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </ContentMain>

        <AdminSideBar
          surveyId={survey.id}
          actionGrant={actionGrant}
          push={push}
          deleteFunction={deleteSurvey}
        />
      </ContentSection>
    </Content>
  );
};

export default SurveyDetail;
