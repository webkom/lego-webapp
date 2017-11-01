// @flow

import React from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import styles from './surveys.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import { colorForEvent } from 'app/routes/events/utils';

type Props = {
  survey: SurveyEntity
};

const SurveyItem = (props: Props) => {
  const { survey } = props;

  return (
    <div
      className={styles.surveyItem}
      style={{ borderColor: colorForEvent(survey.event.eventType) }}
    >
      <div>
        <Link to={`/surveys/${String(survey.id)}`}>
          <h3 className={styles.surveyItemTitle}>{survey.title}</h3>
        </Link>

        <div className={styles.surveyTime}>
          For arrangement{' '}
          <Link to={`/events/${survey.event.id}`}>{survey.event.title}</Link>
        </div>

        <div className={styles.surveyTime}>
          Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
        </div>
      </div>

      <div className={styles.companyLogo}>
        <Image src={survey.event.cover} />
      </div>
    </div>
  );
};

export default SurveyItem;
