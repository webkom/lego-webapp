// @flow
import React from 'react';
import { Link } from 'react-router';
import type { AggregatedActivity } from './types';

export function lookupContext(
  aggregatedActivity: AggregatedActivity,
  key: string
) {
  return aggregatedActivity.context[key];
}

export const contextRender = {
  'users.user': (context: Object) => (
    <Link to={`/users/${context.username}/`}>
      {`${context.firstName} ${context.lastName}`}
    </Link>
  ),
  'events.event': (context: Object) => (
    <Link to={`/events/${context.id}/`}>{`${context.title}`}</Link>
  ),
  'meetings.meetinginvitation': (context: Object) => (
    <Link to={`/meetings/${context.meeting.id}/`}>{context.meeting.title}</Link>
  ),
  'articles.article': (context: Object) => (
    <Link to={`/articles/${context.id}/`}>{context.title}</Link>
  ),
  'notifications.announcement': (context: Object) => <p>{context.message}</p>
};
