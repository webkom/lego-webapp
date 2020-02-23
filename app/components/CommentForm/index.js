// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { getFormMeta, getFormValues, reduxForm, Field } from 'redux-form';
import type { FormProps } from 'redux-form';
import { EditorField } from 'app/components/Form';
import Button from 'app/components/Button';
import { ProfilePicture } from 'app/components/Image';
import { addComment } from 'app/actions/CommentActions';
import type { CommentEntity } from 'app/actions/CommentActions';
import styles from './CommentForm.css';

// TODO: This can be removed if the editor importer gets an actual empty state.
const EMPTY_STATE = '<p class="unstyled"><br/></p>';

const validate = values => {
  const errors = {};
  if (!values.text) {
    errors.text = 'Required';
  }
  return errors;
};

type Props = FormProps & {
  contentTarget: string,
  user: Object,
  loggedIn: boolean,
  addComment: CommentEntity => void,
  parent: number,
  submitText: string,
  inlineMode: boolean
};

class CommentForm extends Component<Props> {
  static defaultProps = {
    submitText: 'Kommenter',
    autoFocus: false
  };

  onSubmit = ({ text }) => {
    const { contentTarget, parent } = this.props;
    this.props.addComment({
      contentTarget,
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
          <ProfilePicture size={40} user={user} />

          {isOpen && (
            <div className={styles.author}>{this.props.user.fullName}</div>
          )}
        </div>

        <div className={cx(styles.fields, isOpen && styles.activeFields)}>
          <Field
            autoFocus={autoFocus}
            name="text"
            placeholder="Skriv en kommentar"
            component={EditorField}
            simple
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

function mapStateToProps(state, props) {
  const meta = getFormMeta(props.form)(state);
  const values = getFormValues(props.form)(state);
  return {
    isOpen:
      meta &&
      meta.text &&
      (meta.text.active || (values && values.text !== EMPTY_STATE))
  };
}

export default compose(
  reduxForm({
    validate,
    initialValues: {},
    destroyOnUnmount: false
  }),
  connect(
    mapStateToProps,
    { addComment }
  )
)(CommentForm);
