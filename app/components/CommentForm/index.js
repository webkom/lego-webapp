// @flow

import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { TextField } from 'app/components/Form';
import Button from 'app/components/Button';
import ProfilePicture from 'app/components/ProfilePicture';
import { addComment } from 'app/actions/CommentActions';
import styles from './CommentForm.css';

const validate = (values) => {
  const errors = {};
  if (!values.text) {
    errors.text = 'Required';
  }
  return errors;
};

type Props = {
  commentTarget: string,
  user: Object,
  loggedIn: boolean,
  addComment: () => void,
  parent: number,
  fields: Object,
  handleSubmit: () => void,
  submitText: string,
  inlineMode: boolean,
  autoFocus: boolean
};

class CommentForm extends Component {
  props: Props;

  static defaultProps = {
    submitText: 'Send kommentar',
    autoFocus: false
  };

  onSubmit = ({ text }) => {
    const { commentTarget, parent } = this.props;
    this.props.addComment({
      commentTarget,
      text,
      parent
    });
  };

  render() {
    const {
      fields: {
        text
      },
      handleSubmit,
      user,
      loggedIn,
      submitText,
      inlineMode,
      autoFocus
    } = this.props;

    if (!loggedIn) {
      return (
        <div>
          Please log in.
        </div>
      );
    }

    const hasError = text.error && text.touched;
    const className = inlineMode ? styles.inlineForm : styles.form;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className={className}>
        <ProfilePicture
          size={64}
          user={user.id}
          style={{ marginRight: 20 }}
        />

        <div className={styles.fields}>
          <TextField
            placeholder='Skriv noe her...'
            style={{ borderColor: hasError && 'red' }}
            autoFocus={autoFocus}
            {...text}
          />

          <Button
            className={styles.submit}
            disabled={hasError}
            submit
          >
            {hasError ? 'Kommentaren kan ikke være tom' : submitText}
          </Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'comment',
  fields: ['text'],
  validate,
  destroyOnUnmount: false
}, null, { addComment })(CommentForm);
