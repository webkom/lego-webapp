import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import Button from 'app/components/Button';
import DisplayContent from 'app/components/DisplayContent';
import { EditorField } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { ProfilePicture } from 'app/components/Image';
import { useAppDispatch } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type { CurrentUser } from 'app/store/models/User';
import { EDITOR_EMPTY } from 'app/utils/constants';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.css';

type Props = {
  contentTarget: string;
  user: CurrentUser;
  loggedIn: boolean;
  submitText?: string;
  inlineMode?: boolean;
  autoFocus?: boolean;
  parent?: ID;
};

const validate = createValidator({
  text: [legoEditorRequired('Kommentaren kan ikke være tom')],
});

const CommentForm = ({
  contentTarget,
  user,
  loggedIn,
  submitText = 'Kommenter',
  inlineMode = false,
  autoFocus = false,
  parent,
}: Props) => {
  const dispatch = useAppDispatch();
  // editor must be disabled while server-side rendering
  const [editorSsrDisabled, setEditorSsrDisabled] = useState(true);
  useEffect(() => {
    // Workaround to make sure we re-render editor in enabled state on client after ssr
    setEditorSsrDisabled(false);
  }, []);
  const className = inlineMode ? styles.inlineForm : styles.form;

  if (!loggedIn) {
    return <div>Vennligst logg inn for å kommentere.</div>;
  }

  return (
    <LegoFinalForm
      initialValues={{
        text: EDITOR_EMPTY,
        commentKey: Math.random(),
      }}
      validate={validate}
      onSubmit={({ text }) => {
        return dispatch(
          addComment({
            contentTarget,
            text,
            parent,
          })
        );
      }}
    >
      {({
        handleSubmit,
        pristine,
        submitting,
        form,
        // $FlowFixMe
        values,
      }) => {
        const textValue = form.getFieldState('text')?.value;
        const fieldActive = form.getFieldState('text')?.active;
        const isOpen = fieldActive || (textValue && textValue !== EDITOR_EMPTY);
        return (
          <form
            onSubmit={handleSubmit}
            className={cx(className, isOpen && styles.activeForm)}
          >
            <div className={styles.header}>
              <ProfilePicture size={40} user={user} />

              {isOpen && <div className={styles.author}>{user.fullName}</div>}
            </div>
            <div className={cx(styles.fields, isOpen && styles.activeFields)}>
              {editorSsrDisabled ? (
                <DisplayContent
                  id="comment-text"
                  content=""
                  placeholder="Skriv en kommentar"
                />
              ) : (
                <Field
                  key={values.commentKey}
                  autoFocus={autoFocus}
                  name="text"
                  placeholder="Skriv en kommentar"
                  component={EditorField.AutoInitialized}
                  simple
                />
              )}

              {isOpen && (
                <Button
                  flat
                  submit
                  disabled={pristine || submitting}
                  className={styles.submit}
                >
                  {submitText}
                </Button>
              )}
              <SubmissionError />
            </div>
          </form>
        );
      }}
    </LegoFinalForm>
  );
};

export default CommentForm;
