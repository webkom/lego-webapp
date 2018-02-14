// @flow

import React from 'react';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import { Content } from 'app/components/Content';
import { Link } from 'react-router';
import AlreadyAnswered from './AlreadyAnswered';
import SubmissionEditor from './SubmissionEditor';

type Props = {
  survey: SurveyEntity,
  submission?: SubmissionEntity
};

const SubmissionContainer = ({ survey, submission, ...props }: Props) => {
  if (survey.templateType) {
    return (
      <Content>
        <p>Du kan ikke svare på denne typen undersøkelser.</p>
        <Link to="/">Tilbake til forsiden</Link>
      </Content>
    );
  }

  if (submission) {
    return <AlreadyAnswered survey={survey} submission={submission} />;
  }

  return (
    <SubmissionEditor survey={survey} submission={submission} {...props} />
  );
};

export default SubmissionContainer;
