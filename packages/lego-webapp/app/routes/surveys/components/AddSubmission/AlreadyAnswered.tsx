import { Card, Page } from '@webkom/lego-bricks';
import { ContentMain } from 'app/components/Content';
import StaticSubmission from '../StaticSubmission';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

type Props = {
  survey: DetailedSurvey;
  submission: SurveySubmission;
};

const AlreadyAnswered = ({ survey, submission }: Props) => (
  <Page
    title={survey.title}
    back={{ href: '/', label: 'Tilbake til forsiden' }}
  >
    <ContentMain>
      <Card severity="success">
        <Card.Header>Du har svart på denne undersøkelsen. Takk!</Card.Header>
      </Card>

      <div>
        <h2>Du svarte følgende</h2>
        <StaticSubmission survey={survey} submission={submission} />
      </div>
    </ContentMain>
  </Page>
);

export default AlreadyAnswered;
