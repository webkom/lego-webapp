import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.css';
import type { DetailedSurvey } from 'app/store/models/Survey';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

type Props = {
  survey: DetailedSurvey;
  submission: SurveySubmission;
};

const AlreadyAnswered = ({ survey, submission }: Props) => (
  <Content>
    <div className={styles.centerContent}>
      <h1
        style={{
          display: 'block',
        }}
      >
        Du har svart på denne undersøkelsen. Takk!
      </h1>
      <Link to="/">Tilbake til forsiden</Link>
    </div>

    <div>
      <h3
        style={{
          display: 'block',
        }}
      >
        Du svarte følgende:{' '}
      </h3>
      <StaticSubmission survey={survey} submission={submission} />
    </div>
  </Content>
);

export default AlreadyAnswered;
