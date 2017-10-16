// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { getFormMeta, getFormValues, reduxForm, Field } from 'redux-form';
import type { FieldProps } from 'redux-form';
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

type Props = FieldProps & {
  commentTarget: string,
  user: Object,
  loggedIn: boolean,
  addComment: Object /* TODO: CommentEntity */ => void,
  parent: number,
  submitText: string,
  inlineMode: boolean
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
      isOpen,
      loggedIn,
      submitText,
      inlineMode,
      autoFocus
    } = this.props;
    const className = inlineMode ? styles.inlineForm : styles.form;

    if (!loggedIn) {
      return <div>Vennligst logg inn.</div>;
    }

    return (
      <form
        onSubmit={handleSubmit(this.onSubmit)}
        className={cx(className, isOpen && styles.activeForm)}
      >
        <div className={styles.header}>
          <ProfilePicture
            size={40}
            user={user}
            style={{ margin: '0px 0px 0px 25px' }}
          />

          {isOpen && (
            <div className={styles.author}>{this.props.user.fullName}</div>
          )}
        </div>

        <div className={cx(styles.fields, isOpen && styles.activeFields)}>
          <Field
            placeholder={submitText}
            autoFocus={autoFocus}
            name="text"
            component={EditorField}
            disableBlocks
          />

          {isOpen && (
            <Button
              className={styles.submit}
              disabled={pristine || submitting}
              submit
            >
              {submitText}
            </Button>
          )}
        </div>
      </form>
    );
  }
}

// TODO(larsen): there's a bug in the editor that causes
// the empty value to be a p-tag with two spaces.
// This should be replaced with value != null or something
// when that's fixed.
function hasContent(value) {
  return value !== '<p>  </p>';
}

function mapStateToProps(state, props) {
  const meta = getFormMeta(props.form)(state);
  const values = getFormValues(props.form)(state);
  return {
    isOpen: meta && (meta.text.active || hasContent(values.text))
  };
}

export default compose(
  reduxForm({
    validate,
    initialValues: {},
    destroyOnUnmount: false
  }),
  connect(mapStateToProps, { addComment })
)(CommentForm);
