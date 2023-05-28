import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import type { SurveyEntity } from 'app/reducers/surveys';
import { eventTypeToString } from 'app/routes/events/utils';
import type { ID } from 'app/store/models';
import { DetailNavigation } from '../utils';
import AdminSideBar from './AdminSideBar';
import StaticSubmission from './StaticSubmission';
import styles from './surveyDetail.css';
import type { Push } from 'connected-react-router';

type Props = {
  survey: SurveyEntity;
  actionGrant: ActionGrant;
  push: Push;
  shareSurvey: (surveyId: ID) => Promise<void>;
  hideSurvey: (surveyId: ID) => Promise<void>;
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
                  color: 'var(--lego-red-color)',
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
