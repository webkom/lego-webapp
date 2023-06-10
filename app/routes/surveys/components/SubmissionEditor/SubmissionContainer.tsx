import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import Time from 'app/components/Time';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import styles from '../surveys.module.css';
import AlreadyAnswered from './AlreadyAnswered';
import SubmissionEditor from './SubmissionEditor';

type Props = {
  survey: SurveyEntity;
  submission?: SubmissionEntity;
  actionGrant: Array<string>;
};

const SubmissionContainer = ({
  survey,
  submission,
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

  if (submission) {
    return <AlreadyAnswered survey={survey} submission={submission} />;
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

  return (
    <SubmissionEditor
      survey={survey}
      submission={submission}
      {...(props as Record<string, any>)}
    />
  );
};

export default SubmissionContainer;
