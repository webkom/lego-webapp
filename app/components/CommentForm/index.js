// @flow

import { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { compose } from 'redux';
import type { FormProps } from 'redux-form';
import { Field, getFormMeta, getFormValues, reduxForm } from 'redux-form';

import type { CommentEntity } from 'app/actions/CommentActions';
import { addComment } from 'app/actions/CommentActions';
import Button from 'app/components/Button';
import DisplayContent from 'app/components/DisplayContent';
import { EditorField } from 'app/components/Form';
import { ProfilePicture } from 'app/components/Image';

import styles from './CommentForm.css';

// TODO: This can be removed if the editor importer gets an actual empty state.
const EMPTY_STATE = '<p></p>';

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
  addComment: (CommentEntity) => void,
  parent: number,
  submitText: string,
  inlineMode: boolean,
  initialized: boolean,
  autoFocus: boolean,
  isOpen: boolean,
} & FormProps;

class CommentForm extends Component<Props, { disabled: boolean }> {
  constructor(props) {
    super(props);
    this.state = { disabled: !__CLIENT__ };
  }
  static defaultProps = {
    submitText: 'Kommenter',
    autoFocus: false,
  };

  onSubmit = ({ text }) => {
    const { contentTarget, parent } = this.props;
    this.props.addComment({
      contentTarget,
      text,
      parent,
    });
  };

  enableForm = (e) => {
    this.setState({ disabled: false });
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
      autoFocus,
      initialized,
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

        <div
          className={cx(styles.fields, isOpen && styles.activeFields)}
          onMouseOver={this.enableForm}
          onScroll={this.enableForm}
          onPointerDown={this.enableForm}
        >
          {this.state.disabled ? (
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
  }
}

function mapStateToProps(state, props) {
  const meta = getFormMeta(props.form)(state);
  const values = getFormValues(props.form)(state);
  return {
    isOpen:
      meta &&
      meta.text &&
      (meta.text.active || (values && values.text !== EMPTY_STATE)),
  };
}

export default compose(
  reduxForm({
    validate,
    initialValues: {},
    destroyOnUnmount: false,
  }),
  connect(mapStateToProps, { addComment })
)(CommentForm);
