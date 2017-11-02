// @flow

import React from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import styles from './surveyDetail.css';
import type { SurveyEntity } from 'app/reducers/surveys';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { DetailNavigation } from '../utils.js';
import Content from 'app/components/Layout/Content';

type Props = {
  survey: SurveyEntity,
  fetching: boolean,
  deleteSurvey: number => Promise<*>
};

const SurveyDetail = (props: Props) => {
  const { survey, fetching, deleteSurvey } = props;

  if (fetching || !survey || !survey.event) return <LoadingIndicator />;
  return (
    <div>
      <div className={styles.coverImage}>
        <Image src={survey.event.cover} />
      </div>

      <Content className={styles.surveyDetail}>
        <DetailNavigation
          title={survey.title}
          surveyId={Number(survey.id)}
          deleteFunction={deleteSurvey}
        />

        <div className={styles.surveyTime}>
          Spørreundersøkelse for{' '}
          <Link to={`/surveys/${survey.event}`}>{survey.event.title}</Link>
        </div>

        <div className={styles.surveyTime}>
          Aktiv fra <Time time={survey.activeFrom} format="ll HH:mm" />
        </div>
      </Content>
    </div>
  );
};

export default SurveyDetail;
