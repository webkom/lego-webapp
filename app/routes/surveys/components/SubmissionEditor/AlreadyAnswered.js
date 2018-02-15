// @flow

import React, { Component } from 'react';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import { Content, ContentMain } from 'app/components/Content';
import { Link } from 'react-router';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.css';

type Props = {
  survey: SurveyEntity,
  submission: SubmissionEntity
};

class AlreadyAnswered extends Component<Props> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { survey, submission } = this.props;
    return (
      <Content>
        <ContentMain>
          <div className={styles.centerContent}>
            <h1 style={{ display: 'block' }}>
              Du har svart på denne undersøkelsen. Takk!
            </h1>
            <Link to="/">Tilbake til forsiden</Link>
          </div>

          <div>
            <h3 style={{ display: 'block' }}>Du svarte følgende: </h3>
            <StaticSubmission survey={survey} submission={submission} />
          </div>
        </ContentMain>
      </Content>
    );
  }
}

export default AlreadyAnswered;
