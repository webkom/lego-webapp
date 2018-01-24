// @flow

import * as React from 'react';
import styles from './surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import { DetailNavigation } from '../utils.js';
import { Content } from 'app/components/Content';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  deleteSurvey: number => Promise<*>,
  survey: SurveyEntity,
  children: React.Element<*>
};

const SubmissionPage = (props: Props) => {
  const { submissions, deleteSurvey, survey } = props;
  if (!submissions || !survey || !survey.event)
    return <LoadingIndicator loading />;

  return (
    <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <DetailNavigation
        title={survey.title}
        surveyId={Number(survey.id)}
        deleteFunction={deleteSurvey}
      />

      <h2>{submissions.length} svar</h2>

      <div className={styles.submissionNav}>
        <Link to={`/surveys/${survey.id}/submissions/summary`}>
          Oppsummering
        </Link>
        {' | '}
        <Link to={`/surveys/${survey.id}/submissions/individual`}>
          Individuell
        </Link>
      </div>

      {React.cloneElement(props.children, props)}
    </Content>
  );
};

export default SubmissionPage;
