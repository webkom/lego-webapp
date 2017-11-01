// @flow

import React from 'react';
import styles from './surveys.css';
import Survey from './Survey';
import type { SurveyEntity } from 'app/reducers/surveys';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  surveys: Array<SurveyEntity>,
  fetching: boolean
};

const SurveyList = (props: Props) => {
  const { surveys, fetching } = props;

  const surveys_to_render = surveys.map(survey => (
    <Survey key={survey.id} survey={survey} />
  ));

  return (
    <div className={styles.surveyList}>
      {surveys_to_render}
      {fetching && <LoadingIndicator loading />}
    </div>
  );
};

export default SurveyList;
