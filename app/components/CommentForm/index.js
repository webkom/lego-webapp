// @flow

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';
import { EditorField } from 'app/components/Form';
import Button from 'app/components/Button';
import { ProfilePicture } from 'app/components/Image';
import { addComment } from 'app/actions/CommentActions';
import styles from './CommentForm.css';
import DisplayContent from 'app/components/DisplayContent';
import { EDITOR_EMPTY } from 'app/utils/constants';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { Field } from 'react-final-form';
import SubmissionError from 'app/components/Form/SubmissionError';
import { createValidator, legoEditorRequired } from 'app/utils/validation';

type Props = {
  contentTarget: string,
  user: Object,
  loggedIn: boolean,
  parent: number,
  submitText: string,
  inlineMode: boolean,
  autoFocus: boolean,
  isOpen: boolean,
};

const validate = createValidator({
  text: [legoEditorRequired('Kommentaren kan ikke være tom')],
});

const CommentForm = ({
  user,
  loggedIn,
  submitText = 'Kommenter',
  inlineMode,
  autoFocus = false,
  contentTarget,
  parent,
}: Props) => {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(!__CLIENT__);

  const enableForm = (e) => {
    setDisabled(false);
  };

  const className = inlineMode ? styles.inlineForm : styles.form;

  if (!loggedIn) {
    return <div>Vennligst logg inn.</div>;
  }

  return (
    <LegoFinalForm
      initialValues={{
        text: EDITOR_EMPTY,
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
      {({ handleSubmit, pristine, submitting, form }) => {
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

            <div
              className={cx(styles.fields, isOpen && styles.activeFields)}
              onMouseOver={enableForm}
              onScroll={enableForm}
              onPointerDown={enableForm}
            >
              {disabled ? (
                <DisplayContent
                  id="comment-text"
                  className={styles.text}
                  content=""
                  placeholder="Skriv en kommentar"
                />
              ) : (
                <Field
                  autoFocus={autoFocus}
                  name="text"
                  placeholder="Skriv en kommentar"
                  component={EditorField.AutoInitialized}
                  simple
                />
              )}

              {isOpen && (
                <Button
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
