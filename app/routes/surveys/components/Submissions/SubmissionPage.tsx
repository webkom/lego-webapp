import { Link } from 'react-router-dom';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { ID } from 'app/store/models';
import { DetailNavigation } from '../../utils';
import AdminSideBar from '../AdminSideBar';
import styles from '../surveys.css';
import type { ReactNode } from 'react';

type Props = {
  submissions: Array<SubmissionEntity>;
  addSubmission: (submission: SubmissionEntity) => Promise<void>;
  survey: SurveyEntity;
  children: (props: Omit<Props, 'children'>) => ReactNode;
  actionGrant: ActionGrant;
  isSummary: boolean;
  shareSurvey: (id: ID) => Promise<void>;
  hideSurvey: (id: ID) => Promise<void>;
  exportSurvey: (id: ID) => Promise<void>;
};

const SubmissionPage = (props: Props) => {
  const {
    survey,
    actionGrant,
    isSummary,
    hideSurvey,
    shareSurvey,
    exportSurvey,
  } = props;
  return (
    <Content banner={survey.event.cover}>
      <DetailNavigation title={survey.title} surveyId={Number(survey.id)} />

      <ContentSection>
        <ContentMain>
          <div className={styles.submissionNav}>
            <Link
              to={`/surveys/${survey.id}/submissions/summary`}
              className={!isSummary ? styles.activeRoute : styles.inactiveRoute}
            >
              Oppsummering
            </Link>
            {' | '}
            <Link
              to={`/surveys/${survey.id}/submissions/individual`}
              className={isSummary ? styles.activeRoute : styles.inactiveRoute}
            >
              Individuell
            </Link>
          </div>

          {props.children(props)}
        </ContentMain>

        <AdminSideBar
          surveyId={survey.id}
          actionGrant={actionGrant}
          token={survey.token}
          shareSurvey={shareSurvey}
          hideSurvey={hideSurvey}
          exportSurvey={exportSurvey}
        />
      </ContentSection>
    </Content>
  );
};

export default SubmissionPage;
