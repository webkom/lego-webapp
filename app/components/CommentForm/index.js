// @flow

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { getFormMeta, getFormValues, reduxForm, Field } from 'redux-form';
import type { FormProps } from 'redux-form';
import { EditorField } from 'app/components/Form';
import Button from 'app/components/Button';
import { ProfilePicture } from 'app/components/Image';
import { addComment } from 'app/actions/CommentActions';
import styles from './CommentForm.css';
import DisplayContent from 'app/components/DisplayContent';
import { EDITOR_EMPTY } from 'app/utils/constants';

const validate = (values) => {
  const errors = {};
  if (!values.text) {
    errors.text = 'Required';
  }
  return errors;
};

type Props = {
  contentTarget: string,
  user: Object,
  loggedIn: boolean,
  parent: number,
  submitText: string,
  inlineMode: boolean,
  initialized: boolean,
  autoFocus: boolean,
  isOpen: boolean,
} & FormProps;

const CommentForm = ({
  handleSubmit,
  pristine,
  submitting,
  user,
  form,
  loggedIn,
  submitText = 'Kommenter',
  inlineMode,
  autoFocus = false,
  initialized,
  contentTarget,
  parent,
}: Props) => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => {
    const meta = getFormMeta(form)(state);
    const values = getFormValues(form)(state);
    return (
      meta &&
      meta.text &&
      (meta.text.active || (values && values.text !== EDITOR_EMPTY))
    );
  });

  const [disabled, setDisabled] = useState(!__CLIENT__);

  const onSubmit = ({ text }) => {
    dispatch(
      addComment({
        contentTarget,
        text,
        parent,
      })
    );
  };

  const enableForm = (e) => {
    setDisabled(false);
  };

  const className = inlineMode ? styles.inlineForm : styles.form;

  if (!loggedIn) {
    return <div>Vennligst logg inn.</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
            component={EditorField}
            initialized={initialized}
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
      </div>
    </form>
  );
};

export default reduxForm({
  validate,
  initialValues: {},
  destroyOnUnmount: false,
})(CommentForm);
