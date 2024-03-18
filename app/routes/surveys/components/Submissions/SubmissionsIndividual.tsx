import cx from 'classnames';
import { useOutletContext } from 'react-router-dom';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.css';
import type { ContextType } from '../../index';

const SubmissionPage = () => {
  const { submissions, survey } = useOutletContext<ContextType>();
  return (
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
};

export default SubmissionPage;
