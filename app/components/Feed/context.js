import React from 'react';
import { Link } from 'react-router';

export function lookupContext(activity, key) {
  return activity.context[key];
}

export const contextRender = {
  'users.user': context => (
    <Link to={`/users/${context.username}/`}>
      {`${context.firstName} ${context.lastName}`}
    </Link>
  ),
  'events.event': context => (
    <Link to={`/events/${context.id}/`}>{`${context.title}`}</Link>
  ),
  'meetings.meetinginvitation': context => (
    <Link to={`/meetings/${context.meeting.id}/`}>{context.meeting.title}</Link>
  ),
  'articles.article': context => (
    <Link to={`/articles/${context.id}/`}>{context.title}</Link>
  )
};
