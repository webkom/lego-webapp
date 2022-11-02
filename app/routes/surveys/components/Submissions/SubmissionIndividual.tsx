// @flow

import styles from '../surveys.css';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import StaticSubmission from '../StaticSubmission';
import cx from 'classnames';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: (SubmissionEntity) => Promise<*>,
  survey: SurveyEntity,
};

const SubmissionPage = ({ submissions, survey }: Props) => {
  return (
    <ul className={styles.submissions}>
      {submissions.map((submission, i) => (
        <li key={submission.id}>
          <h3>Svar {i}</h3>

          <ul className={cx(styles.answers, styles.detailQuestions)}>
            {survey.questions && (
              <StaticSubmission survey={survey} submission={submission} />
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default SubmissionPage;
