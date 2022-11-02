import type { Element } from "react";
import { cloneElement } from "react";
import styles from "../surveys.css";
import type { SubmissionEntity } from "app/reducers/surveySubmissions";
import type { SurveyEntity } from "app/reducers/surveys";
import { DetailNavigation } from "../../utils";
import { Content, ContentSection, ContentMain } from "app/components/Content";
import { Link } from "react-router-dom";
import AdminSideBar from "../AdminSideBar";
import type { ActionGrant } from "app/models";
type Props = {
  submissions: Array<SubmissionEntity>;
  addSubmission: (arg0: SubmissionEntity) => Promise<any>;
  survey: SurveyEntity;
  children: Array<Element<any>>;
  actionGrant: ActionGrant;
  isSummary: boolean;
  shareSurvey: (arg0: number) => Promise<any>;
  hideSurvey: (arg0: number) => Promise<any>;
  exportSurvey: (arg0: number) => Promise<any>;
};

const SubmissionPage = (props: Props) => {
  const {
    survey,
    actionGrant,
    isSummary,
    hideSurvey,
    shareSurvey,
    exportSurvey
  } = props;
  return <Content className={styles.surveyDetail} banner={survey.event.cover}>
      <DetailNavigation title={survey.title} surveyId={Number(survey.id)} />

      <ContentSection>
        <ContentMain>
          <div className={styles.submissionNav}>
            <Link to={`/surveys/${survey.id}/submissions/summary`} className={!isSummary ? styles.activeRoute : styles.inactiveRoute}>
              Oppsummering
            </Link>
            {' | '}
            <Link to={`/surveys/${survey.id}/submissions/individual`} className={isSummary ? styles.activeRoute : styles.inactiveRoute}>
              Individuell
            </Link>
          </div>

          {props.children.map((child, i) => cloneElement(child, { ...props,
          children: undefined
        }))}
        </ContentMain>

        <AdminSideBar surveyId={survey.id} actionGrant={actionGrant} token={survey.token} shareSurvey={shareSurvey} hideSurvey={hideSurvey} exportSurvey={exportSurvey} />
      </ContentSection>
    </Content>;
};

export default SubmissionPage;