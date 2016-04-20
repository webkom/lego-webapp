import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import FieldError from 'app/components/FieldError';
import { addComment } from 'app/actions/CommentActions';

const validate = (values) => {
  const errors = {};
  if (!values.text) {
    errors.text = 'Required';
  }
  return errors;
};

class ContactForm extends Component {
  static propTypes = {
    commentTarget: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    addComment: PropTypes.func.isRequired,
    parent: PropTypes.number
  }
  onSubmit({ text }) {
    const { commentTarget, parent } = this.props;
    this.props.addComment({
      commentTarget,
      text,
      parent
    });
  }
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
    return (
      <form onSubmit={handleSubmit(::this.onSubmit)}>
        <div>
          <div><i>Commenting as {user.username}</i></div>
          <label>Comment</label>
          <input type='text' placeholder='Comment' {...text}/>
          {text.error && text.touched ?
            <FieldError error={text.error} /> : null}
        </div>
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'comment',
  fields: ['text'],
  validate
}, null, { addComment })(ContactForm);
