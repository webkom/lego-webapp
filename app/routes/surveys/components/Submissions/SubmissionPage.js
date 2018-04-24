// @flow

import * as React from 'react';
import styles from '../surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import { DetailNavigation } from '../../utils';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import { Link } from 'react-router';
import AdminSideBar from '../AdminSideBar';
import type { ActionGrant } from 'app/models';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  survey: SurveyEntity,
  children: React.Element<*>,
  actionGrant: ActionGrant,
  isSummary: boolean
};

const SubmissionPage = (props: Props) => {
  const { deleteSurvey, survey, actionGrant, isSummary } = props;

  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <DetailNavigation
        title={survey.title}
        surveyId={Number(survey.id)}
        deleteFunction={deleteSurvey}
      />

      <ContentSection>
        <ContentMain>
          <div className={styles.submissionNav}>
            <Link
              to={`/surveys/${survey.id}/submissions/summary`}
              className={isSummary ? styles.activeRoute : styles.inactiveRoute}
            >
              Oppsummering
            </Link>
            {' | '}
            <Link
              to={`/surveys/${survey.id}/submissions/individual`}
              className={!isSummary ? styles.activeRoute : styles.inactiveRoute}
            >
              Individuell
            </Link>
          </div>

          {React.cloneElement(props.children, props)}
        </ContentMain>

        <AdminSideBar
          surveyId={survey.id}
          actionGrant={actionGrant}
          token={survey.token}
        />
      </ContentSection>
    </Content>
  );
};

export default SubmissionPage;
