import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import styles from './surveyDetail.css';
import type { SurveyEntity } from 'app/store/slices/surveysSlice';
import { DetailNavigation } from '../utils';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import AdminSideBar from './AdminSideBar';
import Button from 'app/components/Button';
import StaticSubmission from './StaticSubmission';
import { eventTypeToString } from 'app/routes/events/utils';
type Props = {
  survey: SurveyEntity;
  actionGrant: ActionGrant;
  push: (arg0: string) => void;
  shareSurvey: (arg0: number) => Promise<any>;
  hideSurvey: (arg0: number) => Promise<any>;
};

class SurveyDetail extends Component<Props> {
  componentDidMount() {
    const { survey, actionGrant = [], push } = this.props;

    if (!actionGrant.includes('edit')) {
      push(`/surveys/${survey.id}/answer`);
    }
  }

  render() {
    const { survey, actionGrant = [], shareSurvey, hideSurvey } = this.props;
    return (
      <Content
        className={styles.surveyDetail}
        banner={!survey.templateType && survey.event.cover}
      >
        <Helmet title={survey.title} />
        <DetailNavigation title={survey.title} surveyId={Number(survey.id)} />

        <ContentSection>
          <ContentMain>
            {survey.templateType ? (
              <h2
                style={{
                  color: 'red',
                }}
              >
                Dette er malen for arrangementer av type{' '}
                {eventTypeToString(survey.templateType)}
              </h2>
            ) : (
              <div>
                <div className={styles.surveyTime}>
                  Spørreundersøkelse for{' '}
                  <Link to={`/events/${survey.event.id}`}>
                    {survey.event.title}
                  </Link>
                </div>

                <div className={styles.surveyTime}>
                  Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
                </div>

                <Link to={`/surveys/${survey.id}/answer`}>
                  <Button
                    style={{
                      marginTop: '30px',
                    }}
                  >
                    Svar på undersøkelsen
                  </Button>
                </Link>
              </div>
            )}
            <StaticSubmission survey={survey} />
          </ContentMain>

          <AdminSideBar
            surveyId={survey.id}
            actionGrant={actionGrant}
            token={survey.token}
            shareSurvey={shareSurvey}
            hideSurvey={hideSurvey}
          />
        </ContentSection>
      </Content>
    );
  }
}

export default SurveyDetail;
