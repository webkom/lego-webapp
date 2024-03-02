import cx from 'classnames';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.css';
import type { SelectedSurvey } from 'app/reducers/surveys';
import type { SurveySubmission } from 'app/store/models/SurveySubmission';

type Props = {
  submissions: SurveySubmission[];
  survey: SelectedSurvey;
};

const SubmissionPage = ({ submissions, survey }: Props) => {
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
