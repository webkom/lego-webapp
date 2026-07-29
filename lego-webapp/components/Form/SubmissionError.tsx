import { RenderErrorMessage } from '~/components/Form/Field';
import { spyFormError } from '~/utils/formSpyUtils';
import styles from './SubmissionError.module.css';

const SubmissionError = () =>
  spyFormError((error) => (
    <>
      {error && (
        <div className={styles.submissionErrorContainer}>
          <RenderErrorMessage error={error} inline />
        </div>
      )}
    </>
  ));

export default SubmissionError;
