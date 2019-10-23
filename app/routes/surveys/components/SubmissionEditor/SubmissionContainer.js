// @flow

import React from 'react';
import type { SurveyEntity } from 'app/reducers/surveys';
import { Content } from 'app/components/Content';
import { Link } from 'react-router';
import AlreadyAnswered from './AlreadyAnswered';
import SubmissionEditor from './SubmissionEditor';
import moment from 'moment-timezone';
import Time from 'app/components/Time';
import styles from '../surveys.css';

type Props = {
  survey: SurveyEntity,
  alreadyAnswered: boolean,
  actionGrant: Array<string>
};

const SubmissionContainer = ({
  survey,
  alreadyAnswered,
  actionGrant = [],
  ...props
}: Props) => {
  if (survey.templateType) {
    return (
      <Content className={styles.centerContent}>
        <h2>Du kan ikke svare på denne typen undersøkelser.</h2>
        <Link to="/">Tilbake til forsiden</Link>
      </Content>
    );
  }

  if (alreadyAnswered) {
    return <AlreadyAnswered />;
  }

  if (!actionGrant.includes('edit') && moment(survey.activeFrom) > moment()) {
    return (
      <Content className={styles.centerContent}>
        <h2>Denne undersøkelsen er ikke aktiv enda.</h2>
        <p>
          Den vil aktiveres{' '}
          <Time time={survey.activeFrom} format="HH:mm DD. MMM" />.
        </p>
      </Content>
    );
  }

  return <SubmissionEditor survey={survey} {...props} />;
};

export default SubmissionContainer;
