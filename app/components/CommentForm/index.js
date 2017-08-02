// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { reduxForm, Field } from 'redux-form';
import { EditorField } from 'app/components/Form';
import Button from 'app/components/Button';
import ProfilePicture from 'app/components/ProfilePicture';
import { addComment } from 'app/actions/CommentActions';
import styles from './CommentForm.css';

const validate = values => {
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
      active,
      user,
      loggedIn,
      submitText,
      inlineMode,
      autoFocus
    } = this.props;
    const formActive = autoFocus || (active || !pristine);
    const className = inlineMode ? styles.inlineForm : styles.form;

    if (!loggedIn) {
      return <div>Please log in.</div>;
    }

    return (
      <form
        onSubmit={handleSubmit(this.onSubmit)}
        className={cx(className, formActive && styles.activeForm)}
      >
        <div className={styles.header}>
          <ProfilePicture
            size={40}
            user={user}
            style={{ margin: '0px 0px 0px 25px' }}
          />

          {formActive &&
            <div className={styles.author}>
              {this.props.user.fullName}
            </div>}
        </div>

        <div className={cx(styles.fields, formActive && styles.activeFields)}>
          <Field
            placeholder={submitText}
            autoFocus={autoFocus}
            name="text"
            component={EditorField}
            disableBlocks
          />

          {formActive &&
            <Button
              className={styles.submit}
              disabled={pristine || submitting}
              submit
            >
              {submitText}
            </Button>}
        </div>
      </form>
    );
  }
}

export default compose(
  connect(
    () => ({
      initialValues: {
        text: '<p></p>'
      }
    }),
    { addComment }
  ),
  reduxForm({
    validate,
    destroyOnUnmount: false
  })
)(CommentForm);
