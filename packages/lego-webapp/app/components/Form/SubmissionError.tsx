import { RenderErrorMessage } from 'app/components/Form/Field';
import { spyFormError } from 'app/utils/formSpyUtils';
import styles from './SubmissionError.module.css';

const SubmissionError = () =>
  spyFormError((error) => (
    <>
      {error && (
        <div className={styles.submissionErrorContainer}>
          <RenderErrorMessage error={error} />
        </div>
      )}
    </>
  ));

export default SubmissionError;
