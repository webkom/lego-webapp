// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { TextField } from 'app/components/Form';
import Button from 'app/components/Button';
import ProfilePicture from 'app/components/ProfilePicture';
import { addComment } from 'app/actions/CommentActions';
import styles from './CommentForm.css';
import FieldWrapper from 'app/components/Form/FieldWrapper';

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
      handleSubmit,
      pristine,
      submitting,
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

    const className = inlineMode ? styles.inlineForm : styles.form;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className={className}>
        <ProfilePicture
          size={64}
          user={user.id}
          style={{ marginRight: 20 }}
        />

        <div className={styles.fields}>
          <Field
            placeholder='Skriv noe her...'
            autoFocus={autoFocus}
            name='text'
            component={FieldWrapper}
            inputComponent={TextField}
            type='text'
          />

          <Button
            className={styles.submit}
            disabled={pristine || submitting}
            submit
          >
            {submitText}
          </Button>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = {
  addComment
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  reduxForm({
    validate,
    destroyOnUnmount: false
  })
)(CommentForm);
