import './Comment.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import ReadableDateTime from 'app/components/ReadableDateTime';
import CommentForm from 'app/components/CommentForm';

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    commentFormProps: PropTypes.object.isRequired
  };

  state = {
    replyOpen: false
  };

  openReply = () => {
    this.setState({
      replyOpen: true
    });
  };

  closeReply = () => {
    this.setState({
      replyOpen: false
    });
  };

  render() {
    const { comment, commentFormProps } = this.props;
    const { createdAt, text, author } = comment;
    const { replyOpen } = this.state;
    return (
      <div className='Comment__wrapper'>
        <div className='Comment'>
          <img
            className='Comment__avatar'
            src={`http://api.adorable.io/avatars/70/${author.username}.png`}
          />

          <div className='Comment__content'>
            <div className='Comment__header'>
              <Link to={`/users/${author.username}`}>
                {author.username}
              </Link>
              <span className='Comment__bullet'>•</span>
              <ReadableDateTime className='Comment__timestamp' dateTime={createdAt} />
              <span className='Comment__bullet'>•</span>
              <a onClick={this.openReply}>Svar</a>
            </div>

            <p className='Comment__text'>{text}</p>
          </div>
        </div>

        {replyOpen ?
          <div>
            <button type='button' onClick={this.closeReply}>x</button>
            <CommentForm
              formKey={`${commentFormProps.commentTarget}-${comment.id}`}
              parent={comment.id}
              {...commentFormProps}
            />
          </div>
          : null}
      </div>
    );
  }
}
