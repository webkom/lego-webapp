import { RenderErrorMessage } from 'app/components/Form/Field';
import { spyFormError } from 'app/utils/formSpyUtils';

const SubmissionError = () =>
  spyFormError((error) => <>{error && <RenderErrorMessage error={error} />}</>);

export default SubmissionError;
