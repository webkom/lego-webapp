import { spyFormError } from 'app/utils/formSpyUtils';
import { RenderErrorMessage } from 'app/components/Form/Field';

const SubmissionError = () =>
  spyFormError((error) => <>{error && <RenderErrorMessage error={error} />}</>);

export default SubmissionError;
