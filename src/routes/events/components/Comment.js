import './Comment.css';
import React from 'react';
import { Link } from 'react-router';
import ReadableDateTime from '🏠/components/ReadableDateTime';

const Comment = ({ comment: { createdAt, text, author } }) => (
  <div className='Comment'>
    <img
      className='Comment__avatar'
      src={`http://api.adorable.io/avatars/70/${author.username}.png`}
    >
    </img>

    <div className='Comment__content'>
      <div className='Comment__header'>
        <Link
          className='Comment__username'
          to={`/users/${author.username}`}
        >
          {author.username}
        </Link>
        <span className='Comment__bullet'>•</span>
        <span className='Comment__timestamp'>
          <ReadableDateTime dateTime={createdAt} />
        </span>
      </div>

      <p className='Comment__text'>{text}</p>
    </div>
  </div>
);

export default Comment;
