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
  handleSubmit: () => void
};

class CommentForm extends Component {
  props: Props;

  onSubmit = ({ text }) => {
    const { commentTarget, parent } = this.props;
    this.props.addComment({
      commentTarget,
      text,
      parent
    });
  };

  render() {
    const { fields: { text }, handleSubmit, user, commentTarget, loggedIn } = this.props;
    if (!loggedIn) {
      return (
        <div>
          Please log in.
        </div>
      );
    }
    if (!user || !commentTarget) {
      return (
        <div>
          An error occured. Please try to reload the page.
        </div>
      );
    }

    const hasError = text.error && text.touched;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className={styles.form}>
        <div>
          <ProfilePicture
            size={64}
            username={user.username}
            style={{ marginRight: 20 }}
          />
        </div>

        <div className={styles.fields}>
          <TextField
            placeholder='Skriv noe her...'
            style={{ borderColor: hasError && 'red' }}
            {...text}
          />

          <Button
            className={styles.submit}
            disabled={hasError}
            submit
          >
            {hasError ? 'Kommentaren kan ikke være tom' : 'Send kommentar'}
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
