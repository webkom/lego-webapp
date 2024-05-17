import { Card, Page } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import StaticSubmission from '../StaticSubmission';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

type Props = {
  survey: DetailedSurvey;
  submission: SurveySubmission;
};

const AlreadyAnswered = ({ survey, submission }: Props) => (
  <Page title={survey.title}>
    <Card severity="info">
      <Card.Header>Du har svart på denne undersøkelsen. Takk! </Card.Header>
      <Link to="/">Tilbake til forsiden</Link>
    </Card>

    <h2>Du svarte følgende: </h2>
    <StaticSubmission survey={survey} submission={submission} />
  </Page>
);

export default AlreadyAnswered;
