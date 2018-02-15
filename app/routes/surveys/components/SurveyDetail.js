// @flow

import React, { Component } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import styles from './surveyDetail.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import { DetailNavigation } from '../utils';
import { Content, ContentSection, ContentMain } from 'app/components/Content';
import type { ActionGrant } from 'app/models';
import AdminSideBar from './AdminSideBar';
import Button from 'app/components/Button';
import StaticSubmission from './StaticSubmission';

type Props = {
  survey: SurveyEntity,
  deleteSurvey: number => Promise<*>,
  actionGrant: ActionGrant,
  push: string => void
};

class SurveyDetail extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { survey, actionGrant, push } = this.props;
    if (!actionGrant.includes('edit')) {
      push(`/surveys/${survey.id}/answer`);
    }
  }

  render() {
    const { survey, deleteSurvey, actionGrant, push } = this.props;

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
              <Link to={`/events/${survey.event.id}`}>
                {survey.event.title}
              </Link>
            </div>

            <div className={styles.surveyTime}>
              Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
            </div>

            <Link to={`/surveys/${survey.id}/answer`}>
              <Button style={{ marginTop: '30px' }}>
                Svar på undersøkelsen
              </Button>
            </Link>

            <StaticSubmission survey={survey} />
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
  }
}

export default SurveyDetail;
