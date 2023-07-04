import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import DisplayContent from 'app/components/DisplayContent';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { ProfilePicture } from 'app/components/Image';
import Flex from 'app/components/Layout/Flex';
import { useAppDispatch } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type { CurrentUser } from 'app/store/models/User';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.css';

type Props = {
  contentTarget: string;
  user: CurrentUser;
  loggedIn: boolean;
  submitText?: string;
  autoFocus?: boolean;
  parent?: ID;
  placeholder?: string;
};

const validate = createValidator({
  text: [legoEditorRequired('Kommentaren kan ikke være tom')],
});

const CommentForm = ({
  contentTarget,
  user,
  loggedIn,
  submitText = 'Kommenter',
  autoFocus = false,
  parent,
  placeholder = 'Skriv en kommentar ...',
}: Props) => {
  const dispatch = useAppDispatch();
  // editor must be disabled while server-side rendering
  const [editorSsrDisabled, setEditorSsrDisabled] = useState(true);
  useEffect(() => {
    // Workaround to make sure we re-render editor in enabled state on client after ssr
    setEditorSsrDisabled(false);
  }, []);

  if (!loggedIn) {
    return <div>Vennligst logg inn for å kommentere</div>;
  }

  return (
    <Card>
      <LegoFinalForm
        initialValues={{
          commentKey: Math.random(),
        }}
        validate={validate}
        onSubmit={({ text }) =>
          dispatch(
            addComment({
              contentTarget,
              text,
              parent,
            })
          )
        }
      >
        {({ handleSubmit, pristine, submitting, form, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Flex alignItems="center" gap="1rem">
                <ProfilePicture size={40} user={user} />

                <div className={styles.field}>
                  {editorSsrDisabled ? (
                    <DisplayContent
                      id="comment-text"
                      content=""
                      placeholder={placeholder}
                    />
                  ) : (
                    <Field
                      key={values.commentKey}
                      autoFocus={autoFocus}
                      name="text"
                      placeholder={placeholder}
                      component={TextInput.Field}
                      removeBorder
                      maxLength={140}
                    />
                  )}
                </div>

                {spySubmittable((submittable) => (
                  <Button
                    type="submit"
                    className={cx(!submittable && styles.submittable)}
                  >
                    {submitText}
                  </Button>
                ))}
              </Flex>

              <SubmissionError />
            </form>
          );
        }}
      </LegoFinalForm>
    </Card>
  );
};

export default CommentForm;
