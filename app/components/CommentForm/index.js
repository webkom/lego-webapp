import './CommentForm.css';
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import FieldError from 'app/components/FieldError';
import { addComment } from 'app/actions/CommentActions';
import { Link } from 'react-router';

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
        <div className='Comment'>
          <img
            className='Comment__avatar'
            src={`http://api.adorable.io/avatars/70/${user.username}.png`}
          >
          </img>

          <div className='Comment__content'>
            <div className='Comment__header'>
              <Link
                className='Comment__username'
                to={`/users/${user.username}`}
              >
                {user.username}
              </Link>
            </div>

            <textarea {...text} className='Comment__text'></textarea>
            {text.error && text.touched ?
              <FieldError error={text.error} /> : null}
            <button className='Comment__submit'>Send kommentar</button>
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'comment',
  fields: ['text'],
  validate
}, null, { addComment })(ContactForm);
