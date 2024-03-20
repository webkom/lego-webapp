import cx from 'classnames';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.css';
import type { SubmissionsPageChild } from 'app/routes/surveys/components/Submissions/SubmissionsPage';

const SubmissionPage: SubmissionsPageChild = ({ submissions, survey }) => (
  <ul>
    {submissions.map((submission, i) => (
      <li key={submission.id}>
        <h3>Svar {i + 1}</h3>

        <ul className={cx(styles.answers, styles.detailQuestions)}>
          {survey.questions && (
            <StaticSubmission survey={survey} submission={submission} />
          )}
        </ul>
      </li>
    ))}
  </ul>
);

export default SubmissionPage;
